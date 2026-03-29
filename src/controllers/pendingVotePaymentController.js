const prisma = require("../prisma/client");

const PRICE_PER_VOTE = 1;
const MOMO_NUMBER = process.env.MOMO_NUMBER || "0550000000";
const MOMO_NAME = process.env.MOMO_NAME || "HOLICO SRC";

const generateCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "HVC-";
  for (let i = 0; i < 8; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
};

const generateReference = () => {
  return `HCV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
};

exports.createPendingVotePayment = async (req, res) => {
  try {
    const { nomineeId, voteCount, payerName, payerPhone } = req.body;

    const parsedNomineeId = Number(nomineeId);
    const parsedVoteCount = Math.max(1, Number(voteCount) || 1);

    const nominee = await prisma.nominee.findUnique({
      where: { id: parsedNomineeId },
      include: { category: true },
    });

    if (!nominee) {
      return res.status(404).json({ message: "Nominee not found" });
    }

    const amount = parsedVoteCount * PRICE_PER_VOTE;
    const code = generateCode();
    const reference = generateReference();

    const payment = await prisma.voteRequest.create({
      data: {
        code,
        reference,
        payerName: payerName || null,
        payerPhone: payerPhone || null,
        paymentNumber: MOMO_NUMBER,
        amount,
        voteCount: parsedVoteCount,
        nomineeId: nominee.id,
        categoryId: nominee.categoryId,
      },
      include: {
        nominee: true,
        category: true,
      },
    });

    return res.status(201).json({
      message: "Vote payment request created",
      payment,
      paymentMeta: {
        momoNumber: MOMO_NUMBER,
        momoName: MOMO_NAME,
        pricePerVote: PRICE_PER_VOTE,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getPendingVotePayments = async (_req, res) => {
  try {
    const payments = await prisma.voteRequest.findMany({
      include: {
        nominee: true,
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(payments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getPendingVotePaymentByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const payment = await prisma.voteRequest.findUnique({
      where: { code },
      include: {
        nominee: true,
        category: true,
      },
    });

    if (!payment) {
      return res.status(404).json({ message: "Tracking code not found" });
    }

    return res.json(payment);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.approvePendingVotePayment = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const payment = await prisma.voteRequest.findUnique({
      where: { id },
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment request not found" });
    }

    if (payment.status === "approved") {
      return res.status(400).json({ message: "Payment already approved" });
    }

    if (payment.status === "rejected") {
      return res.status(400).json({ message: "Rejected payment cannot be approved" });
    }

    await prisma.$transaction(async (tx) => {
      const votesToCreate = Array.from({ length: payment.voteCount }, () => ({
        nomineeId: payment.nomineeId,
        voterEmail: null,
        voterIP: req.ip || null,
        userAgent: req.get("user-agent") || "admin-approval",
      }));

      await tx.vote.createMany({
        data: votesToCreate,
      });

      await tx.nominee.update({
        where: { id: payment.nomineeId },
        data: {
          voteCount: {
            increment: payment.voteCount,
          },
        },
      });

      await tx.voteRequest.update({
        where: { id },
        data: {
          status: "approved",
          approvedAt: new Date(),
          rejectionReason: null,
        },
      });
    });

    return res.json({ message: "Payment approved and votes added successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.rejectPendingVotePayment = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { reason } = req.body;

    const payment = await prisma.voteRequest.findUnique({
      where: { id },
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment request not found" });
    }

    if (payment.status === "approved") {
      return res.status(400).json({ message: "Approved payment cannot be rejected" });
    }

    await prisma.voteRequest.update({
      where: { id },
      data: {
        status: "rejected",
        rejectionReason: reason || "Payment not found or incorrect amount",
      },
    });

    return res.json({ message: "Payment request rejected" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};