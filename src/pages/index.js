import React, { useState, useEffect } from 'react';
import ProductModal from '../components/ProductModal';
import PartyModal from '../components/PartyModal';
import EntryModal from '../components/EntryModal';
import { Container, Typography, Button, Box, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Menu, MenuItem, TextField } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [parties, setParties] = useState([]);
  const [entries, setEntries] = useState([]);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isPartyModalOpen, setIsPartyModalOpen] = useState(false);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isViewPartiesOpen, setIsViewPartiesOpen] = useState(false);
  const [isViewProductsOpen, setIsViewProductsOpen] = useState(false);
  const [selectedParty, setSelectedParty] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [editingParty, setEditingParty] = useState(null);
  const [menu, setMenu] = useState({ anchorEl: null, items: [] });
  const [productSearch, setProductSearch] = useState('');
  const [partySearch, setPartySearch] = useState('');

  const handleMenuClick = (event, items) => {
    setMenu({ anchorEl: event.currentTarget, items });
  };

  const handleMenuClose = () => {
    setMenu({ anchorEl: null, items: [] });
  };

  const fetchData = async () => {
    try {
      const [productsRes, partiesRes, entriesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/parties'),
        fetch('/api/entries'),
      ]);
      const [productsData, partiesData, entriesData] = await Promise.all([
        productsRes.json(),
        partiesRes.json(),
        entriesRes.json(),
      ]);
      setProducts(productsData);
      setParties(partiesData);
      setEntries(entriesData);
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    const isProductInUse = parties.some(party => party.products.some(p => p.productId === productId));
    if (isProductInUse) {
      alert('This product is assigned to a party and cannot be deleted. Please remove it from the party first.');
      return;
    }

    try {
      const res = await fetch(`/api/products?productId=${productId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchData();
      } else {
        const errorData = await res.json();
        alert(`Error deleting product: ${errorData.message}`);
      }
    } catch (error) {
      alert('A critical error occurred while deleting the product.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddProduct = async (productName) => {
    try {
      console.log('Attempting to send POST request to /api/products...');
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName }),
      });


      if (res.ok) {
        await fetchData(); // Re-fetch data to show the new product
        setIsProductModalOpen(false);
      } else {
        const errorData = await res.json();
        alert(`Error saving product: ${errorData.message}`);
      }
    } catch (error) {
      alert('A critical error occurred. Please check the browser console.');
    }
  };

  const handleAddParty = async (partyData) => {
    try {
      const res = await fetch('/api/parties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partyData),
      });
      if (res.ok) {
        await fetchData(); // Re-fetch data
        setIsPartyModalOpen(false);
      } else {
        const errorData = await res.json();
        alert(`Error adding party: ${errorData.message}`);
      }
    } catch (error) {
      alert('A critical error occurred while adding the party.');
    }
  };

  const handleAddOrUpdateEntry = async (entry) => {
    if (editingEntry) {
      // Update existing entry
      try {
        const res = await fetch(`/api/entries/${editingEntry.entryDataId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry),
        });
        if (res.ok) {
          await fetchData(); // Re-fetch all data to reflect changes
          setIsEntryModalOpen(false);
          setEditingEntry(null);
        }
      } catch (error) {
        console.error("Failed to update entry:", error);
      }
    } else {
      // Add new entry
      try {
        const res = await fetch('/api/entries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry),
        });
        if (res.ok) {
          await fetchData(); // Re-fetch all data
          setIsEntryModalOpen(false);
        }
      } catch (error) {
        console.error("Failed to add entry:", error);
      }
    }
  };

  const handleEditClick = (entry) => {
    setEditingEntry(entry);
    setIsEntryModalOpen(true);
  };

  const handleDeleteEntry = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        const res = await fetch(`/api/entries/${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          await fetchData(); // Re-fetch data
        }
      } catch (error) {
        console.error("Failed to delete entry:", error);
      }
    }
  };

  const handleUpdateParty = async (partyData) => {
    try {
      const res = await fetch('/api/parties', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partyData),
      });
      if (res.ok) {
        await fetchData(); // Re-fetch data
        setIsPartyModalOpen(false);
        setEditingParty(null);
      } else {
        const errorData = await res.json();
        alert(`Error updating party: ${errorData.message}`);
      }
    } catch (error) {
      alert('A critical error occurred while updating the party.');
    }
  };

  const handleDeleteParty = async (id) => {
    if (window.confirm('Are you sure you want to delete this party?')) {
      try {
        const res = await fetch(`/api/parties?partyId=${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          await fetchData(); // Re-fetch data
        } else {
          const errorData = await res.json();
          alert(`Error deleting party: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Failed to delete party:", error);
      }
    }
  };

  const handleEditPartyClick = (party) => {
    setEditingParty(party);
    setIsPartyModalOpen(true);
  };

  const closePartyModal = () => {
    setIsPartyModalOpen(false);
    setEditingParty(null);
  };

  const closeModal = () => {
    setIsEntryModalOpen(false);
    setEditingEntry(null);
  };

  const columns = [
    {
      field: 'serialNo',
      headerName: 'S.No.',
      width:80,
      sortable: false,
      filterable: false,
      renderCell: (params) => params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
    },
    {
      field: 'partyName',
      headerName: 'Party Name',
      width: 150,
    },
    {
      field: 'productName',
      headerName: 'Product Name',
      width: 150,
    },
    {
      field: 'netWeight',
      headerName: 'Net Weight (g)',
      type: 'number',
      width: 110,
    },
    {
      field: 'tanch',
      headerName: 'Tanch',
      type: 'number',
      width: 110,
    },
    {
      field: 'wastage',
      headerName: 'Wastage',
      type: 'number',
      width: 110,
    },
    {
      field: 'calculatedValue',
      headerName: 'Calculated Value',
      type: 'number',
      width: 160,
    },
    {
      field: "createdOn",
      headerName: "Created On",
      type: "dateTime",
      width: 180,
      valueGetter: (value) => (value ? new Date(value) : null),
      valueFormatter: (value) =>
        value ? value.toLocaleString() : "",
    },
    {
      field: "modifiedOn",
      headerName: "Modified On",
      type: "dateTime",
      width: 180,
      valueGetter: (value) => (value ? new Date(value) : null),
      valueFormatter: (value) =>
        value ? value.toLocaleString() : "",
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 120,
      renderCell: (params) => (
        <>
          <IconButton size="small" onClick={() => handleEditClick(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton size="small" onClick={() => handleDeleteEntry(params.row.entryDataId)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const rows = entries.map(entry => ({
    ...entry,
    partyName: parties.find(p => p.partyId === entry.partyId)?.partyName || 'N/A',
  productName: products.find(p => p.productId === entry.productId)?.productName || 'N/A',
    ...entry,
  }));

  const partyMenuItems = [
    { label: 'Add Party', action: () => setIsPartyModalOpen(true) },
    { label: 'Edit / View Parties', action: () => setIsViewPartiesOpen(true) },
  ];

  const productMenuItems = [
    { label: 'Add Product', action: () => setIsProductModalOpen(true) },
    { label: 'View Products', action: () => setIsViewProductsOpen(true) },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        EntryBook
      </Typography>
      
      {/* Main Dashboard Card */}
      <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 2, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        {/* Responsive Action Bar - stacks vertically on mobile */}
        <Box sx={{ 
          mb: 4, 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          <Button 
            variant="contained" 
            onClick={() => { setEditingEntry(null); setIsEntryModalOpen(true); }}
            sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
          >
            Add Entry
          </Button>
          <Button 
            variant="outlined" 
            onClick={(e) => handleMenuClick(e, partyMenuItems)}
            sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
          >
            Parties
          </Button>
          <Button 
            variant="outlined" 
            onClick={(e) => handleMenuClick(e, productMenuItems)}
            sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
          >
            Products
          </Button>
          <Menu
            anchorEl={menu.anchorEl}
            open={Boolean(menu.anchorEl)}
            onClose={handleMenuClose}
          >
            {menu.items.map((item, index) => (
              <MenuItem key={index} onClick={() => { item.action(); handleMenuClose(); }}>
                {item.label}
              </MenuItem>
            ))}
          </Menu>
        </Box>

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onAddProduct={handleAddProduct}
      />

      <PartyModal
        isOpen={isPartyModalOpen}
        onClose={closePartyModal}
        onAddParty={handleAddParty}
        onUpdateParty={handleUpdateParty}
        products={products}
        editingParty={editingParty}
      />

      <EntryModal
        isOpen={isEntryModalOpen}
        onClose={closeModal}
        onAddEntry={handleAddOrUpdateEntry}
        parties={parties}
        products={products}
        entryData={editingEntry}
      />

      {/* Entries DataGrid */}
      <Box sx={{ height: { xs: 500, md: 600 }, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
          getRowId={(row) => row.entryDataId}
          components={{ Toolbar: GridToolbar }}
          sx={{
            borderRadius: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            '& .MuiDataGrid-cell': {
              py: 2,
            },
          }}
        />
      </Box>
      </Paper> {/* Close main dashboard card */}
      <Dialog open={isViewProductsOpen} onClose={() => setIsViewProductsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>All Products</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Search Products"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setProductSearch(e.target.value)}
          />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product ID</TableCell>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products
                  .filter((product) =>
                    product.productName.toLowerCase().includes(productSearch.toLowerCase())
                  )
                  .map((product) => (
                    <TableRow key={product.productId}>
                      <TableCell>{product.productId}</TableCell>
                      <TableCell>{product.productName}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleDeleteProduct(product.productId)} size="small">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsViewProductsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>


      {/* View Parties Modal - Responsive Design */}
      <Dialog 
        open={isViewPartiesOpen} 
        onClose={() => { setIsViewPartiesOpen(false); setSelectedParty(null); }} 
        maxWidth="md" 
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            m: { xs: 2, md: 'auto' }, // Margin on mobile, centered on desktop
            width: { xs: 'calc(100% - 32px)', md: '100%' },
            maxHeight: { xs: 'calc(100% - 32px)', md: '90vh' },
          }
        }}
      >
        <DialogTitle sx={{ fontSize: '1.25rem', fontWeight: 600 }}>All Parties</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
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
                    <TableCell><strong>Party ID</strong></TableCell>
                    <TableCell><strong>Party Name</strong></TableCell>
                    <TableCell><strong>Assigned Products</strong></TableCell>
                    <TableCell align="right"><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {parties
                    .filter((party) =>
                      party.partyName.toLowerCase().includes(partySearch.toLowerCase())
                    )
                    .map((party) => (
                      <TableRow key={party.partyId} hover sx={{ cursor: 'pointer' }}>
                        <TableCell>{party.partyId}</TableCell>
                        <TableCell>{party.partyName}</TableCell>
                        <TableCell>
                          {party.products.map(p => products.find(product => product.productId === p.productId)?.productName).join(', ')}
                        </TableCell>
                        <TableCell align="right" sx={{ 
                          display: 'flex', 
                          flexDirection: { xs: 'column', md: 'row' },
                          gap: 1,
                          justifyContent: 'flex-end'
                        }}>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            onClick={() => handleEditPartyClick(party)}
                            sx={{ minHeight: 36 }}
                          >
                            Edit
                          </Button>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            color="error" 
                            onClick={() => handleDeleteParty(party.partyId)}
                            sx={{ minHeight: 36 }}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  {parties.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} align="center">No parties found. Add your first party!</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
        </DialogContent>
        <DialogActions sx={{ 
          position: { xs: 'sticky', md: 'static' },
          bottom: { xs: 0, md: 'auto' },
          bgcolor: 'white',
          p: { xs: 2, md: 1 }
        }}>
          <Button 
            onClick={() => { setIsViewPartiesOpen(false); setSelectedParty(null); }}
            sx={{ minHeight: 44, minWidth: { xs: '100%', md: 'auto' } }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HomePage;