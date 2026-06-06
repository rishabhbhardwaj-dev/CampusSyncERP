const { body } = require('express-validator');

exports.createStudentValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('enrollmentNo').trim().notEmpty().withMessage('Enrollment number is required'),
  body('courseId').isInt().withMessage('Valid course ID is required'),
  body('semester').optional().isInt({ min: 1, max: 8 }).withMessage('Semester must be between 1 and 8'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

exports.updateStudentValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Must be a valid email'),
  body('enrollmentNo').optional().trim().notEmpty().withMessage('Enrollment number cannot be empty'),
  body('courseId').optional().isInt().withMessage('Valid course ID is required'),
  body('semester').optional().isInt({ min: 1, max: 8 }).withMessage('Semester must be between 1 and 8'),
];
