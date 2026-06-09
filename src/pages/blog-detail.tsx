import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { useBlogByIdQuery, useAddBlogMutation, useUpdateBlogMutation } from 'src/hooks/useBlog';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

export default function BlogDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const isEdit = id !== 'new';

  const { data: blog, isLoading } = useBlogByIdQuery(id);
  const { mutateAsync: addBlog, isPending: isAdding } = useAddBlogMutation();
  const { mutateAsync: updateBlog, isPending: isUpdating } = useUpdateBlogMutation();

  const [formData, setFormData] = useState({ title: '', description: '', thumbnail: null as File | null });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (blog) {
      setFormData({ title: blog.title || '', description: blog.description || '', thumbnail: null });
    }
  }, [blog]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', formData.title);
    fd.append('description', formData.description);

    if (formData.thumbnail) {
      fd.append('thumbnail', formData.thumbnail);
    } else if (!isEdit) {
      alert('Please upload a thumbnail');
      return;
    }

    try {
      if (isEdit) {
        await updateBlog({ id, formData: fd });
      } else {
        await addBlog(fd);
      }
      router.push('/blog');
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
      <title>{isEdit ? 'Edit Post' : 'New Post'} - Admin</title>

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
          <IconButton onClick={() => router.push('/blog')} sx={{ mr: 2 }}>
            <Iconify icon="eva:arrow-ios-back-fill" />
          </IconButton>

          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            {isEdit ? 'Edit Post' : 'Create a new post'}
          </Typography>
        </Box>

        <Box sx={{ py: 4, maxWidth: 800 }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Post Title"
                fullWidth
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root fieldset': { borderWidth: '1px !important', borderColor: 'rgba(145, 158, 171, 0.2) !important' } }}
              />

              <TextField
                label="Content"
                fullWidth
                required
                multiline
                rows={8}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root fieldset': { borderWidth: '1px !important', borderColor: 'rgba(145, 158, 171, 0.2) !important' } }}
              />

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Thumbnail Image</Typography>
                {formData.thumbnail instanceof File ? (
                  <Box
                    component="img"
                    src={URL.createObjectURL(formData.thumbnail)}
                    sx={{ width: 128, height: 128, objectFit: 'cover', borderRadius: 1, mb: 2, cursor: 'pointer' }}
                    onClick={() => setPreviewImage(URL.createObjectURL(formData.thumbnail!))}
                  />
                ) : blog?.thumbnail ? (
                  <Box
                    component="img"
                    src={blog.thumbnail}
                    sx={{ width: 128, height: 128, objectFit: 'cover', borderRadius: 1, mb: 2, cursor: 'pointer' }}
                    onClick={() => setPreviewImage(blog.thumbnail)}
                  />
                ) : null}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.files ? e.target.files[0] : null })}
                />
                {isEdit && !formData.thumbnail && (
                  <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                    Leave empty to keep current thumbnail
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                <Button variant="outlined" onClick={() => router.push('/blog')}>Cancel</Button>

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
