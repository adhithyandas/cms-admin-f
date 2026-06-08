import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import Backdrop from '@mui/material/Backdrop';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { useBlogQuery, useDeleteBlogMutation } from 'src/hooks/useBlog';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

export function BlogView() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const { data: response, isLoading, isFetching } = useBlogQuery(page + 1, rowsPerPage);
  const { mutateAsync: deleteBlog, isPending: isDeleting } = useDeleteBlogMutation();

  const isWorking = isFetching || isDeleting;

  const blogs = response?.data || [];
  const total = response?.total || 0;

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleDelete = async () => {
    if (deleteId) {
      await deleteBlog(deleteId);
      setDeleteId(null);
    }
  };

  if (isLoading && page === 0) {
    return <DashboardContent />;
  }

  return (
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
          Blog Posts
        </Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => router.push('/blog/new')}
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
                  <TableRow
                    key={blog._id}
                    sx={{
                      '&:nth-of-type(even)': {
                        backgroundColor: 'background.default',
                      },
                    }}
                  >
                    <TableCell>
                      <Box
                        component="img"
                        src={blog.thumbnail}
                        sx={{ width: 64, height: 48, borderRadius: 1, objectFit: 'cover', cursor: 'pointer' }}
                        onClick={() => setPreviewImage(blog.thumbnail)}
                      />
                    </TableCell>

                    <TableCell sx={{ fontWeight: 'fontWeightMedium' }}>{blog.title}</TableCell>

                    <TableCell sx={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {blog.description}
                    </TableCell>

                    <TableCell align="right">
                      <IconButton onClick={() => router.push(`/blog/${blog._id}`)} size="small" sx={{ mr: 1 }}>
                        <Iconify icon="solar:pen-bold" />
                      </IconButton>

                      <IconButton onClick={() => setDeleteId(blog._id)} size="small" sx={{ color: 'error.main' }}>
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

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this blog post? This action cannot be undone.</Typography>
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
  );
}
