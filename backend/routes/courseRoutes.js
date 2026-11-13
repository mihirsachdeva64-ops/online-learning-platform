const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseBySlug,
  getCategories,
} = require('../controllers/courseController');

router.get('/categories', getCategories);
router.get('/', getCourses);
router.get('/:slugOrId', getCourseBySlug);

module.exports = router;
