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
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';

import { useGalleryQuery, useAddGalleryMutation, useDeleteGalleryMutation } from 'src/hooks/useGallery';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export default function Page() {
  const { data: gallery = [], isLoading } = useGalleryQuery();
  const { mutateAsync: addGallery, isPending: isAdding } = useAddGalleryMutation();
  const { mutateAsync: deleteGallery } = useDeleteGalleryMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      alert('Please select an image to upload');
      return;
    }

    const fd = new FormData();
    fd.append('image', imageFile);

    try {
      await addGallery(fd);
      setIsModalOpen(false);
      setImageFile(null);
    } catch (error) {
      console.error(error);
      alert('Upload failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      await deleteGallery(id);
    }
  };

  if (isLoading) {
    return <DashboardContent><Typography>Loading gallery...</Typography></DashboardContent>;
  }

  return (
    <>
      <title>Gallery - Admin</title>

      <DashboardContent>
        <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            Gallery
          </Typography>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => setIsModalOpen(true)}
          >
            Add Image
          </Button>
        </Box>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>ID</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gallery.map((item: any) => (
                    <TableRow hover key={item._id}>
                      <TableCell>
                        <Box component="img" src={item.image} sx={{ width: 64, height: 64, borderRadius: 1, objectFit: 'cover' }} />
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>{item._id}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleDelete(item._id)} size="small" sx={{ color: 'error.main' }}>
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {gallery.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          No images found in the gallery.
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
          <DialogTitle>Upload Image to Gallery</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Select Image</Typography>
                  {imageFile instanceof File && (
                    <Box component="img" src={URL.createObjectURL(imageFile)} sx={{ width: 1, maxHeight: 300, objectFit: 'contain', borderRadius: 1, mb: 2, bgcolor: 'background.neutral' }} />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                  />
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={isAdding}>
                {isAdding ? 'Uploading...' : 'Upload'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </DashboardContent>
    </>
  );
}
