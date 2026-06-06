// ─── Global Error Handler ───────────────────────────────────
// Purpose: Catches ALL errors thrown anywhere in the app and sends
//          a consistent error response.
// Why: Without a global handler, unhandled errors crash the server
//      or leak stack traces to the client (security risk).
//      This catches both our ApiError (expected) and unknown errors (bugs).
//      In production, unknown errors show a generic message.
//      In development, we include the stack trace for debugging.

const ApiError = require('../utils/apiError');
const env = require('../config/env');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  // Prisma known errors
  if (err.code === 'P2002') {
    statusCode = 409;
    message = `Duplicate entry: ${err.meta?.target?.join(', ')} already exists.`;
  }
  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found.';
  }

  // Log error in development
  if (env.NODE_ENV === 'development') {
    console.error('🔴 Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: errors.length > 0 ? errors : undefined,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
