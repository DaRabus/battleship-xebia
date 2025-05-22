import type { ThemeOptions } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

import { Colors } from './colors';
import type { LocalTheme } from '@theme/theme-registry';

const commonTheme: ThemeOptions = {
  typography: {
    fontFamily: ['var(--font-roboto)', 'Helvetica', 'sans-serif'].join(', '),
    h1: {
      fontStyle: 'normal',
      fontWeight: 700,
      fontSize: '42px',
      lineHeight: '120%',
      letterSpacing: '-0.5px'
    },
    h2: {
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '32px',
      lineHeight: '120%',
      letterSpacing: '-0.25px'
    },
    h3: {
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '28px',
      lineHeight: '130%',
      letterSpacing: '0px'
    },
    h4: {
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '24px',
      lineHeight: '130%',
      letterSpacing: '0.25px'
    },
    h5: {
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '20px',
      lineHeight: '130%',
      letterSpacing: '0px'
    },
    h6: {
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '18px',
      lineHeight: '130%',
      letterSpacing: '0.15px'
    },
    body1: {
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '160%', // Increased line height for better readability
      letterSpacing: '0.15px'
    },
    body2: {
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: '150%', // Increased line height
      letterSpacing: '0.15px'
    },
    subtitle1: {
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '16px',
      lineHeight: '150%',
      letterSpacing: '0.15px'
    },
    subtitle2: {
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '14px',
      lineHeight: '140%',
      letterSpacing: '0.1px'
    },
    overline: {
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '12px',
      letterSpacing: '1px',
      lineHeight: '150%',
      textTransform: 'uppercase'
    },
    caption: {
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '12px',
      letterSpacing: '0.4px',
      lineHeight: '140%'
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollBehavior: 'smooth',
          transition: 'background-color 0.3s ease'
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableRipple: true,
        disableElevation: true
      },
      styleOverrides: {
        root: ({ theme }) => ({
          textAlign: 'center',
          cursor: 'pointer',
          borderRadius: '2px', // Sharper borders for a more modern look
          color: theme.palette.common.white,
          padding: '8px 16px',
          fontWeight: 500,
          textTransform: 'none', // More modern approach without all caps
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          },
          '&:active': {
            transform: 'translateY(1px)'
          }
        }),
        contained: ({ theme }) => ({
          backgroundSize: '200% auto',
          transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
          '&:hover': {
            backgroundPosition: 'right center'
          }
        }),
        outlined: ({ theme }) => ({
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px'
          }
        })
      }
    },
    MuiChip: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          borderRadius: '4px', // Slightly rounded corners
          fontWeight: 500,
          transition: 'all 0.2s ease',
          ...(ownerState.className === 'filled' && {
            textAlign: 'center',
            cursor: 'pointer',
            color: theme.palette.common.black,
            backgroundColor: theme.palette.common.white,
            '&:hover': {
              background: 'rgba(255,255,255,0.85)',
              transform: 'translateY(-2px)'
            },
            '&:active': {
              transform: 'translateY(1px)'
            }
          }),
          ...(ownerState.color === 'primary' &&
            ownerState.variant === 'filled' && {
              background: 'linear-gradient(145deg, #14F195, #4EA6C3, #9945FF)'
            }),
          '&.Mui-disabled': {
            color: theme.palette.text.disabled,
            opacity: 0.5
          }
        }),
        filled: ({ theme }) => ({
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark
          }
        }),
        outlined: ({ theme }) => ({
          borderColor: theme.palette.primary.main,
          color: theme.palette.common.white,
          borderWidth: '2px',
          '&:hover': {
            borderColor: theme.palette.primary.light,
            backgroundColor: 'rgba(157, 181, 192, 0.1)'
          }
        })
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          borderRadius: '4px',
          padding: '10px',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            transform: 'translateY(-2px)'
          },
          '&:active': {
            transform: 'translateY(1px)'
          },
          ...(ownerState.className === 'filled' && {
            color: theme.palette.primary.dark,
            backgroundColor: theme.palette.primary.contrastText,
            '&:hover': {
              backgroundColor: theme.palette.grey[300]
            }
          })
        })
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: '4px',
          transition: 'all 0.2s ease',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.light,
            borderWidth: '2px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)'
          },
          '&.Mui-focused': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main,
              borderWidth: '2px'
            }
          },
          '&:hover:not(.Mui-disabled)': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main,
              borderWidth: '2px'
            }
          }
        })
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: ({ theme }) => ({
          margin: '0.5rem 0',
          backgroundColor: theme.palette.primary.dark
        })
      }
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          transition: 'all 0.3s ease',
          overflow: 'hidden'
        })
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px',
          '&:last-child': {
            paddingBottom: '24px'
          }
        }
      }
    },
    MuiLink: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.secondary.main,
          textDecoration: 'none',
          fontWeight: 500,
          transition: 'all 0.2s ease',
          '&:hover': {
            color: theme.palette.secondary.light,
            textDecoration: 'underline'
          }
        })
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          padding: '8px 0'
        }
      }
    }
  }
};

export const createAppTheme = (mode: LocalTheme) =>
  createTheme({
    palette: { mode, ...Colors[mode] },
    ...commonTheme
  });
