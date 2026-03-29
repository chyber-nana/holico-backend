const prisma = require('../prisma/client');

exports.getDashboardSummary = async (req, res) => {
  try {
    const totalCategories = await prisma.category.count();
    const totalNominees = await prisma.nominee.count();
    const totalVotes = await prisma.vote.count();
    const totalAdmins = await prisma.admin.count();

    res.json({
      totalCategories,
      totalNominees,
      totalVotes,
      totalAdmins,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCategoryLeaders = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        nominees: {
          orderBy: {
            voteCount: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    const leaders = categories.map((category) => ({
      categoryId: category.id,
      category: category.name,
      leader: category.nominees[0] || null,
    }));

    res.json(leaders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFullResults = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        nominees: {
          orderBy: {
            voteCount: 'desc',
          },
          include: {
            _count: {
              select: {
                votes: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};