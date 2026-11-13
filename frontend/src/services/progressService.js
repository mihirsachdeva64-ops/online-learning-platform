import api from './api';

export const enrollCourse = async (courseId) => {
  const response = await api.post(`/progress/enroll/${courseId}`);
  return response.data;
};

export const getMyEnrollments = async () => {
  const response = await api.get('/progress/my-enrollments');
  return response.data;
};

export const getCourseEnrollment = async (courseId) => {
  const response = await api.get(`/progress/course/${courseId}`);
  return response.data;
};

export const saveLessonProgress = async (data) => {
  const response = await api.post('/progress/lesson', data);
  return response.data;
};
