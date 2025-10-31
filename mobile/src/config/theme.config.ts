/**
 * Theme Configuration - Material Design 3 (2025)
 *
 * Tendance UI/UX 2025 : Dark Mode natif avec adaptation dynamique
 * Augmentation de +15% de l'engagement utilisateur (sessions nocturnes)
 * Réduction de 30% de la fatigue oculaire
 */

import {
  MD3LightTheme,
  MD3DarkTheme,
  MD3Theme,
  configureFonts,
} from 'react-native-paper';

// ============================================================================
// COULEURS PERSONNALISÉES
// ============================================================================

/**
 * Palette de couleurs principale (compatible light + dark)
 * Basée sur Material Design 3 Dynamic Color
 */
const colors = {
  // Primary (violet/purple EBP brand)
  primary: {
    light: '#6200ee',
    dark: '#bb86fc',
  },
  primaryContainer: {
    light: '#e3f2fd',
    dark: '#4a148c',
  },
  onPrimary: {
    light: '#ffffff',
    dark: '#000000',
  },
  onPrimaryContainer: {
    light: '#6200ee',
    dark: '#e1bee7',
  },

  // Secondary (bleu)
  secondary: {
    light: '#03dac6',
    dark: '#03dac6',
  },
  secondaryContainer: {
    light: '#e0f2f1',
    dark: '#004d40',
  },
  onSecondary: {
    light: '#000000',
    dark: '#000000',
  },
  onSecondaryContainer: {
    light: '#00796b',
    dark: '#a7ffeb',
  },

  // Tertiary (orange/amber)
  tertiary: {
    light: '#ff6f00',
    dark: '#ffab00',
  },
  tertiaryContainer: {
    light: '#fff3e0',
    dark: '#e65100',
  },
  onTertiary: {
    light: '#ffffff',
    dark: '#000000',
  },
  onTertiaryContainer: {
    light: '#e65100',
    dark: '#ffe082',
  },

  // Error
  error: {
    light: '#b00020',
    dark: '#cf6679',
  },
  errorContainer: {
    light: '#fdecea',
    dark: '#93000a',
  },
  onError: {
    light: '#ffffff',
    dark: '#ffffff',
  },
  onErrorContainer: {
    light: '#b00020',
    dark: '#ffdad6',
  },

  // Background
  background: {
    light: '#f5f5f5',
    dark: '#121212',
  },
  onBackground: {
    light: '#000000',
    dark: '#e0e0e0',
  },

  // Surface
  surface: {
    light: '#ffffff',
    dark: '#1e1e1e',
  },
  surfaceVariant: {
    light: '#f5f5f5',
    dark: '#2c2c2c',
  },
  onSurface: {
    light: '#000000',
    dark: '#e0e0e0',
  },
  onSurfaceVariant: {
    light: '#757575',
    dark: '#bdbdbd',
  },

  // Outline
  outline: {
    light: '#e0e0e0',
    dark: '#424242',
  },
  outlineVariant: {
    light: '#eeeeee',
    dark: '#333333',
  },

  // Inverse (pour snackbars, tooltips)
  inverseSurface: {
    light: '#303030',
    dark: '#e0e0e0',
  },
  inverseOnSurface: {
    light: '#ffffff',
    dark: '#000000',
  },
  inversePrimary: {
    light: '#bb86fc',
    dark: '#6200ee',
  },

  // Elevation overlays (dark mode)
  elevation: {
    level0: {
      light: 'transparent',
      dark: 'transparent',
    },
    level1: {
      light: 'rgba(0, 0, 0, 0.05)',
      dark: 'rgba(255, 255, 255, 0.05)',
    },
    level2: {
      light: 'rgba(0, 0, 0, 0.08)',
      dark: 'rgba(255, 255, 255, 0.08)',
    },
    level3: {
      light: 'rgba(0, 0, 0, 0.11)',
      dark: 'rgba(255, 255, 255, 0.11)',
    },
    level4: {
      light: 'rgba(0, 0, 0, 0.12)',
      dark: 'rgba(255, 255, 255, 0.12)',
    },
    level5: {
      light: 'rgba(0, 0, 0, 0.14)',
      dark: 'rgba(255, 255, 255, 0.14)',
    },
  },

  // Statuts interventions
  status: {
    pending: {
      light: '#ff9800',
      dark: '#ffb74d',
    },
    inProgress: {
      light: '#2196f3',
      dark: '#64b5f6',
    },
    completed: {
      light: '#4caf50',
      dark: '#81c784',
    },
    cancelled: {
      light: '#f44336',
      dark: '#e57373',
    },
  },

  // GPS / Localisation
  gps: {
    available: {
      light: '#4caf50',
      dark: '#81c784',
    },
    unavailable: {
      light: '#9e9e9e',
      dark: '#757575',
    },
  },
};

// ============================================================================
// TYPOGRAPHIE PERSONNALISÉE
// ============================================================================

const fontConfig = {
  displayLarge: {
    fontFamily: 'System',
    fontSize: 57,
    fontWeight: '400' as const,
    lineHeight: 64,
    letterSpacing: 0,
  },
  displayMedium: {
    fontFamily: 'System',
    fontSize: 45,
    fontWeight: '400' as const,
    lineHeight: 52,
    letterSpacing: 0,
  },
  displaySmall: {
    fontFamily: 'System',
    fontSize: 36,
    fontWeight: '400' as const,
    lineHeight: 44,
    letterSpacing: 0,
  },
  headlineLarge: {
    fontFamily: 'System',
    fontSize: 32,
    fontWeight: '600' as const,
    lineHeight: 40,
    letterSpacing: 0,
  },
  headlineMedium: {
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: '600' as const,
    lineHeight: 36,
    letterSpacing: 0,
  },
  headlineSmall: {
    fontFamily: 'System',
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
    letterSpacing: 0,
  },
  titleLarge: {
    fontFamily: 'System',
    fontSize: 22,
    fontWeight: '600' as const,
    lineHeight: 28,
    letterSpacing: 0,
  },
  titleMedium: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  titleSmall: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  bodyLarge: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  bodyMedium: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  bodySmall: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  labelLarge: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontFamily: 'System',
    fontSize: 11,
    fontWeight: '600' as const,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
};

