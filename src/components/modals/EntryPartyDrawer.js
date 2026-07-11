import React from 'react';
import {
  Box,
  Drawer,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EntryModal from '../EntryModal';
import PartyModal from '../PartyModal';

const EntryPartyDrawer = ({
  isEntryModalOpen,
  isPartyModalOpen,
  setIsEntryModalOpen,
  setIsPartyModalOpen,
  setIsProductModalOpen,
  editingEntry,
  setEditingEntry,
  editingParty,
  setEditingParty,
  handleAddOrUpdateEntry,
  parties,
  products,
  handleAddParty,
  handleUpdateParty,
}) => {
  return (
    <Drawer
      anchor="right"
      open={isEntryModalOpen || isPartyModalOpen}
      onClose={() => {
        setIsEntryModalOpen(false);
        setIsPartyModalOpen(false);
        setIsProductModalOpen(false);
        setEditingEntry(null);
        setEditingParty(null);
      }}
      transitionDuration={0}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 500, md: 600 },
          maxWidth: '100vw',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box
          sx={{
            p: 2,
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            bgcolor: 'white',
            zIndex: 1,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {isEntryModalOpen
              ? editingEntry
                ? 'Edit Entry'
                : 'Add New Entry'
              : isPartyModalOpen
              ? editingParty
                ? 'Edit Party'
                : 'Add New Party'
              : ''}
          </Typography>
          <IconButton
            onClick={() => {
              setIsEntryModalOpen(false);
              setIsPartyModalOpen(false);
              setIsProductModalOpen(false);
              setEditingEntry(null);
              setEditingParty(null);
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
          {isEntryModalOpen && (
            <EntryModal
              isOpen={isEntryModalOpen}
              onClose={() => {
                setIsEntryModalOpen(false);
                setEditingEntry(null);
              }}
              onAddEntry={handleAddOrUpdateEntry}
              parties={parties}
              products={products}
              entryData={editingEntry}
            />
          )}
          {isPartyModalOpen && (
            <PartyModal
              isOpen={isPartyModalOpen}
              onClose={() => {
                setIsPartyModalOpen(false);
                setEditingParty(null);
              }}
              onAddParty={handleAddParty}
              onUpdateParty={handleUpdateParty}
              products={products}
              editingParty={editingParty}
            />
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default EntryPartyDrawer;