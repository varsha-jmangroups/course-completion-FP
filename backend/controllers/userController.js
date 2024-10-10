const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: { not: 'Admin' } },
      include: {
        enrollments: {
          include: {
            course: true,
          },
        },
      },
    });

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
};

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
};
