/**
 * Store d'authentification avec Zustand (Version optimisée 2025 + Biométrie)
 * Utilise persist middleware pour auto-persistence et devtools pour debug
 *
 * Nouveautés Phase 2:
 * - Biométrie Face ID / Touch ID
 * - Stockage sécurisé des tokens (SecureStore)
 * - Auto-login avec biométrie
 * - Refresh token automatique
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthTokens, mapBackendRole } from '../types/user.types';
import { apiService } from '../services/api.service';
import { BiometricService, BiometricCapabilities } from '../services/biometric.service';
import { SecureStorageService } from '../services/secureStorage.service';

interface AuthState {
  // État
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Biométrie
  biometricEnabled: boolean;
  biometricCapabilities: BiometricCapabilities | null;

  // Actions
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  loginWithBiometric: () => Promise<void>;
  loginWithData: (user: User, tokens: AuthTokens) => void;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  clearError: () => void;

  // Biométrie
  enableBiometric: (email: string, password: string) => Promise<void>;
  disableBiometric: () => Promise<void>;
  checkBiometricCapabilities: () => Promise<void>;

  // Auto-login
  attemptAutoLogin: () => Promise<boolean>;

  // Internal helpers (non-persistées)
  _hydrated: boolean;
  setHydrated: () => void;
}

/**
 * Store d'authentification avec persist middleware
 * Avantages :
 * - Auto-persistence dans AsyncStorage (plus besoin de loadFromStorage)
 * - Immer pour mutations immutables
 * - Devtools support (en dev uniquement)
 * - Meilleure performance avec sélecteurs
 */
