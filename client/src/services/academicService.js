import api from './api';

export const academicService = {
  getDepartments: () => api.get('/academic/departments'),
  getCourses: (departmentId) => api.get('/academic/courses', { params: { departmentId } }),
  getSubjects: (courseId, semester) => api.get('/academic/subjects', { params: { courseId, semester } })
};

export const attendanceService = {
  getByDate: (date, subjectId) => api.get('/attendance', { params: { date, subjectId } }),
  create: (data) => api.post('/attendance', data),
  update: (id, status) => api.put(`/attendance/${id}`, { status }),
  delete: (id) => api.delete(`/attendance/${id}`),
  getStudentStats: (semester) => api.get('/attendance/stats', { params: { semester } })
};
