import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// A custom theme for this app - Jewelry/Gold branding
const theme = createTheme({
  palette: {
    primary: {
      main: '#d4a82e', // Darker gold for good contrast
      light: '#eece77', // Your gold accent color
    },
    secondary: {
      main: '#6c757d', // Mid grey for secondary elements
    },
    error: {
      main: '#d9534f', // Your specified destructive red
    },
    background: {
      default: '#f8f9fa', // Light grey background
      paper: '#ffffff', // White for cards/modals
    },
    text: {
      primary: '#212529', // Dark grey primary text
      secondary: '#6c757d', // Mid grey secondary text
    },
  },
  shape: {
    borderRadius: 8, // Standardized border radius
  },
  shadows: [
    'none',
    '0 4px 6px rgba(0,0,0,0.1)', // Custom subtle shadow for depth
    ...Array(23).fill('0 4px 6px rgba(0,0,0,0.1)'),
  ],
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    body1: { fontWeight: 400, lineHeight: 1.6 },
    body2: { fontWeight: 400, lineHeight: 1.5 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 44, // Touch-friendly button height
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .Mui-focused': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#eece77', // Gold focus state
            },
          },
        },
      },
    },
  },
});

export default theme;