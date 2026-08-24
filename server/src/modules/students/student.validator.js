const { body } = require('express-validator');

exports.createStudentValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),

  body('enrollmentNo')
    .trim()
    .notEmpty().withMessage('Enrollment number is required')
    .isLength({ min: 3, max: 20 }).withMessage('Enrollment number must be between 3 and 20 characters'),

  body('courseId')
    .notEmpty().withMessage('Course ID is required')
    .isInt({ min: 1 }).withMessage('Valid course ID is required'),

  body('semester')
    .optional()
    .isInt({ min: 1, max: 8 }).withMessage('Semester must be between 1 and 8'),

  body('section')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 5 }).withMessage('Section cannot exceed 5 characters'),

  body('admissionYear')
    .optional()
    .isInt({ min: 2000, max: 2100 }).withMessage('Admission year must be between 2000 and 2100'),

  body('departmentId')
    .optional({ values: 'null' })
    .isInt({ min: 1 }).withMessage('Valid department ID is required'),

  body('phone')
    .optional({ values: 'null' })
    .trim()
    .isLength({ min: 10, max: 15 }).withMessage('Phone number must be between 10 and 15 digits')
    .matches(/^[0-9]+$/).withMessage('Phone number must contain only digits'),

  body('guardianName')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 100 }).withMessage('Guardian name cannot exceed 100 characters'),

  body('guardianPhone')
    .optional({ values: 'null' })
    .trim()
    .isLength({ min: 10, max: 15 }).withMessage('Guardian phone must be between 10 and 15 digits')
    .matches(/^[0-9]+$/).withMessage('Guardian phone must contain only digits'),

  body('password')
    .optional()
    .isLength({ min: 6, max: 50 }).withMessage('Password must be between 6 and 50 characters'),
];

exports.updateStudentValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Name cannot be empty')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Must be a valid email')
    .normalizeEmail(),

  body('enrollmentNo')
    .optional()
    .trim()
    .notEmpty().withMessage('Enrollment number cannot be empty')
    .isLength({ min: 3, max: 20 }).withMessage('Enrollment number must be between 3 and 20 characters'),

  body('courseId')
    .optional()
    .isInt({ min: 1 }).withMessage('Valid course ID is required'),

  body('semester')
    .optional()
    .isInt({ min: 1, max: 8 }).withMessage('Semester must be between 1 and 8'),

  body('section')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 5 }).withMessage('Section cannot exceed 5 characters'),

  body('departmentId')
    .optional({ values: 'null' })
    .isInt({ min: 1 }).withMessage('Valid department ID is required'),

  body('phone')
    .optional({ values: 'null' })
    .trim()
    .isLength({ min: 10, max: 15 }).withMessage('Phone number must be between 10 and 15 digits')
    .matches(/^[0-9]+$/).withMessage('Phone number must contain only digits'),

  body('guardianName')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 100 }).withMessage('Guardian name cannot exceed 100 characters'),

  body('guardianPhone')
    .optional({ values: 'null' })
    .trim()
    .isLength({ min: 10, max: 15 }).withMessage('Guardian phone must be between 10 and 15 digits')
    .matches(/^[0-9]+$/).withMessage('Guardian phone must contain only digits'),

  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean'),
];