import React from 'react';
import { Flame, Calendar, Check } from 'lucide-react';

export default function StreakCalendar({ streakDays = 4, streakActivity = [] }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
            <Flame className="w-5 h-5 fill-amber-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Learning Streak</h3>
            <p className="text-xs text-slate-500">
              <strong className="text-amber-600">{streakDays} consecutive days</strong> of studying!
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
          🔥 Active Streak
        </span>
      </div>

      {/* 14-day calendar squares */}
      <div className="mt-4">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Recent Activity (Past 14 Days)</span>
          <span className="text-slate-400 font-normal">Active vs Rest Days</span>
        </div>

        <div className="grid grid-cols-7 sm:grid-cols-14 gap-2">
          {streakActivity.map((day, idx) => (
            <div
              key={day.date || idx}
              className={`p-2 rounded-xl text-center border transition-all ${
                day.active
                  ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-sm'
                  : 'bg-slate-50 border-slate-200/70 text-slate-400'
              }`}
              title={`${day.date}: ${day.active ? `${day.minutes} mins studied` : 'Rest day'}`}
            >
              <span className="block text-[10px] font-bold">{day.dayName}</span>
              <div className="w-5 h-5 mx-auto my-1 rounded-full flex items-center justify-center">
                {day.active ? (
                  <Check className="w-3.5 h-3.5 text-amber-600 stroke-[3]" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                )}
              </div>
              <span className="block text-[9px] font-medium truncate">
                {day.active ? `${day.minutes}m` : '-'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