export const useAuthStore = create<AuthState>()(
  persist(
    immer((set, get) => ({
      // État initial
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      _hydrated: false,
      biometricEnabled: false,
      biometricCapabilities: null,

      // Marquer comme hydraté après chargement depuis AsyncStorage
      setHydrated: () => {
        set((state) => {
          state._hydrated = true;
        });
      },

      // Vérifier les capacités biométriques
      checkBiometricCapabilities: async () => {
        try {
          const capabilities = await BiometricService.getCapabilities();
          set((state) => {
            state.biometricCapabilities = capabilities;
          });
        } catch (error) {
          console.error('[AuthStore] Error checking biometric capabilities:', error);
        }
      },

      // Login - Appel API puis sauvegarde automatique par persist
      login: async (email, password, rememberMe = false) => {
        console.log('📱 AuthStore.login called with:', { email, passwordLength: password?.length });

        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          console.log('📡 Calling apiService.login...');
          const response = await apiService.login({ email, password });
          console.log('✅ apiService.login success');

          const user: User = {
            id: response.user.id,
            email: response.user.email,
            fullName: response.user.fullName,
            role: mapBackendRole(response.user.role), // Mapper snake_case → SCREAMING_SNAKE_CASE
            colleagueId: response.user.colleagueId,
            ninjaOneTechnicianId: response.user.ninjaOneTechnicianId,
            permissions: response.user.permissions,
            isActive: true,
          };

          const tokens: AuthTokens = {
            accessToken: response.accessToken,
            refreshToken: response.refreshToken || '',
            expiresIn: response.expiresIn,
          };

          // Sauvegarder les tokens dans SecureStore
          await SecureStorageService.setTokens({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          });
          await SecureStorageService.setUserData(user);

          set((state) => {
            state.user = user;
            state.tokens = tokens;
            state.isAuthenticated = true;
            state.isLoading = false;
            state.error = null;
          });
        } catch (error: any) {
          console.error('❌ Login error in authStore:', {
            name: error?.name,
            message: error?.message,
            response: error?.response,
            stack: error?.stack,
          });

          set((state) => {
            state.isLoading = false;
            state.error = error?.message || 'Erreur de connexion';
          });
          throw error;
        }
      },

      // Login avec biométrie (utilise les credentials stockés)
      loginWithBiometric: async () => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          // Vérifier que la biométrie est activée
          const isBiometricEnabled = await SecureStorageService.isBiometricEnabled();
          if (!isBiometricEnabled) {
            throw new Error('La biométrie n\'est pas activée');
          }

          // Authentifier avec biométrie
          const authenticated = await BiometricService.authenticate(
            'Connectez-vous à l\'application'
          );

          if (!authenticated) {
            throw new Error('Authentification biométrique échouée');
          }

          // Récupérer les credentials stockés
          const credentials = await SecureStorageService.getCredentials();
          if (!credentials) {
            throw new Error('Aucun identifiant stocké');
          }

          // Login classique avec les credentials
          await get().login(credentials.email, credentials.password, true);
        } catch (error: any) {
          set((state) => {
            state.isLoading = false;
            state.error = error?.message || 'Erreur de connexion biométrique';
          });
          throw error;
        }
      },

      // Activer la biométrie (stocke les credentials de manière sécurisée)
      enableBiometric: async (email, password) => {
        try {
          // Vérifier que la biométrie est disponible
          const isUsable = await BiometricService.isUsable();
          if (!isUsable) {
            throw new Error('La biométrie n\'est pas disponible sur cet appareil');
          }

          // Demander authentification biométrique pour confirmation
          const authenticated = await BiometricService.authenticate(
            'Activez Face ID / Touch ID pour cette application'
          );

          if (!authenticated) {
            throw new Error('Authentification biométrique échouée');
          }

          // Stocker les credentials de manière sécurisée
          await SecureStorageService.setCredentials({ email, password });
          await SecureStorageService.setBiometricEnabled(true);

          set((state) => {
            state.biometricEnabled = true;
          });
        } catch (error: any) {
          console.error('[AuthStore] Error enabling biometric:', error);
          throw error;
        }
      },

      // Désactiver la biométrie (efface les credentials stockés)
      disableBiometric: async () => {
        try {
          await SecureStorageService.clearCredentials();
          await SecureStorageService.setBiometricEnabled(false);

          set((state) => {
            state.biometricEnabled = false;
          });
        } catch (error) {
          console.error('[AuthStore] Error disabling biometric:', error);
          throw error;
        }
      },

      // Tenter un auto-login (appelé au démarrage de l'app)
      attemptAutoLogin: async () => {
        try {
          // Vérifier si la biométrie est activée
          const isBiometricEnabled = await SecureStorageService.isBiometricEnabled();

          if (isBiometricEnabled) {
            // Vérifier si des credentials sont stockés
            const hasCredentials = await SecureStorageService.hasStoredCredentials();

            if (hasCredentials) {
              set((state) => {
                state.biometricEnabled = true;
              });

              // Tenter login biométrique
              await get().loginWithBiometric();
              return true;
            }
          }

          // Sinon, vérifier si un token est stocké
          const tokens = await SecureStorageService.getTokens();
          const userData = await SecureStorageService.getUserData();

          if (tokens && userData) {
            // Restaurer la session
            set((state) => {
              state.user = userData;
              state.tokens = {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken || '',
                expiresIn: 3600, // Valeur par défaut
              };
              state.isAuthenticated = true;
            });
            return true;
          }

          return false;
        } catch (error) {
          console.error('[AuthStore] Auto-login failed:', error);
          return false;
        }
      },

      // LoginWithData - Sauvegarde directe (pour refresh token)
      loginWithData: (user, tokens) => {
        set((state) => {
          state.user = user;
          state.tokens = tokens;
          state.isAuthenticated = true;
          state.isLoading = false;
          state.error = null;
        });
      },

      // Logout - Nettoie tout (persist s'occupe de supprimer d'AsyncStorage)
      logout: async () => {
        try {
          // Optionnel : appeler l'API de logout
          // await apiService.logout();

          // Nettoyer uniquement les tokens (garder credentials si biométrie activée)
          await SecureStorageService.clearTokens();
        } catch (error) {
          console.warn('Erreur lors du logout:', error);
        }

        set((state) => {
          state.user = null;
          state.tokens = null;
          state.isAuthenticated = false;
          state.isLoading = false;
          state.error = null;
          // On garde biometricEnabled pour permettre un re-login rapide
        });
      },

      // Mettre à jour les informations utilisateur (immer permet mutations directes)
      updateUser: (updates) => {
        set((state) => {
          if (state.user) {
            state.user = { ...state.user, ...updates };
          }
        });
      },

      // Effacer l'erreur
      clearError: () => {
        set((state) => {
          state.error = null;
        });
      },
    })),
    {
      name: 'auth-storage', // Nom unique pour AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Ne persister que ce qui est nécessaire
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
        biometricEnabled: state.biometricEnabled,
      }),
      onRehydrateStorage: () => (state) => {
        // Appelé après chargement depuis AsyncStorage
        state?.setHydrated();

        // Vérifier les capacités biométriques au démarrage
        state?.checkBiometricCapabilities();

        // Tenter auto-login si possible
        // Note: Ne pas bloquer l'hydratation, exécuter en arrière-plan
        if (state) {
          state.attemptAutoLogin().catch((error) => {
            console.log('[AuthStore] Auto-login skipped:', error);
          });
        }
      },
    }
  )
);

/**
 * Sélecteurs optimisés (évitent re-renders inutiles)
 */
export const authSelectors = {
  user: (state: AuthState) => state.user,
  isAuthenticated: (state: AuthState) => state.isAuthenticated,
  isLoading: (state: AuthState) => state.isLoading,
  tokens: (state: AuthState) => state.tokens,
  error: (state: AuthState) => state.error,
  permissions: (state: AuthState) => state.user?.permissions || [],
  role: (state: AuthState) => state.user?.role,
  hasPermission: (permission: string) => (state: AuthState) =>
    state.user?.permissions?.includes(permission) || false,

  // Sélecteurs biométrie
  biometricEnabled: (state: AuthState) => state.biometricEnabled,
  biometricCapabilities: (state: AuthState) => state.biometricCapabilities,
  canUseBiometric: (state: AuthState) =>
    state.biometricCapabilities?.isAvailable &&
    state.biometricCapabilities?.isEnrolled,
};

/**
 * Hook pour attendre que le store soit hydraté
 */
export const useAuthHydrated = () => {
  return useAuthStore((state) => state._hydrated);
};
