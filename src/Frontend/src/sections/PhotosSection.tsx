import React, { useState, useContext, useEffect } from 'react';
import {
  Box,
  Typography,
  ImageList,
  ImageListItem,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Tooltip,
  CircularProgress // Import CircularProgress for loading indicator
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
  id: string; // Changed to string, using URL as ID
  img: string;
  title: string; // Using URL or a derived name
  date: string; // Placeholder for now, backend might provide this later
  provider: StorageProvider;
}

const PhotosSection: React.FC = () => {
  const { provider, storageData } = useContext(StorageProviderContext);
  const [photos, setPhotos] = useState<Photo[]>([]); // Initialize with empty array
  const [loading, setLoading] = useState(false); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  // useEffect to fetch photos when provider changes
  useEffect(() => {
    const fetchPhotos = async () => {
      if (provider === 'google-drive') {
        setLoading(true);
        setError(null); // Clear previous errors
        try {
          // Assuming backend is running on the same host, port 8080
          const response = await fetch('/cloud-storage/photos');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const photoUrls: string[] = await response.json();

          // Convert URLs to Photo objects
          const fetchedPhotos: Photo[] = photoUrls.map((url, index) => ({
            id: url, // Use URL as a unique ID
            img: url,
            title: `Photo ${index + 1}`, // Simple title for now
            date: new Date().toLocaleDateString(), // Placeholder date
            provider: 'google-drive',
          }));

          setPhotos(fetchedPhotos);
        } catch (error: any) {
          console.error('Error fetching Google Drive photos:', error);
          setError('Failed to load photos from Google Drive.');
          setPhotos([]); // Clear photos on error
        } finally {
          setLoading(false);
        }
      } else {
        // Clear photos when provider is not google-drive or all
        // If 'all' is selected, you might want to fetch from multiple sources or have a different logic
        // For now, let's clear if not google-drive. We can add 'all' logic later.
        setPhotos([]);
        setError(null);
      }
    };

    fetchPhotos();
  }, [provider]); // Re-run effect when provider changes

  // Filter photos based on selected provider (now filters fetched photos or remains empty)
  // When provider is 'all', this will currently show an empty state because we only fetch google-drive photos
  // We might need to adjust the fetch logic or filtering for 'all' later.
  const filteredPhotos = provider === 'all'
    ? photos // If 'all', show all fetched photos (currently only google-drive)
    : photos.filter((photo: Photo) => photo.provider === provider);


  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDeletePhoto = (id: string) => { // Changed id type to string
    // Implement deletion logic here, including calling backend API if needed
    console.log(`Attempting to delete photo with id: ${id}`);
    // For now, just filter from the local state
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

      {loading && ( // Show loading indicator
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
          <CircularProgress />
        </Box>
      )}

      {error && ( // Show error message
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {!loading && !error && filteredPhotos.length === 0 ? ( // Show no photos message only when not loading and no error
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
          {provider === 'all' && (
             <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
               Select a specific storage provider to view photos, or ensure you have linked your accounts.
             </Typography>
          )}
           {provider !== 'all' && (
             <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
               Ensure you have linked your {getProviderLabel(provider)} account and have photos stored there.
             </Typography>
          )}
        </Box>
      ) : ( // Render photos when not loading, no error, and photos exist
        !loading && !error && (
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
        )
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