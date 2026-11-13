import React, { useState } from 'react';
import { ChevronDown, ChevronUp, PlayCircle, CheckCircle2, Lock, FileText, HelpCircle } from 'lucide-react';

export default function SyllabusAccordion({
  sections = [],
  currentLessonId,
  completedLessonIds = [],
  isEnrolled = false,
  onSelectLesson,
}) {
  // Keep all sections open by default
  const [openSections, setOpenSections] = useState(() =>
    sections.reduce((acc, _, idx) => ({ ...acc, [idx]: true }), {})
  );

  const toggleSection = (idx) => {
    setOpenSections((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className="space-y-3">
      {sections.map((section, sIdx) => {
        const isOpen = openSections[sIdx];
        const sectionLessons = section.lessons || [];
        const sectionCompletedCount = sectionLessons.filter((l) =>
          completedLessonIds.some((id) => id.toString() === l._id.toString())
        ).length;

        return (
          <div
            key={section._id || sIdx}
            className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-sm"
          >
            {/* Accordion Header */}
            <button
              onClick={() => toggleSection(sIdx)}
              className="w-full px-5 py-4 flex items-center justify-between bg-slate-50/80 hover:bg-slate-100/80 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold">
                  {sIdx + 1}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{section.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span>{sectionLessons.length} lessons</span>
                    {isEnrolled && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-600 font-medium">
                          {sectionCompletedCount}/{sectionLessons.length} completed
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-slate-400">
                {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </button>

            {/* Accordion Body */}
            {isOpen && (
              <div className="divide-y divide-slate-100 border-t border-slate-100">
                {sectionLessons.map((lesson, lIdx) => {
                  const isCurrent = currentLessonId && lesson._id.toString() === currentLessonId.toString();
                  const isCompleted = completedLessonIds.some(
                    (id) => id.toString() === lesson._id.toString()
                  );
                  const canAccess = isEnrolled || lesson.isPreview;

                  return (
                    <div
                      key={lesson._id || lIdx}
                      onClick={() => canAccess && onSelectLesson && onSelectLesson(lesson)}
                      className={`px-5 py-3.5 flex items-center justify-between gap-4 transition-colors ${
                        canAccess ? 'cursor-pointer hover:bg-slate-50' : 'cursor-not-allowed opacity-75'
                      } ${isCurrent ? 'bg-brand-50/70 border-l-4 border-brand-600 pl-4' : ''}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        ) : canAccess ? (
                          <PlayCircle className={`w-4 h-4 flex-shrink-0 ${isCurrent ? 'text-brand-600' : 'text-slate-400'}`} />
                        ) : (
                          <Lock className="w-4 h-4 text-slate-300 flex-shrink-0" />
                        )}

                        <div className="min-w-0">
                          <p className={`text-xs font-medium truncate ${isCurrent ? 'text-brand-900 font-bold' : 'text-slate-700'}`}>
                            {lesson.title}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <span>{lesson.duration || '5:00'}</span>
                            {lesson.transcript && lesson.transcript.length > 0 && (
                              <span className="flex items-center gap-0.5 text-slate-400">
                                <FileText className="w-3 h-3" /> Transcript
                              </span>
                            )}
                            {lesson.hasQuiz && (
                              <span className="flex items-center gap-0.5 text-amber-600 font-medium bg-amber-50 px-1.5 py-0.2 rounded">
                                <HelpCircle className="w-3 h-3" /> Quiz
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {lesson.isPreview && !isEnrolled && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Free Preview
                          </span>
                        )}
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-600 text-white animate-pulse">
                            Now Playing
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
