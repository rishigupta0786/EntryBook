import React, { useState, useEffect } from 'react';
import ProductModal from '../components/ProductModal';
import PartyModal from '../components/PartyModal';
import EntryModal from '../components/EntryModal';
import { Container, Typography, Button, Box, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [parties, setParties] = useState([]);
  const [entries, setEntries] = useState([]);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isPartyModalOpen, setIsPartyModalOpen] = useState(false);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

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

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        EntryBook
      </Typography>
      <Box sx={{ mb: 4 }}>
        <Button variant="contained" onClick={() => { setEditingEntry(null); setIsEntryModalOpen(true); }} sx={{ mr: 2 }}>Add Entry</Button>
        <Button variant="outlined" onClick={() => setIsPartyModalOpen(true)} sx={{ mr: 2 }}>Add Party</Button>
        <Button variant="outlined" onClick={() => setIsProductModalOpen(true)}>Add Product</Button>
      </Box>

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onAddProduct={handleAddProduct}
      />

      <PartyModal
        isOpen={isPartyModalOpen}
        onClose={() => setIsPartyModalOpen(false)}
        onAddParty={handleAddParty}
        products={products}
      />

      <EntryModal
        isOpen={isEntryModalOpen}
        onClose={closeModal}
        onAddEntry={handleAddOrUpdateEntry}
        parties={parties}
        products={products}
        entryData={editingEntry}
      />

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
          getRowId={(row) => row.entryDataId}
        />
      </Box>
    </Container>
  );
};

export default HomePage;