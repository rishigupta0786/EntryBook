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
    >
      <DialogTitle>All Products</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Search Products"
          type="text"
          fullWidth
          variant="standard"
          onChange={(e) => setProductSearch(e.target.value)}
        />
        <TableContainer component={Paper}>
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
      <DialogActions>
        <Button onClick={() => setIsViewProductsOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewProductsModal;