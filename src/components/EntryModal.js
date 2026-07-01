import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  Select, MenuItem, FormControl, InputLabel, Grid
} from '@mui/material';

const EntryModal = ({ isOpen, onClose, onAddEntry, parties, products, entryData }) => {
  const [selectedParty, setSelectedParty] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [netWeight, setNetWeight] = useState('');
  const [tanch, setTanch] = useState('');
  const [wastage, setWastage] = useState('');

  const isEditing = entryData != null;

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        setSelectedParty(entryData.partyId || '');
        setSelectedProduct(entryData.productId || '');
        setNetWeight(entryData.netWeight || '');
        setTanch(entryData.tanch || '');
        setWastage(entryData.wastage || '');
      } else {
        // Reset form for new entry
        setSelectedParty('');
        setSelectedProduct('');
        setNetWeight('');
        setTanch('');
        setWastage('');
      }
    }
  }, [isOpen, entryData, isEditing]);

  const calculatedValue = (parseFloat(netWeight) * (parseFloat(tanch) + parseFloat(wastage))) / 100;

  const handleSave = () => {
    onAddEntry({
      partyId: Number(selectedParty),
      productId: Number(selectedProduct),
      netWeight: parseFloat(netWeight) || 0,
      tanch: parseFloat(tanch) || 0,
      wastage: parseFloat(wastage) || 0,
      calculatedValue: calculatedValue || 0,
    });
  };

  const handlePartySelect = (partyId) => {
    setSelectedParty(partyId);
    if (selectedProduct && parties) {
      const party = parties.find(p => p.partyId === Number(partyId));
      if (party && party.products) {
        const productInfo = party.products.find(p => p.productId === Number(selectedProduct));
        if (productInfo) {
          setTanch(productInfo.tanch || '0');
          setWastage(productInfo.wastage || '0');
        } else {
          setTanch('0');
          setWastage('0');
        }
      }
    }
  };

  const handleProductSelect = (productId) => {
    setSelectedProduct(productId);
    if (selectedParty && parties) {
      const party = parties.find(p => p.partyId === Number(selectedParty));
      if (party && party.products) {
        const productInfo = party.products.find(p => p.productId === Number(productId));
        if (productInfo) {
          setTanch(productInfo.tanch || '0');
          setWastage(productInfo.wastage || '0');
        } else {
          setTanch('0');
          setWastage('0');
        }
      }
    }
  };
  
  const uniqueParties = Array.isArray(parties) 
    ? [...new Map(parties.map(item => [item["partyName"], item])).values()] 
    : [];

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? 'Edit Entry' : 'Add New Entry'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Party</InputLabel>
              <Select
                value={selectedParty}
                onChange={(e) => handlePartySelect(e.target.value)}
                label="Party"
              >
                {uniqueParties.map(p => (
                  <MenuItem key={p.partyId} value={p.partyId}>
                    {p.partyName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Product</InputLabel>
              <Select
                value={selectedProduct}
                onChange={(e) => handleProductSelect(e.target.value)}
                label="Product"
              >
                {products.map(p => (
                  <MenuItem key={p.productId} value={p.productId}>
                    {p.productName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Net Weight (grams)"
              type="number"
              fullWidth
              value={netWeight}
              onChange={(e) => setNetWeight(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Tanch"
              type="number"
              fullWidth
              value={tanch}
              onChange={(e) => setTanch(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Wastage"
              type="number"
              fullWidth
              value={wastage}
              onChange={(e) => setWastage(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Calculated Value"
              fullWidth
              value={calculatedValue ? calculatedValue.toFixed(2) : '0'}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">{isEditing ? 'Update' : 'Save'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EntryModal;