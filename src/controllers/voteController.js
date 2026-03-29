const prisma = require('../prisma/client');

exports.castVote = async (req, res) => {
  try {
    const { nomineeId, voterEmail, voteCount } = req.body;
    const parsedNomineeId = Number(nomineeId);
    const parsedVoteCount = Math.max(1, Number(voteCount) || 1);

    const nominee = await prisma.nominee.findUnique({
      where: {
        id: parsedNomineeId,
      },
      include: {
        category: true,
      },
    });

    if (!nominee) {
      return res.status(404).json({ message: 'Nominee not found' });
    }

    const result = await prisma.$transaction(async (tx) => {
      const votesToCreate = Array.from({ length: parsedVoteCount }, () => ({
        nomineeId: parsedNomineeId,
        voterEmail: voterEmail ? voterEmail.toLowerCase() : null,
        voterIP: req.ip || null,
        userAgent: req.get('user-agent') || null,
      }));

      await tx.vote.createMany({
        data: votesToCreate,
      });

      await tx.nominee.update({
        where: {
          id: parsedNomineeId,
        },
        data: {
          voteCount: {
            increment: parsedVoteCount,
          },
        },
      });

      return {
        nomineeId: parsedNomineeId,
        voteCount: parsedVoteCount,
      };
    });

    res.status(201).json({
      message: `${result.voteCount} vote${result.voteCount > 1 ? 's' : ''} cast successfully`,
      vote: result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVotes = async (req, res) => {
  try {
    const votes = await prisma.vote.findMany({
      include: {
        nominee: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(votes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetVotes = async (req, res) => {
  try {
    await prisma.$transaction([
      prisma.vote.deleteMany(),
      prisma.nominee.updateMany({
        data: {
          voteCount: 0,
        },
      }),
    ]);

    res.json({ message: 'All votes reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};