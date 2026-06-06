// ─── Validation Runner Middleware ────────────────────────────
// Purpose: Runs express-validator checks and returns errors if any.
// Why: express-validator defines rules in route files, but doesn't
//      automatically stop the request on failure. This middleware
//      collects all validation errors and sends a clean 400 response.
//      Without it, invalid data would reach the controller.
//
// Usage in routes:
//   router.post('/login', loginValidationRules, validate, loginController);

const { validationResult } = require('express-validator');
const ApiError = require('../utils/apiError');

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    throw new ApiError(400, 'Validation failed', extractedErrors);
  }

  next();
};

module.exports = validate;
