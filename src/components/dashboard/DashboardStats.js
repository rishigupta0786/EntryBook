import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { 
  ReceiptLong as EntriesIcon, 
  Business as PartiesIcon, 
  Inventory as ProductsIcon, 
  AccountBalanceWallet as ValueIcon 
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, gradient }) => (
  <Card sx={{ 
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
    }
  }}>
    <Box sx={{
      position: 'absolute',
      top: -20,
      right: -20,
      width: 100,
      height: 100,
      borderRadius: '50%',
      background: gradient,
      opacity: 0.1,
    }} />
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ 
          p: 1.5, 
          borderRadius: 3, 
          background: gradient,
          color: 'white',
          display: 'flex',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
        }}>
          {icon}
        </Box>
      </Box>
      <Typography color="textSecondary" variant="subtitle2" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const DashboardStats = ({ entries, parties, products }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard 
          title="Total Entries" 
          value={entries.length} 
          icon={<EntriesIcon fontSize="medium" />}
          gradient="linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard 
          title="Total Parties" 
          value={parties.length} 
          icon={<PartiesIcon fontSize="medium" />}
          gradient="linear-gradient(135deg, #6366F1 0%, #818CF8 100%)"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard 
          title="Total Products" 
          value={products.length} 
          icon={<ProductsIcon fontSize="medium" />}
          gradient="linear-gradient(135deg, #10B981 0%, #34D399 100%)"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard 
          title="Total Value" 
          value={entries.reduce((acc, entry) => acc + entry.calculatedValue, 0).toFixed(2)} 
          icon={<ValueIcon fontSize="medium" />}
          gradient="linear-gradient(135deg, #F59E0B 0%, #FCD34D 100%)"
        />
      </Grid>
    </Grid>
  );
};

export default DashboardStats;