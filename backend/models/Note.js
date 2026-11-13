const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
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
    timestamp: {
      type: Number,
      required: [true, 'Timestamp in seconds is required'],
      min: 0,
    },
    formattedTimestamp: {
      type: String,
      required: true,
      default: '00:00',
    },
    content: {
      type: String,
      required: [true, 'Note content cannot be empty'],
      trim: true,
      maxlength: [1000, 'Note content cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

noteSchema.index({ user: 1, lessonId: 1, timestamp: 1 });

module.exports = mongoose.model('Note', noteSchema);
