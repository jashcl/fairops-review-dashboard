import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1E3C72' },
    secondary: { main: '#f59e0b' },
    background: { default: '#f8fafc' },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    button: { textTransform: 'none', fontWeight: 800 },
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 12 } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 18 } } },
    MuiPaper: { styleOverrides: { root: { borderRadius: 18 } } },
  },
});

export default theme;
