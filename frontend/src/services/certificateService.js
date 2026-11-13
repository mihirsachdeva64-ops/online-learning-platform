import api from './api';

export const getMyCertificates = async () => {
  const response = await api.get('/certificates/my-certificates');
  return response.data;
};

export const getCourseCertificate = async (courseId) => {
  const response = await api.get(`/certificates/course/${courseId}`);
  return response.data;
};

export const verifyCertificate = async (certificateId) => {
  const response = await api.get(`/certificates/verify/${certificateId}`);
  return response.data;
};
