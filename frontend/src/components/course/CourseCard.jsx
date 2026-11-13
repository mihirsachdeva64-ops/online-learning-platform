import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, BookOpen, Users, ArrowRight } from 'lucide-react';

const levelColors = {
  Beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Intermediate: 'bg-brand-50 text-brand-700 border-brand-200',
  Advanced: 'bg-purple-50 text-purple-700 border-purple-200',
};

export default function CourseCard({ course }) {
  const totalLessons = course.sections
    ? course.sections.reduce((acc, sec) => acc + (sec.lessons ? sec.lessons.length : 0), 0)
    : 4;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col hover:-translate-y-1">
      {/* Thumbnail Banner */}
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-slate-800 shadow-sm">
            {course.category}
          </span>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${
              levelColors[course.level] || 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            {course.level}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Rating & Reviews */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
          <div className="flex items-center text-amber-500 font-bold">
            <Star className="w-4 h-4 fill-amber-400 stroke-amber-400 mr-1" />
            <span>{course.rating ? course.rating.toFixed(1) : '4.9'}</span>
          </div>
          <span>•</span>
          <span>({course.reviewCount || 85} reviews)</span>
          <span className="ml-auto flex items-center gap-1 text-slate-400">
            <Users className="w-3.5 h-3.5" />
            {course.enrollmentCount || 120} learners
          </span>
        </div>

        {/* Title & Subtitle */}
        <h3 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 text-base mb-1.5 leading-snug">
          <Link to={`/course/${course.slug}`}>{course.title}</Link>
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
          {course.subtitle || course.description}
        </p>

        {/* Instructor */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={course.instructor ? course.instructor.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80'}
              alt={course.instructor ? course.instructor.name : 'Instructor'}
              className="w-6 h-6 rounded-full object-cover border border-slate-200"
            />
            <span className="text-xs font-medium text-slate-700 truncate max-w-[110px]">
              {course.instructor ? course.instructor.name : 'Senior Instructor'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {course.duration || '4h 30m'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              {totalLessons} lessons
            </span>
          </div>
        </div>

        {/* Action Link */}
        <Link
          to={`/course/${course.slug}`}
          className="mt-4 w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-brand-50 text-brand-600 hover:text-brand-700 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-200/80 hover:border-brand-200 transition-all"
        >
          View Course & Syllabus
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