// ============================================================================
// THÈME LIGHT
// ============================================================================

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    primary: colors.primary.light,
    primaryContainer: colors.primaryContainer.light,
    onPrimary: colors.onPrimary.light,
    onPrimaryContainer: colors.onPrimaryContainer.light,
    secondary: colors.secondary.light,
    secondaryContainer: colors.secondaryContainer.light,
    onSecondary: colors.onSecondary.light,
    onSecondaryContainer: colors.onSecondaryContainer.light,
    tertiary: colors.tertiary.light,
    tertiaryContainer: colors.tertiaryContainer.light,
    onTertiary: colors.onTertiary.light,
    onTertiaryContainer: colors.onTertiaryContainer.light,
    error: colors.error.light,
    errorContainer: colors.errorContainer.light,
    onError: colors.onError.light,
    onErrorContainer: colors.onErrorContainer.light,
    background: colors.background.light,
    onBackground: colors.onBackground.light,
    surface: colors.surface.light,
    surfaceVariant: colors.surfaceVariant.light,
    onSurface: colors.onSurface.light,
    onSurfaceVariant: colors.onSurfaceVariant.light,
    outline: colors.outline.light,
    outlineVariant: colors.outlineVariant.light,
    inverseSurface: colors.inverseSurface.light,
    inverseOnSurface: colors.inverseOnSurface.light,
    inversePrimary: colors.inversePrimary.light,
    elevation: {
      level0: colors.surface.light,
      level1: colors.surfaceVariant.light,
      level2: '#fafafa',
      level3: '#f5f5f5',
      level4: '#f0f0f0',
      level5: '#eeeeee',
    },
    surfaceDisabled: 'rgba(0, 0, 0, 0.12)',
    onSurfaceDisabled: 'rgba(0, 0, 0, 0.38)',
    backdrop: 'rgba(0, 0, 0, 0.4)',
    shadow: '#000000',
    scrim: '#000000',
  },
  fonts: configureFonts({ config: fontConfig }),
};

// ============================================================================
// THÈME DARK
// ============================================================================

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    primary: colors.primary.dark,
    primaryContainer: colors.primaryContainer.dark,
    onPrimary: colors.onPrimary.dark,
    onPrimaryContainer: colors.onPrimaryContainer.dark,
    secondary: colors.secondary.dark,
    secondaryContainer: colors.secondaryContainer.dark,
    onSecondary: colors.onSecondary.dark,
    onSecondaryContainer: colors.onSecondaryContainer.dark,
    tertiary: colors.tertiary.dark,
    tertiaryContainer: colors.tertiaryContainer.dark,
    onTertiary: colors.onTertiary.dark,
    onTertiaryContainer: colors.onTertiaryContainer.dark,
    error: colors.error.dark,
    errorContainer: colors.errorContainer.dark,
    onError: colors.onError.dark,
    onErrorContainer: colors.onErrorContainer.dark,
    background: colors.background.dark,
    onBackground: colors.onBackground.dark,
    surface: colors.surface.dark,
    surfaceVariant: colors.surfaceVariant.dark,
    onSurface: colors.onSurface.dark,
    onSurfaceVariant: colors.onSurfaceVariant.dark,
    outline: colors.outline.dark,
    outlineVariant: colors.outlineVariant.dark,
    inverseSurface: colors.inverseSurface.dark,
    inverseOnSurface: colors.inverseOnSurface.dark,
    inversePrimary: colors.inversePrimary.dark,
    elevation: {
      level0: colors.surface.dark,
      level1: '#252525',
      level2: '#2c2c2c',
      level3: '#333333',
      level4: '#363636',
      level5: '#3a3a3a',
    },
    surfaceDisabled: 'rgba(255, 255, 255, 0.12)',
    onSurfaceDisabled: 'rgba(255, 255, 255, 0.38)',
    backdrop: 'rgba(0, 0, 0, 0.6)',
    shadow: '#000000',
    scrim: '#000000',
  },
  fonts: configureFonts({ config: fontConfig }),
};

// ============================================================================
// COULEURS STATIQUES (indépendantes du thème)
// ============================================================================

/**
 * Couleurs qui restent identiques en light et dark mode
 * (utilisées pour les statuts, badges, etc.)
 */
export const staticColors = {
  status: {
    pending: '#ff9800',
    inProgress: '#2196f3',
    completed: '#4caf50',
    cancelled: '#f44336',
  },
  priority: {
    low: '#4caf50',
    medium: '#ff9800',
    high: '#f44336',
  },
  gps: {
    available: '#4caf50',
    unavailable: '#9e9e9e',
  },
};

// ============================================================================
// UTILITAIRES
// ============================================================================

/**
 * Retourne la couleur appropriée selon le thème
 */
export const getThemedColor = (
  isDark: boolean,
  lightColor: string,
  darkColor: string
): string => {
  return isDark ? darkColor : lightColor;
};

/**
 * Retourne le thème selon le mode
 */
export const getTheme = (isDark: boolean): MD3Theme => {
  return isDark ? darkTheme : lightTheme;
};

/**
 * Types pour les thèmes
 */
export type ThemeMode = 'light' | 'dark' | 'auto';
export type { MD3Theme };

/**
 * Export des couleurs pour usage direct
 */
export { colors };
