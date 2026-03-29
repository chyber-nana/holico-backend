const { body, param, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  next();
};

const validateCategory = [
  body('name').trim().notEmpty().withMessage('Category name is required'),
  body('slug').trim().notEmpty().withMessage('Slug is required'),
  body('description').optional().isString().withMessage('Description must be a string'),
];

const validateCategoryId = [
  param('id').isInt().withMessage('Valid category id is required'),
];

module.exports = {
  validateCategory,
  validateCategoryId,
  handleValidationErrors,
};