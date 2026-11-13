import api from './api';

export const getCourses = async (params = {}) => {
  const response = await api.get('/courses', { params });
  return response.data;
};

export const getCourseBySlug = async (slugOrId) => {
  const response = await api.get(`/courses/${slugOrId}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/courses/categories');
  return response.data;
};
