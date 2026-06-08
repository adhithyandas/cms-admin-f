import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { getCourse, addCourse, updateCourse, deleteCourse, getCourseById } from '../lib/api/course';

export const useCourseQuery = (page = 1, limit = 20) => useQuery({
  queryKey: ['course', page, limit],
  queryFn: () => getCourse(page, limit),
});

export const useCourseByIdQuery = (id) => useQuery({
  queryKey: ['course', id],
  queryFn: () => getCourseById(id),
  enabled: !!id && id !== 'new',
});

export const useAddCourseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course'] });
    },
  });
};

export const useUpdateCourseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course'] });
    },
  });
};

export const useDeleteCourseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course'] });
    },
  });
};
