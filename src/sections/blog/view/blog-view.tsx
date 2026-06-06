import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';

import { useBlogQuery, useAddBlogMutation, useUpdateBlogMutation, useDeleteBlogMutation } from 'src/hooks/useBlog';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export function BlogView() {
  const { data: blogs = [], isLoading } = useBlogQuery();
  const { mutateAsync: addBlog, isPending: isAdding } = useAddBlogMutation();
  const { mutateAsync: updateBlog, isPending: isUpdating } = useUpdateBlogMutation();
  const { mutateAsync: deleteBlog } = useDeleteBlogMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', description: '', thumbnail: null as File | null });

  const handleOpenAdd = () => {
    setEditingBlog(null);
    setFormData({ title: '', description: '', thumbnail: null });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (blog: any) => {
    setEditingBlog(blog);
    setFormData({ title: blog.title, description: blog.description, thumbnail: null });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', formData.title);
    fd.append('description', formData.description);
    if (formData.thumbnail) {
      fd.append('thumbnail', formData.thumbnail);
    } else if (!editingBlog) {
      alert('Please upload a thumbnail');
      return;
    }

    try {
      if (editingBlog) {
        await updateBlog({ id: editingBlog._id, formData: fd });
      } else {
        await addBlog(fd);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert('Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      await deleteBlog(id);
    }
  };

  if (isLoading) {
    return <DashboardContent><Typography>Loading blogs...</Typography></DashboardContent>;
  }

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Blog Posts
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpenAdd}
        >
          New post
        </Button>
      </Box>

      <Card>
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Thumbnail</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {blogs.map((blog: any) => (
                  <TableRow hover key={blog._id}>
                    <TableCell>
                      <Box component="img" src={blog.thumbnail} sx={{ width: 64, height: 48, borderRadius: 1, objectFit: 'cover' }} />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'fontWeightMedium' }}>{blog.title}</TableCell>
                    <TableCell sx={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {blog.description}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleOpenEdit(blog)} size="small" sx={{ mr: 1 }}>
                        <Iconify icon="solar:pen-bold" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(blog._id)} size="small" sx={{ color: 'error.main' }}>
                        <Iconify icon="solar:trash-bin-trash-bold" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {blogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        No blog posts found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </Card>

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingBlog ? 'Edit Blog' : 'Add New Blog'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
              <TextField
                label="Title"
                fullWidth
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <TextField
                label="Description"
                fullWidth
                required
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Thumbnail Image</Typography>
                {formData.thumbnail instanceof File ? (
                  <Box component="img" src={URL.createObjectURL(formData.thumbnail)} sx={{ width: 1, height: 200, objectFit: 'cover', borderRadius: 1, mb: 2 }} />
                ) : editingBlog?.thumbnail ? (
                  <Box component="img" src={editingBlog.thumbnail} sx={{ width: 1, height: 200, objectFit: 'cover', borderRadius: 1, mb: 2 }} />
                ) : null}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.files ? e.target.files[0] : null })}
                />
                {editingBlog && !formData.thumbnail && (
                  <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                    Leave empty to keep current thumbnail
                  </Typography>
                )}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isAdding || isUpdating}>
              {isAdding || isUpdating ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </DashboardContent>
  );
}
