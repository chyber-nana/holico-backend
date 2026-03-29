const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  getNominees,
  createNominee,
  updateNominee,
  deleteNominee,
} = require("../controllers/nomineeController");

router.get("/", getNominees);

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  createNominee
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  updateNominee
);

router.delete("/:id", authMiddleware, adminMiddleware, deleteNominee);

module.exports = router;