import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  ChevronRight,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function QuizResults({ result, onRetake, courseSlug, nextLessonUrl }) {
  const {
    score = 0,
    totalQuestions = 0,
    percentage = 0,
    passed = false,
    passingScorePercentage = 70,
    breakdown = [],
  } = result;

  useEffect(() => {
    if (passed) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [passed]);

  return (
    <div className="space-y-8">
      {/* Score Header Card */}
      <div
        className={`p-8 rounded-3xl border text-center relative overflow-hidden shadow-card ${
          passed
            ? 'bg-gradient-to-b from-emerald-50 via-white to-white border-emerald-200'
            : 'bg-gradient-to-b from-amber-50 via-white to-white border-amber-200'
        }`}
      >
        <div
          className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-4 shadow-md ${
            passed
              ? 'bg-emerald-500 text-white shadow-emerald-500/20'
              : 'bg-amber-500 text-white shadow-amber-500/20'
          }`}
        >
          {passed ? <Award className="w-10 h-10" /> : <RotateCcw className="w-10 h-10" />}
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 mb-1">
          {passed ? 'Quiz Passed! Excellent Work' : 'Keep Going, Practice Makes Perfect!'}
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          {passed
            ? `You scored ${percentage}%, well above the passing grade of ${passingScorePercentage}%.`
            : `You scored ${percentage}%. You need ${passingScorePercentage}% to pass this assessment.`}
        </p>

        {/* Circular / Stat Pills */}
        <div className="grid grid-cols-3 max-w-sm mx-auto gap-3 text-center mb-6">
          <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="block text-xl font-black text-slate-900">{score}/{totalQuestions}</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Score</span>
          </div>
          <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            <span className={`block text-xl font-black ${passed ? 'text-emerald-600' : 'text-amber-600'}`}>
              {percentage}%
            </span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Percentage</span>
          </div>
          <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            <span className={`block text-xl font-black ${passed ? 'text-emerald-600' : 'text-amber-600'}`}>
              {passed ? 'Passed' : 'Retake'}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Status</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onRetake}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retake Quiz
          </button>

          {courseSlug && (
            <Link
              to={`/learn/${courseSlug}`}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Return to Course Player
            </Link>
          )}
        </div>
      </div>

      {/* Question by Question Detailed Breakdown */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span>Question Review & Explanations</span>
          <span className="text-xs font-normal text-slate-400">({breakdown.length} questions)</span>
        </h3>

        <div className="space-y-4">
          {breakdown.map((item, idx) => {
            const isCorrect = item.isCorrect;

            return (
              <div
                key={item.questionId || idx}
                className={`p-6 rounded-2xl border bg-white shadow-sm transition-all ${
                  isCorrect ? 'border-emerald-200' : 'border-red-200'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-2.5">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Question {idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                        {item.question}
                      </h4>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex-shrink-0 ${
                      isCorrect
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}
                  >
                    {isCorrect ? 'Correct (+1 pt)' : 'Incorrect (0 pt)'}
                  </span>
                </div>

                {/* Explanation Box */}
                <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                  <span className="font-bold text-slate-800 block mb-1">
                    Explanation & Learning Takeaway:
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    {item.explanation || 'Refer back to the video lesson for a full demonstration of this principle.'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
