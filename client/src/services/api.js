// ─── Axios Instance ────────────────────────────────────────
// Purpose: Pre-configured HTTP client for all API calls.
// Why: Instead of writing `axios.get('http://localhost:5000/api/...')`
//      everywhere, we create ONE instance with the base URL and 
//      cookie settings already configured. Every API call uses this.
// 
// withCredentials: true → sends httpOnly cookies (JWT) with every request.
// This is how the backend knows who is logged in.
// ────────────────────────────────────────────────────────────

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',           // Vite proxy forwards this to localhost:5000/api
  withCredentials: true,     // Send cookies (JWT) with every request
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Response Interceptor ──────────────────────────────────
// Automatically handles 401 (unauthorized) responses.
// If the JWT expires or is invalid, redirect to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear local state and redirect
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
