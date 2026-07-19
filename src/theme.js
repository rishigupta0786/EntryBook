import { createTheme } from '@mui/material/styles';

export const createAppTheme = (fontFamily) => createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6366F1', // Indigo (Main Accent)
      light: '#818CF8',
      dark: '#4F46E5',
      contrastText: '#fff',
    },
    secondary: {
      main: '#0EA5E9', // Sky Blue
      light: '#38BDF8',
      dark: '#0284C7',
      contrastText: '#fff',
    },
    background: {
      default: '#F8FAFC', // Slate 50 (cleaner, premium light gray)
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',   // Slate 900
      secondary: '#64748B', // Slate 500
    },
    divider: '#E2E8F0', // Slate 200
  },
  typography: {
    fontFamily: fontFamily || '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h6: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontWeight: 800,
      letterSpacing: '-0.03em',
    },
    h3: {
      fontWeight: 800,
      letterSpacing: '-0.03em',
    },
    subtitle1: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    subtitle2: {
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    body1: {
      letterSpacing: '-0.01em',
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: '#CBD5E1 #F1F5F9',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#F1F5F9',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#CBD5E1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#94A3B8',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '12px',
          padding: '10px 24px',
          boxShadow: 'none',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
          color: '#fff',
          '&:hover': {
            background: 'linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)',
            boxShadow: '0 6px 20px rgba(99, 102, 241, 0.3)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05), 0px 10px 30px rgba(0, 0, 0, 0.02)',
          border: '1px solid #E2E8F0',
          transition: 'box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: '1px solid #E2E8F0',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05), 0px 12px 36px rgba(0, 0, 0, 0.03)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.8) !important',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #E2E8F0',
          boxShadow: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#F8FAFC',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            border: '1px solid transparent',
            '& fieldset': {
              borderColor: '#E2E8F0',
            },
            '&:hover': {
              backgroundColor: '#F1F5F9',
              '& fieldset': {
                borderColor: '#CBD5E1',
              },
            },
            '&.Mui-focused': {
              backgroundColor: '#FFFFFF',
              '& fieldset': {
                borderColor: '#6366F1',
                borderWidth: '2px',
              },
              boxShadow: '0px 4px 12px rgba(99, 102, 241, 0.08)',
            }
          },
        },
      },
    },
  },
});

const theme = createAppTheme();

export default theme;