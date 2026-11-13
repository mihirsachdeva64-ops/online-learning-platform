import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Bookmark,
  FileText,
  List,
  HelpCircle,
  Award,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { getCourseBySlug } from '../services/courseService';
import {
  getCourseEnrollment,
  saveLessonProgress,
  enrollCourse,
} from '../services/progressService';
import CustomVideoPlayer from '../components/player/CustomVideoPlayer';
import NotesPanel from '../components/player/NotesPanel';
import TranscriptPanel from '../components/player/TranscriptPanel';
import SyllabusAccordion from '../components/course/SyllabusAccordion';
import { useAuth } from '../context/AuthContext';

export default function LearningPlayerPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentSection, setCurrentSection] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [lessonProgressMap, setLessonProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'transcript' | 'syllabus'
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [completionModal, setCompletionModal] = useState(false);
  const [unlockedCertId, setUnlockedCertId] = useState(null);

  const playerContainerRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  // Flatten all lessons for easy previous/next index navigation
  const allLessons = React.useMemo(() => {
    if (!course || !course.sections) return [];
    const list = [];
    course.sections.forEach((sec) => {
      if (sec.lessons) {
        sec.lessons.forEach((l) => list.push({ ...l, sectionTitle: sec.title }));
      }
    });
    return list;
  }, [course]);

  // Load course and enrollment
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const courseData = await getCourseBySlug(slug);
        const courseObj = courseData.course;
        setCourse(courseObj);

        // Fetch enrollment
        let enrollData = null;
        if (isAuthenticated) {
          try {
            enrollData = await getCourseEnrollment(courseObj._id);
            if (!enrollData.isEnrolled) {
              // Auto-enroll if logged in and accessing player
              const autoEnrollRes = await enrollCourse(courseObj._id);
              enrollData = { isEnrolled: true, enrollment: autoEnrollRes.enrollment, lessonProgresses: [] };
            }
          } catch (e) {
            console.error('Enrollment error:', e);
          }
        }

        const enrollObj = enrollData ? enrollData.enrollment : null;
        setEnrollment(enrollObj);

        // Build lesson progress map
        const pMap = {};
        if (enrollData && enrollData.lessonProgresses) {
          enrollData.lessonProgresses.forEach((p) => {
            pMap[p.lessonId.toString()] = p;
          });
        }
        setLessonProgressMap(pMap);

        // Determine current lesson
        const targetLessonId = searchParams.get('lesson');
        let initialLesson = null;

        if (targetLessonId && courseObj.sections) {
          for (const sec of courseObj.sections) {
            const found = sec.lessons?.find((l) => l._id.toString() === targetLessonId);
            if (found) {
              initialLesson = found;
              setCurrentSection(sec);
              break;
            }
          }
        }

        // If not from URL query, check enrollment currentLessonId or default to first lesson
        if (!initialLesson && courseObj.sections) {
          if (enrollObj && enrollObj.currentLessonId) {
            for (const sec of courseObj.sections) {
              const found = sec.lessons?.find((l) => l._id.toString() === enrollObj.currentLessonId.toString());
              if (found) {
                initialLesson = found;
                setCurrentSection(sec);
                break;
              }
            }
          }
        }

        if (!initialLesson && courseObj.sections?.[0]?.lessons?.[0]) {
          initialLesson = courseObj.sections[0].lessons[0];
          setCurrentSection(courseObj.sections[0]);
        }

        setCurrentLesson(initialLesson);
      } catch (err) {
        console.error('Failed to load learning player:', err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [slug, isAuthenticated]);

  // Update current lesson when URL param changes
  useEffect(() => {
    const targetLessonId = searchParams.get('lesson');
    if (targetLessonId && course && course.sections) {
      for (const sec of course.sections) {
        const found = sec.lessons?.find((l) => l._id.toString() === targetLessonId);
        if (found) {
          setCurrentLesson(found);
          setCurrentSection(sec);
          break;
        }
      }
    }
  }, [searchParams, course]);

  // Handle position update from CustomVideoPlayer (debounced save to MongoDB)
  const handlePositionUpdate = useCallback(
    (timeSec, durSec) => {
      setCurrentTime(timeSec);
      setDuration(durSec);

      if (!isAuthenticated || !course || !currentLesson) return;

      // Debounce saving position every 4 seconds
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          await saveLessonProgress({
            courseId: course._id,
            lessonId: currentLesson._id,
            position: Math.round(timeSec),
            duration: Math.round(durSec),
            completed: timeSec / (durSec || 1) > 0.9, // Auto complete if watched 90%
          });
        } catch (e) {
          // Silent catch for background autosave
        }
      }, 4000);
    },
    [isAuthenticated, course, currentLesson]
  );

  // Mark current lesson as complete
  const handleToggleComplete = async () => {
    if (!isAuthenticated || !course || !currentLesson) return;

    const isCurrentlyCompleted = enrollment?.completedLessons?.some(
      (id) => id.toString() === currentLesson._id.toString()
    );

    try {
      const res = await saveLessonProgress({
        courseId: course._id,
        lessonId: currentLesson._id,
        position: Math.round(currentTime),
        duration: Math.round(duration),
        completed: !isCurrentlyCompleted,
      });

      if (res.enrollment) {
        setEnrollment(res.enrollment);
      }

      if (res.newlyCompleted || res.certificate) {
        setUnlockedCertId(res.certificate || 'EDUPULSE-2026-UX9841');
        setCompletionModal(true);
      }
    } catch (e) {
      console.error('Failed to save completion:', e);
    }
  };

  // Switch to next or prev lesson
  const currentIdx = allLessons.findIndex((l) => currentLesson && l._id.toString() === currentLesson._id.toString());
  const hasPrev = currentIdx > 0;
  const hasNext = currentIdx < allLessons.length - 1;

  const goToLesson = (lesson) => {
    setCurrentLesson(lesson);
    setSearchParams({ lesson: lesson._id });
  };

  const handleNextLesson = () => {
    if (hasNext) {
      goToLesson(allLessons[currentIdx + 1]);
    }
  };

  const handlePrevLesson = () => {
    if (hasPrev) {
      goToLesson(allLessons[currentIdx - 1]);
    }
  };

  const handleSeek = (seconds) => {
    const playerDom = document.getElementById('custom-video-player-container');
    if (playerDom && playerDom.seekTo) {
      playerDom.seekTo(seconds);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="w-10 h-10 border-4 border-brand-400 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6">
        <p className="text-sm font-semibold mb-4">Lesson could not be loaded.</p>
        <Link to={`/course/${slug}`} className="px-4 py-2 rounded-xl bg-brand-600 text-xs font-bold">
          Back to Course Details
        </Link>
      </div>
    );
  }

  const isCompleted = enrollment?.completedLessons?.some(
    (id) => id.toString() === currentLesson._id.toString()
  );

  const initialWatchedPos = lessonProgressMap[currentLesson._id.toString()]?.lastWatchedPosition || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Learning Navigation Bar */}
      <div className="h-14 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4 flex-shrink-0 z-30">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to={`/course/${slug}`}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex-shrink-0"
            title="Return to Course Syllabus"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <h2 className="text-xs font-bold text-white truncate">{course.title}</h2>
            <p className="text-[11px] text-slate-400 truncate">
              {currentSection?.title || 'Section'} • Lesson {currentIdx + 1} of {allLessons.length}
            </p>
          </div>
        </div>

        {/* Progress Pill & Certificate Link */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {enrollment && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full border border-slate-700 text-xs">
              <span className="text-slate-400 font-medium">Progress:</span>
              <span className="font-bold text-brand-400">{enrollment.progressPercentage}%</span>
            </div>
          )}

          {enrollment?.isCompleted && (
            <Link
              to={`/certificate/${unlockedCertId || 'EDUPULSE-2026-UX9841'}`}
              className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 hover:bg-emerald-500/30 transition-all"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Certificate Unlocked</span>
            </Link>
          )}
        </div>
      </div>

      {/* Main Workspace: Left Video Player / Right Tabs */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-y-auto lg:overflow-hidden">
        {/* Left Column (8 cols): Video Player & Controls & Description */}
        <div className="lg:col-span-8 flex flex-col p-4 sm:p-6 lg:overflow-y-auto">
          {/* Custom HTML5 Video Player */}
          <div className="w-full">
            <CustomVideoPlayer
              key={currentLesson._id}
              videoUrl={currentLesson.videoUrl}
              vttUrl={currentLesson.vttUrl}
              initialPosition={initialWatchedPos}
              onPositionUpdate={handlePositionUpdate}
              onVideoEnd={handleNextLesson}
              onNextLesson={handleNextLesson}
              onPrevLesson={handlePrevLesson}
              hasNext={hasNext}
              hasPrev={hasPrev}
              title={currentLesson.title}
            />
          </div>

          {/* Lesson Action Bar */}
          <div className="mt-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white leading-snug">
                {currentLesson.title}
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                {currentLesson.description || 'Watch the lecture, take timestamped notes, and review the synced transcript below.'}
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Quiz button if lesson has quiz */}
              {currentLesson.hasQuiz && (
                <Link
                  to={`/quiz/${course._id}?lesson=${currentLesson._id}`}
                  className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  Take Lesson Quiz
                </Link>
              )}

              {/* Mark as Completed Button */}
              <button
                onClick={handleToggleComplete}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${
                  isCompleted
                    ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-600/40'
                    : 'bg-brand-600 hover:bg-brand-700 text-white'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isCompleted ? 'Completed' : 'Mark Complete'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Tabbed Panels (Notes, Transcript, Syllabus) */}
        <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col h-full bg-slate-900/50">
          {/* Tabs Selector */}
          <div className="flex border-b border-slate-800 px-3 pt-3 bg-slate-900 flex-shrink-0">
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 pb-3 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'notes'
                  ? 'border-brand-500 text-brand-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              Notes
            </button>
            <button
              onClick={() => setActiveTab('transcript')}
              className={`flex-1 pb-3 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'transcript'
                  ? 'border-brand-500 text-brand-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Transcript
            </button>
            <button
              onClick={() => setActiveTab('syllabus')}
              className={`flex-1 pb-3 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'syllabus'
                  ? 'border-brand-500 text-brand-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Syllabus
            </button>
          </div>

          {/* Active Panel View */}
          <div className="flex-1 overflow-hidden p-4">
            {activeTab === 'notes' && (
              <NotesPanel
                courseId={course._id}
                lessonId={currentLesson._id}
                currentTime={currentTime}
                onSeek={handleSeek}
              />
            )}

            {activeTab === 'transcript' && (
              <TranscriptPanel
                transcript={currentLesson.transcript || []}
                currentTime={currentTime}
                onSeek={handleSeek}
              />
            )}

            {activeTab === 'syllabus' && (
              <div className="h-full overflow-y-auto pr-1">
                <SyllabusAccordion
                  sections={course.sections}
                  currentLessonId={currentLesson._id}
                  completedLessonIds={enrollment?.completedLessons || []}
                  isEnrolled={true}
                  onSelectLesson={goToLesson}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Completion Modal */}
      {completionModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center text-slate-900 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Award className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-1">
              Course Completed!
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Congratulations! You have completed all lessons in <strong>{course.title}</strong>. Your official certificate of completion has been issued!
            </p>

            <div className="space-y-3">
              <Link
                to={`/certificate/${unlockedCertId}`}
                className="w-full py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Award className="w-4 h-4" />
                View & Print Official Certificate
              </Link>
              <button
                onClick={() => setCompletionModal(false)}
                className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-700 font-semibold"
              >
                Continue Reviewing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
