const Certificate = require('../models/Certificate');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// @desc    Get all certificates earned by authenticated user
// @route   GET /api/certificates/my-certificates
// @access  Private
const getMyCertificates = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const certificates = await Certificate.find({ user: userId })
      .populate('course', 'title slug thumbnail category instructor')
      .sort({ issueDate: -1 });

    res.json({
      success: true,
      certificates,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get or generate certificate for completed course
// @route   GET /api/certificates/course/:courseId
// @access  Private
const getCourseCertificate = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    let certificate = await Certificate.findOne({ user: userId, course: courseId })
      .populate('course', 'title slug thumbnail category instructor');

    if (!certificate) {
      // Check if user is enrolled and has completed 100%
      const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }

      if (!enrollment || enrollment.progressPercentage < 100) {
        return res.status(400).json({
          success: false,
          message: 'Course must be 100% completed to unlock your certificate',
          progressPercentage: enrollment ? enrollment.progressPercentage : 0,
        });
      }

      // Generate new certificate
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      certificate = await Certificate.create({
        certificateId: `EDUPULSE-2026-${randomCode}`,
        user: userId,
        course: courseId,
        recipientName: req.user.name,
        courseTitle: course.title,
        instructorName: course.instructor ? course.instructor.name : 'Master Instructor',
        issueDate: new Date(),
        grade: 'Passed with Distinction',
        finalScorePercentage: 100,
      });

      certificate = await Certificate.findById(certificate._id).populate(
        'course',
        'title slug thumbnail category instructor'
      );
    }

    res.json({
      success: true,
      certificate,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Public verification of certificate by ID
// @route   GET /api/certificates/verify/:certificateId
// @access  Public
const verifyCertificate = async (req, res, next) => {
  try {
    const { certificateId } = req.params;

    const certificate = await Certificate.findOne({
      certificateId: certificateId.toUpperCase().trim(),
    }).populate('course', 'title category level thumbnail instructor');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Invalid certificate ID. No credential found in the verification registry.',
      });
    }

    res.json({
      success: true,
      valid: true,
      certificate: {
        certificateId: certificate.certificateId,
        recipientName: certificate.recipientName,
        courseTitle: certificate.courseTitle,
        instructorName: certificate.instructorName,
        issueDate: certificate.issueDate,
        grade: certificate.grade,
        course: certificate.course,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMyCertificates,
  getCourseCertificate,
  verifyCertificate,
};
