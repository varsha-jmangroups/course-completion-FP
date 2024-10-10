const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
    console.error("Error creating learning path:", error);
    res.status(500).json({ error: 'Failed to create learning path' });
  }
};

exports.getLearningPaths = async (req, res) => {
  try {
    const paths = await prisma.learningPath.findMany({
      include: {
        courses: true,
      },
    });
    res.json(paths);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve learning paths' });
  }
};

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
          set: courseIds.map(id => ({ id })),
        },
      },
    });
    res.json(updatedPath);
  } catch (error) {
    console.error("Error updating learning path:", error);
    res.status(500).json({ error: 'Failed to update learning path' });
  }
};

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
};
