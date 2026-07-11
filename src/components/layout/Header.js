import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
} from '@mui/material';
import { Menu as MenuIcon, Dashboard as DashboardIcon } from '@mui/icons-material';

const Header = ({ drawerWidth, handleDrawerToggle }) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        boxShadow: 'none',
      }}
    >
      <Toolbar sx={{ minHeight: { xs: '56px', sm: '72px' }, px: { xs: 1.5, sm: 3 } }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 1.5, display: { sm: 'none' }, color: 'text.primary' }}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, flexGrow: 1 }}>
          <Box sx={{ 
            bgcolor: 'primary.main', 
            color: 'white', 
            p: { xs: 0.75, sm: 1 }, 
            borderRadius: 2, 
            display: 'flex',
            boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
          }}>
            <DashboardIcon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="subtitle1" noWrap component="div" sx={{ color: 'text.primary', lineHeight: 1.2, fontWeight: 700, fontSize: { xs: '0.95rem', sm: '1.25rem' } }}>
              Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              Welcome back, Rishi 👋
            </Typography>
          </Box>
        </Box>
        <Avatar sx={{ bgcolor: 'secondary.main', fontWeight: 600, width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 }, fontSize: { xs: '0.85rem', sm: '1rem' } }}>
          R
        </Avatar>
      </Toolbar>
    </AppBar>
  );
};

export default Header;