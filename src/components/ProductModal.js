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

  const isInvalid = !productName || !productName.trim();

  const handleAdd = () => {
    if (isInvalid) return;
    onAddProduct(productName.trim());
    setProductName('');
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      fullWidth
      PaperProps={{
        sx: {
          width: { xs: '95vw', sm: '450px' },
          maxHeight: { xs: '90vh', sm: '80vh' },
          m: { xs: 1.5, sm: 2 },
          display: 'flex',
          flexDirection: 'column',
        }
      }}
    >
      <DialogTitle sx={{ pb: 1, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>Add New Product</DialogTitle>
      <DialogContent sx={{ overflowY: 'auto', py: 1 }}>
        <TextField
          autoFocus
          margin="dense"
          id="productName"
          label="Product Name *"
          type="text"
          fullWidth
          variant="outlined"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
        <Button onClick={onClose} sx={{ minWidth: 80, minHeight: 44 }}>Cancel</Button>
        <Button variant="contained" onClick={handleAdd} disabled={isInvalid} sx={{ minWidth: 80, minHeight: 44 }}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductModal;