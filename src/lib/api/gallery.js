import axiosInstance from '../axios';

export const getGallery = async () => {
  const { data } = await axiosInstance.get('/gallery');
  return data;
};

export const addGallery = async (formData) => {
  const { data } = await axiosInstance.post('/gallery', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const deleteGallery = async (id) => {
  const { data } = await axiosInstance.delete(`/gallery/${id}`);
  return data;
};
