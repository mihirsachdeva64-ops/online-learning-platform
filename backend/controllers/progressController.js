const Enrollment = require('../models/Enrollment');
const LessonProgress = require('../models/LessonProgress');
const Course = require('../models/Course');
const Certificate = require('../models/Certificate');

// Helper to count total lessons in course
const countCourseLessons = (course) => {
  let count = 0;
  if (course.sections) {
    for (const sec of course.sections) {
      if (sec.lessons) count += sec.lessons.length;
    }
  }
  return count || 1;
};

// @desc    Enroll authenticated user in course
// @route   POST /api/progress/enroll/:courseId
// @access  Private
const enrollCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    let enrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (enrollment) {
      return res.json({
        success: true,
        message: 'Already enrolled',
        enrollment,
      });
    }

    // Default currentLessonId to first lesson of first section
    let firstLessonId = null;
    if (course.sections && course.sections[0] && course.sections[0].lessons[0]) {
      firstLessonId = course.sections[0].lessons[0]._id;
    }

    enrollment = await Enrollment.create({
      user: userId,
      course: courseId,
      currentLessonId: firstLessonId,
      progressPercentage: 0,
      completedLessons: [],
    });

    // Increment course enrollment count
    course.enrollmentCount = (course.enrollmentCount || 0) + 1;
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Enrolled successfully',
      enrollment,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's enrolled courses with progress
// @route   GET /api/progress/my-enrollments
// @access  Private
const getMyEnrollments = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const enrollments = await Enrollment.find({ user: userId })
      .populate({
        path: 'course',
        select: 'title slug thumbnail category level duration instructor rating sections',
      })
      .sort({ lastAccessedAt: -1 });

    res.json({
      success: true,
      enrollments,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get enrollment details for a specific course
// @route   GET /api/progress/course/:courseId
// @access  Private
const getCourseEnrollment = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
    const lessonProgresses = await LessonProgress.find({ user: userId, course: courseId });

    res.json({
      success: true,
      isEnrolled: !!enrollment,
      enrollment: enrollment || null,
      lessonProgresses,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Save lesson position & completion status
// @route   POST /api/progress/lesson
// @access  Private
const saveLessonProgress = async (req, res, next) => {
  try {
    const { courseId, lessonId, position, duration, completed } = req.body;
    const userId = req.user._id;

    if (!courseId || !lessonId) {
      return res.status(400).json({ success: false, message: 'courseId and lessonId are required' });
    }

    // 1. Update or create LessonProgress
    let progress = await LessonProgress.findOne({ user: userId, lessonId });
    if (!progress) {
      progress = new LessonProgress({
        user: userId,
        course: courseId,
        lessonId,
        lastWatchedPosition: position || 0,
        duration: duration || 0,
        isCompleted: !!completed,
        completedAt: completed ? new Date() : null,
      });
    } else {
      if (position !== undefined) progress.lastWatchedPosition = position;
      if (duration !== undefined) progress.duration = duration;
      if (completed && !progress.isCompleted) {
        progress.isCompleted = true;
        progress.completedAt = new Date();
      }
    }
    await progress.save();

    // 2. Update Enrollment progress
    let enrollment = await Enrollment.findOne({ user: userId, course: courseId });
    let newlyCompleted = false;
    let certificate = null;

    if (enrollment) {
      enrollment.currentLessonId = lessonId;
      enrollment.lastAccessedAt = new Date();

      if (completed) {
        const alreadyInCompleted = enrollment.completedLessons.some(
          (id) => id.toString() === lessonId.toString()
        );

        if (!alreadyInCompleted) {
          enrollment.completedLessons.push(lessonId);
        }
      }

      const course = await Course.findById(courseId);
      if (course) {
        const totalLessons = countCourseLessons(course);
        const completedCount = enrollment.completedLessons.length;
        const progressPercentage = Math.min(
          100,
          Math.round((completedCount / totalLessons) * 100)
        );

        enrollment.progressPercentage = progressPercentage;

        if (progressPercentage >= 100 && !enrollment.isCompleted) {
          enrollment.isCompleted = true;
          enrollment.completedAt = new Date();
          newlyCompleted = true;

          // Auto-generate Certificate if not present
          certificate = await Certificate.findOne({ user: userId, course: courseId });
          if (!certificate) {
            const certSuffix = Math.floor(1000 + Math.random() * 9000);
            certificate = await Certificate.create({
              certificateId: `EDUPULSE-2026-${certSuffix}`,
              user: userId,
              course: courseId,
              recipientName: req.user.name,
              courseTitle: course.title,
              instructorName: course.instructor ? course.instructor.name : 'Master Instructor',
              issueDate: new Date(),
              grade: 'Passed with Distinction',
              finalScorePercentage: 100,
            });
          }
        }
      }

      await enrollment.save();
    }

    res.json({
      success: true,
      progress,
      enrollment,
      newlyCompleted,
      certificate: certificate ? certificate.certificateId : null,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  enrollCourse,
  getMyEnrollments,
  getCourseEnrollment,
  saveLessonProgress,
};
