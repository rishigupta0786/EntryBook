import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

const ProductModal = ({ isOpen, onClose, onAddProduct }) => {
  const [productName, setProductName] = useState('');

  const handleAdd = () => {
    onAddProduct(productName);
    setProductName('');
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Add New Product
      </Typography>
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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button onClick={onClose} sx={{ mr: 1 }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleAdd}>
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default ProductModal;