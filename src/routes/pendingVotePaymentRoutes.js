const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  createPendingVotePayment,
  getPendingVotePayments,
  getPendingVotePaymentByCode,
  approvePendingVotePayment,
  rejectPendingVotePayment,
} = require("../controllers/pendingVotePaymentController");

router.post("/", createPendingVotePayment);
router.get("/track/:code", getPendingVotePaymentByCode);

router.get("/", authMiddleware, adminMiddleware, getPendingVotePayments);
router.post("/:id/approve", authMiddleware, adminMiddleware, approvePendingVotePayment);
router.post("/:id/reject", authMiddleware, adminMiddleware, rejectPendingVotePayment);

module.exports = router;