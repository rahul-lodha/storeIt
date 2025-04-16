import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Switch, Typography, Container, Box, Snackbar, Alert } from '@mui/material';
import { useThemeContext } from '../App';

interface SettingsState {
  notifications: boolean;
  autoSave: boolean;
}

const Settings: React.FC = () => {
  
  const [settings, setSettings] = useState<SettingsState>({
    notifications: false,
    autoSave: false,
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const loadSettings = () => {
      try {
        const notificationsSetting = localStorage.getItem('notifications');
        const autoSaveSetting = localStorage.getItem('autoSave');

        setSettings({
          notifications: notificationsSetting === 'true',
          autoSave: autoSaveSetting === 'true',
        });
      } catch (error) {
        console.error('Failed to load settings:', error);
        showSnackbar('Failed to load settings', 'error');
      }
    };

    loadSettings();
  }, []);

  const handleSettingChange = (setting: keyof SettingsState) => () => {
    try {
      const newValue = !settings[setting];
      localStorage.setItem(setting, newValue.toString());

      setSettings((prev) => ({
        ...prev,
        [setting]: newValue,
      }));

      showSnackbar(`${setting} ${newValue ? 'enabled' : 'disabled'}`, 'success');
    } catch (error) {
      console.error(`Failed to update ${setting}:`, error);
      showSnackbar(`Failed to update ${setting}`, 'error');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Settings
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Notifications" secondary="Receive notifications about your documents" />
            <Switch
              edge="end"
              checked={settings.notifications}
              onChange={handleSettingChange('notifications')}
            />
          </ListItem>
          <ListItem>
            <ListItemText primary="Auto-save" secondary="Automatically save your documents" />
            <Switch
              edge="end"
              checked={settings.autoSave}
              onChange={handleSettingChange('autoSave')}
            />
          </ListItem>
        </List>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Settings;