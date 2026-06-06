// ─── Auth Routes ────────────────────────────────────────────
// Purpose: Maps HTTP endpoints to their middleware chain + controller.
// Why: Routes are the "table of contents" for each module.
//      You can see at a glance what endpoints exist, what middleware
//      protects them, and what controller handles them.
//
// Middleware order matters:
//   1. Validation rules (define what to check)
//   2. validate middleware (actually run the checks)
//   3. authenticate (verify JWT)
//   4. authorize (check role)
//   5. controller (handle request)

const express = require('express');
const router = express.Router();
const { register, login, logout, getProfile, changePassword } = require('./auth.controller');
const { registerRules, loginRules, changePasswordRules } = require('./auth.validator');
const validate = require('../../middleware/validate');
const authenticate = require('../../middleware/auth');
const authorize = require('../../middleware/rbac');

// Public routes
router.post('/login', loginRules, validate, login);

// Protected routes (need valid JWT)
router.post('/register', authenticate, authorize('ADMIN'), registerRules, validate, register);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getProfile);
router.put('/change-password', authenticate, changePasswordRules, validate, changePassword);

module.exports = router;
