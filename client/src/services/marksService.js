import api from './api';

export const marksService = {
  getMarks: (courseId, semester, subjectId, examType) => 
    api.get('/marks', { params: { courseId, semester, subjectId, examType } }),
  
  saveMarks: (subjectId, examType, marksData, maxMarks) => 
    api.post('/marks', { subjectId, examType, marksData, maxMarks }),
  
  getMyMarks: (semester) => api.get('/marks/my-marks', { params: { semester } })
};
