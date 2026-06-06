// ─── Custom API Error Class ─────────────────────────────────
// Purpose: A custom error class that carries an HTTP status code.
// Why: When something goes wrong in a service or controller, we throw
//      `new ApiError(404, "Student not found")` and our global error
//      handler catches it, extracts the status code, and sends a clean response.
//      Without this, we'd have messy try-catch blocks everywhere.

class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors; // For validation errors (array of field-level errors)
    this.isOperational = true; // Distinguishes expected errors from bugs

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
