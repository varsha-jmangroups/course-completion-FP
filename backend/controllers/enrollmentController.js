const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.enrollInCourse = async (req, res) => {
  const { userId, courseId } = req.body;

  try {
    const enrollment = await prisma.enrollment.create({
      data: { userId, courseId },
    });
    res.status(201).json({ message: 'Enrolled successfully', enrollment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to enroll in course' });
  }
};

exports.getEnrollmentsForUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: parseInt(userId) },
      include: { course: true },
    });
    res.json(enrollments);
  } catch (error) {
    console.error('Error retrieving enrollments:', error);
    res.status(500).json({ error: 'Failed to retrieve enrollments' });
  }
};

exports.updateEnrollmentCompletion = async (req, res) => {
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
};

exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany();
    res.json(enrollments);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
