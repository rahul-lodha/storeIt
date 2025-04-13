import React, { useState, Suspense } from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar,
  Typography,
  Tabs,
  Tab,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent
} from '@mui/material';
import { 
  MoreVert as MoreIcon,
  Image as PhotoIcon,
  VideoLibrary as VideoIcon,
  InsertDriveFile as FileIcon,
  Menu as MenuIcon,
  PhoneAndroid as DeviceIcon,
  Cloud as CloudIcon,
  CloudCircle as GoogleDriveIcon,
  CloudQueue as OneDriveIcon,
  CloudDownload as DropboxIcon,
  CloudDone as ICloudIcon,
  CloudUpload as JioCloudIcon,
  Backup as BackupIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import { useThemeContext } from '../App';
import { useNavigate } from 'react-router-dom';

// Lazy load the sections
const PhotosSection = React.lazy(() => import('../sections/PhotosSection'));
const VideosSection = React.lazy(() => import('../sections/VideosSection'));
const FilesSection = React.lazy(() => import('../sections/FilesSection'));

// Loading fallback
const SectionLoader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 4 }}>
    <CircularProgress />
  </Box>
);

// Cloud provider type
export type StorageProvider = 'all' | 'device' | 'google-drive' | 'onedrive' | 'dropbox' | 'icloud' | 'jio-cloud';

// Provider colors for UI across app
export const providerColors: Record<StorageProvider, string> = {
  'all': '#607d8b',
  'device': '#4caf50',
  'google-drive': '#4285F4',
  'onedrive': '#0078D4',
  'dropbox': '#0061FF',
  'icloud': '#A2AAAD',
  'jio-cloud': '#8EC928'
};

// Helper function to get provider label - exported for reuse
export const getProviderLabel = (provider: StorageProvider): string => {
  switch(provider) {
    case 'all': return 'All Storage';
    case 'device': return 'This Device';
    case 'google-drive': return 'Google Drive';
    case 'onedrive': return 'OneDrive';
    case 'dropbox': return 'Dropbox';
    case 'icloud': return 'iCloud';
    case 'jio-cloud': return 'Jio Cloud';
    default: return 'Unknown';
  }
};

// Get color by usage percentage - exported for reuse
export const getColorByUsage = (used: number, total: number) => {
  const percentage = (used / total) * 100;
  if (percentage > 90) return 'error';
  if (percentage > 70) return 'warning';
  return 'primary';
};

// Helper function to render provider icons - exported for reuse
export const renderProviderIcon = (provider: StorageProvider) => {
  switch(provider) {
    case 'all': return <CloudIcon />;
    case 'device': return <DeviceIcon />;
    case 'google-drive': return <GoogleDriveIcon sx={{ color: '#4285F4' }} />;
    case 'onedrive': return <OneDriveIcon sx={{ color: '#0078D4' }} />;
    case 'dropbox': return <DropboxIcon sx={{ color: '#0061FF' }} />;
    case 'icloud': return <ICloudIcon sx={{ color: '#A2AAAD' }} />;
    case 'jio-cloud': return <JioCloudIcon sx={{ color: '#8EC928' }} />;
    default: return <CloudIcon />;
  }
};

// Storage data for each provider
export interface StorageData {
  used: number;
  total: number;
  itemCount: number;
}

// Storage data by provider
const storageDataByProvider: Record<StorageProvider, StorageData> = {
  'all': { used: 22.5, total: 130, itemCount: 65 },
  'device': { used: 10.2, total: 32, itemCount: 42 },
  'google-drive': { used: 8.5, total: 15, itemCount: 12 },
  'onedrive': { used: 2.4, total: 5, itemCount: 8 },
  'dropbox': { used: 1.4, total: 2, itemCount: 3 },
  'icloud': { used: 0, total: 5, itemCount: 0 },
  'jio-cloud': { used: 0, total: 10, itemCount: 0 }
};

// Create a context for the selected provider
export const StorageProviderContext = React.createContext<{
  provider: StorageProvider;
  setProvider: (provider: StorageProvider) => void;
  storageData: StorageData;
}>({
  provider: 'all',
  setProvider: () => {},
  storageData: storageDataByProvider['all']
});

