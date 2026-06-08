import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Backdrop from '@mui/material/Backdrop';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { useGalleryQuery, useAddGalleryMutation, useDeleteGalleryMutation } from 'src/hooks/useGallery';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export default function Page() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const { data: response, isLoading, isFetching } = useGalleryQuery(page + 1, rowsPerPage);
  const { mutateAsync: addGallery, isPending: isAdding } = useAddGalleryMutation();
  const { mutateAsync: deleteGallery, isPending: isDeleting } = useDeleteGalleryMutation();

  const isWorking = isFetching || isAdding || isDeleting;

  const gallery = response?.data || [];
  const total = response?.total || 0;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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

  const handleDelete = async () => {
    if (deleteId) {
      await deleteGallery(deleteId);
      setDeleteId(null);
    }
  };

  if (isLoading && page === 0) {
    return <DashboardContent />;
  }

  return (
    <>
      <title>Gallery - Admin</title>

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

        <Card sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
                lg: 'repeat(5, 1fr)',
              },
            }}
          >
            {gallery.map((item: any) => (
              <Box 
                key={item._id} 
                sx={{ 
                  position: 'relative', 
                  borderRadius: 2, 
                  overflow: 'hidden', 
                  aspectRatio: '1/1',
                  boxShadow: '0 0 0 1px rgba(0,0,0,0.05)'
                }}
              >
                <Box 
                  component="img" 
                  src={item.image} 
                  sx={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} 
                  onClick={() => setPreviewImage(item.image)}
                />
                <IconButton 
                  onClick={() => setDeleteId(item._id)} 
                  size="small" 
                  sx={{ 
                    position: 'absolute', 
                    top: 8, 
                    right: 8, 
                    color: 'error.main', 
                    bgcolor: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(4px)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                  }}
                >
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Box>
            ))}
          </Box>

          {gallery.length === 0 && (
            <Box sx={{ py: 10, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                No images found in the gallery.
              </Typography>
            </Box>
          )}
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 20, 25, 50]}
          />
        </Card>

        {/* Upload Modal */}
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

        {/* Delete Confirmation */}
        <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this image? This action cannot be undone.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={!!previewImage} onClose={() => setPreviewImage(null)} maxWidth="md" fullWidth>
          {previewImage && (
            <Box 
              component="img" 
              src={previewImage} 
              sx={{ width: '100%', height: 'auto', maxHeight: '90vh', objectFit: 'contain', bgcolor: 'background.default' }} 
            />
          )}
        </Dialog>

        <Backdrop open={isWorking} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </DashboardContent>
    </>
  );
}
