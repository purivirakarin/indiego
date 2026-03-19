import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#b53a2a',
      dark: '#9e3022',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f5ece3',
      dark: '#e8ddd1',
      contrastText: '#1a1411',
    },
    background: {
      default: '#1a1411',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1411',
      secondary: '#c4b5a5',
    },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    h1: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 900,
    },
    h2: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 900,
    },
    h3: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 700,
    },
    h4: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 700,
    },
    h5: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 700,
    },
    h6: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 700,
    },
    button: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '1.5px',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 40,
          padding: '12px 32px',
          fontSize: '14px',
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#9e3022',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(181, 58, 42, 0.3)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
})

export default theme
