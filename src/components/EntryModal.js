import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Grid,
  Autocomplete,
  Typography,
} from '@mui/material';

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

  const handleSave = () => {
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
      p: 2,
      display: "flex",
      flexDirection: "column",
      gap: 2,
    }}
  >
    {/* Party */}
    <Autocomplete
      options={uniqueParties}
      getOptionLabel={(option) => option.partyName}
      value={uniqueParties.find((p) => p.partyId === selectedParty) || null}
      onChange={(event, newValue) => {
        handlePartySelect(newValue ? newValue.partyId : "");
      }}
      renderInput={(params) => (
        <TextField {...params} label="Party" fullWidth />
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
        <TextField {...params} label="Product" fullWidth />
      )}
    />

    {/* Net Weight */}
    <TextField
      fullWidth
      label="Net Weight (grams)"
      type="number"
      value={netWeight}
      onChange={(e) => setNetWeight(e.target.value)}
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
        label="Tanch"
        type="number"
        value={tanch}
        onChange={(e) => setTanch(e.target.value)}
      />

      <TextField
        fullWidth
        label="Wastage"
        type="number"
        value={wastage}
        onChange={(e) => setWastage(e.target.value)}
      />
    </Box>

    {/* Calculated Value */}
    <TextField
      fullWidth
      label="Calculated Value"
      value={calculatedValue.toFixed(2)}
      InputProps={{
        readOnly: true,
      }}
    />

    {/* Bottom Buttons */}
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        gap: 2,
        mt: "auto",
        pt: 2,
        pb: { xs: 1, sm: 0 },
        borderTop: "1px solid #e0e0e0",
        position: "sticky",
        bottom: 0,
        bgcolor: "background.paper",
        zIndex: 10,
      }}
    >
      <Button onClick={onClose} sx={{ minWidth: 100, minHeight: 44 }}>Cancel</Button>

      <Button variant="contained" onClick={handleSave} sx={{ minWidth: 100, minHeight: 44 }}>
        {isEditing ? "Update" : "Save"}
      </Button>
    </Box>
  </Box>
);
};

export default EntryModal;