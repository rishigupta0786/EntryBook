import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

const ProductModal = ({ isOpen, onClose, onAddProduct }) => {
  const [productName, setProductName] = useState('');

  const handleAdd = () => {
    onAddProduct(productName);
    setProductName('');
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Add New Product</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="productName"
          label="Product Name"
          type="text"
          fullWidth
          variant="outlined"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleAdd}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductModal;