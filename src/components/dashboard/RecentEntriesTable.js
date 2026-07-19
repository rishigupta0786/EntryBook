import React, { useState } from 'react';
import { Box, IconButton, Paper, Typography, Autocomplete, TextField, useTheme, useMediaQuery } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Delete as DeleteIcon, Edit as EditIcon, ReceiptLongOutlined as TableIcon } from '@mui/icons-material';

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
      width: 180,
    },
    {
      field: 'productName',
      headerName: 'Product Name',
      width: 180,
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
      width: 120,
    },
    {
      field: 'wastage',
      headerName: 'Wastage',
      type: 'number',
      width: 120,
    },
    {
      field: 'calculatedValue',
      headerName: 'Value',
      type: 'number',
      width: 150,
      renderCell: (params) => (
        <Typography sx={{ fontWeight: 700, color: 'primary.main', fontSize: '0.9rem' }}>
          {params.value != null ? Number(params.value).toFixed(2) : '-'}
        </Typography>
      ),
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
      headerAlign: 'right',
      align: 'right',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1, py: 1, justifyContent: 'flex-end', width: '100%' }}>
          <IconButton
            size="small"
            onClick={() => handleEditClick(params.row)}
            color="primary"
            sx={{
              bgcolor: 'rgba(99, 102, 241, 0.04)',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: 'rgba(99, 102, 241, 0.1)',
                transform: 'scale(1.05)',
              }
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDeleteEntry(params.row.entryDataId, params.row.partyId)}
            color="error"
            sx={{
              bgcolor: 'rgba(239, 68, 68, 0.04)',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: 'rgba(239, 68, 68, 0.1)',
                transform: 'scale(1.05)',
              }
            }}
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
    <Paper sx={{ 
      p: { xs: 2.5, sm: 3 }, 
      display: 'flex', 
      flexDirection: 'column', 
      width: '100%', 
      overflow: 'hidden',
      borderRadius: '20px',
      border: '1px solid #E2E8F0',
      boxShadow: '0 4px 20px rgba(0,0,0,0.015)',
      animation: 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
      '@keyframes fadeInUp': {
        from: {
          opacity: 0,
          transform: 'translateY(24px)',
        },
        to: {
          opacity: 1,
          transform: 'translateY(0)',
        },
      },
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: 2,
        mb: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ p: 1, borderRadius: '10px', bgcolor: 'rgba(99, 102, 241, 0.08)', color: 'primary.main', display: 'flex' }}>
            <TableIcon />
          </Box>
          <Typography variant="h6" sx={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Recent Entries
          </Typography>
        </Box>
        <Autocomplete
          options={parties}
          getOptionLabel={(option) => option.partyName}
          value={selectedParty}
          onChange={(event, newValue) => {
            setSelectedParty(newValue);
          }}
          renderInput={(params) => <TextField {...params} label="Filter by Party" size="small" />}
          sx={{ width: { xs: '100%', sm: 300 } }}
        />
      </Box>
      <Box sx={{ height: { xs: 400, sm: 500 }, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableSelectionOnClick
          getRowId={(row) => row.entryDataId}
          rowHeight={isMobile ? 50 : 56}
          columnHeaderHeight={isMobile ? 46 : 52}
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
              borderBottom: '1px solid #F1F5F9',
              color: 'text.primary',
              fontSize: '0.9rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#F8FAFC',
              borderBottom: '1px solid #E2E8F0',
              color: 'text.secondary',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 700,
            },
            '& .MuiDataGrid-virtualScroller': {
              backgroundColor: '#ffffff',
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '1px solid #E2E8F0',
              backgroundColor: '#F8FAFC',
            },
            '& .MuiDataGrid-row': {
              transition: 'background-color 0.2s ease-in-out',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#F8FAFC',
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default RecentEntriesTable;