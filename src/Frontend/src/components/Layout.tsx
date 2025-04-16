// Import necessary libraries and components from React, React Router, and Material-UI
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  ListItemButton,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Storage as StorageIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';

// Define the width of the navigation drawer
const drawerWidth = 240;

// Define the props interface for the Layout component
interface LayoutProps {
  children: React.ReactNode; // Content to be displayed in the main area
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // State to manage whether the drawer is open or closed
  const [open, setOpen] = useState(true);

  // React Router hooks for navigation and current location
  const navigate = useNavigate();
  const location = useLocation();

  // Array of menu items for the navigation drawer
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Storage', icon: <StorageIcon />, path: '/storage' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  // Function to toggle the drawer's open state
  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}> {/* Main container with flex layout */}
      <CssBaseline /> {/* Ensures consistent baseline styles for Material-UI components */}

      {/* AppBar at the top of the layout */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1, // Ensures AppBar is above the Drawer
          transition: (theme) =>
            theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          ...(open && {
            marginLeft: drawerWidth, // Adjust margin when drawer is open
            width: `calc(100% - ${drawerWidth}px)`, // Adjust width when drawer is open
            transition: (theme) =>
              theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
          }),
        }}
      >
        <Toolbar>
          {/* Button to toggle the drawer */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ marginRight: 5 }}
          >
            {/* Show ChevronLeftIcon if open, otherwise MenuIcon */}
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          {/* Application title */}
          <Typography variant="h6" noWrap component="div">
            StoreIt
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Drawer
        variant="permanent" // Drawer is always present but can collapse
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0, // Prevents the drawer from shrinking
          '& .MuiDrawer-paper': {
            width: drawerWidth, // Drawer width
            boxSizing: 'border-box', // Ensures proper box model
            whiteSpace: 'nowrap', // Prevents text wrapping
            transition: (theme) =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            ...(!open && {
              width: 0, // Collapse drawer when closed
              overflowX: 'hidden', // Hide overflow content
              transition: (theme) =>
                theme.transitions.create('width', {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
                }),
            }),
          },
        }}
      >
        <Toolbar /> {/* Spacer to align content below the AppBar */}
        <List>
          {/* Map through menu items to create navigation links */}
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path} // Highlight the selected menu item
                onClick={() => navigate(item.path)} // Navigate to the specified path
              >
                <ListItemIcon>{item.icon}</ListItemIcon> {/* Icon for the menu item */}
                <ListItemText primary={item.text} /> {/* Text for the menu item */}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1, // Allow the content area to grow and fill available space
          p: 3, // Padding for the content area
          width: { sm: `calc(100% - ${drawerWidth}px)` }, // Adjust width based on drawer state
          marginTop: '64px', // Add margin to account for the AppBar height
        }}
      >
        {children} {/* Render the children passed to the Layout component */}
      </Box>
    </Box>
  );
};

export default Layout;