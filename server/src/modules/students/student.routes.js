// ─── Student API Routes ─────────────────────────────────────
// Purpose: CRUD endpoints for student management.
// Base URL: /api/students
//
// Routes:
//   GET    /stats      → Get student statistics
//   GET    /           → List all students (with search, filter, pagination)
//   GET    /:id        → Get single student details
//   POST   /           → Create a new student (+ user account)
//   PUT    /:id        → Update student info
//   DELETE /:id        → Delete student (+ user account)
// ────────────────────────────────────────────────────────────

const express = require('express');
const router = express.Router();
const controller = require('./student.controller');
const authenticate = require('../../middleware/auth');
const authorize = require('../../middleware/rbac');
const validate = require('../../middleware/validate');
const { createStudentValidation, updateStudentValidation } = require('./student.validator');

// All routes require authentication
router.use(authenticate);

// Stats route (must be before /:id to avoid conflict)
router.get('/stats', authorize('ADMIN', 'FACULTY'), controller.getStats);

// CRUD routes
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', authorize('ADMIN'), createStudentValidation, validate, controller.create);
router.put('/:id', authorize('ADMIN'), updateStudentValidation, validate, controller.update);
router.delete('/:id', authorize('ADMIN'), controller.delete);

module.exports = router;
