import api from './api';

export const getQuizById = async (id) => {
  const response = await api.get(`/quizzes/${id}`);
  return response.data;
};

export const getQuizByTarget = async (params) => {
  const response = await api.get('/quizzes/target', { params });
  return response.data;
};

export const submitQuizAttempt = async (id, data) => {
  const response = await api.post(`/quizzes/${id}/submit`, data);
  return response.data;
};

export const getQuizAttempts = async (id) => {
  const response = await api.get(`/quizzes/${id}/attempts`);
  return response.data;
};
