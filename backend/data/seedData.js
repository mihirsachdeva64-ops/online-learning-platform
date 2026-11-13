const mongoose = require('mongoose');
require('dotenv').config();

const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const LessonProgress = require('../models/LessonProgress');
const Note = require('../models/Note');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Certificate = require('../models/Certificate');

const sampleVideos = {
  video1: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  video2: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  video3: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  video4: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
};

const sampleTranscript = [
  { start: 0, end: 4.5, text: "Welcome to this masterclass! Today we will explore modern web architecture." },
  { start: 4.5, end: 9.8, text: "We'll learn how component-driven frontend architecture pairs with Express RESTful backends." },
  { start: 9.8, end: 15.2, text: "Notice how the custom HTML5 video player provides responsive controls and playback speed." },
  { start: 15.2, end: 21.0, text: "You can take timestamped notes on the right side and they will automatically sync to your database." },
  { start: 21.0, end: 27.5, text: "The transcript panel highlights each line in real-time as the audio plays." },
  { start: 27.5, end: 34.0, text: "Feel free to click any transcript line or saved note to jump the video directly to that moment." },
  { start: 34.0, end: 41.0, text: "After completing the video lessons, challenge yourself with the interactive quizzes to test your knowledge!" },
  { start: 41.0, end: 50.0, text: "Once you finish all lessons in the course, your official completion certificate will be generated automatically." },
];

