import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

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
          variant="standard"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAdd} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductModal;