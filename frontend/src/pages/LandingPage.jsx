import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  PlayCircle,
  FileText,
  Bookmark,
  Award,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Users,
  Star,
  BookOpen,
} from 'lucide-react';
import { getCourses } from '../services/courseService';
import CourseCard from '../components/course/CourseCard';
import { CourseCardSkeleton } from '../components/common/LoadingSkeleton';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { demoLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getCourses({ limit: 4, sortBy: 'popularity' })
      .then((res) => setCourses(res.courses || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleDemoClick = async () => {
    try {
      await demoLogin();
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/60 via-slate-50 to-slate-50 pt-16 pb-20 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Pill Banner */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              <span>Full-Stack EdTech Learning Experience</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Master Tech Skills with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600">
                Interactive Video
              </span>{' '}
              & Real-Time Tools
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Learn through custom HTML5 video lessons, synchronized interactive transcripts, timestamped notes, and multi-format quizzes. Earn verifiable completion certificates.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                to="/courses"
                className="px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Browse Course Catalog
                <ArrowRight className="w-4 h-4" />
              </Link>

              {!isAuthenticated && (
                <button
                  onClick={handleDemoClick}
                  className="px-6 py-3.5 rounded-2xl bg-white hover:bg-amber-50 text-slate-800 hover:text-amber-900 border border-slate-300 hover:border-amber-300 font-bold text-sm shadow-sm hover:shadow transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                  1-Click Mentor Demo
                </button>
              )}
            </div>

            {/* Quick Feature Tickers */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Custom HTML5 Video Player
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Timestamped Note Taking
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Synchronized Transcripts
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Printable Certificates
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Engineered for Real Learning
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Every feature is built natively using HTML5 APIs, persistent MongoDB state, and clean component architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-sm hover:border-brand-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center mb-4">
                <PlayCircle className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Custom Video Player</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Play/pause, speed controls (0.5x to 2x), WebVTT subtitles, fullscreen, and auto-resume from your exact watch timestamp.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-sm hover:border-brand-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Timestamped Notes</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Capture thoughts linked to video moments. Click any saved note to jump the video directly to that second.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-sm hover:border-brand-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Interactive Transcript</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Read transcript cues synchronized in real-time. Active lines auto-scroll and highlight as video plays.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-sm hover:border-brand-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Printable Certificates</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complete courses to automatically generate verifiable completion certificates with native browser print styling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Showcase */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Featured Curriculum
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Top Rated Courses
            </h2>
          </div>
          <Link
            to="/courses"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            <span>View All Courses</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <CourseCardSkeleton key={n} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
