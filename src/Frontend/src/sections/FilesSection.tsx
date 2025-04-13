import React, { useState, useContext, ChangeEvent } from 'react';
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

// File interface with provider
interface File {
  id: number;
  name: string;
  type: string;
  size: string;
  date: string;
  provider: StorageProvider;
}

// Sample file data
const initialFiles: File[] = [
  {
    id: 1,
    name: 'Project Proposal.pdf',
    type: 'pdf',
    size: '2.4 MB',
    date: '2023-10-15',
    provider: 'device'
  },
  {
    id: 2,
    name: 'Budget Spreadsheet.xlsx',
    type: 'spreadsheet',
    size: '1.1 MB',
    date: '2023-09-28',
    provider: 'google-drive'
  },
  {
    id: 3,
    name: 'Meeting Notes.docx',
    type: 'doc',
    size: '325 KB',
    date: '2023-08-14',
    provider: 'onedrive'
  },
  {
    id: 4,
    name: 'ReadMe.txt',
    type: 'text',
    size: '4 KB',
    date: '2023-07-22',
    provider: 'dropbox'
  },
  {
    id: 5,
    name: 'script.js',
    type: 'code',
    size: '18 KB',
    date: '2023-11-05',
    provider: 'device'
  }
];

const FilesSection: React.FC = () => {
  const { provider, storageData } = useContext(StorageProviderContext);
  const [files, setFiles] = useState<File[]>(initialFiles);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [currentFile, setCurrentFile] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState<number | null>(null);

  // Filter files based on selected provider and search term
  const filteredFiles = files
    .filter((file: File) => file.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((file: File) => provider === 'all' ? true : file.provider === provider);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, id: number) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setCurrentFile(id);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleDeleteFile = (id: number | null) => {
    if (id === null) return;
    setFiles(files.filter((file: File) => file.id !== id));
    handleCloseMenu();
  };

  const handleDownloadFile = (id: number | null) => {
    if (id === null) return;
    setIsDownloading(id);
    
    // Simulate download
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
      case 'share': handleCloseMenu(); break;
      default: handleCloseMenu();
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <PdfIcon sx={{ color: '#e53935' }} />;
      case 'spreadsheet': return <SpreadsheetIcon sx={{ color: '#43a047' }} />;
      case 'doc': return <DocIcon sx={{ color: '#1e88e5' }} />;
      case 'text': return <TextIcon sx={{ color: '#757575' }} />;
      case 'code': return <CodeIcon sx={{ color: '#f57c00' }} />;
      default: return <DocIcon />;
    }
  };
  
  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          My Files ({filteredFiles.length})
        </Typography>
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
          height: '50vh',
          textAlign: 'center' 
        }}>
          <CloudIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            {searchTerm 
              ? "No files found matching your search" 
              : `No files found in ${getProviderLabel(provider)}`}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {searchTerm 
              ? "Try a different search term" 
              : "Select a different storage provider to view files"}
          </Typography>
        </Box>
      ) : (
        <List sx={{ bgcolor: 'background.paper' }}>
          {filteredFiles.map((file: File) => (
            <React.Fragment key={file.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar>
                    {getFileIcon(file.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography noWrap component="span" sx={{ mr: 1 }}>
                        {file.name}
                      </Typography>
                      <Chip 
                        label={getProviderLabel(file.provider)}
                        size="small"
                        sx={{ 
                          backgroundColor: providerColors[file.provider as keyof typeof providerColors],
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
                        {file.size}
                      </Typography>
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