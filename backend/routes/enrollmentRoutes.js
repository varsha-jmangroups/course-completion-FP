const express = require('express');
const router = express.Router();
const {
  enrollInCourse,
  getEnrollmentsForUser,
  updateEnrollmentCompletion,
  getAllEnrollments,
} = require('../controllers/enrollmentController');

// Route to enroll a user in a course
router.post('/', enrollInCourse);

// Route to get all enrollments for a specific user
router.get('/user/:userId', getEnrollmentsForUser);

// Route to update course completion for an enrollment
router.put('/:courseId', updateEnrollmentCompletion);

// Route to get all enrollments
router.get('/', getAllEnrollments);

module.exports = router;
