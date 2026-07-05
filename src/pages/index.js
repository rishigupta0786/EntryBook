import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Dashboard as DashboardIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Group as GroupIcon,
  Inventory2 as Inventory2Icon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import ProductModal from '../components/ProductModal';
import PartyModal from '../components/PartyModal';
import EntryModal from '../components/EntryModal';
import CloseIcon from '@mui/icons-material/Close';
const drawerWidth = 240;

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
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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
      console.error('Failed to fetch initial data:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    const isProductInUse = parties.some((party) =>
      party.products.some((p) => p.productId === productId)
    );
    if (isProductInUse) {
      alert(
        'This product is assigned to a party and cannot be deleted. Please remove it from the party first.'
      );
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
        console.error('Failed to update entry:', error);
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
        console.error('Failed to add entry:', error);
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
        console.error('Failed to delete entry:', error);
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
        console.error('Failed to delete party:', error);
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
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) =>
        params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
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
      width: 150,
    },
    {
      field: 'tanch',
      headerName: 'Tanch',
      type: 'number',
      width: 150,
    },
    {
      field: 'wastage',
      headerName: 'Wastage',
      type: 'number',
      width: 150,
    },
    {
      field: 'calculatedValue',
      headerName: 'Calculated Value',
      type: 'number',
      width: 160,
    },
    {
      field: 'createdOn',
      headerName: 'Created On',
      type: 'dateTime',
      width: 180,
      valueGetter: (value) => (value ? new Date(value) : null),
      valueFormatter: (value) => (value ? value.toLocaleString() : ''),
    },
    {
      field: 'modifiedOn',
      headerName: 'Modified On',
      type: 'dateTime',
      width: 180,
      valueGetter: (value) => (value ? new Date(value) : null),
      valueFormatter: (value) => (value ? value.toLocaleString() : ''),
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
          <IconButton
            size="small"
            onClick={() => handleDeleteEntry(params.row.entryDataId)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const rows = entries.map((entry) => ({
    ...entry,
    partyName:
      parties.find((p) => p.partyId === entry.partyId)?.partyName || 'N/A',
    productName:
      products.find((p) => p.productId === entry.productId)?.productName ||
      'N/A',
  }));

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          EntryBook
        </Typography>
      </Toolbar>
      <List>
        {[
          { text: 'Dashboard', icon: <DashboardIcon /> },
          { text: 'Parties', icon: <GroupIcon /> },
          { text: 'Products', icon: <Inventory2Icon /> },
        ].map((item, index) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => {
                if (item.text === 'Parties') {
                  setIsViewPartiesOpen(true);
                } else if (item.text === 'Products') {
                  setIsViewProductsOpen(true);
                }
              }}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'white',
          color: 'black',
          boxShadow: 'none',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" noWrap component="div">
              Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Welcome back, Rishi 👋
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: '#f5f5f5',
        }}
      >
        <Toolbar />
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Entries
                  </Typography>
                  <Typography variant="h5">{entries.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Parties
                  </Typography>
                  <Typography variant="h5">{parties.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Products
                  </Typography>
                  <Typography variant="h5">{products.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Value
                  </Typography>
                  <Typography variant="h5">
                    {entries
                      .reduce((acc, entry) => acc + entry.calculatedValue, 0)
                      .toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid item xs={12}>
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
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom>
                  Recent Entries
                </Typography>
                <Box sx={{ height: 600, width: '100%' }}>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    getRowId={(row) => row.entryDataId}
                    disableRowSelectionOnClick
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        {/* Right-side sliding drawer */}
        <Drawer
          anchor="right"
          open={isEntryModalOpen || isPartyModalOpen || isProductModalOpen}
          onClose={() => {
            setIsEntryModalOpen(false);
            setIsPartyModalOpen(false);
            setIsProductModalOpen(false);
            setEditingEntry(null);
            setEditingParty(null);
          }}
          PaperProps={{
            sx: {
              width: { xs: '100%', sm: 500, md: 600 },
              maxWidth: '90vw',
            },
          }}
          sx={{
            width: 400,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: 400,
              boxSizing: 'border-box',
            },
            zIndex: (theme) => theme.zIndex.drawer + 1,
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
                  : 'Add New Product'}
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
              {isProductModalOpen && (
                <ProductModal
                  isOpen={isProductModalOpen}
                  onClose={() => setIsProductModalOpen(false)}
                  onAddProduct={handleAddProduct}
                />
              )}
            </Box>
          </Box>
        </Drawer>
      </Box>
      <Dialog
        open={isViewProductsOpen}
        onClose={() => setIsViewProductsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
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
                    product.productName
                      .toLowerCase()
                      .includes(productSearch.toLowerCase())
                  )
                  .map((product) => (
                    <TableRow key={product.productId}>
                      <TableCell>{product.productId}</TableCell>
                      <TableCell>{product.productName}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleDeleteProduct(product.productId)}
                          size="small"
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
        <DialogActions>
          <Button onClick={() => setIsViewProductsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={isViewPartiesOpen}
        onClose={() => {
          setIsViewPartiesOpen(false);
          setSelectedParty(null);
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
              setSelectedParty(null);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HomePage;