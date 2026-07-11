import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const ViewProductsModal = ({
  isViewProductsOpen,
  setIsViewProductsOpen,
  products,
  productSearch,
  setProductSearch,
  handleDeleteProduct,
}) => {
  return (
    <Dialog
      open={isViewProductsOpen}
      onClose={() => setIsViewProductsOpen(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          width: { xs: '95vw', sm: '480px' },
          maxHeight: { xs: '90vh', sm: '80vh' },
          m: { xs: 1.5, sm: 2 },
        }
      }}
    >
      <DialogTitle sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>All Products</DialogTitle>
      <DialogContent sx={{ overflowY: 'auto' }}>
        <TextField
          autoFocus
          margin="dense"
          label="Search Products"
          type="text"
          fullWidth
          variant="standard"
          onChange={(e) => setProductSearch(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Card Layout for Mobile */}
        <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexDirection: 'column', gap: 1.5 }}>
          {products
            .filter((product) =>
              product.productName
                .toLowerCase()
                .includes(productSearch.toLowerCase())
            )
            .map((product) => (
              <Paper
                key={product.productId}
                elevation={1}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.9rem' }}>
                    {product.productName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    ID: {product.productId}
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => handleDeleteProduct(product.productId)}
                  size="small"
                  color="error"
                  sx={{ minWidth: '44px', minHeight: '44px' }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Paper>
            ))}
        </Box>

        {/* Table Layout for Tablet and Desktop */}
        <TableContainer component={Paper} sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product ID</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products
                .filter((product) =>
                  product.productName
                    .toLowerCase()
                    .includes(productSearch.toLowerCase())
                )
                .map((product) => (
                  <TableRow key={product.productId}>
                    <TableCell>{product.productId}</TableCell>
                    <TableCell>{product.productName}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleDeleteProduct(product.productId)}
                        size="small"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: '1px solid #e5e7eb' }}>
        <Button onClick={() => setIsViewProductsOpen(false)} sx={{ minHeight: '44px', px: 3 }}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewProductsModal;