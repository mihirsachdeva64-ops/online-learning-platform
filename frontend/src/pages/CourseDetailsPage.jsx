import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  Clock,
  BookOpen,
  Users,
  CheckCircle2,
  PlayCircle,
  Award,
  Share2,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { getCourseBySlug } from '../services/courseService';
import { enrollCourse, getCourseEnrollment } from '../services/progressService';
import SyllabusAccordion from '../components/course/SyllabusAccordion';
import InstructorCard from '../components/course/InstructorCard';
import { useAuth } from '../context/AuthContext';

export default function CourseDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, demoLogin } = useAuth();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        setLoading(true);
        const data = await getCourseBySlug(slug);
        setCourse(data.course);

        if (isAuthenticated && data.course) {
          try {
            const enrollData = await getCourseEnrollment(data.course._id);
            setIsEnrolled(enrollData.isEnrolled);
            setEnrollment(enrollData.enrollment);
          } catch (e) {
            console.error('Enrollment fetch error:', e);
          }
        }
      } catch (err) {
        console.error('Failed to load course details:', err);
        setError('Course not found or unavailable');
      } finally {
        setLoading(false);
      }
    };

    loadCourseData();
  }, [slug, isAuthenticated]);

  const handleEnrollOrResume = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/course/${slug}` } });
      return;
    }

    if (isEnrolled) {
      // Resume to learning player
      navigate(`/learn/${course.slug}`);
      return;
    }

    try {
      setEnrolling(true);
      await enrollCourse(course._id);
      setIsEnrolled(true);
      navigate(`/learn/${course.slug}`);
    } catch (err) {
      console.error('Enrollment failed:', err);
    } finally {
      setEnrolling(false);
    }
  };

  const handleSelectLesson = (lesson) => {
    if (isEnrolled || lesson.isPreview) {
      navigate(`/learn/${course.slug}?lesson=${lesson._id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <ShieldAlert className="w-12 h-12 text-red-500 mb-3" />
        <h2 className="text-xl font-bold text-slate-900 mb-1">Course Not Found</h2>
        <p className="text-xs text-slate-500 mb-4">{error || 'The requested course does not exist.'}</p>
        <Link to="/courses" className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const totalLessons = course.sections
    ? course.sections.reduce((acc, sec) => acc + (sec.lessons ? sec.lessons.length : 0), 0)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Course Banner Header */}
      <section className="bg-slate-900 text-white py-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            {/* Left 2 Cols: Details */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="px-3 py-1 rounded-full font-bold bg-brand-600 text-white">
                  {course.category}
                </span>
                <span className="px-3 py-1 rounded-full font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  {course.level} Level
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                {course.subtitle || course.description}
              </p>

              {/* Course Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2">
                <div className="flex items-center text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 stroke-amber-400 mr-1" />
                  <span>{course.rating ? course.rating.toFixed(1) : '4.9'}</span>
                  <span className="text-slate-400 ml-1">({course.reviewCount || 120} reviews)</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{course.enrollmentCount ? course.enrollmentCount.toLocaleString() : '1,200'} enrolled</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{course.duration}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  <span>{totalLessons} lessons</span>
                </div>
              </div>

              {/* Instructor snippet */}
              <div className="flex items-center gap-2.5 pt-3 border-t border-slate-800">
                <span className="text-xs text-slate-400">Created by:</span>
                <img
                  src={course.instructor ? course.instructor.avatar : ''}
                  alt={course.instructor ? course.instructor.name : ''}
                  className="w-6 h-6 rounded-full object-cover border border-slate-700"
                />
                <span className="text-xs font-bold text-white">
                  {course.instructor ? course.instructor.name : 'Master Instructor'}
                </span>
                <span className="text-[11px] text-slate-400">
                  ({course.instructor ? course.instructor.title : 'Senior Engineer'})
                </span>
              </div>
            </div>

            {/* Right Col: Sticky Enrollment Action Card */}
            <div className="lg:col-span-1 bg-white rounded-3xl p-6 text-slate-900 border border-slate-200/90 shadow-2xl space-y-5">
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-100 shadow-inner group">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div
                  onClick={() => {
                    const firstPreview = course.sections?.[0]?.lessons?.[0];
                    if (firstPreview) handleSelectLesson(firstPreview);
                  }}
                  className="absolute inset-0 bg-black/40 hover:bg-black/30 flex items-center justify-center cursor-pointer transition-all"
                >
                  <div className="w-14 h-14 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <PlayCircle className="w-8 h-8 fill-white/20" />
                  </div>
                  <span className="absolute bottom-3 text-[11px] font-bold text-white bg-black/60 px-3 py-1 rounded-full backdrop-blur-md">
                    Preview Course
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl font-black text-slate-900">Free Access</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Included with Platform
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Full lifetime access to custom video player, notes, quizzes & certificate.
                </p>
              </div>

              {/* Progress Indicator if already enrolled */}
              {isEnrolled && enrollment && (
                <div className="p-3.5 rounded-2xl bg-brand-50 border border-brand-200">
                  <div className="flex justify-between items-center text-xs font-bold text-brand-900 mb-1.5">
                    <span>Your Learning Progress</span>
                    <span>{enrollment.progressPercentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-brand-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-600 rounded-full transition-all"
                      style={{ width: `${enrollment.progressPercentage}%` }}
                    />
                  </div>
                </div>
              )}

              {/* CTA Button */}
              <button
                onClick={handleEnrollOrResume}
                disabled={enrolling}
                className="w-full py-3.5 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isEnrolled ? (
                  <>
                    <PlayCircle className="w-4 h-4" />
                    <span>Continue Learning</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                ) : (
                  <>
                    <BookOpen className="w-4 h-4" />
                    <span>{enrolling ? 'Enrolling...' : 'Enroll Now (Free)'}</span>
                  </>
                )}
              </button>

              {/* Includes Checklist */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <span className="font-bold text-slate-800 block">This course includes:</span>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-brand-600" />
                  <span>{course.duration} on-demand video</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-brand-600" />
                  <span>{totalLessons} lessons with timestamped transcripts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-brand-600" />
                  <span>Verifiable Course Completion Certificate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Details Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left 2 Cols: What you'll learn, Syllabus, Instructor */}
          <div className="lg:col-span-2 space-y-10">
            {/* What you'll learn */}
            {course.highlights && course.highlights.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-7 shadow-card">
                <h3 className="text-lg font-bold text-slate-900 mb-4">What You'll Learn</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {course.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Syllabus Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Course Syllabus</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {course.sections ? course.sections.length : 0} modules • {totalLessons} lessons • {course.duration} total length
                  </p>
                </div>
              </div>

              <SyllabusAccordion
                sections={course.sections}
                completedLessonIds={enrollment ? enrollment.completedLessons : []}
                isEnrolled={isEnrolled}
                onSelectLesson={handleSelectLesson}
              />
            </div>

            {/* Course Description */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-7 shadow-card space-y-3">
              <h3 className="text-lg font-bold text-slate-900">Detailed Description</h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {course.description}
              </p>

              {course.prerequisites && course.prerequisites.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Prerequisites
                  </h4>
                  <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                    {course.prerequisites.map((pre, i) => (
                      <li key={i}>{pre}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Instructor Card */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Meet Your Instructor</h3>
              <InstructorCard instructor={course.instructor} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
