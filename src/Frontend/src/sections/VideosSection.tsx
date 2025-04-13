import React, { useState, useContext } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Avatar,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Chip,
  Tooltip
} from '@mui/material';
import {
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
  VideoLibrary as VideoIcon,
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

// Video interface with provider
interface Video {
  id: number;
  title: string;
  duration: string;
  thumbnail: string;
  date: string;
  provider: StorageProvider;
}

// Sample video data
const initialVideos: Video[] = [
  {
    id: 1,
    title: 'Beach Vacation',
    duration: '2:45',
    thumbnail: 'https://source.unsplash.com/random/320x180/?beach',
    date: '2023-10-15',
    provider: 'device'
  },
  {
    id: 2,
    title: 'Birthday Party',
    duration: '4:20',
    thumbnail: 'https://source.unsplash.com/random/320x180/?birthday',
    date: '2023-09-28',
    provider: 'google-drive'
  },
  {
    id: 3,
    title: 'Concert Highlights',
    duration: '7:12',
    thumbnail: 'https://source.unsplash.com/random/320x180/?concert',
    date: '2023-08-14',
    provider: 'onedrive'
  },
  {
    id: 4,
    title: 'Road Trip',
    duration: '5:30',
    thumbnail: 'https://source.unsplash.com/random/320x180/?road',
    date: '2023-07-22',
    provider: 'dropbox'
  }
];

const VideosSection: React.FC = () => {
  const { provider, storageData } = useContext(StorageProviderContext);
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [openDetail, setOpenDetail] = useState(false);

  // Filter videos based on selected provider
  const filteredVideos = provider === 'all' 
    ? videos 
    : videos.filter((video: Video) => video.provider === provider);

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setOpenDetail(true);
  };

  const handleDetailClose = () => {
    setOpenDetail(false);
  };

  const handleDeleteVideo = (id: number) => {
    setVideos(videos.filter((video: Video) => video.id !== id));
    if (selectedVideo && selectedVideo.id === id) {
      setOpenDetail(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          My Videos ({filteredVideos.length})
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

      {filteredVideos.length === 0 ? (
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
            No videos found in {getProviderLabel(provider)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Select a different storage provider to view videos
          </Typography>
        </Box>
      ) : (
        <List sx={{ bgcolor: 'background.paper' }}>
          {filteredVideos.map((video) => (
            <React.Fragment key={video.id}>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleVideoClick(video)} sx={{ py: 1 }}>
                  <ListItemAvatar sx={{ mr: 2 }}>
                    <Avatar 
                      variant="rounded" 
                      sx={{ width: 80, height: 45 }}
                      src={video.thumbnail}
                    >
                      <VideoIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography noWrap component="span" sx={{ mr: 1 }}>
                          {video.title}
                        </Typography>
                        <Chip 
                          label={getProviderLabel(video.provider)}
                          size="small"
                          sx={{ 
                            backgroundColor: providerColors[video.provider as keyof typeof providerColors],
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
                          {video.duration}
                        </Typography>
                        {` • ${video.date}`}
                      </React.Fragment>
                    }
                  />
                </ListItemButton>
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      )}

      {/* Video Detail Dialog */}
      <Dialog
        open={openDetail}
        onClose={handleDetailClose}
        maxWidth="sm"
        fullWidth
      >
        {selectedVideo && (
          <React.Fragment>
            <DialogContent sx={{ p: 0 }}>
              <Box sx={{ position: 'relative' }}>
                <Box 
                  sx={{ 
                    width: '100%', 
                    paddingTop: '56.25%', // 16:9 aspect ratio
                    position: 'relative',
                    backgroundColor: 'black'
                  }}
                >
                  <Box
                    component="img"
                    src={selectedVideo.thumbnail}
                    alt={selectedVideo.title}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      bgcolor: 'rgba(0,0,0,0.5)',
                      '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.7)',
                      },
                      color: 'white',
                      p: 2
                    }}
                  >
                    <PlayIcon sx={{ fontSize: 40 }} />
                  </IconButton>
                </Box>
                <Box sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      {selectedVideo.title}
                    </Typography>
                    <Chip 
                      label={getProviderLabel(selectedVideo.provider)}
                      size="small"
                      sx={{ 
                        backgroundColor: providerColors[selectedVideo.provider as keyof typeof providerColors],
                        color: 'white'
                      }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {selectedVideo.duration} • {selectedVideo.date}
                  </Typography>
                </Box>
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
                onClick={() => {
                  handleDeleteVideo(selectedVideo.id);
                }}
              >
                Delete
              </Button>
            </DialogActions>
          </React.Fragment>
        )}
      </Dialog>
    </Box>
  );
};

export default VideosSection; 