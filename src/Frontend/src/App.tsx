import React, { createContext, useState, useMemo, useContext } from 'react';
import { ThemeProvider, createTheme, CssBaseline, PaletteMode } from '@mui/material';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import Storage from './pages/Storage'; // Import Storage page

// Create a theme context
interface ThemeContextType {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  mode: 'dark',
  toggleColorMode: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

function App() {
  const [mode, setMode] = useState<PaletteMode>('dark');

  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [mode],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#ffffff',
          },
          secondary: {
            main: '#000000',
          },
        },
      }),
    [mode],
  );

  // Get Google OAuth Client ID from environment variables
  // If not available, use a placeholder (will show an error in the console)
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'default-client-id';

  // Log the Google Client ID to verify it is being loaded correctly
  console.log('Google Client ID:', process.env.REACT_APP_GOOGLE_CLIENT_ID);

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <ThemeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <ProtectedRoute>
                  {/* Render Storage component for the root path */}
                  <Storage />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              {/* The /storage route might be redundant now if / is the main storage view */}
              <Route path="/storage" element={
                <ProtectedRoute>
                  <Storage />
                </ProtectedRoute>
              } />
               {/* Consider if /admin should render Dashboard or a specific Admin component */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </Router>
        </ThemeProvider>
      </ThemeContext.Provider>
    </GoogleOAuthProvider>
  );
}

export default App;
