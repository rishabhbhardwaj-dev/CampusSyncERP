// ─── Role-Based Access Control Middleware ───────────────────
// Purpose: Restricts routes to specific roles (ADMIN, FACULTY, STUDENT).
// Why: Even after authentication, not everyone should access everything.
//      An admin can manage users, but a student cannot.
//      This middleware is used AFTER `authenticate` middleware.
//
// Usage in routes:
//   router.get('/users', authenticate, authorize('ADMIN'), getUsers);
//   router.get('/marks', authenticate, authorize('ADMIN', 'FACULTY'), getMarks);

const ApiError = require('../utils/apiError');

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user is set by the authenticate middleware
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required.'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(403, `Access denied. Required role(s): ${allowedRoles.join(', ')}`)
      );
    }

    next();
  };
};

module.exports = authorize;
