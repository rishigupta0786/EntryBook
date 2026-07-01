import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3A604A', // Medium green for actions
    },
    secondary: {
      main: '#21402E', // Darkest green as secondary
    },
    background: {
      default: '#F5F5ED', // Off-white for main background
      paper: '#ffffff',   // Clean white for cards
    },
    text: {
      primary: '#21402E',   // Darkest green for readability
      secondary: '#3A604A', // Medium green for secondary text
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontSize: '1rem',
          padding: '10px 20px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;