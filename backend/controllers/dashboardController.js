const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Certificate = require('../models/Certificate');
const QuizAttempt = require('../models/QuizAttempt');
const User = require('../models/User');

// @desc    Get aggregated learner dashboard data
// @route   GET /api/dashboard
// @access  Private
const getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. Fetch user info
    const user = await User.findById(userId);

    // 2. Fetch all enrollments populated with course info
    const enrollments = await Enrollment.find({ user: userId })
      .populate({
        path: 'course',
        select: 'title slug thumbnail category level duration instructor sections',
      })
      .sort({ lastAccessedAt: -1 });

    const totalEnrolled = enrollments.length;
    let completedCoursesCount = 0;
    let totalCompletedLessons = 0;
    let sumProgress = 0;

    enrollments.forEach((e) => {
      if (e.isCompleted) completedCoursesCount += 1;
      totalCompletedLessons += (e.completedLessons ? e.completedLessons.length : 0);
      sumProgress += (e.progressPercentage || 0);
    });

    const overallProgress = totalEnrolled > 0 ? Math.round(sumProgress / totalEnrolled) : 0;

    // 3. Continue Learning: Most recently accessed in-progress course
    let continueLearning = null;
    const activeEnrollment = enrollments.find((e) => !e.isCompleted) || enrollments[0];

    if (activeEnrollment && activeEnrollment.course) {
      const course = activeEnrollment.course;
      let currentLesson = null;

      // Find lesson object
      if (course.sections) {
        for (const sec of course.sections) {
          if (sec.lessons) {
            const found = sec.lessons.find(
              (l) => activeEnrollment.currentLessonId && l._id.toString() === activeEnrollment.currentLessonId.toString()
            );
            if (found) {
              currentLesson = found;
              break;
            }
          }
        }
        // Fallback to first lesson if not found
        if (!currentLesson && course.sections[0] && course.sections[0].lessons[0]) {
          currentLesson = course.sections[0].lessons[0];
        }
      }

      continueLearning = {
        courseId: course._id,
        courseTitle: course.title,
        courseSlug: course.slug,
        thumbnail: course.thumbnail,
        category: course.category,
        progressPercentage: activeEnrollment.progressPercentage,
        lessonId: currentLesson ? currentLesson._id : null,
        lessonTitle: currentLesson ? currentLesson.title : 'Resume Next Lesson',
        lessonDuration: currentLesson ? currentLesson.duration : '',
      };
    }

    // 4. Certificates count
    const certificatesCount = await Certificate.countDocuments({ user: userId });

    // 5. Quiz Performance metrics
    const quizAttempts = await QuizAttempt.find({ user: userId }).sort({ completedAt: -1 });
    const totalQuizzesTaken = quizAttempts.length;
    let averageQuizScore = 0;
    if (totalQuizzesTaken > 0) {
      const totalScoreSum = quizAttempts.reduce((acc, curr) => acc + curr.percentage, 0);
      averageQuizScore = Math.round(totalScoreSum / totalQuizzesTaken);
    }

    // 6. Streak Calendar (Past 14 days activity visualization)
    const streakActivity = [];
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

      // Active if within user's streak range
      const isActive = i < (user.streakDays || 1);

      streakActivity.push({
        date: dateString,
        dayName,
        active: isActive,
        minutes: isActive ? Math.floor(25 + (i * 7) % 45) : 0,
      });
    }

    res.json({
      success: true,
      stats: {
        totalEnrolled,
        completedCoursesCount,
        totalCompletedLessons,
        overallProgress,
        totalLearningHours: Math.round(((user.totalLearningMinutes || 180) / 60) * 10) / 10,
        streakDays: user.streakDays || 1,
        certificatesCount,
        totalQuizzesTaken,
        averageQuizScore,
      },
      continueLearning,
      streakActivity,
      recentEnrollments: enrollments.slice(0, 5),
      recentQuizAttempts: quizAttempts.slice(0, 4),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboardData,
};
