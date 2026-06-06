import api from './api';

export const feesService = {
  getMyFees: (semester) => api.get('/fees/my-fees', { params: { semester } }),
  getFees: (courseId, semester) => api.get('/fees', { params: { courseId, semester } }),
  createFee: (data) => api.post('/fees', data),
  payFee: (id, amount) => api.post(`/fees/${id}/pay`, { amount })
};
