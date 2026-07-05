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
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4,
      }}
    >
      <Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingEntry(null);
            setIsEntryModalOpen(true);
            setIsPartyModalOpen(false);
            setIsProductModalOpen(false);
          }}
        >
          Add Entry
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setIsPartyModalOpen(true);
            setIsEntryModalOpen(false);
            setIsProductModalOpen(false);
          }}
          sx={{ ml: 2 }}
        >
          Add Party
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setIsProductModalOpen(true);
            setIsEntryModalOpen(false);
            setIsPartyModalOpen(false);
          }}
          sx={{ ml: 2 }}
        >
          Add Product
        </Button>
      </Box>
    </Box>
  );
};

export default AddActionButtons;