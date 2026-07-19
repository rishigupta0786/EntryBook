import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import {
  ReceiptLong as EntriesIcon,
  Business as PartiesIcon,
  Inventory as ProductsIcon
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, gradient, delay }) => (
  <Card sx={{
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid #E2E8F0',
    background: '#FFFFFF',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    animation: `fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s both`,
    '@keyframes fadeInUp': {
      from: {
        opacity: 0,
        transform: 'translateY(16px)',
      },
      to: {
        opacity: 1,
        transform: 'translateY(0)',
      },
    },
    '&:hover': {
      transform: 'translateY(-6px)',
      boxShadow: '0 20px 35px rgba(99, 102, 241, 0.08)',
      borderColor: 'primary.light',
      '& .icon-wrapper': {
        transform: 'scale(1.1) rotate(3deg)',
      },
    }
  }}>
    <Box sx={{
      position: 'absolute',
      top: -24,
      right: -24,
      width: { xs: 80, sm: 110 },
      height: { xs: 80, sm: 110 },
      borderRadius: '50%',
      background: gradient,
      opacity: 0.08,
      transition: 'transform 0.4s',
    }} />
    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box
          className="icon-wrapper"
          sx={{
            p: 1.5,
            borderRadius: '12px',
            background: gradient,
            color: 'white',
            display: 'flex',
            boxShadow: '0 6px 15px rgba(0,0,0,0.06)',
            transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {React.cloneElement(icon, { sx: { fontSize: { xs: '1.25rem', sm: '1.6rem' } } })}
        </Box>
      </Box>
      <Typography color="text.secondary" variant="subtitle2" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.5, fontSize: '0.75rem' }}>
        {title}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const DashboardStats = ({ entries, parties, products }) => {
  return (
    <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ width: '100%' }}>
      <Grid item xs={4}>
        <StatCard
          title="Total Parties"
          value={parties.length}
          icon={<PartiesIcon />}
          gradient="linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)"
          delay={0.1}
        />
      </Grid>
      <Grid item xs={4}>
        <StatCard
          title="Total Products"
          value={products.length}
          icon={<ProductsIcon />}
          gradient="linear-gradient(135deg, #10B981 0%, #059669 100%)"
          delay={0.2}
        />
      </Grid>
    </Grid>
  );
};

export default DashboardStats;