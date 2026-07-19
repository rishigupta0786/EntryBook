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
import AddIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import DeleteIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import PartyIcon from '@mui/icons-material/Business';
import ProductIcon from '@mui/icons-material/Inventory2';

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

  const isInvalid = !partyName || !partyName.trim();

  const handleSave = () => {
    if (isInvalid) return;
    const partyData = {
      partyName: partyName.trim(),
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
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      {/* Section: Party Details */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, borderBottom: '1px solid #F1F5F9', pb: 1 }}>
          <PartyIcon color="primary" fontSize="small" />
          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Party Profile
          </Typography>
        </Box>

        <TextField
          autoFocus
          fullWidth
          label="Party Name *"
          value={partyName}
          onChange={(e) => setPartyName(e.target.value)}
        />
      </Box>

      {/* Section: Assigned Products */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ProductIcon color="primary" fontSize="small" />
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Assign Products
            </Typography>
          </Box>
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={addPartyProductRow}
            sx={{
              borderRadius: '8px',
              py: 0.5,
              px: 1.5,
              fontSize: '0.8rem',
            }}
          >
            Add Product
          </Button>
        </Box>

        {/* Product Assignment List */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {partyProducts.map((partyProduct, index) => (
            <Paper
              key={index}
              sx={{
                p: 2.5,
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                bgcolor: '#F8FAFC',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                position: 'relative',
                transition: 'all 0.25s',
                '&:hover': {
                  borderColor: 'primary.light',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
                }
              }}
            >
              {/* Product Select */}
              <FormControl fullWidth>
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
                  sx={{ bgcolor: 'background.paper' }}
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
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
                }}
              >
                <TextField
                  fullWidth
                  label="Tanch (%)"
                  type="number"
                  value={partyProduct.tanch}
                  onChange={(e) =>
                    handlePartyProductChange(index, 'tanch', e.target.value)
                  }
                  sx={{ bgcolor: 'background.paper' }}
                />

                <TextField
                  fullWidth
                  label="Wastage (%)"
                  type="number"
                  value={partyProduct.wastage}
                  onChange={(e) =>
                    handlePartyProductChange(index, 'wastage', e.target.value)
                  }
                  sx={{ bgcolor: 'background.paper' }}
                />
              </Box>

              {/* Remove Row Button */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #E2E8F0', pt: 1.5 }}>
                <Button
                  color="error"
                  size="small"
                  startIcon={<DeleteIcon />}
                  onClick={() => removePartyProductRow(index)}
                  sx={{ borderRadius: '8px' }}
                >
                  Remove Product
                </Button>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* Sticky Bottom Actions Bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
          mt: 'auto',
          pt: 2.5,
          borderTop: '1px solid #E2E8F0',
          position: 'sticky',
          bottom: 0,
          bgcolor: 'background.paper',
          zIndex: 10,
        }}
      >
        <Button onClick={onClose} sx={{ minWidth: 100, borderRadius: '12px' }}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSave} 
          disabled={isInvalid} 
          sx={{ minWidth: 120, borderRadius: '12px', boxShadow: 'none' }}
        >
          {editingParty ? 'Update Party' : 'Save Party'}
        </Button>
      </Box>
    </Box>
  );
};

export default PartyModal;