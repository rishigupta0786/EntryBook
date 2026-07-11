import React, { useState } from 'react';
import { Box, IconButton, Paper, Typography, Autocomplete, TextField, useTheme, useMediaQuery } from '@mui/material';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

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
      headerName: 'Value',
      type: 'number',
      width: 150,
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
      width: 100,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5, py: 1 }}>
          <IconButton
            size="small"
            onClick={() => handleEditClick(params.row)}
            color="primary"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDeleteEntry(params.row.entryDataId, params.row.partyId)}
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
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
    <Paper sx={{ p: { xs: 1.5, sm: 2 }, display: 'flex', flexDirection: 'column', width: '100%', overflow: 'hidden' }}>
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: 2,
        mb: 2
      }}>
        <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' }, fontWeight: 600 }}>
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
          sx={{ width: { xs: '100%', sm: 300 } }}
        />
      </Box>
      <Box sx={{ height: { xs: 400, sm: 500, md: 600 }, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableSelectionOnClick
          getRowId={(row) => row.entryDataId}
          rowHeight={isMobile ? 48 : 52}
          columnHeaderHeight={isMobile ? 44 : 48}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
            columns: {
              columnVisibilityModel: {
                createdOn: false,
                modifiedOn: false,
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
              fontSize: { xs: '0.85rem', sm: '0.9rem' },
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8fafc',
              borderBottom: 'none',
              color: 'text.primary',
              fontSize: { xs: '0.75rem', sm: '0.8rem' },
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