const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

exports.register = async (req, res) => {
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
}


exports.login = async (req, res) => {
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
  }

exports.getUsers = async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        where: { role: { not: 'Admin' } }, // Fetch all except admin
        include: {
          enrollments: {
            include: {
              course: true, // Include course details for each enrollment
            },
          },
        },
      });
  
      // Transform the data to show users with their enrolled courses
      const transformedUsers = users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        courses: user.enrollments.map(enrollment => ({
          id: enrollment.course.id,
          title: enrollment.course.title,
          description: enrollment.course.description,
          duration: enrollment.course.duration,
          difficulty: enrollment.course.difficulty,
          completionPercentage: enrollment.completionPercentage,
          enrollmentDate: enrollment.enrollmentDate,
          completionDate: enrollment.completionDate,
        })),
      }));
  
      res.json(transformedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to retrieve users' });
    }
  }

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedUser = await prisma.user.delete({
        where: { id: parseInt(id) },
      });
  
      res.json({ message: 'User deleted successfully', deletedUser });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete user' });
    }
  }