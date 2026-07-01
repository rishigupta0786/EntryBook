import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  IconButton, Select, MenuItem, FormControl, InputLabel 
} from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
const PartyModal = ({ isOpen, onClose, onAddParty, onUpdateParty, products, editingParty }) => {
  const [partyName, setPartyName] = useState('');
  const [partyProducts, setPartyProducts] = useState([{ productId: '', tanch: '', wastage: '' }]);

  useEffect(() => {
    if (editingParty) {
      setPartyName(editingParty.partyName);
      setPartyProducts(editingParty.products.map(p => ({
        ...p,
        tanch: p.tanch.toString(),
        wastage: p.wastage.toString()
      })));
    } else {
      setPartyName('');
      setPartyProducts([{ productId: '', tanch: '', wastage: '' }]);
    }
  }, [editingParty]);

  const handleSave = () => {
    const partyData = {
      partyName,
      products: partyProducts.map(p => ({
        ...p,
        tanch: parseFloat(p.tanch) || 0,
        wastage: parseFloat(p.wastage) || 0,
      })),
    };
    
    if (editingParty) {
      onUpdateParty({ ...partyData, partyId: editingParty.partyId });
    } else {
      onAddParty(partyData);
    }
    
    // Reset form
    setPartyName('');
    setPartyProducts([{ productId: '', tanch: '', wastage: '' }]);
  };

  const handlePartyProductChange = (index, field, value) => {
    const updatedPartyProducts = [...partyProducts];
    updatedPartyProducts[index][field] = value;
    setPartyProducts(updatedPartyProducts);
  };

  const addPartyProductRow = () => {
    setPartyProducts([...partyProducts, { productId: '', tanch: '', wastage: '' }]);
  };

  const removePartyProductRow = (index) => {
    const updatedPartyProducts = partyProducts.filter((_, i) => i !== index);
    setPartyProducts(updatedPartyProducts);
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          m: { xs: 2, md: 'auto' },
          width: { xs: 'calc(100% - 32px)', md: '100%' },
          maxHeight: { xs: 'calc(100% - 32px)', md: '90vh' },
        }
      }}
    >
      <DialogTitle sx={{ fontSize: '1.25rem', fontWeight: 600 }}>{editingParty ? 'Edit Party' : 'Add New Party'}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <TextField
          autoFocus
          margin="dense"
          id="partyName"
          label="Party Name"
          type="text"
          fullWidth
          variant="outlined"
          value={partyName}
          onChange={(e) => setPartyName(e.target.value)}
          sx={{ mb: 3, mt: 1 }}
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Tanch</TableCell>
                <TableCell>Wastage</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {partyProducts.map((partyProduct, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <FormControl fullWidth size="small">
                      <InputLabel>Product</InputLabel>
                      <Select
                        value={partyProduct.productId}
                        onChange={(e) => handlePartyProductChange(index, 'productId', e.target.value)}
                        label="Product"
                      >
                        {products.map(p => (
                          <MenuItem key={p.productId} value={p.productId}>
                            {p.productName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      placeholder="Tanch"
                      value={partyProduct.tanch}
                      onChange={(e) => handlePartyProductChange(index, 'tanch', e.target.value)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      placeholder="Wastage"
                      value={partyProduct.wastage}
                      onChange={(e) => handlePartyProductChange(index, 'wastage', e.target.value)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => removePartyProductRow(index)} color="warning">
                      <RemoveCircleOutlineOutlinedIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          startIcon={<AddCircleOutlineOutlinedIcon />}
          onClick={addPartyProductRow}
          sx={{ mt: 2 }}
        >
          Add Product
        </Button>
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
          onClick={handleSave} 
          variant="contained"
          sx={{ minHeight: 44, minWidth: { xs: '100%', md: 'auto' } }}
        >
          {editingParty ? 'Update' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PartyModal;