declare module '@mui/material';
declare module '@mui/icons-material';
declare module '@emotion/react';
declare module '@emotion/styled';

// Add any missing StorageProvider types here
export type StorageProvider = 'all' | 'device' | 'google-drive' | 'onedrive' | 'dropbox' | 'icloud' | 'jio-cloud';

export interface StorageData {
  used: number; // in GB
  total: number; // in GB
  itemCount: number;
} 