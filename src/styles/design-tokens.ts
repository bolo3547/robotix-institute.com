/**
 * Design Tokens for ROBOTIX Platform
 * Unified design system for all user roles with kid-friendly and professional variants
 */

// ============================================================================
// TYPOGRAPHY SCALE
// ============================================================================

export const TYPOGRAPHY = {
  // Display - Hero sections, major headings
  display: {
    large: { fontSize: '3.5rem', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em' },
    medium: { fontSize: '2.8rem', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.015em' },
    small: { fontSize: '2.25rem', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.01em' },
  },

  // Heading 1 - Page titles, main sections
  heading1: { fontSize: '2rem', fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.005em' },

  // Heading 2 - Section headings
  heading2: { fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.33 },

  // Heading 3 - Subsection headings
  heading3: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4 },

  // Heading 4 - Minor headings
  heading4: { fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.44 },

  // Body - Large body text (lead text)
  bodyLarge: { fontSize: '1.125rem', fontWeight: 400, lineHeight: 1.56, letterSpacing: '0.005em' },

  // Body - Default body text
  body: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.5, letterSpacing: '0.005em' },

  // Body - Small body text
  bodySmall: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.43, letterSpacing: '0.005em' },

  // Label - Form labels, button text
  label: { fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.43, letterSpacing: '0.005em' },

  // Caption - Small UI text
  caption: { fontSize: '0.75rem', fontWeight: 500, lineHeight: 1.33, letterSpacing: '0.01em' },

  // Mono - Code, technical text
  mono: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.5, fontFamily: 'monospace' },
} as const;

// ============================================================================
// COLOR PALETTES
// ============================================================================

export const COLORS = {
  // Primary Brand Colors - Robotix Institute Purple (#331f53)
  primary: {
    // Kid-friendly: Vibrant purple
    kid: {
      50: '#f3f0f7',
      100: '#e7e0ef',
      200: '#cfc1df',
      300: '#b7a2cf',
      400: '#8a6aad',
      500: '#331f53', // Robotix Purple
      600: '#2b1a47',
      700: '#23153b',
      800: '#1b102f',
      900: '#130b23',
    },
    // Professional: Same purple for brand consistency
    pro: {
      50: '#f3f0f7',
      100: '#e7e0ef',
      200: '#cfc1df',
      300: '#b7a2cf',
      400: '#8a6aad',
      500: '#331f53', // Robotix Purple
      600: '#2b1a47',
      700: '#23153b',
      800: '#1b102f',
      900: '#130b23',
    },
  },

  // Secondary Colors - Golden Yellow (#fda809)
  secondary: {
    kid: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fdb913',
      500: '#fda809',
      600: '#e09200',
      700: '#b87400',
      800: '#925c00', // Robotix Gold
      900: '#764a00',
    },
    pro: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fdb913',
      500: '#fda809',
      600: '#e09200',
      700: '#b87400',
      800: '#925c00', // Robotix Gold
      900: '#764a00',
    },
  },

  // Accent Colors
  accent: {
    success: {
      50: '#E8F5E9',
      100: '#C8E6C9',
      200: '#A5D6A7',
      300: '#81C784',
      400: '#66BB6A',
      500: '#4CAF50',
      600: '#43A047',
      700: '#388E3C',
      800: '#2E7D32',
      900: '#1B5E20',
    },
    warning: {
      50: '#FFF3E0',
      100: '#FFE0B2',
      200: '#FFCC80',
      300: '#FFB74D',
      400: '#FFA726',
      500: '#FF9800',
      600: '#FB8C00',
      700: '#F57C00',
      800: '#E65100',
      900: '#BF360C',
    },
    danger: {
      50: '#FFEBEE',
      100: '#FFCDD2',
      200: '#EF9A9A',
      300: '#E57373',
      400: '#EF5350',
      500: '#F44336',
      600: '#E53935',
      700: '#D32F2F',
      800: '#C62828',
      900: '#B71C1C',
    },
    info: {
      50: '#E1F5FE',
      100: '#B3E5FC',
      200: '#81D4FA',
      300: '#4FC3F7',
      400: '#29B6F6',
      500: '#03A9F4',
      600: '#039BE5',
      700: '#0288D1',
      800: '#0277BD',
      900: '#01579B',
    },
  },

  // Neutral/Grayscale
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },

  // Semantic colors for UI states
  semantic: {
    background: {
      kid: '#FFFFFF',
      pro: '#F9FAFB',
    },
    surface: {
      kid: '#F5F7FA',
      pro: '#FFFFFF',
    },
    border: {
      kid: '#E0E7FF',
      pro: '#E5E7EB',
    },
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
      tertiary: '#9CA3AF',
      inverse: '#FFFFFF',
    },
  },
} as const;

