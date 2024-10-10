const express = require('express');
const { getAllCourses, createCourse, deleteCourse } = require('../controllers/courseController');

const router = express.Router();

router.get('/', getAllCourses);
router.post('/', createCourse); // Admin-only route, you can add middleware to check admin role
router.delete('/:id', deleteCourse);

module.exports = router;
