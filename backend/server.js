// Import necessary packages
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cors = require('cors');


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
app.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// 2. Login User
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    res.json({
      id: user.id,
      name: user.name,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
});

// 3. Get All Courses
app.get('/courses', async (req, res) => {
  try {
    const courses = await prisma.course.findMany();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve courses' });
  }
});

// 4. Create a Course (Admin Only)
app.post('/courses', async (req, res) => {
  const { title, description, duration, difficulty } = req.body;
  console.log(req.body)

  try {
    const newCourse = await prisma.course.create({
      data: { title, description, duration: Number(duration), difficulty },
    });
    res.status(201).json(newCourse);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// 5. Enroll in a Course
app.post('/enroll', async (req, res) => {
  const { userId, courseId } = req.body;

  try {
    const enrollment = await prisma.enrollment.create({
      data: { userId, courseId },
    });
    res.status(201).json({ message: 'Enrolled successfully', enrollment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to enroll in course' });
  }
});

// 6. Get User Progress (Enrollments)
app.get('/user/:userId/progress', async (req, res) => {
  const { userId } = req.params;

  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: parseInt(userId) },
      include: { course: true },
    });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve progress' });
  }
});

// 7. Create a Learning Path (Admin Only)
app.post('/learning-paths', async (req, res) => {
  const { title, description, courseIds } = req.body;

  try {
    const newPath = await prisma.learningPath.create({
      data: { title, description, course_ids: courseIds },
    });
    res.status(201).json(newPath);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create learning path' });
  }
});

// 8. Get Learning Paths
app.get('/learning-paths', async (req, res) => {
  try {
    const paths = await prisma.learningPath.findMany();
    res.json(paths);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve learning paths' });
  }
});

// 9. Generate Certificate after Course Completion
app.post('/certificate', async (req, res) => {
  const { userId, courseId, certificateUrl } = req.body;

  try {
    const newCertificate = await prisma.certificate.create({
      data: { userId, courseId, certificateUrl },
    });
    res.status(201).json({ message: 'Certificate generated', newCertificate });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate certificate' });
  }
});

// PATCH route to update the completionPercentage for a specific course in Enrollment
app.patch('/enrollment/:courseId', async (req, res) => {
  const { courseId } = req.params;
  const { completionPercentage } = req.body;
  
  try {
    const updatedEnrollment = await prisma.enrollment.updateMany({
      where: { courseId: parseInt(courseId) },
      data: { completionPercentage },
    });

    if (updatedEnrollment.count === 0) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    res.json(updatedEnrollment);
  } catch (error) {
    console.error('Error updating completion:', error);
    res.status(500).json({ error: 'Failed to update completion' });
  }
});

// Assuming you have a route for fetching all users
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: { not: 'Admin' } } // Fetch all except admin
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

// 1. Delete User (Admin Only)
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'User deleted successfully', deletedUser });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Existing endpoints...


// --- Start the Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
