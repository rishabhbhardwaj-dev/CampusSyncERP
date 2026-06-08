// ─── Auth Controller ────────────────────────────────────────
// Purpose: Handles HTTP requests for auth endpoints.
// Why: Controllers are THIN — they only:
//   1. Extract data from the request (req.body, req.params, req.user)
//   2. Call the service
//   3. Send the response
// All business logic lives in the service, not here.

const authService = require('./auth.service');
const ApiResponse = require('../../utils/apiResponse');
const env = require('../../config/env');

// Cookie options for JWT token
const cookieOptions = {
  httpOnly: true,       // JavaScript can't access this cookie (XSS protection)
  secure: env.NODE_ENV === 'production',  // HTTPS only in production
  sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',      // CSRF protection
  maxAge: env.COOKIE_MAX_AGE,
};

const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    new ApiResponse(201, 'User registered successfully.', user).send(res);
  } catch (error) {
    next(error); // Passes error to global error handler
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);

    // Set JWT in httpOnly cookie — more secure than localStorage
    res.cookie('token', token, cookieOptions);

    new ApiResponse(200, 'Login successful.', { user, token }).send(res);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    // Clear the JWT cookie
    res.clearCookie('token', cookieOptions);
    new ApiResponse(200, 'Logged out successfully.').send(res);
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    new ApiResponse(200, 'Profile fetched successfully.', user).send(res);
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user.id, currentPassword, newPassword);
    new ApiResponse(200, 'Password changed successfully.').send(res);
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, logout, getProfile, changePassword };
