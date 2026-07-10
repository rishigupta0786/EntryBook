import React, { useState } from 'react';
import { Box, IconButton, Paper, Typography, Autocomplete, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

const RecentEntriesTable = ({
  entries,
  parties,
  products,
  handleEditClick,
  handleDeleteEntry,
}) => {
  const [selectedParty, setSelectedParty] = useState(null);
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
          <IconButton
            size="small"
            onClick={() => handleEditClick(params.row)}
            color="primary"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDeleteEntry(params.row.entryDataId, params.row.partyId)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const filteredEntries = selectedParty
    ? entries.filter((e) => e.partyId === selectedParty.partyId)
    : [];

  const rows = filteredEntries.map((entry) => ({
    ...entry,
    partyName:
      parties.find((p) => p.partyId === entry.partyId)?.partyName || 'N/A',
    productName:
      products.find((p) => p.productId === entry.productId)?.productName ||
      'N/A',
  }));

  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Recent Entries
        </Typography>
        <Autocomplete
          options={parties}
          getOptionLabel={(option) => option.partyName}
          value={selectedParty}
          onChange={(event, newValue) => {
            setSelectedParty(newValue);
          }}
          renderInput={(params) => <TextField {...params} label="Select Party" size="small" />}
          sx={{ width: 300 }}
        />
      </Box>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableSelectionOnClick
          getRowId={(row) => row.entryDataId}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10]}
          showToolbar
          slotProps={{
            toolbar: {
              csvOptions: {
                fileName: "entries",
              },
            },
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #f0f0f0',
              color: 'text.secondary',
              fontSize: '0.95rem',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8fafc',
              borderBottom: 'none',
              color: 'text.primary',
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 700,
            },
            '& .MuiDataGrid-virtualScroller': {
              backgroundColor: '#ffffff',
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: 'none',
              backgroundColor: '#f8fafc',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#f1f5f9',
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default RecentEntriesTable;