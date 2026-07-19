import React, { useState, useEffect } from 'react';
import {
  getProducts, getParties, getEntries,
  addProduct, deleteProduct,
  addParty, updateParty, deleteParty,
  addEntry, updateEntry, deleteEntry
} from '../utils/storage';
import {
  Box,
  Container,
  Toolbar,
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
      const productsData = await getProducts();
      const partiesData = await getParties();
      const entriesData = await getEntries();
      setProducts(productsData);
      setParties(partiesData);
      setEntries(entriesData);
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    const isProductInUse = parties.some((party) =>
      party.products && party.products.some((p) => p.productId === productId)
    );
    if (isProductInUse) {
      alert('This product is assigned to a party and cannot be deleted. Please remove it from the party first.');
      return;
    }

    try {
      await deleteProduct(productId);
      await fetchData();
    } catch (error) {
      alert(`Error deleting product: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddProduct = async (productName) => {
    try {
      await addProduct(productName);
      await fetchData();
      setIsProductModalOpen(false);
    } catch (error) {
      alert(`Error saving product: ${error.message}`);
    }
  };

  const handleAddParty = async (partyData) => {
    try {
      await addParty(partyData);
      await fetchData();
      setIsPartyModalOpen(false);
    } catch (error) {
      alert(`Error adding party: ${error.message}`);
    }
  };

  const handleAddOrUpdateEntry = async (entry) => {
    if (editingEntry) {
      try {
        await updateEntry(editingEntry.entryDataId, editingEntry.partyId, entry);
        await fetchData();
        setIsEntryModalOpen(false);
        setEditingEntry(null);
      } catch (error) {
        console.error('Failed to update entry:', error);
        alert(`Failed to update entry: ${error.message}`);
      }
    } else {
      try {
        await addEntry(entry);
        await fetchData();
        setIsEntryModalOpen(false);
      } catch (error) {
        console.error('Failed to add entry:', error);
        alert(`Failed to add entry: ${error.message}`);
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
        await deleteEntry(id, partyId);
        await fetchData();
      } catch (error) {
        console.error('Failed to delete entry:', error);
      }
    }
  };

  const handleUpdateParty = async (partyData) => {
    try {
      await updateParty(partyData.partyId || editingParty.partyId, partyData);
      await fetchData();
      setIsPartyModalOpen(false);
      setEditingParty(null);
    } catch (error) {
      alert(`Error updating party: ${error.message}`);
    }
  };

  const handleDeleteParty = async (id) => {
    if (window.confirm('Are you sure you want to delete this party?')) {
      try {
        await deleteParty(id);
        await fetchData();
      } catch (error) {
        console.error('Failed to delete party:', error.message);
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
          p: { xs: 1.5, sm: 3.5 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: 'background.default',
          minWidth: 0, // Prevent flex items from overflowing
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 2 } }}>
          <Box sx={{ mb: { xs: 2.5, sm: 3 } }}>
            <DashboardStats entries={entries} parties={parties} products={products} />
          </Box>
          <AddActionButtons
            setEditingEntry={setEditingEntry}
            setIsEntryModalOpen={setIsEntryModalOpen}
            setIsPartyModalOpen={setIsPartyModalOpen}
            setIsProductModalOpen={setIsProductModalOpen}
          />
          <RecentEntriesTable
            entries={entries}
            parties={parties}
            products={products}
            handleEditClick={handleEditClick}
            handleDeleteEntry={handleDeleteEntry}
            selectedParty={selectedParty}
          />
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
          PaperProps={{
            sx: {
              width: { xs: '100%', sm: 500, md: 600 },
              maxWidth: '100vw',
              borderLeft: '1px solid',
              borderColor: 'divider',
              boxShadow: '-10px 0 40px rgba(0,0,0,0.04)',
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