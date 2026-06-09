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

  const [formData, setFormData] = useState({ title: '', description: '', price: '', icon: null as File | null });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (course) {
      setFormData({ title: course.title || '', description: course.description || '', price: course.price || '', icon: null });
    }
  }, [course]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', formData.title);
    fd.append('description', formData.description);
    fd.append('price', formData.price);

    if (formData.icon) {
      fd.append('icon', formData.icon);
    } else if (!isEdit) {
      alert('Please upload an icon');
      return;
    }

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

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Icon / Image</Typography>
                {formData.icon instanceof File ? (
                  <Box
                    component="img"
                    src={URL.createObjectURL(formData.icon)}
                    sx={{ width: 128, height: 128, objectFit: 'cover', borderRadius: 1, mb: 2, cursor: 'pointer' }}
                    onClick={() => setPreviewImage(URL.createObjectURL(formData.icon!))}
                  />
                ) : course?.icon ? (
                  <Box
                    component="img"
                    src={course.icon}
                    sx={{ width: 128, height: 128, objectFit: 'cover', borderRadius: 1, mb: 2, cursor: 'pointer' }}
                    onClick={() => setPreviewImage(course.icon)}
                  />
                ) : null}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, icon: e.target.files ? e.target.files[0] : null })}
                />

                {isEdit && !formData.icon && (
                  <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                    Leave empty to keep current icon
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                <Button variant="outlined" onClick={() => router.push('/courses')}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isAdding || isUpdating}>
                  {isAdding || isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Box>
          </form>
        </Box>

        <Dialog open={!!previewImage} onClose={() => setPreviewImage(null)} maxWidth="md" fullWidth>
          {previewImage && (
            <Box
              component="img"
              src={previewImage}
              sx={{ width: '100%', height: 'auto', maxHeight: '90vh', objectFit: 'contain', bgcolor: 'background.default' }}
            />
          )}
        </Dialog>
      </DashboardContent>
    </>
  );
}
