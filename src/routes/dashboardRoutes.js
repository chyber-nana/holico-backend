const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const {
  getDashboardSummary,
  getCategoryLeaders,
  getFullResults,
} = require('../controllers/dashboardController');

router.get('/summary', authMiddleware, adminMiddleware, getDashboardSummary);
router.get('/leaders', authMiddleware, adminMiddleware, getCategoryLeaders);
router.get('/results', authMiddleware, adminMiddleware, getFullResults);

module.exports = router;