/**
 * Store de synchronisation avec Zustand
 * Gère l'état de la synchronisation offline-first
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SyncStatus {
  lastSyncDate: string | null;
  isSyncing: boolean;
  syncProgress: number; // 0-100
  syncMessage: string;
  hasUnsyncedChanges: boolean;
  interventionsCount: number;
  customersCount: number;
  projectsCount: number;
}

interface SyncState extends SyncStatus {
  // Actions
  setSyncStatus: (status: Partial<SyncStatus>) => void;
  startSync: () => void;
  updateSyncProgress: (progress: number, message: string) => void;
  completeSyncSuccess: () => Promise<void>;
  completeSyncError: (error: string) => void;
  markUnsyncedChanges: () => Promise<void>;
  clearUnsyncedChanges: () => Promise<void>;
  loadSyncStatus: () => Promise<void>;
}

const STORAGE_KEY = '@sync/status';

export const useSyncStore = create<SyncState>((set, get) => ({
  // État initial
  lastSyncDate: null,
  isSyncing: false,
  syncProgress: 0,
  syncMessage: '',
  hasUnsyncedChanges: false,
  interventionsCount: 0,
  customersCount: 0,
  projectsCount: 0,

  // Définir le statut de sync
  setSyncStatus: (status) => {
    set(status);
  },

  // Démarrer une sync
  startSync: () => {
    set({
      isSyncing: true,
      syncProgress: 0,
      syncMessage: 'Démarrage de la synchronisation...',
    });
  },

  // Mettre à jour la progression
  updateSyncProgress: (progress, message) => {
    set({
      syncProgress: Math.min(100, Math.max(0, progress)),
      syncMessage: message,
    });
  },

  // Terminer la sync avec succès
  completeSyncSuccess: async () => {
    const now = new Date().toISOString();

    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          lastSyncDate: now,
          hasUnsyncedChanges: false,
        })
      );

      set({
        isSyncing: false,
        syncProgress: 100,
        syncMessage: 'Synchronisation terminée',
        lastSyncDate: now,
        hasUnsyncedChanges: false,
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du statut de sync:', error);
    }
  },

  // Terminer la sync avec erreur
  completeSyncError: (error) => {
    set({
      isSyncing: false,
      syncProgress: 0,
      syncMessage: `Erreur: ${error}`,
    });
  },

  // Marquer qu'il y a des changements non synchronisés
  markUnsyncedChanges: async () => {
    try {
      const { lastSyncDate } = get();
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          lastSyncDate,
          hasUnsyncedChanges: true,
        })
      );

      set({ hasUnsyncedChanges: true });
    } catch (error) {
      console.error('Erreur lors du marquage des changements non synchronisés:', error);
    }
  },

  // Nettoyer les changements non synchronisés
  clearUnsyncedChanges: async () => {
    try {
      const { lastSyncDate } = get();
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          lastSyncDate,
          hasUnsyncedChanges: false,
        })
      );

      set({ hasUnsyncedChanges: false });
    } catch (error) {
      console.error('Erreur lors du nettoyage des changements non synchronisés:', error);
    }
  },

  // Charger le statut depuis AsyncStorage
  loadSyncStatus: async () => {
    try {
      const statusJson = await AsyncStorage.getItem(STORAGE_KEY);
      if (statusJson) {
        const status = JSON.parse(statusJson);
        set({
          lastSyncDate: status.lastSyncDate || null,
          hasUnsyncedChanges: status.hasUnsyncedChanges || false,
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement du statut de sync:', error);
    }
  },
}));
