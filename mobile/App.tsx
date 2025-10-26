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
import { useAuthStore } from './src/stores/authStore';
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
  const { loadFromStorage } = useAuthStore();
  const { loadSyncStatus } = useSyncStore();

  /**
   * Initialisation de l'application
   */
  useEffect(() => {
    const initialize = async () => {
      try {
        // Charger les données persistées
        await Promise.all([
          loadFromStorage(),
          loadSyncStatus(),
        ]);
      } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
      } finally {
        setIsReady(true);
      }
    };

    initialize();
  }, [loadFromStorage, loadSyncStatus]);

  // Afficher un loader pendant l'initialisation
  if (!isReady) {
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
