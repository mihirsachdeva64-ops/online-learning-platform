const express = require('express');
const router = express.Router();
const {
  getQuizById,
  getQuizByTarget,
  submitQuizAttempt,
  getQuizAttempts,
} = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All quiz routes require authentication

router.get('/target', getQuizByTarget);
router.get('/:id', getQuizById);
router.post('/:id/submit', submitQuizAttempt);
router.get('/:id/attempts', getQuizAttempts);

module.exports = router;
