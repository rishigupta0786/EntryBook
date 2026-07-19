import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Group as GroupIcon,
  Inventory2 as Inventory2Icon,
  AutoStories as BookIcon,
} from '@mui/icons-material';

const SideNavigation = ({
  drawerWidth,
  mobileOpen,
  handleDrawerToggle,
  setIsViewPartiesOpen,
  setIsViewProductsOpen,
}) => {
  const theme = useTheme();

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      {/* Brand Header */}
      <Toolbar sx={{ px: 3, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ 
          p: 0.75, 
          borderRadius: '10px', 
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`, 
          color: 'white',
          display: 'flex',
          boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)'
        }}>
          <BookIcon fontSize="small" />
        </Box>
        <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 800, letterSpacing: '-0.03em' }}>
          EntryBook
        </Typography>
      </Toolbar>

      {/* Navigation Links */}
      <List sx={{ px: 2, py: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {[
          { text: 'Dashboard', icon: <DashboardIcon />, active: true },
          { text: 'Parties', icon: <GroupIcon /> },
          { text: 'Products', icon: <Inventory2Icon /> },
        ].map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => {
                if (item.text === 'Parties') {
                  setIsViewPartiesOpen(true);
                } else if (item.text === 'Products') {
                  setIsViewProductsOpen(true);
                }
                if (mobileOpen) {
                  handleDrawerToggle();
                }
              }}
              sx={{
                borderRadius: '12px',
                py: 1.25,
                px: 2,
                transition: 'all 0.2s ease-in-out',
                bgcolor: item.active ? 'rgba(99, 102, 241, 0.04)' : 'transparent',
                borderLeft: item.active ? `3px solid ${theme.palette.primary.main}` : '3px solid transparent',
                '&:hover': {
                  bgcolor: 'rgba(99, 102, 241, 0.08)',
                  transform: 'translateX(3px)',
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main',
                  },
                  '& .MuiListItemText-primary': {
                    color: 'text.primary',
                  }
                },
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 40, 
                color: item.active ? 'primary.main' : 'text.secondary',
                transition: 'color 0.2s',
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontSize: '0.925rem',
                  fontWeight: item.active ? 700 : 500,
                  color: item.active ? 'text.primary' : 'text.secondary',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      {/* Temporary drawer for mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        {drawer}
      </Drawer>
      {/* Permanent drawer for desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default SideNavigation;