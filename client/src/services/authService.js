// ─── Auth Service ──────────────────────────────────────────
// Purpose: All authentication-related API calls in one place.
// Why: Components don't need to know the exact API URLs or 
//      how data is structured. They just call authService.login()
//      and get back the user data.
// ────────────────────────────────────────────────────────────

import api from './api';

const authService = {
  // Sends email + password to backend, gets back user data + JWT cookie
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Only admins can register new users (faculty/students)
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Clears the JWT cookie on the server
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Gets the currently logged-in user's profile
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export default authService;
