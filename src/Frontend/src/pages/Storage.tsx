import React, { useState, useEffect, Suspense } from 'react'; // Added Suspense
import {
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import MobileLayout from '../components/MobileLayout'; // Import MobileLayout
// Lazy load sections
const FilesSection = React.lazy(() => import('../sections/FilesSection'));
const PhotosSection = React.lazy(() => import('../sections/PhotosSection'));
const VideosSection = React.lazy(() => import('../sections/VideosSection'));

// Define a common interface for data items (adjust as needed)
interface DataItem {
  id: string | number; // Assuming items have an ID
  name: string;
  // Add other common or specific properties
  // For example, FilesSection might need 'type', 'size', 'date', 'provider'
  type?: string;
  size?: string;
  date?: string;
  provider?: string;
  // PhotosSection might need 'thumbnailUrl', 'dateTaken'
  thumbnailUrl?: string;
  dateTaken?: string;
   // VideosSection might need 'thumbnailUrl', 'duration'
  duration?: string;
}


// Loading fallback
const SectionLoader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 4 }}>
    <CircularProgress />
  </Box>
);

const Storage: React.FC = () => {
  // State for data
  const [files, setFiles] = useState<DataItem[] | null>(null);
  const [photos, setPhotos] = useState<DataItem[] | null>(null);
  const [videos, setVideos] = useState<DataItem[] | null>(null);
  // State for loading status
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);

  // State for the active tab
  const [tabValue, setTabValue] = useState(0); // 0: Photos, 1: Videos, 2: Files

  // Fetching functions (adjust API endpoints and data mapping as needed)
  const fetchFiles = async () => {
    setLoadingFiles(true);
    try {
      // TODO: Replace with actual API endpoint for files
      const response = await fetch('/cloud-storage/files'); // Example endpoint
      if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
      const data: DataItem[] = await response.json(); // Assume API returns DataItem[]
      setFiles(data);
    } catch (error) {
      console.error('Error fetching files:', error);
      setFiles([]); // Set empty array on error
    } finally {
      setLoadingFiles(false);
    }
  };

  const fetchPhotos = async () => {
    setLoadingPhotos(true);
    try {
       // TODO: Replace with actual API endpoint for photos
      const response = await fetch('/cloud-storage/photos'); // Example endpoint
      if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
      const data: DataItem[] = await response.json(); // Assume API returns DataItem[]
      setPhotos(data);
    } catch (error) {
      console.error('Error fetching photos:', error);
      setPhotos([]); // Set empty array on error
    } finally {
      setLoadingPhotos(false);
    }
  };

  const fetchVideos = async () => {
    setLoadingVideos(true);
    try {
       // TODO: Replace with actual API endpoint for videos
      const response = await fetch('/cloud-storage/videos'); // Example endpoint
       if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
      const data: DataItem[] = await response.json(); // Assume API returns DataItem[]
      setVideos(data);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setVideos([]); // Set empty array on error
    } finally {
      setLoadingVideos(false);
    }
  };

  // Fetch all data on component mount
  useEffect(() => {
    fetchPhotos();
    fetchVideos();
    fetchFiles();
  }, []);

  // Handler for tab changes
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Render the appropriate section based on tabValue
  const renderSection = () => {
    switch (tabValue) {
      case 0: // Photos
        if (loadingPhotos) return <SectionLoader />;
        if (!photos || photos.length === 0) return <Typography sx={{ p: 2, textAlign: 'center' }}>No photos found.</Typography>;
        // TODO: Ensure PhotosSectionProps matches DataItem or adjust mapping
        return <PhotosSection />;
      case 1: // Videos
         if (loadingVideos) return <SectionLoader />;
        if (!videos || videos.length === 0) return <Typography sx={{ p: 2, textAlign: 'center' }}>No videos found.</Typography>;
         // TODO: Ensure VideosSectionProps matches DataItem or adjust mapping
        return <VideosSection />;
      case 2: // Files
         if (loadingFiles) return <SectionLoader />;
        if (!files || files.length === 0) return <Typography sx={{ p: 2, textAlign: 'center' }}>No files found.</Typography>;
         // Pass files to FilesSection. Ensure FilesSectionProps matches DataItem or adjust mapping
        return <FilesSection files={files} />;
      default:
        return null;
    }
  };

  return (
    // Use MobileLayout as the wrapper
    <MobileLayout tabValue={tabValue} onTabChange={handleTabChange}>
      {/* Render the selected section as children */}
      {renderSection()}
    </MobileLayout>
  );
};

export default Storage;