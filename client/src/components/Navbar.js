import React, { useContext, useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Divider,
  Container,
  ListItemIcon,
  Tooltip,
} from '@mui/material';
import {
  Hub as HubIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';

const navLinks = [
  { label: 'Profile', to: '/profile' },
  { label: 'Groups', to: '/groups' },
  { label: 'Network', to: '/connections' },
  { label: 'Events', to: '/events' },
];

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate('/');
  };

  const isActive = (to) => location.pathname === to;

  const linkStyles = (to) => ({
    color: 'common.white',
    fontWeight: 600,
    px: 2,
    borderRadius: 2,
    opacity: isActive(to) ? 1 : 0.85,
    backgroundColor: isActive(to) ? 'rgba(255,255,255,0.18)' : 'transparent',
    '&:hover': { backgroundColor: 'rgba(255,255,255,0.14)', opacity: 1 },
  });

  const initial = (user?.name || 'U').trim().charAt(0).toUpperCase();

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="lg" disableGutters>
        <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              textDecoration: 'none',
              color: 'common.white',
              flexGrow: 1,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                display: 'grid',
                placeItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.18)',
              }}
            >
              <HubIcon fontSize="small" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
              EvolveNet
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {user ? (
              <>
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, mr: 1 }}>
                  {navLinks.map((link) => (
                    <Button
                      key={link.to}
                      component={RouterLink}
                      to={link.to}
                      sx={linkStyles(link.to)}
                    >
                      {link.label}
                    </Button>
                  ))}
                </Box>
                <Tooltip title="Account">
                  <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0.5 }}>
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: 'secondary.main',
                        fontWeight: 700,
                        fontSize: '1rem',
                      }}
                    >
                      {initial}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  PaperProps={{ sx: { mt: 1, minWidth: 200 } }}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2" noWrap>
                      {user.name || 'Signed in'}
                    </Typography>
                    {user.email && (
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {user.email}
                      </Typography>
                    )}
                  </Box>
                  <Divider />
                  <MenuItem
                    component={RouterLink}
                    to="/profile"
                    onClick={() => setAnchorEl(null)}
                  >
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button component={RouterLink} to="/login" sx={linkStyles('/login')}>
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="secondary"
                  sx={{ ml: 1, fontWeight: 700 }}
                >
                  Get Started
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
