import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Clock, BookOpen, ArrowRight } from 'lucide-react';

export default function ContinueLearningCard({ continueLearning }) {
  if (!continueLearning) return null;

  const {
    courseTitle,
    courseSlug,
    thumbnail,
    category,
    progressPercentage = 0,
    lessonTitle,
    lessonDuration,
  } = continueLearning;

  return (
    <div className="bg-gradient-to-r from-brand-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
      {/* Background Subtle Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative w-28 h-20 sm:w-36 sm:h-24 rounded-2xl overflow-hidden shadow-lg flex-shrink-0 bg-slate-800">
            <img
              src={thumbnail}
              alt={courseTitle}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <PlayCircle className="w-8 h-8 text-white fill-white/20" />
            </div>
          </div>

          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-md mb-2">
              {category || 'In Progress'}
            </span>
            <h3 className="text-lg sm:text-xl font-bold leading-snug line-clamp-1">
              {courseTitle}
            </h3>
            <p className="text-xs text-indigo-200 mt-1 flex items-center gap-2">
              <span className="font-semibold text-white">Current Lesson:</span>
              <span className="truncate max-w-[200px] sm:max-w-xs">{lessonTitle}</span>
              {lessonDuration && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {lessonDuration}
                  </span>
                </>
              )}
            </p>

            {/* Progress bar */}
            <div className="mt-3 flex items-center gap-3">
              <div className="w-40 sm:w-56 h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-400 rounded-full transition-all duration-700"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="text-xs font-bold text-white">{progressPercentage}% Completed</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          to={`/learn/${courseSlug}`}
          className="px-6 py-3 rounded-2xl bg-white hover:bg-slate-100 text-brand-900 font-bold text-xs flex items-center gap-2 shadow-lg hover:scale-105 transition-all flex-shrink-0"
        >
          <span>Resume Lesson</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
