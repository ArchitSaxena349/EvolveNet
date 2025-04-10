import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Set the base URL for API requests
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'https://evolvenet-api.onrender.com';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Set default axios headers
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('accessToken');

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (accessToken && refreshToken) {
          try {
            const res = await axios.get('/api/auth/me');
            setUser(res.data);
          } catch (error) {
            if (error.response?.status === 401 && error.response?.data?.refreshToken) {
              // Access token expired, try to refresh
              try {
                const refreshRes = await axios.post('/api/auth/refresh-token', {
                  refreshToken
                });
                localStorage.setItem('accessToken', refreshRes.data.accessToken);
                axios.defaults.headers.common['Authorization'] = refreshRes.data.accessToken;
                const userRes = await axios.get('/api/auth/me');
                setUser(userRes.data);
              } catch (refreshError) {
                // Refresh token failed, logout user
                logout();
              }
            } else {
              logout();
            }
          }
        }
      } catch (err) {
        console.error('Auth error:', err);
        setAuthError('Authentication error');
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      axios.defaults.headers.common['Authorization'] = res.data.accessToken;
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Login failed';
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsAuthenticating(false);
    }
  };

  const register = async (formData) => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const res = await axios.post('/api/auth/register', formData);
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      axios.defaults.headers.common['Authorization'] = res.data.accessToken;
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Registration failed';
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setAuthError(null);
  };

  const clearError = () => {
    setAuthError(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        authError,
        isAuthenticating,
        login, 
        register, 
        logout,
        clearError
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}; 