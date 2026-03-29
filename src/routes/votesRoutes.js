const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const {
  castVote,
  getVotes,
  resetVotes,
} = require('../controllers/voteController');

const {
  validateVote,
  handleValidationErrors,
} = require('../validators/voteValidator');

router.post('/', validateVote, handleValidationErrors, castVote);
router.get('/', authMiddleware, adminMiddleware, getVotes);
router.delete('/reset', authMiddleware, adminMiddleware, resetVotes);

module.exports = router;