const mongoose = require('mongoose');

const transcriptCueSchema = new mongoose.Schema(
  {
    start: { type: Number, required: true }, // Start time in seconds
    end: { type: Number, required: true },   // End time in seconds
    text: { type: String, required: true },  // Spoken sentence
  },
  { _id: false }
);

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  duration: {
    type: String,
    required: true,
    default: '5:00',
  },
  durationSeconds: {
    type: Number,
    required: true,
    default: 300,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  vttUrl: {
    type: String,
    default: '',
  },
  isPreview: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 1,
  },
  hasQuiz: {
    type: Boolean,
    default: false,
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    default: null,
  },
  transcript: [transcriptCueSchema],
});

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  order: {
    type: Number,
    default: 1,
  },
  lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide course title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    subtitle: {
      type: String,
      default: '',
      maxlength: [200, 'Subtitle cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide course description'],
    },
    thumbnail: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Web Development',
        'Data Science & AI',
        'UI/UX Design',
        'Cloud Computing',
        'Mobile Development',
      ],
    },
    level: {
      type: String,
      required: true,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    instructor: {
      name: { type: String, required: true },
      title: { type: String, default: 'Senior Instructor' },
      avatar: { type: String, required: true },
      bio: { type: String, default: '' },
      rating: { type: Number, default: 4.9 },
      studentsCount: { type: Number, default: 12500 },
      coursesCount: { type: Number, default: 6 },
    },
    duration: {
      type: String,
      required: true,
      default: '4h 30m',
    },
    totalDurationSeconds: {
      type: Number,
      default: 16200,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 85,
    },
    enrollmentCount: {
      type: Number,
      default: 620,
    },
    highlights: [{ type: String }],
    prerequisites: [{ type: String }],
    sections: [sectionSchema],
  },
  {
    timestamps: true,
  }
);

// Search index for title and description
courseSchema.index({ title: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Course', courseSchema);
