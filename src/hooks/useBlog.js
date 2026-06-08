import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { getBlog, addBlog, updateBlog, deleteBlog, getBlogById } from '../lib/api/blog';

export const useBlogQuery = (page = 1, limit = 20) => useQuery({
  queryKey: ['blog', page, limit],
  queryFn: () => getBlog(page, limit),
});

export const useBlogByIdQuery = (id) => useQuery({
  queryKey: ['blog', id],
  queryFn: () => getBlogById(id),
  enabled: !!id && id !== 'new',
});

export const useAddBlogMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog'] });
    },
  });
};

export const useUpdateBlogMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog'] });
    },
  });
};

export const useDeleteBlogMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog'] });
    },
  });
};
