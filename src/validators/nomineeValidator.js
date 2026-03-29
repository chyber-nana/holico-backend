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

const validateNominee = [
  body('name').trim().notEmpty().withMessage('Nominee name is required'),
  body('categoryId').isInt().withMessage('Valid categoryId is required'),
  body('image').optional().isString().withMessage('Image must be a string'),
  body('bio').optional().isString().withMessage('Bio must be a string'),
];

const validateNomineeId = [
  param('id').isInt().withMessage('Valid nominee id is required'),
];

const validateCategoryParam = [
  param('categoryId').isInt().withMessage('Valid category id is required'),
];

const validateNomineeMove = [
  body('newCategoryId').isInt().withMessage('Valid newCategoryId is required'),
];

module.exports = {
  validateNominee,
  validateNomineeId,
  validateCategoryParam,
  validateNomineeMove,
  handleValidationErrors,
};