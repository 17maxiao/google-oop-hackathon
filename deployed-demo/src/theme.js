// Healthcare-friendly theme configuration
export const theme = {
  colors: {
    // Primary palette - calming blues and teals
    primary: '#4A90A4',
    primaryLight: '#6BB6C9',
    primaryDark: '#2E6B7A',

    // Secondary palette - soft greens for wellness
    secondary: '#7FB685',
    secondaryLight: '#A5D6A7',
    secondaryDark: '#5D8C61',

    // Accent colors
    accent: '#E8A87C',
    accentLight: '#FFCC99',

    // Neutral colors
    background: '#F8FAFB',
    surface: '#FFFFFF',
    surfaceLight: '#F5F7F9',

    // Text colors
    textPrimary: '#2C3E50',
    textSecondary: '#5A6C7D',
    textLight: '#8394A5',

    // Status colors
    success: '#81C784',
    warning: '#FFB74D',
    error: '#E57373',
    info: '#64B5F6',

    // Border and divider
    border: '#E0E7ED',
    divider: '#CFD8DC',
  },

  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },

  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    xlarge: '16px',
    round: '50%',
  },

  shadows: {
    small: '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.08)',
    medium: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.05)',
    large: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
    hover: '0 6px 12px rgba(74, 144, 164, 0.15)',
  },

  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  transitions: {
    fast: '150ms ease-in-out',
    medium: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
};

export default theme;
