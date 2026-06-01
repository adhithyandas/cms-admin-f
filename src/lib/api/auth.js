import axiosInstance from '../axios';

export const loginAdmin = async (credentials) => {
  const { data } = await axiosInstance.post('/auth/login', credentials);
  return data;
};
