const express = require('express');
const router = express.Router();
const {
  getMyCertificates,
  getCourseCertificate,
  verifyCertificate,
} = require('../controllers/certificateController');
const { protect } = require('../middleware/authMiddleware');

router.get('/verify/:certificateId', verifyCertificate); // Public route for verification
router.get('/my-certificates', protect, getMyCertificates);
router.get('/course/:courseId', protect, getCourseCertificate);

module.exports = router;
