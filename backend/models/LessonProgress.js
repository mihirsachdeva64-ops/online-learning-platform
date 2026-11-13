const mongoose = require('mongoose');

const lessonProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    lastWatchedPosition: {
      type: Number,
      default: 0, // in seconds
    },
    duration: {
      type: Number,
      default: 0, // in seconds
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

lessonProgressSchema.index({ user: 1, lessonId: 1 }, { unique: true });
lessonProgressSchema.index({ user: 1, course: 1 });

module.exports = mongoose.model('LessonProgress', lessonProgressSchema);
