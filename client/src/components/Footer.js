import React from 'react';
import { Box, Typography, Container, Stack, Link, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Hub as HubIcon } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 5,
        borderTop: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                display: 'grid',
                placeItems: 'center',
                color: 'common.white',
                backgroundImage: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
              }}
            >
              <HubIcon fontSize="small" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              EvolveNet
            </Typography>
          </Box>

          <Stack direction="row" spacing={3}>
            <Link component={RouterLink} to="/events" color="text.secondary" underline="hover">
              Events
            </Link>
            <Link component={RouterLink} to="/groups" color="text.secondary" underline="hover">
              Groups
            </Link>
            <Link component={RouterLink} to="/connections" color="text.secondary" underline="hover">
              Network
            </Link>
          </Stack>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} EvolveNet. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
