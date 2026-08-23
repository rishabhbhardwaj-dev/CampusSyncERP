// ─── Student API Routes ─────────────────────────────────────
// Base URL: /api/students
//
// Routes:
//   GET    /stats      → Get student statistics (ADMIN, FACULTY)
//   GET    /           → List all students (ADMIN, FACULTY only)
//   GET    /:id        → Get single student (ADMIN, FACULTY, or own record)
//   POST   /           → Create a new student (ADMIN only)
//   PUT    /:id        → Update student info (ADMIN only)
//   DELETE /:id        → Delete student (ADMIN only)
// ────────────────────────────────────────────────────────────

const express = require('express');
const router = express.Router();
const controller = require('./student.controller');
const authenticate = require('../../middleware/auth');
const authorize = require('../../middleware/rbac');
const validate = require('../../middleware/validate');
const ApiError = require('../../utils/apiError');
const prisma = require('../../config/db');
const { createStudentValidation, updateStudentValidation } = require('./student.validator');

// All routes require authentication
router.use(authenticate);

// ─── Middleware: Allow admin/faculty, or student viewing own record ───
const authorizeStudentAccess = async (req, res, next) => {
  try {
    // Admin and Faculty can view any student
    if (req.user.role === 'ADMIN' || req.user.role === 'FACULTY') {
      return next();
    }

    // Students can only view their own record
    if (req.user.role === 'STUDENT') {
      const student = await prisma.student.findUnique({
        where: { id: parseInt(req.params.id) },
        select: { userId: true },
      });

      if (!student || student.userId !== req.user.id) {
        return next(new ApiError(403, 'Access denied. You can only view your own profile.'));
      }

      return next();
    }

    return next(new ApiError(403, 'Access denied.'));
  } catch (error) {
    next(error);
  }
};

// Stats route (must be before /:id to avoid conflict)
router.get('/stats', authorize('ADMIN', 'FACULTY'), controller.getStats);

// CRUD routes
router.get('/', authorize('ADMIN', 'FACULTY'), controller.getAll);
router.get('/:id', authorizeStudentAccess, controller.getById);
router.post('/', authorize('ADMIN'), createStudentValidation, validate, controller.create);
router.put('/:id', authorize('ADMIN'), updateStudentValidation, validate, controller.update);
router.delete('/:id', authorize('ADMIN'), controller.delete);

module.exports = router;