const MobileLayout: React.FC = () => {
  const { toggleColorMode } = useThemeContext();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<StorageProvider>('all');
  const [backupDialogOpen, setBackupDialogOpen] = useState(false);
  const [backupTarget, setBackupTarget] = useState<StorageProvider>('google-drive');
  const [backupInProgress, setBackupInProgress] = useState(false);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleThemeToggle = () => {
    toggleColorMode();
    handleMenuClose();
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const selectProvider = (provider: StorageProvider) => {
    setSelectedProvider(provider);
    setDrawerOpen(false);
  };

  const handleBackupClick = () => {
    setBackupDialogOpen(true);
  };

  const handleBackupDialogClose = () => {
    setBackupDialogOpen(false);
  };

  const handleBackupTargetChange = (event: SelectChangeEvent<StorageProvider>) => {
    setBackupTarget(event.target.value as StorageProvider);
  };

  const handleStartBackup = () => {
    // Simulate backup process
    setBackupInProgress(true);
    
    // In a real app, this would connect to the device's storage and
    // upload files to the selected cloud provider
    setTimeout(() => {
      setBackupInProgress(false);
      setBackupDialogOpen(false);
      // Would show a success notification in a real app
    }, 3000);
  };

  const handleLogout = () => {
    // Clear authentication from localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('googleAuth');
    
    // Close menu
    handleMenuClose();
    
    // Redirect to login page
    navigate('/login');
  };

  // Render storage indicator with circular progress
  const renderStorageIndicator = (provider: StorageProvider) => {
    const data = storageDataByProvider[provider];
    const percentage = Math.round((data.used / data.total) * 100);
    const color = getColorByUsage(data.used, data.total);
    
    return (
      <Tooltip title={`${data.used} GB of ${data.total} GB used (${percentage}%)`} arrow>
        <Box sx={{ position: 'relative', width: 36, height: 36 }}>
          <CircularProgress
            variant="determinate"
            value={percentage}
            color={color}
            size={36}
            thickness={4}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="caption"
              component="div"
              color="text.secondary"
              sx={{ fontWeight: 'bold', fontSize: '0.6rem' }}
            >
              {percentage}%
            </Typography>
          </Box>
        </Box>
      </Tooltip>
    );
  };

  return (
    <StorageProviderContext.Provider value={{ 
      provider: selectedProvider, 
      setProvider: setSelectedProvider,
      storageData: storageDataByProvider[selectedProvider]
    }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh', 
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto',
        boxShadow: 3,
        overflow: 'hidden'
      }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {getProviderLabel(selectedProvider)}
            </Typography>
            <Tooltip title="Backup device content">
              <IconButton
                color="inherit"
                onClick={handleBackupClick}
              >
                <BackupIcon />
              </IconButton>
            </Tooltip>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
            >
              <MoreIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleThemeToggle}>
            Toggle Dark Mode
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
            Logout
          </MenuItem>
        </Menu>
        
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer}
        >
          <Box sx={{ width: 250 }} role="presentation">
            <List>
              <ListItem>
                <Typography variant="h6" sx={{ p: 2 }}>
                  Storage Providers
                </Typography>
              </ListItem>
              <Divider />
              {(Object.keys(storageDataByProvider) as StorageProvider[]).map((provider) => (
                <ListItem key={provider} disablePadding>
                  <ListItemButton 
                    onClick={() => selectProvider(provider)}
                    selected={selectedProvider === provider}
                  >
                    <ListItemIcon>
                      {renderProviderIcon(provider)}
                    </ListItemIcon>
                    <ListItemText 
                      primary={getProviderLabel(provider)} 
                      secondary={`${storageDataByProvider[provider].used} / ${storageDataByProvider[provider].total} GB`}
                    />
                    {renderStorageIndicator(provider)}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<PhotoIcon />} label="Photos" />
            <Tab icon={<VideoIcon />} label="Videos" />
            <Tab icon={<FileIcon />} label="Files" />
          </Tabs>
          
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            <Suspense fallback={<SectionLoader />}>
              {tabValue === 0 && <PhotosSection />}
              {tabValue === 1 && <VideosSection />}
              {tabValue === 2 && <FilesSection />}
            </Suspense>
          </Box>
        </Box>
      </Box>

      {/* Backup Dialog */}
      <Dialog open={backupDialogOpen} onClose={handleBackupDialogClose}>
        <DialogTitle>Backup Device Content</DialogTitle>
        <DialogContent>
          <Typography paragraph sx={{ mt: 1 }}>
            Select a cloud storage provider to back up your photos, videos, and files from this device.
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="backup-target-label">Backup Target</InputLabel>
            <Select
              labelId="backup-target-label"
              value={backupTarget}
              label="Backup Target"
              onChange={handleBackupTargetChange}
              disabled={backupInProgress}
            >
              {(Object.keys(storageDataByProvider) as StorageProvider[])
                .filter(p => p !== 'all' && p !== 'device')
                .map(provider => (
                  <MenuItem key={provider} value={provider}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {renderProviderIcon(provider)}
                      <Box sx={{ ml: 1 }}>{getProviderLabel(provider)}</Box>
                    </Box>
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>
          
          {backupInProgress && (
            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress size={24} sx={{ mr: 1 }} />
              <Typography>Backing up content...</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBackupDialogClose} disabled={backupInProgress}>Cancel</Button>
          <Button 
            onClick={handleStartBackup} 
            variant="contained" 
            disabled={backupInProgress}
            startIcon={<BackupIcon />}
          >
            Start Backup
          </Button>
        </DialogActions>
      </Dialog>
    </StorageProviderContext.Provider>
  );
};

export default MobileLayout; 