import { useMutation } from '@tanstack/react-query';
import { loginAdmin } from '../lib/api/auth';

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: loginAdmin,
  });
};
