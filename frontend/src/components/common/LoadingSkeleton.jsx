import React from 'react';

export function CourseCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-card animate-pulse">
      <div className="w-full h-44 bg-slate-200"></div>
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-5 w-24 bg-slate-200 rounded-full"></div>
          <div className="h-4 w-12 bg-slate-200 rounded"></div>
        </div>
        <div className="h-5 w-4/5 bg-slate-200 rounded"></div>
        <div className="h-4 w-full bg-slate-200 rounded"></div>
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-200"></div>
            <div className="h-4 w-20 bg-slate-200 rounded"></div>
          </div>
          <div className="h-4 w-14 bg-slate-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-card animate-pulse space-y-3">
          <div className="flex justify-between">
            <div className="w-10 h-10 rounded-xl bg-slate-200"></div>
            <div className="w-12 h-6 rounded-full bg-slate-200"></div>
          </div>
          <div className="h-8 w-1/2 bg-slate-200 rounded"></div>
          <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
        </div>
      ))}
    </div>
  );
}

export default {
  CourseCardSkeleton,
  StatsSkeleton,
};
