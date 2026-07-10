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
      <Toolbar sx={{ minHeight: '72px' }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' }, color: 'text.primary' }}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
          <Box sx={{ 
            bgcolor: 'primary.main', 
            color: 'white', 
            p: 1, 
            borderRadius: 2, 
            display: 'flex',
            boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
          }}>
            <DashboardIcon />
          </Box>
          <Box>
            <Typography variant="h6" noWrap component="div" sx={{ color: 'text.primary', lineHeight: 1.2 }}>
              Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              Welcome back, Rishi 👋
            </Typography>
          </Box>
        </Box>
        <Avatar sx={{ bgcolor: 'secondary.main', fontWeight: 600, width: 40, height: 40 }}>
          R
        </Avatar>
      </Toolbar>
    </AppBar>
  );
};

export default Header;