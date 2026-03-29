const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

const {
  validateCategory,
  validateCategoryId,
  handleValidationErrors,
} = require('../validators/categoryValidator');

router.get('/', getCategories);
router.get('/:id', validateCategoryId, handleValidationErrors, getCategoryById);

router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  validateCategory,
  handleValidationErrors,
  createCategory
);

router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  validateCategoryId,
  validateCategory,
  handleValidationErrors,
  updateCategory
);

router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  validateCategoryId,
  handleValidationErrors,
  deleteCategory
);

module.exports = router;