import React, { useState, useEffect } from 'react';
import { Timer, AlertCircle } from 'lucide-react';

export default function QuizTimer({ initialSeconds = 300, onExpire, isSubmitted = false }) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (isSubmitted) return;

    if (secondsLeft <= 0) {
      if (onExpire) onExpire();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (onExpire) onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, isSubmitted, onExpire]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const isUrgent = secondsLeft < 60;
  const isWarning = secondsLeft < 120 && !isUrgent;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all ${
        isUrgent
          ? 'bg-red-50 text-red-600 border-red-200 animate-pulse'
          : isWarning
          ? 'bg-amber-50 text-amber-700 border-amber-200'
          : 'bg-slate-100 text-slate-700 border-slate-200'
      }`}
    >
      {isUrgent ? (
        <AlertCircle className="w-4 h-4 text-red-600" />
      ) : (
        <Timer className="w-4 h-4 text-slate-500" />
      )}
      <span>{formatted}</span>
    </div>
  );
}
