// ─── JWT Authentication Middleware ──────────────────────────
// Purpose: Verifies that the incoming request has a valid JWT token.
// Why: Protected routes need to know WHO is making the request.
//      This middleware reads the JWT from cookies (or Authorization header),
//      verifies it, and attaches the user data to `req.user`.
//      If the token is invalid/missing, the request is rejected before
//      it ever reaches the controller.

const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/apiError');
const prisma = require('../config/db');

const authenticate = async (req, res, next) => {
  try {
    // Try to get token from httpOnly cookie first, then Authorization header
    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : null);

    if (!token) {
      throw new ApiError(401, 'Access denied. No token provided.');
    }

    // Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // Fetch user from DB to ensure they still exist and are active
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        departmentId: true,
      },
    });

    if (!user) {
      throw new ApiError(401, 'User no longer exists.');
    }

    if (!user.isActive) {
      throw new ApiError(403, 'Account has been deactivated.');
    }

    // Attach user to request object — available in all subsequent handlers
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError(401, 'Invalid token.'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Token has expired. Please login again.'));
    }
    next(error);
  }
};

module.exports = authenticate;

