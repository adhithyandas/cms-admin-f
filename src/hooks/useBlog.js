import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { getBlog, addBlog, updateBlog, deleteBlog } from '../lib/api/blog';

export const useBlogQuery = () => useQuery({
    queryKey: ['blog'],
    queryFn: getBlog,
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
