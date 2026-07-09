import React from 'react';
import { Box, IconButton, Paper, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

const RecentEntriesTable = ({
  entries,
  parties,
  products,
  handleEditClick,
  handleDeleteEntry,
}) => {
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
            onClick={() => handleDeleteEntry(params.row.entryDataId)}
            color="error"
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

  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        Recent Entries
      </Typography>
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
            borderRadius: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            '& .MuiDataGrid-cell': {
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default RecentEntriesTable;