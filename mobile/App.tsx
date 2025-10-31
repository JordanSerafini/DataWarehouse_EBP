/**
 * Application principale
 * Configure les providers et la navigation
 *
 * Phase 2 - 2025 UI/UX Trends:
 * - Dark Mode natif avec auto-détection système
 * - Thèmes Material Design 3 dynamiques
 */

import './global.css'; // NativeWind styles

import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import ToastManager from 'toastify-react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Navigation
import AppNavigator from './src/navigation/AppNavigator';

// Stores
import { useAuthStore, useAuthHydrated } from './src/stores/authStore.v2';
import { useSyncStore } from './src/stores/syncStore';
import { useThemeStore, useThemeHydrated, initSystemThemeListener } from './src/stores/themeStore';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const authHydrated = useAuthHydrated();
  const themeHydrated = useThemeHydrated();
  const { loadSyncStatus } = useSyncStore();

  // Récupérer le thème dynamique depuis le store
  const theme = useThemeStore((state) => state.theme);
  const isDark = useThemeStore((state) => state.isDark);

  /**
   * Initialiser le listener de changement de thème système
   */
  useEffect(() => {
    const cleanup = initSystemThemeListener();
    return cleanup;
  }, []);

  /**
   * Initialisation de l'application
   */
  useEffect(() => {
    const initialize = async () => {
      try {
        // Charger uniquement syncStatus (auth et theme sont auto-hydratés)
        await loadSyncStatus();
      } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
      } finally {
        setIsReady(true);
      }
    };

    // Attendre que les stores soient hydratés
    if (authHydrated && themeHydrated) {
      initialize();
    }
  }, [authHydrated, themeHydrated, loadSyncStatus]);

  // Afficher un loader pendant l'initialisation
  if (!isReady || !authHydrated || !themeHydrated) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
        <ActivityIndicator size="large" color={isDark ? '#bb86fc' : '#6200ee'} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <PaperProvider theme={theme}>
        <ToastManager />
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <AppNavigator />
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor est gérée dynamiquement dans le JSX
  },
});
