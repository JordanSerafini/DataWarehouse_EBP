/**
 * Store de synchronisation avec Zustand (Version optimisée 2025)
 * Gère l'état de la synchronisation offline-first avec persist middleware
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
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
  lastError: string | null;
}

interface SyncState extends SyncStatus {
  // Actions
  startSync: () => void;
  updateProgress: (progress: number, message: string) => void;
  completeSuccess: (counts?: { interventions?: number; customers?: number; projects?: number }) => void;
  completeError: (error: string) => void;
  markUnsyncedChanges: () => void;
  clearUnsyncedChanges: () => void;
  resetSync: () => void;

  // Internal
  _hydrated: boolean;
  setHydrated: () => void;
}

/**
 * Store de synchronisation avec persist middleware
 * Avantages :
 * - Auto-persistence des statuts de sync
 * - Immer pour mutations immutables
 * - Gestion d'erreurs améliorée
 * - Compteurs de données locales
 */
export const useSyncStore = create<SyncState>()(
  persist(
    immer((set, get) => ({
      // État initial
      lastSyncDate: null,
      isSyncing: false,
      syncProgress: 0,
      syncMessage: '',
      hasUnsyncedChanges: false,
      interventionsCount: 0,
      customersCount: 0,
      projectsCount: 0,
      lastError: null,
      _hydrated: false,

      setHydrated: () => {
        set((state) => {
          state._hydrated = true;
        });
      },

      // Démarrer une sync
      startSync: () => {
        set((state) => {
          state.isSyncing = true;
          state.syncProgress = 0;
          state.syncMessage = 'Démarrage de la synchronisation...';
          state.lastError = null;
        });
      },

      // Mettre à jour la progression
      updateProgress: (progress, message) => {
        set((state) => {
          state.syncProgress = Math.min(100, Math.max(0, progress));
          state.syncMessage = message;
        });
      },

      // Terminer la sync avec succès
      completeSuccess: (counts) => {
        const now = new Date().toISOString();

        set((state) => {
          state.isSyncing = false;
          state.syncProgress = 100;
          state.syncMessage = 'Synchronisation terminée';
          state.lastSyncDate = now;
          state.hasUnsyncedChanges = false;
          state.lastError = null;

          // Mettre à jour les compteurs si fournis
          if (counts?.interventions !== undefined) {
            state.interventionsCount = counts.interventions;
          }
          if (counts?.customers !== undefined) {
            state.customersCount = counts.customers;
          }
          if (counts?.projects !== undefined) {
            state.projectsCount = counts.projects;
          }
        });
      },

      // Terminer la sync avec erreur
      completeError: (error) => {
        set((state) => {
          state.isSyncing = false;
          state.syncProgress = 0;
          state.syncMessage = `Erreur: ${error}`;
          state.lastError = error;
        });
      },

      // Marquer qu'il y a des changements non synchronisés
      markUnsyncedChanges: () => {
        set((state) => {
          state.hasUnsyncedChanges = true;
        });
      },

      // Nettoyer les changements non synchronisés
      clearUnsyncedChanges: () => {
        set((state) => {
          state.hasUnsyncedChanges = false;
        });
      },

      // Réinitialiser la sync (pour forcer une nouvelle sync complète)
      resetSync: () => {
        set((state) => {
          state.lastSyncDate = null;
          state.isSyncing = false;
          state.syncProgress = 0;
          state.syncMessage = '';
          state.lastError = null;
          state.interventionsCount = 0;
          state.customersCount = 0;
          state.projectsCount = 0;
        });
      },
    })),
    {
      name: 'sync-storage', // Nom unique pour AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Persister tout sauf les états temporaires
        lastSyncDate: state.lastSyncDate,
        hasUnsyncedChanges: state.hasUnsyncedChanges,
        interventionsCount: state.interventionsCount,
        customersCount: state.customersCount,
        projectsCount: state.projectsCount,
        lastError: state.lastError,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);

/**
 * Sélecteurs optimisés (évitent re-renders inutiles)
 */
export const syncSelectors = {
  isSyncing: (state: SyncState) => state.isSyncing,
  syncProgress: (state: SyncState) => state.syncProgress,
  syncMessage: (state: SyncState) => state.syncMessage,
  lastSyncDate: (state: SyncState) => state.lastSyncDate,
  hasUnsyncedChanges: (state: SyncState) => state.hasUnsyncedChanges,
  lastError: (state: SyncState) => state.lastError,
  totalCount: (state: SyncState) =>
    state.interventionsCount + state.customersCount + state.projectsCount,
  counts: (state: SyncState) => ({
    interventions: state.interventionsCount,
    customers: state.customersCount,
    projects: state.projectsCount,
  }),
};

/**
 * Hook pour attendre que le store soit hydraté
 */
export const useSyncHydrated = () => {
  return useSyncStore((state) => state._hydrated);
};

/**
 * Hook utilitaire pour afficher le temps depuis la dernière sync
 */
export const useTimeSinceLastSync = (): string | null => {
  const lastSyncDate = useSyncStore(syncSelectors.lastSyncDate);

  if (!lastSyncDate) return null;

  const now = Date.now();
  const lastSync = new Date(lastSyncDate).getTime();
  const diffMs = now - lastSync;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'À l\'instant';
  if (diffMins < 60) return `Il y a ${diffMins} min`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `Il y a ${diffHours}h`;

  const diffDays = Math.floor(diffHours / 24);
  return `Il y a ${diffDays}j`;
};
