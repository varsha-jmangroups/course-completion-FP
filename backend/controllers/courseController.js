const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve courses' });
  }
};

exports.createCourse = async (req, res) => {
  const { title, description, duration, difficulty } = req.body;

  try {
    const newCourse = await prisma.course.create({
      data: { title, description, duration: Number(duration), difficulty },
    });
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create course' });
  }
};

exports.deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCourse = await prisma.course.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Course deleted successfully', deletedCourse });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete course' });
  }
};
