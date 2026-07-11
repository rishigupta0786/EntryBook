import React from 'react';
import { Box, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const AddActionButtons = ({
  setEditingEntry,
  setIsEntryModalOpen,
  setIsPartyModalOpen,
  setIsProductModalOpen,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        width: { xs: '90vw', sm: '100%', md: '72vw' },
        gap: { xs: '3vw', sm: 2, md: '3vw' },
        mb: { xs: 2, sm: 4 },
      }}
    >
      <Button
        onClick={() => {
          setEditingEntry(null);
          setIsEntryModalOpen(true);
          setIsPartyModalOpen(false);
          setIsProductModalOpen(false);
        }}
        sx={{ 
          flex: 1,
          minWidth: 0,
          fontSize: { xs: '0.72rem', sm: '0.85rem' },
          px: { xs: 0.5, sm: 2 },
          color: 'white',
          background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
          boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)',
          textTransform: 'none',
          fontWeight: 600,
          minHeight: '44px',
          borderRadius: 2,
          '&:hover': {
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            boxShadow: '0 6px 16px rgba(14, 165, 233, 0.35)',
          }
        }}
      >
        Add Entry
      </Button>
      <Button
        onClick={() => {
          setIsPartyModalOpen(true);
          setIsEntryModalOpen(false);
          setIsProductModalOpen(false);
        }}
        sx={{ 
          flex: 1,
          minWidth: 0,
          fontSize: { xs: '0.72rem', sm: '0.85rem' },
          px: { xs: 0.5, sm: 2 },
          color: 'white',
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
          textTransform: 'none',
          fontWeight: 600,
          minHeight: '44px',
          borderRadius: 2,
          '&:hover': {
            background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
            boxShadow: '0 6px 16px rgba(99, 102, 241, 0.35)',
          }
        }}
      >
        Add Party
      </Button>
      <Button
        onClick={() => {
          setIsProductModalOpen(true);
          setIsEntryModalOpen(false);
          setIsPartyModalOpen(false);
        }}
        sx={{ 
          flex: 1,
          minWidth: 0,
          fontSize: { xs: '0.72rem', sm: '0.85rem' },
          px: { xs: 0.5, sm: 2 },
          color: 'white',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
          textTransform: 'none',
          fontWeight: 600,
          minHeight: '44px',
          borderRadius: 2,
          '&:hover': {
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            boxShadow: '0 6px 16px rgba(16, 185, 129, 0.35)',
          }
        }}
      >
        Add Product
      </Button>
    </Box>
  );
};

export default AddActionButtons;