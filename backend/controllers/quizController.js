const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');

// Helper to evaluate drag and order equality
const arraysEqual = (a, b) => {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

// Helper to evaluate multiple-select equality
const setEqual = (a, b) => {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return arraysEqual(sortedA, sortedB);
};

// @desc    Get quiz details & questions
// @route   GET /api/quizzes/:id
// @access  Private
const getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    // Strip answers when sending questions for test
    const sanitizedQuestions = quiz.questions.map((q) => ({
      id: q.id,
      type: q.type,
      question: q.question,
      options: q.options || [],
      items: q.items || [],
      // correct answers omitted for exam integrity
    }));

    res.json({
      success: true,
      quiz: {
        _id: quiz._id,
        course: quiz.course,
        lessonId: quiz.lessonId,
        title: quiz.title,
        description: quiz.description,
        timeLimitSeconds: quiz.timeLimitSeconds,
        passingScorePercentage: quiz.passingScorePercentage,
        questions: sanitizedQuestions,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get quiz for a specific course or lesson
// @route   GET /api/quizzes/target
// @access  Private
const getQuizByTarget = async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.query;

    const query = {};
    if (lessonId) query.lessonId = lessonId;
    else if (courseId) query.course = courseId;
    else {
      return res.status(400).json({ success: false, message: 'courseId or lessonId required' });
    }

    const quiz = await Quiz.findOne(query);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'No quiz found for this target' });
    }

    const sanitizedQuestions = quiz.questions.map((q) => ({
      id: q.id,
      type: q.type,
      question: q.question,
      options: q.options || [],
      items: q.items || [],
    }));

    res.json({
      success: true,
      quiz: {
        _id: quiz._id,
        course: quiz.course,
        lessonId: quiz.lessonId,
        title: quiz.title,
        description: quiz.description,
        timeLimitSeconds: quiz.timeLimitSeconds,
        passingScorePercentage: quiz.passingScorePercentage,
        questions: sanitizedQuestions,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit quiz answers and evaluate score
// @route   POST /api/quizzes/:id/submit
// @access  Private
const submitQuizAttempt = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { answers, timeSpentSeconds = 0 } = req.body;
    const userId = req.user._id;

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'Answers array is required' });
    }

    let score = 0;
    const answersBreakdown = [];

    quiz.questions.forEach((q) => {
      const submitted = answers.find((a) => a.questionId === q.id);
      const userAnswer = submitted ? submitted.userAnswer : null;
      let isCorrect = false;

      if (q.type === 'multiple-choice') {
        isCorrect = Number(userAnswer) === Number(q.correctAnswers);
      } else if (q.type === 'multiple-select') {
        isCorrect = setEqual(userAnswer, q.correctAnswers);
      } else if (q.type === 'drag-and-order') {
        isCorrect = arraysEqual(userAnswer, q.correctAnswers);
      }

      if (isCorrect) score += 1;

      answersBreakdown.push({
        questionId: q.id,
        question: q.question,
        type: q.type,
        options: q.options || [],
        items: q.items || [],
        userAnswer,
        correctAnswer: q.correctAnswers,
        isCorrect,
        explanation: q.explanation || 'Review the lesson lecture for full details.',
      });
    });

    const totalQuestions = quiz.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= quiz.passingScorePercentage;

    const attempt = await QuizAttempt.create({
      user: userId,
      quiz: quiz._id,
      course: quiz.course,
      score,
      totalQuestions,
      percentage,
      passed,
      timeSpentSeconds,
      answers: answersBreakdown.map((b) => ({
        questionId: b.questionId,
        userAnswer: b.userAnswer,
        isCorrect: b.isCorrect,
        correctAnswer: b.correctAnswer,
        explanation: b.explanation,
      })),
    });

    res.json({
      success: true,
      attemptId: attempt._id,
      score,
      totalQuestions,
      percentage,
      passed,
      passingScorePercentage: quiz.passingScorePercentage,
      timeSpentSeconds,
      breakdown: answersBreakdown,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get previous attempts for a quiz
// @route   GET /api/quizzes/:id/attempts
// @access  Private
const getQuizAttempts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const attempts = await QuizAttempt.find({ user: userId, quiz: id })
      .sort({ completedAt: -1 })
      .limit(10);

    res.json({
      success: true,
      attempts,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getQuizById,
  getQuizByTarget,
  submitQuizAttempt,
  getQuizAttempts,
};
