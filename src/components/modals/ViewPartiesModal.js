import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  IconButton,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

const ViewPartiesModal = ({
  isViewPartiesOpen,
  setIsViewPartiesOpen,
  parties,
  products,
  partySearch,
  setPartySearch,
  handleEditPartyClick,
  handleDeleteParty,
}) => {
  return (
    <Dialog
      open={isViewPartiesOpen}
      onClose={() => {
        setIsViewPartiesOpen(false);
      }}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          width: { xs: '95vw', sm: '80vw', md: '750px' },
          maxHeight: { xs: '90vh', sm: '85vh' },
          m: { xs: 1.5, sm: 2 },
        }
      }}
    >
      <DialogTitle sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>All Parties</DialogTitle>
      <DialogContent sx={{ overflowY: 'auto' }}>
        <TextField
          autoFocus
          margin="dense"
          label="Search Parties"
          type="text"
          fullWidth
          variant="standard"
          onChange={(e) => setPartySearch(e.target.value)}
        />

        {/* Card Layout for Mobile */}
        <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexDirection: 'column', gap: 2, mt: 2 }}>
          {parties
            .filter((party) =>
              party.partyName
                .toLowerCase()
                .includes(partySearch.toLowerCase())
            )
            .map((party) => (
              <Paper
                key={party.partyId}
                elevation={1}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {party.partyName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    ID: {party.partyId}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                    Assigned Products:
                  </Typography>
                  {party.products.length === 0 ? (
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                      No products assigned
                    </Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {party.products.map((p) => {
                        const prodName = products.find((prod) => prod.productId === p.productId)?.productName || 'Unknown Product';
                        return (
                          <Chip
                            key={p.productId}
                            label={`${prodName} (T: ${p.tanch}% | W: ${p.wastage}%)`}
                            size="small"
                            sx={{
                              borderRadius: '16px',
                              bgcolor: '#eff6ff',
                              color: '#1e40af',
                              border: '1px solid #bfdbfe',
                              fontWeight: 600,
                              fontSize: '0.75rem',
                            }}
                          />
                        );
                      })}
                    </Box>
                  )}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, borderTop: '1px solid #f3f4f6', pt: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleEditPartyClick(party)}
                    color="primary"
                    sx={{ minHeight: '44px', minWidth: '44px' }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteParty(party.partyId)}
                    color="error"
                    sx={{ minHeight: '44px', minWidth: '44px' }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Paper>
            ))}
        </Box>

        {/* Table Layout for Tablet and Desktop */}
        <TableContainer component={Paper} sx={{ mt: 2, display: { xs: 'none', sm: 'block' } }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Party ID</strong>
                </TableCell>
                <TableCell>
                  <strong>Party Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Assigned Products</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {parties
                .filter((party) =>
                  party.partyName
                    .toLowerCase()
                    .includes(partySearch.toLowerCase())
                )
                .map((party) => (
                  <TableRow key={party.partyId} hover sx={{ cursor: 'pointer' }}>
                    <TableCell>{party.partyId}</TableCell>
                    <TableCell>{party.partyName}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {party.products.length === 0 ? (
                          <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic', fontSize: '0.85rem' }}>
                            No products assigned
                          </Typography>
                        ) : (
                          party.products.map((p) => {
                            const prodName = products.find((product) => product.productId === p.productId)?.productName || 'Unknown Product';
                            return (
                              <Chip
                                key={p.productId}
                                label={`${prodName}`}
                                size="small"
                                sx={{
                                  borderRadius: '16px',
                                  bgcolor: '#eff6ff',
                                  color: '#1e40af',
                                  border: '1px solid #bfdbfe',
                                  fontWeight: 600,
                                }}
                              />
                            );
                          })
                        )}
                      </Box>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 1,
                        justifyContent: 'flex-end',
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleEditPartyClick(party)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteParty(party.partyId)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: '1px solid #e5e7eb' }}>
        <Button
          onClick={() => {
            setIsViewPartiesOpen(false);
          }}
          sx={{ minHeight: '44px', px: 3 }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewPartiesModal;