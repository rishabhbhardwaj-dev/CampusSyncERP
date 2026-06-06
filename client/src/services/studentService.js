// ─── Student Service ────────────────────────────────────────
// Purpose: Frontend API calls for student CRUD operations.
// Uses the pre-configured Axios instance with JWT cookies.
// ────────────────────────────────────────────────────────────

import api from './api';

const studentService = {
  // List students with optional search, filters, pagination
  getAll: (params = {}) => api.get('/students', { params }),

  // Get single student by ID
  getById: (id) => api.get(`/students/${id}`),

  // Create new student
  create: (data) => api.post('/students', data),

  // Update student
  update: (id, data) => api.put(`/students/${id}`, data),

  // Delete student
  delete: (id) => api.delete(`/students/${id}`),

  // Get student stats
  getStats: () => api.get('/students/stats'),
};

export default studentService;
