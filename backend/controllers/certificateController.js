const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.generateCertificate = async (req, res) => {
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
};

exports.getCertificatesForUser = async (req, res) => {
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
};

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
};

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
};

exports.getCertificateDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const certificate = await prisma.certificate.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: { select: { name: true } },
        course: { select: { title: true } },
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
};
