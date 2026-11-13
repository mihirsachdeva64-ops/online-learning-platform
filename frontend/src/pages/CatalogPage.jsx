import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, SearchX, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { getCourses } from '../services/courseService';
import CourseCard from '../components/course/CourseCard';
import CourseFilter from '../components/course/CourseFilter';
import { CourseCardSkeleton } from '../components/common/LoadingSkeleton';

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state from URL query params or defaults
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [level, setLevel] = useState(searchParams.get('level') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'popularity');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Sync state to URL params
  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (level) params.level = level;
    if (sortBy && sortBy !== 'popularity') params.sortBy = sortBy;
    if (currentPage > 1) params.page = currentPage;

    setSearchParams(params, { replace: true });
  }, [search, category, level, sortBy, currentPage]);

  // Fetch courses with debounce on search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCourseList();
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category, level, sortBy, currentPage]);

  const fetchCourseList = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCourses({
        search,
        category,
        level,
        sortBy,
        page: currentPage,
        limit: 8,
      });

      setCourses(data.courses || []);
      setTotalPages(data.totalPages || 1);
      setTotalResults(data.total || 0);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err.message || 'Failed to fetch courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearch('');
    setCategory('');
    setLevel('');
    setSortBy('popularity');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore All Courses
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Discover industry-aligned courses taught by expert practitioners with interactive labs & quizzes.
          </p>
        </div>

        {/* Filters & Search Component */}
        <CourseFilter
          search={search}
          setSearch={(val) => {
            setSearch(val);
            setCurrentPage(1);
          }}
          category={category}
          setCategory={(val) => {
            setCategory(val);
            setCurrentPage(1);
          }}
          level={level}
          setLevel={(val) => {
            setLevel(val);
            setCurrentPage(1);
          }}
          sortBy={sortBy}
          setSortBy={setSortBy}
          totalResults={totalResults}
          onReset={handleReset}
        />

        {/* Error State */}
        {error && (
          <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 my-8">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-xs font-semibold">{error}</p>
          </div>
        )}

        {/* Course Grid / Loading / Empty */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <CourseCardSkeleton key={n} />
            ))}
          </div>
        ) : courses.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-md mx-auto shadow-card my-12">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <SearchX className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">No courses found</h3>
            <p className="text-xs text-slate-500 mb-6">
              We couldn't find any courses matching your search criteria. Try adjusting your filters.
            </p>
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => setCurrentPage(pg)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                      currentPage === pg
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {pg}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
