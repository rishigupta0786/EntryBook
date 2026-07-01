import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const ProductModal = ({ isOpen, onClose, onAddProduct }) => {
  const [productName, setProductName] = useState('');

  const handleAdd = () => {
    onAddProduct(productName);
    setProductName('');
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          m: { xs: 2, md: 'auto' },
          width: { xs: 'calc(100% - 32px)', md: '100%' },
          maxHeight: { xs: 'calc(100% - 32px)', md: '90vh' },
        }
      }}
    >
      <DialogTitle sx={{ fontSize: '1.25rem', fontWeight: 600 }}>Add New Product</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
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
      <DialogActions sx={{ 
        position: { xs: 'sticky', md: 'static' },
        bottom: { xs: 0, md: 'auto' },
        bgcolor: 'white',
        p: { xs: 2, md: 1 }
      }}>
        <Button 
          onClick={onClose}
          sx={{ minHeight: 44, minWidth: { xs: '100%', md: 'auto' } }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleAdd} 
          variant="contained"
          sx={{ minHeight: 44, minWidth: { xs: '100%', md: 'auto' } }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductModal;