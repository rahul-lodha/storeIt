import React, { useState, useContext } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  CircularProgress,
  Tooltip,
  Chip
} from '@mui/material';
import {
  Delete as DeleteIcon,
  GetApp as DownloadIcon,
  Share as ShareIcon,
  MoreVert as MoreIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as DocIcon,
  TableChart as SpreadsheetIcon,
  Description as TextIcon,
  Code as CodeIcon,
  Cloud as CloudIcon
} from '@mui/icons-material';
import { 
  StorageProviderContext, 
  StorageProvider, 
  providerColors,
  getProviderLabel, 
  getColorByUsage 
} from '../components/MobileLayout';

// File interface (assuming FileData from Storage.tsx is compatible or needs import)
// If FileData is defined elsewhere, import it. Otherwise, define or adjust this interface.
// For now, using the existing File interface, assuming FileData matches its structure.
interface File {
  id: number | string; // Allow string ID if backend provides it
  name: string;
  type?: string; // Made type optional to match DataItem
  size?: string; // Made size optional to match DataItem
  date?: string; // Made date optional to match DataItem
  provider?: StorageProvider | string; // Made provider optional to match DataItem
  // Add other fields from FileData if necessary
}

// Define Props interface
interface FilesSectionProps {
  files: File[]; // Expect files prop
}

// Use the props interface in the component definition
const FilesSection: React.FC<FilesSectionProps> = ({ files: filesProp }) => { // Destructure files prop
  const { provider, storageData } = useContext(StorageProviderContext);
  // Remove internal files state, use the prop instead
  // const [files, setFiles] = useState<File[]>(initialFiles); 
  const [localFiles, setLocalFiles] = useState<File[]>(filesProp); // Keep local state for deletion if needed
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [currentFile, setCurrentFile] = useState<number | string | null>(null);
  const [isDownloading, setIsDownloading] = useState<number | string | null>(null);

  // Update localFiles when filesProp changes
  React.useEffect(() => {
    setLocalFiles(filesProp);
  }, [filesProp]);


  // Filter files based on selected provider and search term, using localFiles state
  const filteredFiles = localFiles
    .filter((file: File) => file.name.toLowerCase().includes('')) // Add search term logic if needed
    .filter((file: File) => provider === 'all' ? true : file.provider === provider); // Provider filtering might need adjustment based on actual provider data

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, id: number | string) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setCurrentFile(id);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  // Deletion now modifies the local state. Consider lifting state up if needed.
  const handleDeleteFile = (id: number | string | null) => {
    if (id === null) return;
    setLocalFiles(prevFiles => prevFiles.filter((file: File) => file.id !== id));
    handleCloseMenu();
    // TODO: Add API call to delete the file on the backend
  };

  const handleDownloadFile = (id: number | string | null) => {
    if (id === null) return;
    setIsDownloading(id);
    
    // Simulate download
    // TODO: Implement actual download logic
    setTimeout(() => {
      setIsDownloading(null);
      handleCloseMenu();
    }, 2000);
  };

  const handleMenuAction = (action: string) => {
    if (currentFile === null) {
      handleCloseMenu();
      return;
    }
    
    switch (action) {
      case 'download': handleDownloadFile(currentFile); break;
      case 'delete': handleDeleteFile(currentFile); break;
      case 'share': handleCloseMenu(); break; // TODO: Implement share logic
      default: handleCloseMenu();
    }
  };

  // This function needs adjustment based on actual file data (e.g., mime types)
  const getFileIcon = (type: string | undefined) => {
    if (!type) return <DocIcon />;
    if (type.includes('pdf')) return <PdfIcon sx={{ color: '#e53935' }} />;
    if (type.includes('spreadsheet') || type.includes('excel')) return <SpreadsheetIcon sx={{ color: '#43a047' }} />;
    if (type.includes('document') || type.includes('word')) return <DocIcon sx={{ color: '#1e88e5' }} />;
    if (type.includes('text')) return <TextIcon sx={{ color: '#757575' }} />;
    if (type.includes('javascript') || type.includes('typescript')) return <CodeIcon sx={{ color: '#f57c00' }} />;
    // Add more types as needed
    return <DocIcon />;
  };
  
  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          My Files ({filteredFiles.length}) 
        </Typography>
        {/* Storage usage display might need adjustment based on actual data */}
        <Tooltip title={`${storageData.used} GB of ${storageData.total} GB used`} arrow>
          <Chip 
            label={`${storageData.used} GB / ${storageData.total} GB`} 
            color={getColorByUsage(storageData.used, storageData.total)} 
            variant="outlined" 
            size="small"
          />
        </Tooltip>
      </Box>

      {filteredFiles.length === 0 ? (
         <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '50vh', // Adjust height as needed
          textAlign: 'center' 
        }}>
          <CloudIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            {/* Adjust empty state message */}
            {provider === 'all' ? "No files found" : `No files found in ${getProviderLabel(provider)}`}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {/* Adjust empty state guidance */}
             {provider === 'all' ? "Try selecting a specific provider" : "Upload files or select a different provider"}
          </Typography>
        </Box>
      ) : (
        <List sx={{ bgcolor: 'background.paper' }}>
          {/* Use filteredFiles derived from props */}
          {filteredFiles.map((file: File) => ( 
            <React.Fragment key={file.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar>
                    {/* Adjust getFileIcon based on actual data */}
                    {getFileIcon(file.type)} 
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography noWrap component="span" sx={{ mr: 1 }}>
                        {file.name}
                      </Typography>
                      {/* Chip logic might need adjustment based on file.provider data */}
                       <Chip 
                        label={getProviderLabel(file.provider as StorageProvider)} // Cast might be needed
                        size="small"
                        sx={{ 
                          backgroundColor: providerColors[file.provider as keyof typeof providerColors], // Cast might be needed
                          color: 'white',
                          fontSize: '0.6rem',
                          height: 20
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        variant="body2"
                        color="text.primary"
                        component="span"
                      >
                        {/* Adjust size/date display based on actual data */}
                        {file.size} 
                      </Typography>
                      {/* Adjust date display */}
                      {` • ${file.date}`} 
                    </React.Fragment>
                  }
                />
                <ListItemSecondaryAction>
                  {isDownloading === file.id ? (
                    <CircularProgress size={24} />
                  ) : (
                    <IconButton edge="end" aria-label="more" onClick={(e: React.MouseEvent<HTMLElement>) => handleOpenMenu(e, file.id)}>
                      <MoreIcon />
                    </IconButton>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      )}

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => handleMenuAction('download')}>
          <DownloadIcon fontSize="small" sx={{ mr: 1 }} /> Download
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('share')}>
          <ShareIcon fontSize="small" sx={{ mr: 1 }} /> Share
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleMenuAction('delete')} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default FilesSection;
