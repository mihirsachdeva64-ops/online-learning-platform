const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['multiple-choice', 'multiple-select', 'drag-and-order'],
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: [{ type: String }], // Used for multiple-choice and multiple-select
    items: [{ type: String }],   // Used for drag-and-order (the list to sequence)
    correctAnswers: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      // For multiple-choice: number (index of option)
      // For multiple-select: array of numbers (indices of options)
      // For drag-and-order: array of numbers or strings representing correct sequence
    },
    explanation: {
      type: String,
      required: true,
      default: '',
    },
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: 'Test your understanding of the concepts covered in this module.',
    },
    timeLimitSeconds: {
      type: Number,
      required: true,
      default: 300, // 5 minutes countdown
    },
    passingScorePercentage: {
      type: Number,
      default: 70,
    },
    questions: [questionSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Quiz', quizSchema);
