import React from 'react';
import { Box, Button } from '@mui/material';
import { 
  Add as AddIcon,
  PeopleAltOutlined as PartyIcon,
  CategoryOutlined as ProductIcon,
  NoteAddOutlined as EntryIcon
} from '@mui/icons-material';

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
        flexDirection: { xs: 'column', sm: 'row' },
        width: '100%',
        gap: 2,
        mb: { xs: 3, sm: 4 },
      }}
    >
      <Button
        variant="contained"
        startIcon={<EntryIcon />}
        onClick={() => {
          setEditingEntry(null);
          setIsEntryModalOpen(true);
          setIsPartyModalOpen(false);
          setIsProductModalOpen(false);
        }}
        sx={{ 
          flex: 1,
          fontSize: '0.875rem',
          py: 1.5,
          color: 'white',
          background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
          boxShadow: '0 4px 14px rgba(99, 102, 241, 0.2)',
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: '12px',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)',
            boxShadow: '0 6px 20px rgba(99, 102, 241, 0.35)',
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          }
        }}
      >
        Add Entry
      </Button>
      <Button
        variant="contained"
        startIcon={<PartyIcon />}
        onClick={() => {
          setIsPartyModalOpen(true);
          setIsEntryModalOpen(false);
          setIsProductModalOpen(false);
        }}
        sx={{ 
          flex: 1,
          fontSize: '0.875rem',
          py: 1.5,
          color: 'white',
          background: 'linear-gradient(135deg, #0EA5E9 0%, #2563EB 100%)',
          boxShadow: '0 4px 14px rgba(14, 165, 233, 0.2)',
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: '12px',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            background: 'linear-gradient(135deg, #0284C7 0%, #1D4ED8 100%)',
            boxShadow: '0 6px 20px rgba(14, 165, 233, 0.35)',
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          }
        }}
      >
        Add Party
      </Button>
      <Button
        variant="contained"
        startIcon={<ProductIcon />}
        onClick={() => {
          setIsProductModalOpen(true);
          setIsEntryModalOpen(false);
          setIsPartyModalOpen(false);
        }}
        sx={{ 
          flex: 1,
          fontSize: '0.875rem',
          py: 1.5,
          color: 'white',
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.15)',
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: '12px',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            boxShadow: '0 6px 20px rgba(16, 185, 129, 0.3)',
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          }
        }}
      >
        Add Product
      </Button>
    </Box>
  );
};

export default AddActionButtons;