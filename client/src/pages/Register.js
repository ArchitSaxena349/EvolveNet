import React, { useState, useContext } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  Link,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Hub as HubIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setFieldErrors((current) => ({
      ...current,
      [e.target.name]: undefined
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const nextFieldErrors = {};

    if (!formData.name.trim()) {
      nextFieldErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2 || formData.name.trim().length > 50) {
      nextFieldErrors.name = 'Name must be 2 to 50 characters';
    }

    if (!formData.email.trim()) {
      nextFieldErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      nextFieldErrors.email = 'Enter a valid email address';
    }

    if (!formData.password) {
      nextFieldErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      nextFieldErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      nextFieldErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      nextFieldErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setFieldErrors({});

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password
      });
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ py: { xs: 6, md: 10 } }}>
      <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 3,
              display: 'grid',
              placeItems: 'center',
              color: 'common.white',
              backgroundImage: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
              mb: 2,
            }}
          >
            <HubIcon />
          </Box>
          <Typography component="h1" variant="h5" gutterBottom>
            Create your account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Join EvolveNet and start growing your network
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={formData.name}
              onChange={handleChange}
              error={Boolean(fieldErrors.name)}
              helperText={fieldErrors.name}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              error={Boolean(fieldErrors.email)}
              helperText={fieldErrors.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPasswords ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              error={Boolean(fieldErrors.password)}
              helperText={fieldErrors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPasswords ? 'Hide passwords' : 'Show passwords'}
                      onClick={() => setShowPasswords((current) => !current)}
                      edge="end"
                    >
                      {showPasswords ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showPasswords ? 'text' : 'password'}
              id="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={Boolean(fieldErrors.confirmPassword)}
              helperText={fieldErrors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPasswords ? 'Hide passwords' : 'Show passwords'}
                      onClick={() => setShowPasswords((current) => !current)}
                      edge="end"
                    >
                      {showPasswords ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Typography variant="body2" color="text.secondary" align="center">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" fontWeight={600}>
                Sign in
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
