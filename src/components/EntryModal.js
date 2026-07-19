import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Grid,
  Autocomplete,
  Typography,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ProductIcon from '@mui/icons-material/Category';
import ScaleIcon from '@mui/icons-material/Balance';
import CalcIcon from '@mui/icons-material/Calculate';

const EntryModal = ({
  isOpen,
  onClose,
  onAddEntry,
  parties,
  products,
  entryData,
}) => {
  const [selectedParty, setSelectedParty] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [netWeight, setNetWeight] = useState('');
  const [tanch, setTanch] = useState('');
  const [wastage, setWastage] = useState('');

  const isEditing = entryData != null;

  useEffect(() => {
    if (!isOpen) return;

    if (isEditing) {
      setSelectedParty(entryData.partyId || '');
      setSelectedProduct(entryData.productId || '');
      setNetWeight(entryData.netWeight || '');
      setTanch(entryData.tanch || '');
      setWastage(entryData.wastage || '');
    } else {
      setSelectedParty('');
      setSelectedProduct('');
      setNetWeight('');
      setTanch('');
      setWastage('');
    }
  }, [isOpen, entryData, isEditing]);

  const calculatedValue =
    ((parseFloat(netWeight) || 0) *
      ((parseFloat(tanch) || 0) + (parseFloat(wastage) || 0))) /
    100;

  const isFormInvalid = !selectedParty || !selectedProduct || !netWeight || parseFloat(netWeight) <= 0;

  const handleSave = () => {
    if (isFormInvalid) return;
    onAddEntry({
      partyId: Number(selectedParty),
      productId: Number(selectedProduct),
      netWeight: parseFloat(netWeight) || 0,
      tanch: parseFloat(tanch) || 0,
      wastage: parseFloat(wastage) || 0,
      calculatedValue,
    });
  };

  const handlePartySelect = (partyId) => {
    setSelectedParty(partyId);

    if (!selectedProduct) return;

    const party = parties.find((p) => p.partyId === Number(partyId));

    const productInfo = party?.products?.find(
      (p) => p.productId === Number(selectedProduct)
    );

    setTanch(productInfo?.tanch || '0');
    setWastage(productInfo?.wastage || '0');
  };

  const handleProductSelect = (productId) => {
    setSelectedProduct(productId);

    if (!selectedParty) return;

    const party = parties.find((p) => p.partyId === Number(selectedParty));

    const productInfo = party?.products?.find(
      (p) => p.productId === Number(productId)
    );

    setTanch(productInfo?.tanch || '0');
    setWastage(productInfo?.wastage || '0');
  };

  const uniqueParties = Array.isArray(parties)
    ? [...new Map(parties.map((item) => [item.partyName, item])).values()]
    : [];

  if (!isOpen) {
    return null;
  }

  return (
    <Box
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* Section: Entity Association */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, borderBottom: '1px solid #F1F5F9', pb: 1 }}>
          <PersonIcon color="primary" fontSize="small" />
          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Entity Details
          </Typography>
        </Box>

        {/* Party */}
        <Autocomplete
          options={uniqueParties}
          getOptionLabel={(option) => option.partyName}
          value={uniqueParties.find((p) => p.partyId === selectedParty) || null}
          onChange={(event, newValue) => {
            handlePartySelect(newValue ? newValue.partyId : "");
          }}
          renderInput={(params) => (
            <TextField {...params} label="Select Party *" fullWidth />
          )}
        />

        {/* Product */}
        <Autocomplete
          options={products}
          getOptionLabel={(option) => option.productName}
          value={products.find((p) => p.productId === selectedProduct) || null}
          onChange={(event, newValue) => {
            handleProductSelect(newValue ? newValue.productId : "");
          }}
          renderInput={(params) => (
            <TextField {...params} label="Select Product *" fullWidth />
          )}
        />
      </Box>

      {/* Section: Weight & Valuation */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, borderBottom: '1px solid #F1F5F9', pb: 1 }}>
          <ScaleIcon color="primary" fontSize="small" />
          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Weight & Parameters
          </Typography>
        </Box>

        {/* Net Weight */}
        <TextField
          fullWidth
          label="Net Weight (grams) *"
          type="number"
          value={netWeight}
          onChange={(e) => setNetWeight(e.target.value)}
          error={netWeight !== '' && parseFloat(netWeight) <= 0}
          helperText={netWeight !== '' && parseFloat(netWeight) <= 0 ? "Net weight must be greater than 0" : ""}
        />

        {/* Tanch + Wastage */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            label="Tanch (%)"
            type="number"
            value={tanch}
            onChange={(e) => setTanch(e.target.value)}
          />

          <TextField
            fullWidth
            label="Wastage (%)"
            type="number"
            value={wastage}
            onChange={(e) => setWastage(e.target.value)}
          />
        </Box>
      </Box>

      {/* Section: Calculation Output Card */}
      <Box 
        sx={{ 
          p: 2.5, 
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.04) 0%, rgba(14, 165, 233, 0.04) 100%)',
          border: '1px dashed rgba(99, 102, 241, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.5,
          mt: 1
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <CalcIcon sx={{ color: 'primary.main', fontSize: '1.1rem' }} />
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Calculated Value (g)
          </Typography>
        </Box>
        <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: '-0.02em' }}>
          {calculatedValue.toFixed(2)}
        </Typography>
      </Box>

      {/* Bottom Actions Sticky bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          mt: "auto",
          pt: 2.5,
          borderTop: "1px solid #E2E8F0",
          position: "sticky",
          bottom: 0,
          bgcolor: "background.paper",
          zIndex: 10,
        }}
      >
        <Button onClick={onClose} sx={{ minWidth: 100, borderRadius: '12px' }}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSave} 
          disabled={isFormInvalid} 
          sx={{ minWidth: 120, borderRadius: '12px', boxShadow: 'none' }}
        >
          {isEditing ? "Update" : "Save Entry"}
        </Button>
      </Box>
    </Box>
  );
};

export default EntryModal;