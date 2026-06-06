// ─── Auth Validators ────────────────────────────────────────
// Purpose: Define validation rules for auth endpoints.
// Why: Never trust user input. These rules run BEFORE the controller
//      and reject bad data early with clear error messages.
//      Example: If someone sends email="notanemail", they get back
//      { field: "email", message: "Please provide a valid email" }

const { body } = require('express-validator');

const registerRules = [
  body('email')
    .isEmail().withMessage('Please provide a valid email.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required.')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters.'),
  body('role')
    .isIn(['ADMIN', 'FACULTY', 'STUDENT']).withMessage('Role must be ADMIN, FACULTY, or STUDENT.'),
  body('phone')
    .optional()
    .isMobilePhone().withMessage('Please provide a valid phone number.'),
  // Student-specific
  body('enrollmentNo')
    .if(body('role').equals('STUDENT'))
    .notEmpty().withMessage('Enrollment number is required for students.'),
  body('courseId')
    .if(body('role').equals('STUDENT'))
    .isInt().withMessage('Course ID is required for students.'),
  // Faculty-specific
  body('employeeId')
    .if(body('role').equals('FACULTY'))
    .notEmpty().withMessage('Employee ID is required for faculty.'),
];

const loginRules = [
  body('email')
    .isEmail().withMessage('Please provide a valid email.')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required.'),
];

const changePasswordRules = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required.'),
  body('newPassword')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters.')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('New password must be different from current password.');
      }
      return true;
    }),
];

module.exports = { registerRules, loginRules, changePasswordRules };
