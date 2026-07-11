import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import {
  ReceiptLong as EntriesIcon,
  Business as PartiesIcon,
  Inventory as ProductsIcon
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, gradient }) => (
  <Card sx={{
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
      transform: { xs: 'none', md: 'translateY(-4px)' },
      boxShadow: { xs: 'none', md: '0 20px 40px rgba(0,0,0,0.08)' },
    }
  }}>
    <Box sx={{
      position: 'absolute',
      top: -20,
      right: -20,
      width: { xs: 60, sm: 100 },
      height: { xs: 60, sm: 100 },
      borderRadius: '50%',
      background: gradient,
      opacity: 0.1,
    }} />
    <CardContent sx={{ p: { xs: 1.25, sm: 2.5, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: { xs: 1, sm: 1.5, md: 2 } }}>
        <Box sx={{
          p: { xs: 0.75, sm: 1.25, md: 1.5 },
          borderRadius: 2,
          background: gradient,
          color: 'white',
          display: 'flex',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
        }}>
          {React.cloneElement(icon, { sx: { fontSize: { xs: '1.2rem', sm: '1.5rem' } } })}
        </Box>
      </Box>
      <Typography color="textSecondary" variant="subtitle2" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em', mb: 0.5, fontSize: { xs: '0.6rem', sm: '0.75rem', md: '0.875rem' } }}>
        {title}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', fontSize: { xs: '1.2rem', sm: '1.6rem', md: '2.125rem' } }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const DashboardStats = ({ entries, parties, products }) => {
  return (
    <Grid container spacing={{ xs: 2, sm: 3 }} justifyContent="space-around">
      <Grid item xs={4}>
        <StatCard
          title="Total Parties"
          value={parties.length}
          icon={<PartiesIcon />}
          gradient="linear-gradient(135deg, #6366F1 0%, #818CF8 100%)"
        />
      </Grid>
      <Grid item xs={4}>
        <StatCard
          title="Total Products"
          value={products.length}
          icon={<ProductsIcon />}
          gradient="linear-gradient(135deg, #10B981 0%, #34D399 100%)"
        />
      </Grid>
    </Grid>
  );
};

export default DashboardStats;