// ============================================================================
// SPACING SCALE
// ============================================================================

export const SPACING = {
  0: '0px',
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  8: '2rem', // 32px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
} as const;

// ============================================================================
// COMPONENT SIZES
// ============================================================================

export const COMPONENT_SIZES = {
  // Button sizes
  button: {
    xs: {
      padding: '0.375rem 0.75rem',
      fontSize: '0.75rem',
      fontWeight: 600,
      height: '1.75rem',
    },
    sm: {
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
      fontWeight: 500,
      height: '2rem',
    },
    md: {
      padding: '0.625rem 1.25rem',
      fontSize: '1rem',
      fontWeight: 500,
      height: '2.5rem',
    },
    lg: {
      padding: '0.75rem 1.5rem',
      fontSize: '1.125rem',
      fontWeight: 600,
      height: '3rem',
    },
    xl: {
      padding: '1rem 2rem',
      fontSize: '1.125rem',
      fontWeight: 600,
      height: '3.5rem',
    },
  },

  // Input sizes
  input: {
    sm: {
      padding: '0.375rem 0.75rem',
      fontSize: '0.875rem',
      height: '2rem',
    },
    md: {
      padding: '0.5rem 1rem',
      fontSize: '1rem',
      height: '2.5rem',
    },
    lg: {
      padding: '0.75rem 1rem',
      fontSize: '1.125rem',
      height: '3rem',
    },
  },

  // Badge sizes
  badge: {
    sm: { padding: '0.25rem 0.75rem', fontSize: '0.75rem' },
    md: { padding: '0.375rem 0.875rem', fontSize: '0.875rem' },
    lg: { padding: '0.5rem 1rem', fontSize: '1rem' },
  },

  // Card border radius
  card: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
  },

  // Icon sizes
  icon: {
    xs: '1rem',
    sm: '1.25rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '2.5rem',
    '2xl': '3rem',
  },
} as const;

// ============================================================================
// SHADOWS
// ============================================================================

export const SHADOWS = {
  none: 'none',
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  base: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  md: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  lg: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  xl: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  // Kid-friendly playful shadows
  playful: '0 8px 16px -2px rgb(0 0 0 / 0.1)',
} as const;

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const BORDER_RADIUS = {
  none: '0px',
  sm: '0.25rem',
  base: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  '2xl': '2rem',
  '3xl': '3rem',
  full: '9999px',
} as const;

// ============================================================================
// ANIMATIONS & TRANSITIONS
// ============================================================================

export const ANIMATIONS = {
  duration: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  easing: {
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    linear: 'linear',
  },
} as const;

// ============================================================================
// ROLE-SPECIFIC THEME CONFIGURATIONS
// ============================================================================

export const ROLE_THEMES = {
  parent: {
    primary: COLORS.primary.kid,
    secondary: COLORS.secondary.kid,
    surface: COLORS.semantic.surface.kid,
    background: COLORS.semantic.background.kid,
    theme: 'light',
    description: 'Kid-friendly theme for parents and guardians',
  },
  child: {
    primary: COLORS.primary.kid,
    secondary: COLORS.secondary.kid,
    surface: COLORS.semantic.surface.kid,
    background: COLORS.semantic.background.kid,
    theme: 'light',
    description: 'Playful theme with bright colors for children',
  },
  instructor: {
    primary: COLORS.primary.pro,
    secondary: COLORS.secondary.pro,
    surface: COLORS.semantic.surface.pro,
    background: COLORS.semantic.background.pro,
    theme: 'light',
    description: 'Professional theme for instructors',
  },
  admin: {
    primary: COLORS.primary.pro,
    secondary: COLORS.secondary.pro,
    surface: '#1F2937',
    background: '#111827',
    theme: 'dark',
    description: 'Professional dark theme for administrators',
  },
} as const;

// ============================================================================
// BADGE VARIANTS
// ============================================================================

