export const Colors = {
  dark: {
    primary: {
      main: '#9DB5C0', // Base muted blue
      light: '#E8EBEE', // Lighter muted blue
      contrastText: '#FFFFFF',
      heading: '#FFFFFF',
      dark: '#7A95A2', // Darker shade
      shades: {
        p50: 'rgba(157, 181, 192, 0.5)',
        p30: 'rgba(157, 181, 192, 0.3)'
      }
    },
    secondary: {
      main: '#14F195', // Bright green accent
      dark: '#0FCC7D', // Darker green
      light: '#7DF8C7', // Lighter green
      contrastText: '#121212',
      shades: {
        p50: 'rgba(20, 241, 149, 0.5)' // Semi-transparent green
      }
    },
    success: {
      main: '#6CD0AA', // Lightened green
      dark: '#4AAE8A',
      light: '#D1F5E8', // Lighter mint
      contrastText: '#FFFFFF',
      shades: {
        p30: 'rgba(168, 242, 212, 0.3)'
      }
    },
    error: {
      main: '#FF6B6B', // Vibrant coral red
      dark: '#E74C3C',
      light: '#FFD1D1', // Lighter blush
      contrastText: '#FFFFFF'
    },
    warning: {
      main: '#FFD166', // Bright warning yellow
      dark: '#FFC233',
      light: '#FFF0C2', // Light cream
      contrastText: '#000000'
    },
    info: {
      main: '#4EA6C3', // Brighter blue
      dark: '#3A8CAB',
      light: '#B2DCE9', // Light sky blue
      contrastText: '#000000',
      shades: {
        p30: 'rgba(78, 166, 195, 0.3)'
      }
    },
    text: {
      primary: '#F2F5F7', // Slightly off-white for better readability
      disabled: 'rgba(255,255,255,0.4)',
      secondary: 'rgba(255,255,255,0.7)', // Increased contrast for secondary text
      contrast: '#121212' // Dark contrast text
    },
    other: {
      divider: 'rgba(255,255,255,0.15)',
      buttonGroup: '#4EA6C3', // Bright blue
      buttonSelected: '#14F195', // Bright green for selected state
      successBorder: '#14F195', // Bright green border
      hoverBox: '#363B42' // Darker hover color
    },
    action: {
      hover: 'rgba(255, 255, 255, 0.1)',
      active: 'rgba(255, 255, 255, 0.2)'
    },
    background: {
      default: '#121212', // Darker background for better contrast
      paper: '#1E1E1E', // Slightly lighter than default
      card: '#282828', // Card background
      border: 'rgba(255, 255, 255, 0.1)' // Subtle border color
    },
    paper: {
      elevation1: '#1E1E1E',
      elevation6: '#252525',
      elevation20: 'rgba(157, 181, 192, 0.05)', // Subtle muted blue
      elevation21: '#363636', // Medium grey
      elevation22: 'rgba(20, 241, 149, 0.05)', // Subtle green
      elevation23: 'rgba(78, 166, 195, 0.05)', // Subtle blue
      elevation24: 'rgba(153, 69, 255, 0.05)' // Subtle purple
    }
  }
};
