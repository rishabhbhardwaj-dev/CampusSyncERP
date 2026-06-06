import api from './api';

export const timetableService = {
  getTimetable: (courseId, semester) => 
    api.get('/timetable', { params: { courseId, semester } })
};
