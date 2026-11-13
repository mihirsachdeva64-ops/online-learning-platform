import React from 'react';
import { Star, Users, BookOpen, ShieldCheck } from 'lucide-react';

export default function InstructorCard({ instructor }) {
  if (!instructor) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card">
      <div className="flex items-start gap-4">
        <img
          src={instructor.avatar || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'}
          alt={instructor.name}
          className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-100 shadow-sm flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-base font-bold text-slate-900 truncate">{instructor.name}</h4>
            <ShieldCheck className="w-4 h-4 text-brand-600 flex-shrink-0" title="Verified Instructor" />
          </div>
          <p className="text-xs text-brand-600 font-medium mb-3">{instructor.title || 'Senior Instructor'}</p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-3">
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
              <span>{instructor.rating ? instructor.rating.toFixed(1) : '4.9'} Instructor Rating</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>{instructor.studentsCount ? instructor.studentsCount.toLocaleString() : '12,000+'} Students</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <span>{instructor.coursesCount || 5} Courses</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {instructor.bio ||
              'Experienced industry educator dedicated to demystifying modern software engineering principles and architectural excellence.'}
          </p>
        </div>
      </div>
    </div>
  );
}
