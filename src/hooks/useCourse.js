import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCourse, addCourse, updateCourse, deleteCourse } from '../lib/api/course';

export const useCourseQuery = () => {
  return useQuery({
    queryKey: ['course'],
    queryFn: getCourse,
  });
};

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
