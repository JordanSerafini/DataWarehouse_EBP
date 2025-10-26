/**
 * Application principale
 * Configure les providers et la navigation
 */

import './global.css'; // NativeWind styles

import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import ToastManager from 'toastify-react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Navigation
import AppNavigator from './src/navigation/AppNavigator';

// Stores
import { useAuthStore, useAuthHydrated } from './src/stores/authStore.v2';
import { useSyncStore } from './src/stores/syncStore';

// Thème personnalisé
const customTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200ee',
    secondary: '#03dac6',
    tertiary: '#018786',
    error: '#b00020',
    background: '#f5f5f5',
    surface: '#ffffff',
  },
};

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const authHydrated = useAuthHydrated(); // authStore.v2 gère l'hydratation automatiquement
  const { loadSyncStatus } = useSyncStore();

  /**
   * Initialisation de l'application
   */
  useEffect(() => {
    const initialize = async () => {
      try {
        // Charger uniquement syncStatus (auth est auto-hydraté)
        await loadSyncStatus();
      } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
      } finally {
        setIsReady(true);
      }
    };

    // Attendre que le store auth soit hydraté
    if (authHydrated) {
      initialize();
    }
  }, [authHydrated, loadSyncStatus]);

  // Afficher un loader pendant l'initialisation
  if (!isReady || !authHydrated) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <PaperProvider theme={customTheme}>
        <ToastManager />
        <StatusBar style="auto" />
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
    backgroundColor: '#f5f5f5',
  },
});