export const BADGE_VARIANTS = {
  status: {
    active: {
      bg: COLORS.accent.success[50],
      text: COLORS.accent.success[700],
      border: COLORS.accent.success[200],
    },
    inactive: {
      bg: COLORS.neutral[100],
      text: COLORS.neutral[600],
      border: COLORS.neutral[300],
    },
    pending: {
      bg: COLORS.accent.warning[50],
      text: COLORS.accent.warning[700],
      border: COLORS.accent.warning[200],
    },
    completed: {
      bg: COLORS.accent.success[50],
      text: COLORS.accent.success[700],
      border: COLORS.accent.success[200],
    },
  },
  role: {
    parent: {
      bg: COLORS.primary.kid[50],
      text: COLORS.primary.kid[700],
      border: COLORS.primary.kid[200],
    },
    child: {
      bg: COLORS.secondary.kid[50],
      text: COLORS.secondary.kid[700],
      border: COLORS.secondary.kid[200],
    },
    instructor: {
      bg: COLORS.primary.pro[50],
      text: COLORS.primary.pro[700],
      border: COLORS.primary.pro[200],
    },
    admin: {
      bg: COLORS.accent.info[50],
      text: COLORS.accent.info[700],
      border: COLORS.accent.info[200],
    },
  },
  level: {
    beginner: {
      bg: COLORS.accent.info[50],
      text: COLORS.accent.info[700],
      border: COLORS.accent.info[200],
    },
    intermediate: {
      bg: COLORS.accent.warning[50],
      text: COLORS.accent.warning[700],
      border: COLORS.accent.warning[200],
    },
    advanced: {
      bg: COLORS.accent.danger[50],
      text: COLORS.accent.danger[700],
      border: COLORS.accent.danger[200],
    },
  },
} as const;

// ============================================================================
// ALERT VARIANTS
// ============================================================================

export const ALERT_VARIANTS = {
  success: {
    bg: COLORS.accent.success[50],
    border: COLORS.accent.success[200],
    text: COLORS.accent.success[800],
    icon: COLORS.accent.success[600],
  },
  warning: {
    bg: COLORS.accent.warning[50],
    border: COLORS.accent.warning[200],
    text: COLORS.accent.warning[800],
    icon: COLORS.accent.warning[600],
  },
  error: {
    bg: COLORS.accent.danger[50],
    border: COLORS.accent.danger[200],
    text: COLORS.accent.danger[800],
    icon: COLORS.accent.danger[600],
  },
  info: {
    bg: COLORS.accent.info[50],
    border: COLORS.accent.info[200],
    text: COLORS.accent.info[800],
    icon: COLORS.accent.info[600],
  },
} as const;

// ============================================================================
// BUTTON VARIANTS
// ============================================================================

export const BUTTON_VARIANTS = {
  solid: {
    default: {
      bg: COLORS.primary.pro[500],
      text: '#FFFFFF',
      hover: COLORS.primary.pro[600],
      disabled: COLORS.neutral[300],
    },
    kid: {
      bg: COLORS.primary.kid[500],
      text: '#FFFFFF',
      hover: COLORS.primary.kid[600],
      disabled: COLORS.neutral[300],
    },
    secondary: {
      bg: COLORS.secondary.pro[500],
      text: '#FFFFFF',
      hover: COLORS.secondary.pro[600],
      disabled: COLORS.neutral[300],
    },
    success: {
      bg: COLORS.accent.success[500],
      text: '#FFFFFF',
      hover: COLORS.accent.success[600],
      disabled: COLORS.neutral[300],
    },
    danger: {
      bg: COLORS.accent.danger[500],
      text: '#FFFFFF',
      hover: COLORS.accent.danger[600],
      disabled: COLORS.neutral[300],
    },
  },
  outline: {
    default: {
      bg: 'transparent',
      text: COLORS.primary.pro[500],
      border: COLORS.primary.pro[300],
      hover: COLORS.primary.pro[50],
      disabled: COLORS.neutral[300],
    },
    kid: {
      bg: 'transparent',
      text: COLORS.primary.kid[500],
      border: COLORS.primary.kid[300],
      hover: COLORS.primary.kid[50],
      disabled: COLORS.neutral[300],
    },
  },
  ghost: {
    default: {
      bg: 'transparent',
      text: COLORS.neutral[700],
      hover: COLORS.neutral[100],
      disabled: COLORS.neutral[300],
    },
  },
} as const;

export default {
  TYPOGRAPHY,
  COLORS,
  SPACING,
  COMPONENT_SIZES,
  SHADOWS,
  BORDER_RADIUS,
  ANIMATIONS,
  ROLE_THEMES,
  BADGE_VARIANTS,
  ALERT_VARIANTS,
  BUTTON_VARIANTS,
};
