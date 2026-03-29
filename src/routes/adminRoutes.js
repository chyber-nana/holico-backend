const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
} = require('../controllers/adminController');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/profile', authMiddleware, getAdminProfile);

module.exports = router;