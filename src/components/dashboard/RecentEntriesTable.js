import React, { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Paper,
  Typography,
  Autocomplete,
  TextField,
  useTheme,
  useMediaQuery,
  Chip,
  Divider,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  ReceiptLongOutlined as TableIcon,
  FilterAlt as FilterIcon,
  CalendarMonth as CalendarIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const RecentEntriesTable = ({
  entries,
  parties,
  products,
  handleEditClick,
  handleDeleteEntry,
  selectedParty: selectedPartyProp = null,
}) => {
  const [selectedParty, setSelectedParty] = useState(selectedPartyProp);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Sync when parent passes a new selected party (e.g. from entry drawer)
  useEffect(() => {
    setSelectedParty(selectedPartyProp);
  }, [selectedPartyProp]);

  // Reset to first page when filters change
  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [selectedParty, startDate, endDate]);

  const columns = [
    {
      field: 'serialNo',
      headerName: 'S.No.',
      width: isMobile ? 60 : 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const visibleIndex = params.api.getRowIndexRelativeToVisibleRows(params.id);
        return paginationModel.page * paginationModel.pageSize + visibleIndex + 1;
      },
    },
    {
      field: 'partyName',
      headerName: 'Party Name',
      width: isMobile ? 130 : 180,
    },
    {
      field: 'productName',
      headerName: 'Product Name',
      width: isMobile ? 130 : 180,
    },
    {
      field: 'netWeight',
      headerName: 'Net Wt (g)',
      type: 'number',
      width: isMobile ? 100 : 150,
    },
    {
      field: 'tanch',
      headerName: 'Tanch',
      type: 'number',
      width: isMobile ? 80 : 120,
    },
    {
      field: 'wastage',
      headerName: 'Wastage',
      type: 'number',
      width: isMobile ? 85 : 120,
    },
    {
      field: 'calculatedValue',
      headerName: 'Value',
      type: 'number',
      width: isMobile ? 90 : 150,
      renderCell: (params) => (
        <Typography sx={{ fontWeight: 700, color: 'primary.main', fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
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
      width: isMobile ? 90 : 120,
      headerAlign: 'right',
      align: 'right',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5, py: 1, justifyContent: 'flex-end', width: '100%' }}>
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

  // Jab tak koi party select na ho, grid blank rahe
  const filteredEntries = !selectedParty
    ? []
    : entries.filter((e) => {
        if (e.partyId !== selectedParty.partyId) return false;
        if (startDate) {
          const entryDate = e.createdOn ? new Date(e.createdOn) : null;
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (!entryDate || entryDate < start) return false;
        }
        if (endDate) {
          const entryDate = e.createdOn ? new Date(e.createdOn) : null;
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (!entryDate || entryDate > end) return false;
        }
        return true;
      });

  const rows = filteredEntries.map((entry) => ({
    ...entry,
    partyName:
      parties.find((p) => p.partyId === entry.partyId)?.partyName || 'N/A',
    productName:
      products.find((p) => p.productId === entry.productId)?.productName ||
      'N/A',
  }));

  const hasActiveFilters = selectedParty || startDate || endDate;

  const clearAllFilters = () => {
    setSelectedParty(null);
    setStartDate('');
    setEndDate('');
  };

  return (
    <Paper sx={{
      p: { xs: 2, sm: 3 },
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
      {/* Header row */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 1.5,
        mb: 2,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ p: 1, borderRadius: '10px', bgcolor: 'rgba(99, 102, 241, 0.08)', color: 'primary.main', display: 'flex' }}>
            <TableIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' }, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Recent Entries
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {rows.length} {rows.length === 1 ? 'entry' : 'entries'} {hasActiveFilters ? '(filtered)' : ''}
            </Typography>
          </Box>
        </Box>
        {hasActiveFilters && (
          <Chip
            label="Clear Filters"
            icon={<CloseIcon sx={{ fontSize: '0.9rem !important' }} />}
            onClick={clearAllFilters}
            size="small"
            variant="outlined"
            color="primary"
            sx={{ fontWeight: 600, borderRadius: '8px', cursor: 'pointer' }}
          />
        )}
      </Box>

      {/* Filter row */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
        gap: { xs: 1.5, sm: 2 },
        mb: 2,
        p: { xs: 1.5, sm: 2 },
        bgcolor: '#F8FAFC',
        borderRadius: '14px',
        border: '1px solid #E2E8F0',
      }}>
        {/* Party filter */}
        <Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
            Filter by Party
          </Typography>
          <Autocomplete
            options={parties}
            getOptionLabel={(option) => option.partyName}
            value={selectedParty}
            onChange={(event, newValue) => setSelectedParty(newValue)}
            size="small"
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="All parties"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    bgcolor: 'white',
                    fontSize: '0.875rem',
                  }
                }}
              />
            )}
          />
        </Box>

        {/* Start date */}
        <Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
            From Date
          </Typography>
          <TextField
            type="date"
            size="small"
            fullWidth
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputProps={{
              startAdornment: <CalendarIcon sx={{ fontSize: '1rem', color: 'text.secondary', mr: 0.5 }} />,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                bgcolor: 'white',
                fontSize: '0.875rem',
              }
            }}
          />
        </Box>

        {/* End date */}
        <Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
            To Date
          </Typography>
          <TextField
            type="date"
            size="small"
            fullWidth
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            inputProps={{ min: startDate || undefined }}
            InputProps={{
              startAdornment: <CalendarIcon sx={{ fontSize: '1rem', color: 'text.secondary', mr: 0.5 }} />,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                bgcolor: 'white',
                fontSize: '0.875rem',
              }
            }}
          />
        </Box>
      </Box>

      <Divider sx={{ mb: 2, borderColor: '#F1F5F9' }} />

      {/* Data Grid */}
      <Box sx={{ height: { xs: 380, sm: 480 }, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableSelectionOnClick
          getRowId={(row) => row.entryDataId}
          rowHeight={isMobile ? 48 : 56}
          columnHeaderHeight={isMobile ? 44 : 52}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          initialState={{
            columns: {
              columnVisibilityModel: {
                createdOn: false,
                modifiedOn: false,
              },
            },
          }}
          pageSizeOptions={[10, 25, 50]}
          showToolbar
          slotProps={{
            toolbar: {
              csvOptions: {
                fileName: 'entries',
              },
            },
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #F1F5F9',
              color: 'text.primary',
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              px: isMobile ? 1 : 2,
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#F8FAFC',
              borderBottom: '1px solid #E2E8F0',
              color: 'text.secondary',
              fontSize: isMobile ? '0.7rem' : '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 700,
            },
            '& .MuiDataGrid-columnHeader': {
              px: isMobile ? 1 : 2,
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
            '& .MuiDataGrid-toolbarContainer': {
              px: 1,
              py: 0.5,
              borderBottom: '1px solid #F1F5F9',
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default RecentEntriesTable;