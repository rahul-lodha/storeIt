import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Paper, 
  Divider,
  TextField,
  Alert,
  Snackbar
} from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  console.log('Google Client ID:', process.env.REACT_APP_GOOGLE_CLIENT_ID);

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // You would typically validate and make an API call here
    // This is just a placeholder for demonstration
    if (email && password) {
      // Save login status to localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      
      // Redirect to dashboard
      navigate('/');
    } else {
      setError('Please enter both email and password');
    }
  };

  const handleGoogleLoginSuccess = (credentialResponse: any) => {
    // In a real app, you would verify the token with your backend
    console.log('Google login successful:', credentialResponse);
    
    // Save login status to localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('googleAuth', 'true');
    
    setSnackbarMessage('Google login successful');
    setShowSnackbar(true);
    
    // Redirect to dashboard after a brief delay
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  const handleGoogleLoginError = () => {
    setError('Google sign-in failed. Please try again.');
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          py: 4
        }}
      >
        <Paper 
          elevation={3} 
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 2
          }}
        >
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Welcome to StoreIt
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary" sx={{ mb: 3 }}>
            Your unified storage management solution
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Google Sign-In Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
              useOneTap
            />
          </Box>

          <Divider sx={{ my: 2 }}>
            <Typography color="textSecondary" variant="body2">OR</Typography>
          </Divider>

          {/* Email/Password Login Form */}
          <Box component="form" onSubmit={handleEmailLogin}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Typography variant="body2" color="textSecondary" align="center">
              * For demo purposes, any email/password combination will work
            </Typography>
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSnackbar(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default Login;