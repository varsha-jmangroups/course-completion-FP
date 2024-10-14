// Import necessary packages
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cors = require('cors');
const { register, login, getUsers,deleteUser } = require('./controllers/authController.js')
const { getCourses, createCourse,
  enrollCourse, getEnrollment, getEnrollments,
  deleteCourse, getUserProgress, getLearningPath,
  updateLearningPath,
  deleteLearningPath,
  updateProgress,
  getCertificate,
  getCertificates,
  updateCertificate,
  createLearningPath,
  generateCertificate } = require('./controllers/courseController.js')


// Initialize Express and Prisma Client
const app = express();

app.use(cors({
  origin: 'http://localhost:3001', // allow your frontend's URL
}));
const prisma = new PrismaClient();

// Middleware to parse JSON requests
app.use(express.json());

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// --- Routes and Logic ---

// 1. Register User (Employee/Admin)
app.post('/register', register);

// 2. Login User
app.post('/login', login);

// 3. Get All Courses
app.get('/courses', getCourses);

// 4. Create a Course (Admin Only)
app.post('/courses', createCourse);

// 5. Enroll in a Course
app.post('/enroll', enrollCourse);

// Get all enrollments for a specific user
app.get('/enrollments/:userId', getEnrollment)

// Endpoint to get enrollments from the database
app.get('/enrollments', getEnrollments);

// 10. Delete a Course (Admin Only)
app.delete('/courses/:id', deleteCourse);


// 6. Get User Progress (Enrollments)
app.get('/user/:userId/progress', getUserProgress);

// 7. Create a Learning Path (Admin Only)
app.post('/learning-paths', createLearningPath);


// 8. Get Learning Paths
app.get('/learning-paths', getLearningPath);


// 9. Update Learning Path (Admin Only)
app.put('/learning-paths/:id', updateLearningPath)

app.delete('/learning-paths/:id', deleteLearningPath);

// 9. Generate Certificate after Course Completion
app.post('/certificate', generateCertificate);

// PATCH route to update the completionPercentage for a specific course in Enrollment
app.patch('/enrollment/:courseId', updateProgress);

// Assuming you have a route for fetching all users
app.get('/users', getUsers);


// 1. Delete User (Admin Only)
app.delete('/users/:id', deleteUser);


// 2. Get all Certificates for a User
app.get('/user/:userId/certificates', getCertificates);

// 3. Update a Certificate
app.patch('/certificate/:id', updateCertificate);

// 4. Delete a Certificate
app.delete('/certificate/:id', deleteCourse);
// Route to fetch a certificate by ID
// 5. Get Certificate Details
app.get('/certificate/:id', getCertificate);


// --- Start the Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
