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

import { useCourseQuery, useAddCourseMutation, useUpdateCourseMutation, useDeleteCourseMutation } from 'src/hooks/useCourse';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export default function Page() {
  const { data: courses = [], isLoading } = useCourseQuery();
  const { mutateAsync: addCourse, isPending: isAdding } = useAddCourseMutation();
  const { mutateAsync: updateCourse, isPending: isUpdating } = useUpdateCourseMutation();
  const { mutateAsync: deleteCourse } = useDeleteCourseMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', description: '', price: '', icon: null as File | null });

  const handleOpenAdd = () => {
    setEditingCourse(null);
    setFormData({ title: '', description: '', price: '', icon: null });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course: any) => {
    setEditingCourse(course);
    setFormData({ title: course.title, description: course.description, price: course.price, icon: null });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', formData.title);
    fd.append('description', formData.description);
    fd.append('price', formData.price);

    if (formData.icon) {
      fd.append('icon', formData.icon);
    } else if (!editingCourse) {
      alert('Please upload an icon');
      return;
    }

    try {
      if (editingCourse) {
        await updateCourse({ id: editingCourse._id, formData: fd });
      } else {
        await addCourse(fd);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert('Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      await deleteCourse(id);
    }
  };

  if (isLoading) {
    return <DashboardContent><Typography>Loading courses...</Typography></DashboardContent>;
  }

  return (
    <>
      <title>Courses - Admin</title>

      <DashboardContent>
        <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            Courses
          </Typography>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleOpenAdd}
          >
            Add Course
          </Button>
        </Box>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Icon</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courses.map((course: any) => (
                    <TableRow hover key={course._id}>
                      <TableCell>
                        <Box component="img" src={course.icon} sx={{ width: 48, height: 48, borderRadius: 1, objectFit: 'cover' }} />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'fontWeightMedium' }}>{course.title}</TableCell>
                      <TableCell sx={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {course.description}
                      </TableCell>
                      <TableCell>${course.price}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleOpenEdit(course)} size="small" sx={{ mr: 1 }}>
                          <Iconify icon="solar:pen-bold" />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(course._id)} size="small" sx={{ color: 'error.main' }}>
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {courses.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          No courses found.
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
          <DialogTitle>{editingCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
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
                <TextField
                  label="Price"
                  type="number"
                  fullWidth
                  required
                  slotProps={{ htmlInput: { step: '0.01' } }}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Icon/Image</Typography>
                  {formData.icon instanceof File ? (
                    <Box component="img" src={URL.createObjectURL(formData.icon)} sx={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 1, mb: 2 }} />
                  ) : editingCourse?.icon ? (
                    <Box component="img" src={editingCourse.icon} sx={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 1, mb: 2 }} />
                  ) : null}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, icon: e.target.files ? e.target.files[0] : null })}
                  />
                  {editingCourse && !formData.icon && (
                    <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                      Leave empty to keep current icon
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
    </>
  );
}
