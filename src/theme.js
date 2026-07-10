import { createTheme } from '@mui/material/styles';

export const createAppTheme = (fontFamily) => createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0EA5E9', // Vibrant Sky Blue
      light: '#38BDF8',
      dark: '#0284C7',
      contrastText: '#fff',
    },
    secondary: {
      main: '#6366F1', // Indigo
      light: '#818CF8',
      dark: '#4F46E5',
      contrastText: '#fff',
    },
    background: {
      default: '#F3F4F6', // Very soft gray for background
      paper: '#FFFFFF',   // Pure white for cards
    },
    text: {
      primary: '#1F2937',   // Dark gray for readability
      secondary: '#6B7280', // Medium gray for secondary text
    },
    divider: '#E5E7EB',
  },
  typography: {
    fontFamily: fontFamily || '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    button: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '12px',
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(14, 165, 233, 0.25)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)',
          color: '#fff',
          '&:hover': {
            background: 'linear-gradient(135deg, #0284C7 0%, #4F46E5 100%)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.7)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0px 10px 40px rgba(0, 0, 0, 0.03)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.8) !important',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#F9FAFB',
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: '#F3F4F6',
            },
            '&.Mui-focused': {
              backgroundColor: '#FFFFFF',
              boxShadow: '0px 4px 12px rgba(14, 165, 233, 0.1)',
            }
          },
        },
      },
    },
  },
});

const theme = createAppTheme();

export default theme;