const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to database...');
    await connectDB();

    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    await LessonProgress.deleteMany({});
    await Note.deleteMany({});
    await Quiz.deleteMany({});
    await QuizAttempt.deleteMany({});
    await Certificate.deleteMany({});

    console.log('[Seed] Creating demo user...');
    const demoUser = await User.create({
      name: 'Alex Morgan',
      email: 'demo@edulearn.com',
      password: 'password123',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      bio: 'Full-stack software engineering intern passionate about React, Node, and UI/UX engineering.',
      streakDays: 4,
      lastActiveDate: new Date(),
      totalLearningMinutes: 280,
    });

    console.log('[Seed] Creating courses...');
    const course1Id = new mongoose.Types.ObjectId();
    const course2Id = new mongoose.Types.ObjectId();
    const course3Id = new mongoose.Types.ObjectId();
    const course4Id = new mongoose.Types.ObjectId();

    // Lessons for Course 1
    const c1Lesson1Id = new mongoose.Types.ObjectId();
    const c1Lesson2Id = new mongoose.Types.ObjectId();
    const c1Lesson3Id = new mongoose.Types.ObjectId();
    const c1Lesson4Id = new mongoose.Types.ObjectId();

    // Lessons for Course 2
    const c2Lesson1Id = new mongoose.Types.ObjectId();
    const c2Lesson2Id = new mongoose.Types.ObjectId();

    // Lessons for Course 3
    const c3Lesson1Id = new mongoose.Types.ObjectId();
    const c3Lesson2Id = new mongoose.Types.ObjectId();

    // Lessons for Course 4
    const c4Lesson1Id = new mongoose.Types.ObjectId();
    const c4Lesson2Id = new mongoose.Types.ObjectId();

    const course1 = new Course({
      _id: course1Id,
      title: 'Full-Stack React & Node.js Mastery',
      slug: 'fullstack-react-nodejs-mastery',
      subtitle: 'Build production-ready web applications from scratch with modern React, Express and MongoDB.',
      description: 'Master the art of building scalable, secure, and modern full-stack web applications. In this comprehensive course, you will learn modern React patterns, custom video playback, state management with Context and Hooks, Node.js REST API creation, MongoDB integration, and deployment workflows.',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
      category: 'Web Development',
      level: 'Intermediate',
      instructor: {
        name: 'Sarah Jenkins',
        title: 'Staff Software Engineer at Meta',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        bio: 'Sarah has over 10 years of experience architecting large-scale React and cloud applications. She loves mentoring engineers.',
        rating: 4.9,
        studentsCount: 18400,
        coursesCount: 5,
      },
      duration: '4h 30m',
      totalDurationSeconds: 16200,
      rating: 4.9,
      reviewCount: 342,
      enrollmentCount: 2480,
      highlights: [
        'Build custom video players with pure HTML5 Video API',
        'Implement timestamped note-taking and transcript sync',
        'Develop secure JWT authentication & role-based middleware',
        'Create interactive quiz engines with multiple question formats',
        'Generate and print verifiable completion certificates',
      ],
      prerequisites: [
        'Basic familiarity with JavaScript (ES6+)',
        'Basic understanding of HTML and CSS',
      ],
      sections: [
        {
          title: 'Module 1: Architecture & Custom Player Foundations',
          order: 1,
          lessons: [
            {
              _id: c1Lesson1Id,
              title: 'Introduction to Full-Stack Architecture',
              description: 'Understanding client-server separation, REST standards, and state synchronization.',
              duration: '9:56',
              durationSeconds: 596,
              videoUrl: sampleVideos.video1,
              vttUrl: '/sample-captions.vtt',
              isPreview: true,
              order: 1,
              hasQuiz: false,
              transcript: sampleTranscript,
            },
            {
              _id: c1Lesson2Id,
              title: 'Mastering the HTML5 Video API Controls',
              description: 'Building custom play/pause, seekbars, volume toggles, and playback rates without third-party embeds.',
              duration: '10:53',
              durationSeconds: 653,
              videoUrl: sampleVideos.video2,
              vttUrl: '/sample-captions.vtt',
              isPreview: false,
              order: 2,
              hasQuiz: true,
              transcript: sampleTranscript,
            },
          ],
        },
        {
          title: 'Module 2: Real-time Notes & Transcripts',
          order: 2,
          lessons: [
            {
              _id: c1Lesson3Id,
              title: 'Synchronizing Cues with WebVTT and Timestamps',
              description: 'Connecting transcript highlighting with video currentTime updates and auto-scrolling.',
              duration: '0:15',
              durationSeconds: 15,
              videoUrl: sampleVideos.video3,
              vttUrl: '/sample-captions.vtt',
              isPreview: false,
              order: 3,
              hasQuiz: false,
              transcript: sampleTranscript,
            },
            {
              _id: c1Lesson4Id,
              title: 'Persisting Notes & Jump-to-Timestamp Mechanics',
              description: 'Writing timestamped notes, in-place editing, and seeking directly to specified seconds.',
              duration: '0:15',
              durationSeconds: 15,
              videoUrl: sampleVideos.video4,
              vttUrl: '/sample-captions.vtt',
              isPreview: false,
              order: 4,
              hasQuiz: true,
              transcript: sampleTranscript,
            },
          ],
        },
      ],
    });

    const course2 = new Course({
      _id: course2Id,
      title: 'Deep Learning & Generative AI Foundations',
      slug: 'deep-learning-generative-ai',
      subtitle: 'Understand transformers, neural network mechanics, and hands-on LLM prompt engineering.',
      description: 'Explore the mathematical and practical foundations of deep learning, attention mechanisms, embeddings, and multimodal generative artificial intelligence.',
      thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
      category: 'Data Science & AI',
      level: 'Advanced',
      instructor: {
        name: 'Dr. Aris Thorne',
        title: 'Chief AI Scientist & Ex-Stanford',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        bio: 'Dr. Thorne has published over 25 papers in machine learning and specializes in neural architectures.',
        rating: 4.95,
        studentsCount: 22100,
        coursesCount: 4,
      },
      duration: '6h 15m',
      totalDurationSeconds: 22500,
      rating: 4.9,
      reviewCount: 410,
      enrollmentCount: 3120,
      highlights: [
        'Understand Backpropagation and Gradient Descent mathematically',
        'Implement self-attention and transformer encoders in PyTorch',
        'Fine-tune open-weights models and optimize inference',
      ],
      prerequisites: ['Python proficiency', 'Basic linear algebra and calculus'],
      sections: [
        {
          title: 'Module 1: Neural Networks from Scratch',
          order: 1,
          lessons: [
            {
              _id: c2Lesson1Id,
              title: 'Perceptrons, Activations and Loss Surfaces',
              description: 'Visualizing forward and backward propagation through computation graphs.',
              duration: '9:56',
              durationSeconds: 596,
              videoUrl: sampleVideos.video1,
              vttUrl: '/sample-captions.vtt',
              isPreview: true,
              order: 1,
              hasQuiz: true,
              transcript: sampleTranscript,
            },
            {
              _id: c2Lesson2Id,
              title: 'Transformer Architecture and Attention Heads',
              description: 'Step-by-step breakdown of query, key, value projections and softmax scaling.',
              duration: '10:53',
              durationSeconds: 653,
              videoUrl: sampleVideos.video2,
              vttUrl: '/sample-captions.vtt',
              isPreview: false,
              order: 2,
              hasQuiz: false,
              transcript: sampleTranscript,
            },
          ],
        },
      ],
    });

    const course3 = new Course({
      _id: course3Id,
      title: 'Design Systems & Modern UI/UX Masterclass',
      slug: 'design-systems-ui-ux-masterclass',
      subtitle: 'Craft scalable design tokens, accessible components, and memorable user experiences.',
      description: 'Learn the principles of human-computer interaction, visual hierarchy, micro-interactions, responsive grids, and design tokens that bridge Figma and code.',
      thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80',
      category: 'UI/UX Design',
      level: 'Beginner',
      instructor: {
        name: 'Elena Rostova',
        title: 'Lead Product Designer & UX Strategist',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        bio: 'Elena has led design systems across fintech and enterprise apps, focusing on accessible, delightful experiences.',
        rating: 4.88,
        studentsCount: 15300,
        coursesCount: 3,
      },
      duration: '3h 45m',
      totalDurationSeconds: 13500,
      rating: 4.8,
      reviewCount: 198,
      enrollmentCount: 1840,
      highlights: [
        'Create modular token systems for typography, spacing and elevation',
        'Design accessible color palettes meeting WCAG AAA contrast',
        'Prototype interactive flows and user research testing',
      ],
      prerequisites: ['No prior design experience required'],
      sections: [
        {
          title: 'Module 1: Design Principles & Typography Hierarchy',
          order: 1,
          lessons: [
            {
              _id: c3Lesson1Id,
              title: 'Foundations of Visual Hierarchy & Contrast',
              description: 'How spacing, font weights, and subtle borders guide learner focus.',
              duration: '9:56',
              durationSeconds: 596,
              videoUrl: sampleVideos.video1,
              vttUrl: '/sample-captions.vtt',
              isPreview: true,
              order: 1,
              hasQuiz: true,
              transcript: sampleTranscript,
            },
            {
              _id: c3Lesson2Id,
              title: 'Building Resilient Responsive Layouts',
              description: 'Grid systems, flexbox alignments, and touch-target ergonomics.',
              duration: '10:53',
              durationSeconds: 653,
              videoUrl: sampleVideos.video2,
              vttUrl: '/sample-captions.vtt',
              isPreview: false,
              order: 2,
              hasQuiz: false,
              transcript: sampleTranscript,
            },
          ],
        },
      ],
    });

    const course4 = new Course({
      _id: course4Id,
      title: 'Cloud Architecture & Microservices with Docker',
      slug: 'cloud-architecture-microservices-docker',
      subtitle: 'Architect resilient distributed systems, containerize microservices, and configure CI/CD.',
      description: 'Learn modern DevOps and cloud infrastructure practices. Master Docker containers, multi-stage builds, reverse proxies, and cloud scaling strategies.',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
      category: 'Cloud Computing',
      level: 'Intermediate',
      instructor: {
        name: 'David Chen',
        title: 'Principal Cloud Architect',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        bio: 'David is a cloud architect specializing in high-throughput distributed microservices and container orchestration.',
        rating: 4.92,
        studentsCount: 14200,
        coursesCount: 4,
      },
      duration: '5h 10m',
      totalDurationSeconds: 18600,
      rating: 4.85,
      reviewCount: 220,
      enrollmentCount: 1690,
      highlights: [
        'Containerize multi-tier applications with Docker and Compose',
        'Configure reverse proxies, SSL termination, and rate limits',
        'Design resilient event-driven architectures with queues',
      ],
      prerequisites: ['Basic Linux terminal usage and networking fundamentals'],
      sections: [
        {
          title: 'Module 1: Container Foundations',
          order: 1,
          lessons: [
            {
              _id: c4Lesson1Id,
              title: 'Linux Namespaces, Cgroups, and Container Images',
              description: 'Demystifying how container runtimes isolate processes and manage resource bounds.',
              duration: '9:56',
              durationSeconds: 596,
              videoUrl: sampleVideos.video1,
              vttUrl: '/sample-captions.vtt',
              isPreview: true,
              order: 1,
              hasQuiz: true,
              transcript: sampleTranscript,
            },
            {
              _id: c4Lesson2Id,
              title: 'Multi-stage Docker Builds for Lean Images',
              description: 'Optimizing image size and production security posture using build stages.',
              duration: '10:53',
              durationSeconds: 653,
              videoUrl: sampleVideos.video2,
              vttUrl: '/sample-captions.vtt',
              isPreview: false,
              order: 2,
              hasQuiz: false,
              transcript: sampleTranscript,
            },
          ],
        },
      ],
    });

    await course1.save();
    await course2.save();
    await course3.save();
    await course4.save();

    console.log('[Seed] Creating interactive quizzes...');
    // Create rich quiz for Course 1 containing all 3 question types!
    const quiz1 = await Quiz.create({
      course: course1Id,
      lessonId: c1Lesson2Id,
      title: 'HTML5 Video API & Web Architecture Assessment',
      description: 'Demonstrate your mastery of HTML5 video controls, cue synchronization, and state management.',
      timeLimitSeconds: 240, // 4 minutes
      passingScorePercentage: 70,
      questions: [
        {
          id: 'q1',
          type: 'multiple-choice',
          question: 'Which HTML5 Video API property provides the current playback position in seconds?',
          options: [
            'video.playbackTime',
            'video.currentTime',
            'video.currentPosition',
            'video.timestamp',
          ],
          correctAnswers: 1, // index 1 -> video.currentTime
          explanation: 'The standard HTML5 MediaElement specification defines `currentTime` (in seconds as a floating-point number) to get or set playback position.',
        },
        {
          id: 'q2',
          type: 'multiple-select',
          question: 'Which of the following are valid HTML5 MediaElement playback rate properties and features? (Select all that apply)',
          options: [
            'playbackRate accepts floating-point speeds like 0.5, 1.25, and 2.0',
            'HTML5 video automatically preserves audio pitch by default via preservesPitch',
            'Videos cannot play backwards using negative playbackRate values in browsers',
            'playbackRate must strictly be a whole integer between 1 and 5',
          ],
          correctAnswers: [0, 1, 2], // 0, 1, 2 are correct
          explanation: 'Modern browsers support fractional playbackRate (e.g. 0.5x, 1.5x), enable audio pitch correction (`preservesPitch`), and standard implementations disallow negative playbackRate.',
        },
        {
          id: 'q3',
          type: 'drag-and-order',
          question: 'Arrange the sequence of steps to handle timestamped note creation in the correct chronological order:',
          items: [
            'Read the current video.currentTime in seconds',
            'Format the raw seconds into MM:SS display format',
            'Submit note payload to backend API with JWT Authorization',
            'Persist note to MongoDB collection and update local UI notes list',
          ],
          correctAnswers: [0, 1, 2, 3], // The correct ordered indices
          explanation: 'The client first extracts the current timestamp from the video player, formats it for human readability, sends it over the REST API with the user token, and stores it in the database.',
        },
      ],
    });

    // Update course1 lesson2 with quizId
    await Course.updateOne(
      { _id: course1Id, 'sections.lessons._id': c1Lesson2Id },
      { $set: { 'sections.$[].lessons.$[less].quizId': quiz1._id } },
      { arrayFilters: [{ 'less._id': c1Lesson2Id }] }
    );

    console.log('[Seed] Creating demo enrollment & progress...');
    // Demo user is enrolled in Course 1 with 75% progress (completed 3 of 4 lessons)
    await Enrollment.create({
      user: demoUser._id,
      course: course1Id,
      completedLessons: [c1Lesson1Id, c1Lesson2Id, c1Lesson3Id],
      currentLessonId: c1Lesson4Id,
      progressPercentage: 75,
      isCompleted: false,
    });

    // Demo user completed Course 3 100% and has a certificate!
    await Enrollment.create({
      user: demoUser._id,
      course: course3Id,
      completedLessons: [c3Lesson1Id, c3Lesson2Id],
      currentLessonId: c3Lesson2Id,
      progressPercentage: 100,
      isCompleted: true,
      completedAt: new Date(Date.now() - 86400000 * 2),
    });

    // Seed Certificate for Course 3
    const certificate = await Certificate.create({
      certificateId: 'EDUPULSE-2026-UX9841',
      user: demoUser._id,
      course: course3Id,
      recipientName: 'Alex Morgan',
      courseTitle: 'Design Systems & Modern UI/UX Masterclass',
      instructorName: 'Elena Rostova',
      issueDate: new Date(Date.now() - 86400000 * 2),
      grade: 'Passed with Distinction',
      finalScorePercentage: 98,
    });

    // Seed Sample Notes for Course 1
    await Note.create([
      {
        user: demoUser._id,
        course: course1Id,
        lessonId: c1Lesson1Id,
        timestamp: 12,
        formattedTimestamp: '00:12',
        content: 'Key takeaway: Separation of UI state from persistent backend state prevents unnecessary rerenders.',
      },
      {
        user: demoUser._id,
        course: course1Id,
        lessonId: c1Lesson1Id,
        timestamp: 25,
        formattedTimestamp: '00:25',
        content: 'Review WebVTT cues structure: start time, end time, and cue payload text.',
      },
    ]);

    // Seed LessonProgress
    await LessonProgress.create({
      user: demoUser._id,
      course: course1Id,
      lessonId: c1Lesson4Id,
      lastWatchedPosition: 8,
      duration: 15,
      isCompleted: false,
    });

    console.log('[Seed] Database seeded successfully!');
    console.log('----------------------------------------------------');
    console.log(`Demo Student Login: demo@edulearn.com / password123`);
    console.log(`Certificate ID: ${certificate.certificateId}`);
    console.log('----------------------------------------------------');

    if (require.main === module) {
      await disconnectDB();
      process.exit(0);
    }
  } catch (err) {
    console.error('[Seed] Error seeding database:', err);
    if (require.main === module) {
      process.exit(1);
    }
    throw err;
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
