const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Online Learning Platform API is healthy and running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Mount API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/certificates', require('./routes/certificateRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Root welcome endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Online Learning Platform API',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      courses: '/api/courses',
      progress: '/api/progress',
      notes: '/api/notes',
      quizzes: '/api/quizzes',
      certificates: '/api/certificates',
      dashboard: '/api/dashboard',
    }
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const Course = require('./models/Course');
const seedDatabase = require('./data/seedData');

const startServer = async () => {
  await connectDB();

  // Auto-seed if database is empty (e.g. fresh dev run)
  try {
    const courseCount = await Course.countDocuments();
    if (courseCount === 0) {
      console.log('[Server] Database is empty. Seeding realistic sample courses and demo user...');
      await seedDatabase();
    }
  } catch (seedErr) {
    console.warn('[Server] Auto-seed check warning:', seedErr.message);
  }

  app.listen(PORT, () => {
    console.log(`[Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

if (require.main === module) {
  startServer();
}

module.exports = app;
