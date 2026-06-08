import axiosInstance from '../axios';

export const getBlog = async (page = 1, limit = 20) => {
  const { data } = await axiosInstance.get('/blog', { params: { page, limit } });
  return data;
};

export const getBlogById = async (id) => {
  const { data } = await axiosInstance.get(`/blog/${id}`);
  return data;
};

export const addBlog = async (formData) => {
  const { data } = await axiosInstance.post('/blog', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const updateBlog = async ({ id, formData }) => {
  const { data } = await axiosInstance.put(`/blog/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const deleteBlog = async (id) => {
  const { data } = await axiosInstance.delete(`/blog/${id}`);
  return data;
};
