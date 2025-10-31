/**
 * Composant SafeAreaScreen
 * Wrapper réutilisable pour tous les écrans avec safe area
 * Respecte les zones sûres (notch, barres de navigation)
 */

import React from 'react';
import { StyleSheet, ViewStyle, Platform, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore } from '../stores/themeStore';

interface SafeAreaScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  extraPaddingTop?: number;
  extraPaddingBottom?: number;
}

/**
 * Wrapper pour écrans avec safe area automatique
 *
 * @param children - Contenu de l'écran
 * @param style - Styles additionnels
 * @param edges - Bords à protéger (par défaut: tous)
 * @param extraPaddingTop - Padding supplémentaire en haut (optionnel)
 * @param extraPaddingBottom - Padding supplémentaire en bas (optionnel)
 *
 * @example
 * ```tsx
 * <SafeAreaScreen>
 *   <Text>Mon contenu</Text>
 * </SafeAreaScreen>
 * ```
 *
 * @example
 * ```tsx
 * // Ne protéger que le haut (utile si vous avez une TabBar en bas)
 * <SafeAreaScreen edges={['top']}>
 *   <Text>Mon contenu</Text>
 * </SafeAreaScreen>
 * ```
 *
 * @example
 * ```tsx
 * // Ajouter du padding supplémentaire
 * <SafeAreaScreen extraPaddingTop={10} extraPaddingBottom={10}>
 *   <Text>Mon contenu</Text>
 * </SafeAreaScreen>
 * ```
 */
export const SafeAreaScreen: React.FC<SafeAreaScreenProps> = ({
  children,
  style,
  edges = ['top', 'bottom', 'left', 'right'],
  extraPaddingTop = 0,
  extraPaddingBottom = 0,
}) => {
  const isDark = useThemeStore((state) => state.isDark);
  const insets = useSafeAreaInsets();

  // Calculer le padding total (safe area + extra + StatusBar Android)
  // Ajout de padding minimum pour éviter tout empiètement
  // Augmentez ces valeurs si vous avez encore des problèmes
  const MIN_PADDING_TOP = 12;
  const MIN_PADDING_BOTTOM = 12;

  const paddingTop = edges.includes('top')
    ? Math.max(
        insets.top + MIN_PADDING_TOP,
        Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + MIN_PADDING_TOP : MIN_PADDING_TOP
      ) + extraPaddingTop
    : extraPaddingTop;

  const paddingBottom = edges.includes('bottom')
    ? Math.max(insets.bottom, MIN_PADDING_BOTTOM) + extraPaddingBottom
    : extraPaddingBottom;

  const paddingLeft = edges.includes('left') ? insets.left : 0;
  const paddingRight = edges.includes('right') ? insets.right : 0;

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#121212' : '#f5f5f5',
          paddingTop,
          paddingBottom,
          paddingLeft,
          paddingRight,
        },
        style,
      ]}
      edges={[]} // On gère manuellement les edges pour avoir plus de contrôle
    >
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
