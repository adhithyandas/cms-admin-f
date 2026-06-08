import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { getGallery, addGallery, deleteGallery } from '../lib/api/gallery';

export const useGalleryQuery = (page = 1, limit = 20) => useQuery({
  queryKey: ['gallery', page, limit],
  queryFn: () => getGallery(page, limit),
});

export const useAddGalleryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addGallery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
  });
};

export const useDeleteGalleryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGallery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
  });
};
