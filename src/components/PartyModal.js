import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';

const PartyModal = ({
  isOpen,
  onClose,
  onAddParty,
  onUpdateParty,
  products,
  editingParty,
}) => {
  const [partyName, setPartyName] = useState('');
  const [partyProducts, setPartyProducts] = useState([
    { productId: '', tanch: '', wastage: '' },
  ]);

  useEffect(() => {
    if (editingParty) {
      setPartyName(editingParty.partyName);
      setPartyProducts(
        editingParty.products.map((p) => ({
          ...p,
          tanch: p.tanch.toString(),
          wastage: p.wastage.toString(),
        }))
      );
    } else {
      setPartyName('');
      setPartyProducts([{ productId: '', tanch: '', wastage: '' }]);
    }
  }, [editingParty, isOpen]);

  const handleSave = () => {
    const partyData = {
      partyName,
      products: partyProducts.map((p) => ({
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
    setPartyProducts((prev) => [
      { productId: '', tanch: '', wastage: '' },
      ...prev,
    ]);
  };

  const removePartyProductRow = (index) => {
    const updatedPartyProducts = partyProducts.filter((_, i) => i !== index);
    setPartyProducts(updatedPartyProducts);
  };

  if (!isOpen) {
    return null;
  }

  return (
  <Box
    sx={{
      p: 2,
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    {/* Party Name */}
    <TextField
      autoFocus
      fullWidth
      label="Party Name"
      value={partyName}
      onChange={(e) => setPartyName(e.target.value)}
      sx={{ mb: 2 }}
    />

    {/* Add Product */}
    <Button
      startIcon={<AddCircleOutlineOutlinedIcon />}
      onClick={addPartyProductRow}
      sx={{
        alignSelf: 'flex-start',
        mb: 2,
      }}
    >
      Add Product
    </Button>

    {/* Product List */}
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {partyProducts.map((partyProduct, index) => (
        <Paper
          key={index}
          elevation={2}
          sx={{
            p: 2,
            borderRadius: 2,
          }}
        >
          {/* Product */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Product</InputLabel>

            <Select
              value={partyProduct.productId}
              label="Product"
              onChange={(e) =>
                handlePartyProductChange(
                  index,
                  'productId',
                  e.target.value
                )
              }
            >
              {products.map((p) => (
                <MenuItem key={p.productId} value={p.productId}>
                  {p.productName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Tanch + Wastage */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mb: 2,
            }}
          >
            <TextField
              fullWidth
              label="Tanch"
              type="number"
              value={partyProduct.tanch}
              onChange={(e) =>
                handlePartyProductChange(index, 'tanch', e.target.value)
              }
            />

            <TextField
              fullWidth
              label="Wastage"
              type="number"
              value={partyProduct.wastage}
              onChange={(e) =>
                handlePartyProductChange(index, 'wastage', e.target.value)
              }
            />
          </Box>

          {/* Delete */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              color="error"
              startIcon={<RemoveCircleOutlineOutlinedIcon />}
              onClick={() => removePartyProductRow(index)}
            >
              Delete
            </Button>
          </Box>
        </Paper>
      ))}
    </Box>

    {/* Bottom Buttons */}
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 1,
        mt: 3,
      }}
    >
      <Button onClick={onClose}>Cancel</Button>

      <Button variant="contained" onClick={handleSave}>
        {editingParty ? 'Update' : 'Save'}
      </Button>
    </Box>
  </Box>
);
};

export default PartyModal;