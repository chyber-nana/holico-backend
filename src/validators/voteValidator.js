const { body, validationResult } = require('express-validator');

exports.validateVote = [
  body('nomineeId')
    .notEmpty()
    .withMessage('Nominee ID is required')
    .isInt({ min: 1 })
    .withMessage('Nominee ID must be a valid number'),

  body('voterEmail')
    .optional({ nullable: true, checkFalsy: true })
    .isEmail()
    .withMessage('Invalid email address'),

  body('voteCount')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Vote count must be between 1 and 100'),
];

exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  next();
};