import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Toolbar,
  Grid,
  Drawer,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ProductModal from '../components/ProductModal';
import PartyModal from '../components/PartyModal';
import DashboardStats from '../components/dashboard/DashboardStats';
import AddActionButtons from '../components/dashboard/AddActionButtons';
import RecentEntriesTable from '../components/dashboard/RecentEntriesTable';
import SideNavigation from '../components/layout/SideNavigation';
import Header from '../components/layout/Header';
import ViewProductsModal from '../components/modals/ViewProductsModal';
import ViewPartiesModal from '../components/modals/ViewPartiesModal';
import EntryPartyDrawer from '../components/modals/EntryPartyDrawer';
import EntryModal from '../components/EntryModal';
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
        const res = await fetch(`/api/entries/${editingEntry.entryDataId}?partyId=${editingEntry.partyId}`, {
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

  const handleDeleteEntry = async (id, partyId) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        const res = await fetch(`/api/entries/${id}?partyId=${partyId}`, {
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
    setIsViewPartiesOpen(false);
  };

  const closePartyModal = () => {
    setIsPartyModalOpen(false);
    setEditingParty(null);
  };

  const closeModal = () => {
    setIsEntryModalOpen(false);
    setEditingEntry(null);
  };





  return (
    <Box sx={{ display: 'flex' }}>
      <Header drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle} />
      <SideNavigation
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        setIsViewPartiesOpen={setIsViewPartiesOpen}
        setIsViewProductsOpen={setIsViewProductsOpen}
      />
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onAddProduct={handleAddProduct}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1.5, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: '#f5f5f5',
          minWidth: 0, // Prevent flex items from overflowing
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 2 } }}>
          <Grid container spacing={3}>
            <DashboardStats entries={entries} parties={parties} products={products} />
          </Grid>
          <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid item xs={12}>
              <AddActionButtons
                setEditingEntry={setEditingEntry}
                setIsEntryModalOpen={setIsEntryModalOpen}
                setIsPartyModalOpen={setIsPartyModalOpen}
                setIsProductModalOpen={setIsProductModalOpen}
              />
            </Grid>
            <Grid item xs={12}>
              <RecentEntriesTable
                entries={entries}
                parties={parties}
                products={products}
                handleEditClick={handleEditClick}
                handleDeleteEntry={handleDeleteEntry}
              />
            </Grid>
          </Grid>
        </Container>

        {/* Right-side sliding drawer */}
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
            </Box>
          </Box>
        </Drawer>
      </Box>
      <ViewProductsModal
        isViewProductsOpen={isViewProductsOpen}
        setIsViewProductsOpen={setIsViewProductsOpen}
        products={products}
        productSearch={productSearch}
        setProductSearch={setProductSearch}
        handleDeleteProduct={handleDeleteProduct}
      />
      <ViewPartiesModal
        isViewPartiesOpen={isViewPartiesOpen}
        setIsViewPartiesOpen={setIsViewPartiesOpen}
        parties={parties}
        products={products}
        partySearch={partySearch}
        setPartySearch={setPartySearch}
        handleEditPartyClick={handleEditPartyClick}
        handleDeleteParty={handleDeleteParty}
      />
    </Box>
  );
};

export default HomePage;