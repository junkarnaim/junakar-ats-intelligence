import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1d4ed8',
      dark: '#1e3a8a',
      light: '#dbeafe',
    },
    secondary: {
      main: '#0f766e',
      dark: '#115e59',
      light: '#ccfbf1',
    },
    success: {
      main: '#15803d',
    },
    warning: {
      main: '#b45309',
    },
    error: {
      main: '#b91c1c',
    },
    background: {
      default: '#f5f7fb',
      paper: '#ffffff',
    },
    text: {
      primary: '#111827',
      secondary: '#5b6472',
    },
    divider: '#e5e7eb',
  },
  typography: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: 0,
      lineHeight: 1.04,
    },
    h2: {
      fontWeight: 750,
      letterSpacing: 0,
      lineHeight: 1.12,
    },
    h3: {
      fontWeight: 750,
      letterSpacing: 0,
    },
    h4: {
      fontWeight: 700,
      letterSpacing: 0,
    },
    h5: {
      fontWeight: 700,
      letterSpacing: 0,
    },
    h6: {
      fontWeight: 700,
      letterSpacing: 0,
    },
    button: {
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #e5e7eb',
          boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 650,
        },
      },
    },
  },
})

export default theme
