const Course = require('../models/Course');

// @desc    Get all courses with search, filters, sorting & pagination
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res, next) => {
  try {
    const {
      search,
      category,
      level,
      sortBy = 'popularity',
      page = 1,
      limit = 9,
    } = req.query;

    const query = {};

    // 1. Search filter
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { subtitle: { $regex: search.trim(), $options: 'i' } },
        { 'instructor.name': { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // 2. Category filter
    if (category && category !== 'All' && category !== '') {
      query.category = category;
    }

    // 3. Difficulty level filter
    if (level && level !== 'All' && level !== '') {
      query.level = level;
    }

    // 4. Sorting logic
    let sort = {};
    if (sortBy === 'rating') {
      sort = { rating: -1, reviewCount: -1 };
    } else if (sortBy === 'newest') {
      sort = { createdAt: -1 };
    } else {
      // default: popularity
      sort = { enrollmentCount: -1, rating: -1 };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 9;
    const skip = (pageNum - 1) * limitNum;

    const total = await Course.countDocuments(query);
    const courses = await Course.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .select('-sections.lessons.transcript'); // Exclude large transcript from catalog list

    res.json({
      success: true,
      count: courses.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      courses,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single course by slug or ID
// @route   GET /api/courses/:slugOrId
// @access  Public
const getCourseBySlug = async (req, res, next) => {
  try {
    const { slugOrId } = req.params;

    let course;
    if (slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      course = await Course.findById(slugOrId);
    } else {
      course = await Course.findOne({ slug: slugOrId });
    }

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.json({
      success: true,
      course,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all unique categories with course count
// @route   GET /api/courses/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Course.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          name: '$_id',
          count: 1,
          _id: 0,
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      categories,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCourses,
  getCourseBySlug,
  getCategories,
};
