import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  Link,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { Hub as HubIcon } from '@mui/icons-material';

const ForgotPassword = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const otpInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (step === 1) {
      otpInputRef.current?.focus();
    }
  }, [step]);

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

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const nextFieldErrors = {};

    if (!formData.email.trim()) {
      nextFieldErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      nextFieldErrors.email = 'Enter a valid email address';
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      await axios.post('/api/auth/forgotpassword', { email: formData.email.trim() });
      setMessage('OTP sent to your registered email. Check your inbox and spam folder.');
      setStep(1);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Unable to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await axios.post('/api/auth/forgotpassword', { email: formData.email.trim() });
      setMessage('A new OTP has been sent to your registered email.');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Unable to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const nextFieldErrors = {};

    if (!formData.otp.trim()) {
      nextFieldErrors.otp = 'Verification code is required';
    } else if (!/^\d{6}$/.test(formData.otp.trim())) {
      nextFieldErrors.otp = 'Verification code must be exactly 6 digits';
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

    setLoading(true);

    try {
      await axios.put(`/api/auth/resetpassword/${formData.otp.trim()}`, {
        password: formData.password
      });
      setMessage('Password updated successfully. You can now sign in with your new password.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Unable to reset password');
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Request code', 'Reset password'];

  const handleOtpPaste = (e) => {
    const pastedValue = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedValue) {
      return;
    }

    e.preventDefault();
    setFormData((current) => ({
      ...current,
      otp: pastedValue
    }));
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ py: { xs: 6, md: 10 } }}>
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
            Reset your password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            We&apos;ll send a one-time code to your registered email, then use it to change your password.
          </Typography>

          <Stepper activeStep={step} alternativeLabel sx={{ width: '100%', mb: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          {message && (
            <Alert severity="success" sx={{ mb: 2, width: '100%' }}>
              {message}
            </Alert>
          )}

          {step === 0 ? (
            <Box component="form" onSubmit={handleSendOtp} sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Registered Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                error={Boolean(fieldErrors.email)}
                helperText={fieldErrors.email}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? 'Sending code...' : 'Send OTP'}
              </Button>
              <Typography variant="body2" color="text.secondary" align="center">
                Remembered your password?{' '}
                <Link component={RouterLink} to="/login" fontWeight={600}>
                  Back to sign in
                </Link>
              </Typography>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleResetPassword} sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="otp"
                label="Verification Code"
                name="otp"
                inputMode="numeric"
                inputRef={otpInputRef}
                value={formData.otp}
                onChange={handleChange}
                onPaste={handleOtpPaste}
                error={Boolean(fieldErrors.otp)}
                helperText={fieldErrors.otp || 'Enter the 6-digit code sent to your email'}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="New Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                error={Boolean(fieldErrors.password)}
                helperText={fieldErrors.password}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm New Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={Boolean(fieldErrors.confirmPassword)}
                helperText={fieldErrors.confirmPassword}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? 'Updating password...' : 'Reset Password'}
              </Button>
              <Button
                fullWidth
                variant="text"
                onClick={() => setStep(0)}
                sx={{ mb: 2 }}
              >
                Use a different email
              </Button>
              <Button
                fullWidth
                variant="text"
                onClick={handleResendOtp}
                disabled={loading}
              >
                Resend code
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;