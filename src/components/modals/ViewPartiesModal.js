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
} from '@mui/material';

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
    >
      <DialogTitle>All Parties</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Search Parties"
          type="text"
          fullWidth
          variant="standard"
          onChange={(e) => setPartySearch(e.target.value)}
        />
        <TableContainer component={Paper} sx={{ mt: 2 }}>
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
                      {party.products
                        .map(
                          (p) =>
                            products.find(
                              (product) => product.productId === p.productId
                            )?.productName
                        )
                        .join(', ')}
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
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleEditPartyClick(party)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteParty(party.partyId)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setIsViewPartiesOpen(false);
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewPartiesModal;