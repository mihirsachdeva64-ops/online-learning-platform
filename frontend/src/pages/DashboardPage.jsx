import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Clock,
  CheckCircle2,
  Award,
  Flame,
  HelpCircle,
  PlayCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { getDashboardData } from '../services/dashboardService';
import ProgressRing from '../components/dashboard/ProgressRing';
import StreakCalendar from '../components/dashboard/StreakCalendar';
import ContinueLearningCard from '../components/dashboard/ContinueLearningCard';
import { StatsSkeleton } from '../components/common/LoadingSkeleton';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardData()
      .then((res) => setData(res))
      .catch((err) => console.error('Dashboard fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="h-8 w-48 bg-slate-200 rounded animate-pulse"></div>
          <StatsSkeleton />
        </div>
      </div>
    );
  }

  const stats = data?.stats || {
    totalEnrolled: 0,
    completedCoursesCount: 0,
    totalCompletedLessons: 0,
    overallProgress: 0,
    totalLearningHours: 0,
    streakDays: 1,
    certificatesCount: 0,
    totalQuizzesTaken: 0,
    averageQuizScore: 0,
  };

  const enrollments = data?.recentEnrollments || [];
  const quizAttempts = data?.recentQuizAttempts || [];

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {user?.name || 'Learner'}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track your course progress, study streaks, quiz performance and unlocked credentials.
            </p>
          </div>

          <Link
            to="/courses"
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm self-start transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span>Explore More Courses</span>
          </Link>
        </div>

        {/* 4 Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Overall Progress */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-card flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Overall Progress
              </span>
              <h3 className="text-2xl font-black text-slate-900">{stats.overallProgress}%</h3>
              <p className="text-xs text-slate-500">Across {stats.totalEnrolled} courses</p>
            </div>
            <ProgressRing percentage={stats.overallProgress} size={64} strokeWidth={6} />
          </div>

          {/* Card 2: Total Learning Hours */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-card flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Learning Hours
              </span>
              <h3 className="text-2xl font-black text-slate-900">{stats.totalLearningHours} hrs</h3>
              <p className="text-xs text-slate-500">{stats.totalCompletedLessons} lessons finished</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Quiz Score Average */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-card flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Quiz Mastery
              </span>
              <h3 className="text-2xl font-black text-slate-900">{stats.averageQuizScore}%</h3>
              <p className="text-xs text-slate-500">{stats.totalQuizzesTaken} assessments taken</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <HelpCircle className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Certificates Earned */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-card flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Certificates
              </span>
              <h3 className="text-2xl font-black text-emerald-600">
                {stats.certificatesCount} Earned
              </h3>
              <p className="text-xs text-slate-500">Official credentials</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Continue Learning Banner */}
        {data?.continueLearning && (
          <div>
            <ContinueLearningCard continueLearning={data.continueLearning} />
          </div>
        )}

        {/* Streak Calendar Grid */}
        <StreakCalendar
          streakDays={stats.streakDays}
          streakActivity={data?.streakActivity || []}
        />

        {/* Enrolled Courses with Circular Progress Indicators */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Enrolled Courses</h3>
            <span className="text-xs text-slate-400 font-medium">
              {enrollments.length} Active Courses
            </span>
          </div>

          {enrollments.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-8 text-center text-slate-500 text-xs shadow-card">
              You are not enrolled in any courses yet. Browse our catalog to begin learning!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enr) => {
                const c = enr.course;
                if (!c) return null;

                return (
                  <div
                    key={enr._id}
                    className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={c.thumbnail}
                        alt={c.title}
                        className="w-16 h-16 rounded-2xl object-cover bg-slate-100 flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
                          {c.category}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 truncate leading-snug">
                          {c.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {enr.completedLessons?.length || 0} lessons completed
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-3">
                        <ProgressRing
                          percentage={enr.progressPercentage}
                          size={46}
                          strokeWidth={4.5}
                          color={enr.isCompleted ? 'stroke-emerald-500' : 'stroke-brand-600'}
                        />
                        <span className="text-xs font-semibold text-slate-700">
                          {enr.isCompleted ? 'Completed' : 'In Progress'}
                        </span>
                      </div>

                      <Link
                        to={`/learn/${c.slug}`}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        <span>{enr.isCompleted ? 'Review' : 'Continue'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Quiz Attempts Performance Table */}
        {quizAttempts.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Recent Quiz Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="pb-3">Assessment Date</th>
                    <th className="pb-3">Score</th>
                    <th className="pb-3">Percentage</th>
                    <th className="pb-3">Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {quizAttempts.map((attempt) => (
                    <tr key={attempt._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 text-slate-600">
                        {new Date(attempt.completedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 font-semibold text-slate-800">
                        {attempt.score}/{attempt.totalQuestions}
                      </td>
                      <td className="py-3 font-bold text-slate-900">
                        {attempt.percentage}%
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            attempt.passed
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {attempt.passed ? 'Passed' : 'Needs Practice'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
