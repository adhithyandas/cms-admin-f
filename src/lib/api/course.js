import axiosInstance from '../axios';

export const getCourse = async () => {
  const { data } = await axiosInstance.get('/course');
  return data;
};

export const addCourse = async (formData) => {
  const { data } = await axiosInstance.post('/course', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const updateCourse = async ({ id, formData }) => {
  const { data } = await axiosInstance.put(`/course/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const deleteCourse = async (id) => {
  const { data } = await axiosInstance.delete(`/course/${id}`);
  return data;
};
