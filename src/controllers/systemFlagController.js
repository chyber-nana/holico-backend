const prisma = require("../prisma/client");

const getOrCreateSystemFlag = async () => {
  let flag = await prisma.systemFlag.findFirst({
    orderBy: { id: "asc" },
  });

  if (!flag) {
    flag = await prisma.systemFlag.create({
      data: {
        votingEndsAt: null,
        isVotingClosed: false,
      },
    });
  }

  return flag;
};

exports.getPortalStatus = async (_req, res) => {
  try {
    const flag = await getOrCreateSystemFlag();

    const now = new Date();
    const hasExpired =
      flag.votingEndsAt && new Date(flag.votingEndsAt).getTime() <= now.getTime();

    const portalClosed = flag.isVotingClosed || hasExpired;

    res.json({
      votingEndsAt: flag.votingEndsAt,
      isVotingClosed: flag.isVotingClosed,
      portalClosed,
      now,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePortalStatus = async (req, res) => {
  try {
    const { votingEndsAt, isVotingClosed } = req.body;

    const existing = await getOrCreateSystemFlag();

    const updated = await prisma.systemFlag.update({
      where: { id: existing.id },
      data: {
        votingEndsAt: votingEndsAt ? new Date(votingEndsAt) : null,
        isVotingClosed:
          typeof isVotingClosed === "boolean"
            ? isVotingClosed
            : existing.isVotingClosed,
      },
    });

    res.json({
      message: "Portal settings updated successfully",
      settings: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.closePortalNow = async (_req, res) => {
  try {
    const existing = await getOrCreateSystemFlag();

    const updated = await prisma.systemFlag.update({
      where: { id: existing.id },
      data: {
        isVotingClosed: true,
      },
    });

    res.json({
      message: "Voting portal closed",
      settings: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.reopenPortal = async (_req, res) => {
  try {
    const existing = await getOrCreateSystemFlag();

    const updated = await prisma.systemFlag.update({
      where: { id: existing.id },
      data: {
        isVotingClosed: false,
      },
    });

    res.json({
      message: "Voting portal reopened",
      settings: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};