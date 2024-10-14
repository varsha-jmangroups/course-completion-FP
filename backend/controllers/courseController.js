const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

exports.getCourses = async (req, res) => {
    try {
        const courses = await prisma.course.findMany();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve courses' });
    }
}

exports.createCourse = async (req, res) => {
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
}

exports.enrollCourse = async (req, res) => {
    const { userId, courseId } = req.body;

    try {
        const enrollment = await prisma.enrollment.create({
            data: { userId, courseId },
        });
        res.status(201).json({ message: 'Enrolled successfully', enrollment });
    } catch (error) {
        res.status(500).json({ error: 'Failed to enroll in course' });
    }
}

exports.getEnrollment = async (req, res) => {
    const { userId } = req.params;

    try {
        const enrollments = await prisma.enrollment.findMany({
            where: { userId: parseInt(userId) },
            include: { course: true }, // Include course details
        });
        res.json(enrollments);
    } catch (error) {
        console.error('Error retrieving enrollments:', error);
        res.status(500).json({ error: 'Failed to retrieve enrollments' });
    }
}


exports.getEnrollments = async (req, res) => {
    try {
        const enrollments = await prisma.enrollment.findMany(); // Replace with your actual model
        res.json(enrollments);
    } catch (error) {
        console.error('Error fetching enrollments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.deleteCourse = async (req, res) => {
    const { id } = req.params;

    try {
        // Delete the course by id
        const deletedCourse = await prisma.course.delete({
            where: { id: parseInt(id) },
        });

        res.json({ message: 'Course deleted successfully', deletedCourse });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ error: 'Failed to delete course' });
    }
}

exports.getUserProgress = async (req, res) => {
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
}

exports.createLearningPath = async (req, res) => {
    const { title, description, courseIds } = req.body;

    try {
        const newPath = await prisma.learningPath.create({
            data: {
                title,
                description,
                courses: {
                    connect: courseIds.map(id => ({ id: Number(id) })),
                },
            },
        });
        res.status(201).json(newPath);
    } catch (error) {
        console.error("Error creating learning path:", error); // Log the error
        res.status(500).json({ error: 'Failed to create learning path' });
    }
}

exports.getLearningPath = async (req, res) => {
    try {
        const paths = await prisma.learningPath.findMany({
            include: {
                courses: true, // This includes the related courses for each learning path
            },
        });
        res.json(paths);
    } catch (error) {
        console.error(error); // Log the error for better debugging
        res.status(500).json({ error: 'Failed to retrieve learning paths' });
    }
}

exports.updateLearningPath = async (req, res) => {
    const { id } = req.params;
    const { title, description, courseIds } = req.body;

    try {
        const updatedPath = await prisma.learningPath.update({
            where: { id: parseInt(id) },
            data: {
                title,
                description,
                courses: {
                    set: courseIds.map(id => ({ id })), // Replace existing courses
                },
            },
        });

        res.json(updatedPath);
    } catch (error) {
        console.error("Error updating learning path:", error);
        res.status(500).json({ error: 'Failed to update learning path' });
    }
}

exports.deleteLearningPath = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedPath = await prisma.learningPath.delete({
            where: { id: parseInt(id) },
        });

        res.json({ message: 'Learning path deleted successfully', deletedPath });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete learning path' });
    }
}

exports.generateCertificate = async (req, res) => {
    const { userId, courseId, certificateUrl } = req.body;

    try {
        const newCertificate = await prisma.certificate.create({
            data: { userId, courseId, certificateUrl },
        });
        res.status(201).json({ message: 'Certificate generated', newCertificate });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate certificate' });
    }
}
async (req, res) => {
    const { userId, courseId, certificateUrl } = req.body;

    try {
        const newCertificate = await prisma.certificate.create({
            data: { userId, courseId, certificateUrl },
        });
        res.status(201).json({ message: 'Certificate generated', newCertificate });
    } catch (error) {
        console.error('Error generating certificate:', error);
        res.status(500).json({ error: 'Failed to generate certificate' });
    }
}

exports.updateProgress = async (req, res) => {
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
}

exports.getCertificate = async (req, res) => {
    const { id } = req.params;

    try {
        const certificate = await prisma.certificate.findUnique({
            where: { id: parseInt(id) },
            include: {
                user: { select: { name: true } }, // Include user name
                course: { select: { title: true } }, // Include course title
            },
        });

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        res.json({
            id: certificate.id,
            employeeName: certificate.user.name,
            courseTitle: certificate.course.title,
            certificateUrl: certificate.certificateUrl,
        });
    } catch (error) {
        console.error('Error fetching certificate:', error);
        res.status(500).json({ error: 'Failed to retrieve certificate' });
    }
}

exports.getCertifiate = async (req, res) => {
    const { userId } = req.params;

    try {
        const certificates = await prisma.certificate.findMany({
            where: { userId: parseInt(userId) },
        });
        res.json(certificates);
    } catch (error) {
        console.error('Error fetching certificates:', error);
        res.status(500).json({ error: 'Failed to retrieve certificates' });
    }
}

exports.updateCertificate = async (req, res) => {
    const { id } = req.params;
    const { certificateUrl } = req.body;

    try {
        const updatedCertificate = await prisma.certificate.update({
            where: { id: parseInt(id) },
            data: { certificateUrl },
        });
        res.json(updatedCertificate);
    } catch (error) {
        console.error('Error updating certificate:', error);
        res.status(500).json({ error: 'Failed to update certificate' });
    }
}

exports.deleteCertificate = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCertificate = await prisma.certificate.delete({
            where: { id: parseInt(id) },
        });
        res.json({ message: 'Certificate deleted successfully', deletedCertificate });
    } catch (error) {
        console.error('Error deleting certificate:', error);
        res.status(500).json({ error: 'Failed to delete certificate' });
    }
}

exports.getCertificates = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const certificates = await prisma.certificate.findMany({
        where: { userId: parseInt(userId) },
      });
      res.json(certificates);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      res.status(500).json({ error: 'Failed to retrieve certificates' });
    }
  }