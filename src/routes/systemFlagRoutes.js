const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getPortalStatus,
  updatePortalStatus,
  closePortalNow,
  reopenPortal,
} = require("../controllers/systemFlagController");

router.get("/status", getPortalStatus);

router.put(
  "/status",
  authMiddleware,
  adminMiddleware,
  updatePortalStatus
);

router.post(
  "/close",
  authMiddleware,
  adminMiddleware,
  closePortalNow
);

router.post(
  "/reopen",
  authMiddleware,
  adminMiddleware,
  reopenPortal
);

module.exports = router;