import { createTheme } from '@mui/material/styles';

// EvolveNet design system — a modern, professional networking aesthetic.
// Centralizing palette, typography, shape and component defaults here means
// every page inherits the polish without page-by-page overrides.

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4f46e5', // indigo
      light: '#6366f1',
      dark: '#3730a3',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#06b6d4', // cyan/teal accent
      light: '#22d3ee',
      dark: '#0e7490',
      contrastText: '#ffffff',
    },
    success: { main: '#10b981' },
    warning: { main: '#f59e0b' },
    error: { main: '#ef4444' },
    background: {
      default: '#f6f7fb',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    divider: 'rgba(15, 23, 42, 0.08)',
  },

  shape: {
    borderRadius: 12,
  },

  typography: {
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.03em' },
    h2: { fontWeight: 800, letterSpacing: '-0.03em' },
    h3: { fontWeight: 700, letterSpacing: '-0.02em' },
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h5: { fontWeight: 700, letterSpacing: '-0.01em' },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 500 },
    button: { fontWeight: 600, textTransform: 'none' },
  },

  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingInline: 20,
          paddingBlock: 8,
        },
        containedPrimary: {
          boxShadow: '0 6px 16px -6px rgba(79, 70, 229, 0.6)',
          '&:hover': {
            boxShadow: '0 10px 24px -8px rgba(79, 70, 229, 0.7)',
          },
        },
      },
    },

    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: '1px solid rgba(15, 23, 42, 0.06)',
          borderRadius: 16,
          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 18px 40px -18px rgba(15, 23, 42, 0.25)',
            borderColor: 'rgba(79, 70, 229, 0.35)',
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: 16 },
      },
    },

    MuiTextField: {
      defaultProps: { variant: 'outlined' },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: '#ffffff',
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500 },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(90deg, #4f46e5 0%, #6d28d9 55%, #06b6d4 140%)',
          boxShadow: '0 4px 20px -8px rgba(79, 70, 229, 0.5)',
        },
      },
    },
  },
});

export default theme;
