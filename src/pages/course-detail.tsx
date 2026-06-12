import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { useCourseByIdQuery, useAddCourseMutation, useUpdateCourseMutation } from 'src/hooks/useCourse';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

export default function CourseDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const isEdit = id !== 'new';

  const { data: course, isLoading } = useCourseByIdQuery(id);
  const { mutateAsync: addCourse, isPending: isAdding } = useAddCourseMutation();
  const { mutateAsync: updateCourse, isPending: isUpdating } = useUpdateCourseMutation();

  const [formData, setFormData] = useState({ title: '', description: '', price: '' });

  useEffect(() => {
    if (course) {
      setFormData({ title: course.title || '', description: course.description || '', price: course.price || '' });
    }
  }, [course]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', formData.title);
    fd.append('description', formData.description);
    fd.append('price', formData.price);

    try {
      if (isEdit) {
        await updateCourse({ id, formData: fd });
      } else {
        await addCourse(fd);
      }
      router.push('/courses');
    } catch (error) {
      console.error(error);
      alert('Operation failed');
    }
  };

  if (isEdit && isLoading) {
    return (
      <DashboardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </DashboardContent>
    );
  }

  return (
    <>
      <title>{isEdit ? 'Edit Course' : 'New Course'} - Admin</title>

      <DashboardContent>
        <Box sx={(theme) => ({
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          position: 'sticky',
          top: 16,
          zIndex: 10,
          backgroundColor: 'background.paper',
          p: 2,
          borderRadius: 2,
          boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)',
        })}>
          <IconButton onClick={() => router.push('/courses')} sx={{ mr: 2 }}>
            <Iconify icon="eva:arrow-ios-back-fill" />
          </IconButton>

          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            {isEdit ? 'Edit Course' : 'Create a new course'}
          </Typography>
        </Box>

        <Box sx={{ py: 4, maxWidth: 800 }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Course Title"
                fullWidth
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root fieldset': { borderWidth: '1px !important', borderColor: 'rgba(145, 158, 171, 0.2) !important' } }}
              />

              <TextField
                label="Description"
                fullWidth
                required
                multiline
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root fieldset': { borderWidth: '1px !important', borderColor: 'rgba(145, 158, 171, 0.2) !important' } }}
              />

              <TextField
                label="Price"
                type="number"
                fullWidth
                required
                slotProps={{ htmlInput: { step: '0.01' } }}
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root fieldset': { borderWidth: '1px !important', borderColor: 'rgba(145, 158, 171, 0.2) !important' } }}
              />



              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                <Button variant="outlined" onClick={() => router.push('/courses')}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isAdding || isUpdating}>
                  {isAdding || isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </DashboardContent>
    </>
  );
}
