import api from './api';

const facultyService = {
  getAll: (params) => api.get('/faculty', { params }),
  create: (data) => api.post('/faculty', data),
  delete: (id) => api.delete(`/faculty/${id}`),
};

export default facultyService;
