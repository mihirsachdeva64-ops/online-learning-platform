const express = require('express');
const router = express.Router();
const {
  enrollCourse,
  getMyEnrollments,
  getCourseEnrollment,
  saveLessonProgress,
} = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.post('/enroll/:courseId', protect, enrollCourse);
router.get('/my-enrollments', protect, getMyEnrollments);
router.get('/course/:courseId', protect, getCourseEnrollment);
router.post('/lesson', protect, saveLessonProgress);

module.exports = router;
