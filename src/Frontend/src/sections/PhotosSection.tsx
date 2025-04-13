import React, { useState, useContext } from 'react';
import {
  Box,
  Typography,
  ImageList,
  ImageListItem,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Tooltip
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Share as ShareIcon,
  Cloud as CloudIcon
} from '@mui/icons-material';
import { 
  StorageProviderContext, 
  StorageProvider, 
  providerColors, 
  getProviderLabel, 
  getColorByUsage 
} from '../components/MobileLayout';

interface Photo {
  id: number;
  img: string;
  title: string;
  date: string;
  provider: StorageProvider;
}

// Sample photo data with providers
const initialPhotos: Photo[] = [
  {
    id: 1,
    img: 'https://source.unsplash.com/random/800x600/?nature',
    title: 'Nature view',
    date: '2023-10-15',
    provider: 'device'
  },
  {
    id: 2,
    img: 'https://source.unsplash.com/random/800x600/?beach',
    title: 'Beach sunset',
    date: '2023-09-28',
    provider: 'google-drive'
  },
  {
    id: 3,
    img: 'https://source.unsplash.com/random/800x600/?mountain',
    title: 'Mountain peak',
    date: '2023-08-14',
    provider: 'onedrive'
  },
  {
    id: 4,
    img: 'https://source.unsplash.com/random/800x600/?city',
    title: 'City skyline',
    date: '2023-07-22',
    provider: 'dropbox'
  },
  {
    id: 5,
    img: 'https://source.unsplash.com/random/800x600/?forest',
    title: 'Forest path',
    date: '2023-11-05',
    provider: 'device'
  },
  {
    id: 6,
    img: 'https://source.unsplash.com/random/800x600/?food',
    title: 'Delicious meal',
    date: '2023-10-30',
    provider: 'google-drive'
  }
];

const PhotosSection: React.FC = () => {
  const { provider, storageData } = useContext(StorageProviderContext);
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  
  // Filter photos based on selected provider
  const filteredPhotos = provider === 'all' 
    ? photos 
    : photos.filter((photo: Photo) => photo.provider === provider);
  
  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
    setOpenDialog(true);
  };
  
  const handleDialogClose = () => {
    setOpenDialog(false);
  };
  
  const handleDeletePhoto = (id: number) => {
    setPhotos(photos.filter((photo: Photo) => photo.id !== id));
    if (selectedPhoto && selectedPhoto.id === id) {
      setOpenDialog(false);
    }
  };

  return (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          My Photos ({filteredPhotos.length})
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
      
      {filteredPhotos.length === 0 ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexGrow: 1,
          textAlign: 'center' 
        }}>
          <CloudIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No photos found in {getProviderLabel(provider)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Select a different storage provider to view photos
          </Typography>
        </Box>
      ) : (
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          <ImageList cols={3} gap={12} sx={{ overflow: 'visible', padding: 0, margin: 0 }}>
            {filteredPhotos.map((photo) => (
              <ImageListItem 
                key={photo.id} 
                sx={{ 
                  position: 'relative', 
                  cursor: 'pointer',
                  aspectRatio: '1/1',
                  overflow: 'hidden',
                  borderRadius: '8px',
                }}
                onClick={() => handlePhotoClick(photo)}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      display: 'block',
                      paddingTop: '100%',
                    },
                  }}
                >
                  <img
                    src={photo.img}
                    alt={photo.title}
                    loading="lazy"
                    style={{ 
                      borderRadius: '8px', 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                    p: 1,
                    borderBottomLeftRadius: '8px',
                    borderBottomRightRadius: '8px'
                  }}
                >
                  <Typography variant="subtitle2" color="white" noWrap>
                    {photo.title}
                  </Typography>
                </Box>
                <Chip 
                  label={getProviderLabel(photo.provider)}
                  size="small"
                  sx={{ 
                    position: 'absolute',
                    top: 8, 
                    right: 8,
                    backgroundColor: providerColors[photo.provider as keyof typeof providerColors],
                    color: 'white',
                    fontSize: '0.7rem'
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      )}
      
      {/* Photo Detail Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        {selectedPhoto && (
          <>
            <DialogContent sx={{ p: 0, position: 'relative' }}>
              <img
                src={selectedPhoto.img}
                alt={selectedPhoto.title}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }}
              />
              <Chip 
                label={getProviderLabel(selectedPhoto.provider)}
                size="small"
                sx={{ 
                  position: 'absolute',
                  top: 16, 
                  right: 16,
                  backgroundColor: providerColors[selectedPhoto.provider as keyof typeof providerColors],
                  color: 'white'
                }}
              />
              <Box sx={{ p: 2 }}>
                <Typography variant="h6">{selectedPhoto.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedPhoto.date}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
              <Button 
                variant="outlined" 
                startIcon={<ShareIcon />}
              >
                Share
              </Button>
              <Button 
                variant="contained" 
                color="error" 
                startIcon={<DeleteIcon />}
                onClick={() => handleDeletePhoto(selectedPhoto.id)}
              >
                Delete
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default PhotosSection; 