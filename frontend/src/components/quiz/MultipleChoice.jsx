import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

export default function MultipleChoice({ question, selectedAnswer, onChange, disabled = false }) {
  const options = question.options || [];

  return (
    <div className="space-y-3">
      <div className="text-sm font-semibold text-slate-800 leading-snug">
        {question.question}
      </div>

      <div className="space-y-2.5">
        {options.map((option, idx) => {
          const isSelected = selectedAnswer === idx;

          return (
            <button
              key={idx}
              type="button"
              disabled={disabled}
              onClick={() => onChange(idx)}
              className={`w-full p-4 rounded-xl text-left text-xs font-medium border transition-all flex items-center justify-between gap-3 ${
                isSelected
                  ? 'bg-brand-50/90 border-brand-500 text-brand-950 font-semibold shadow-sm'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
              } ${disabled ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-6 h-6 rounded-lg text-[11px] font-bold flex items-center justify-center flex-shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="leading-relaxed">{option}</span>
              </div>

              {isSelected ? (
                <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-slate-300 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
