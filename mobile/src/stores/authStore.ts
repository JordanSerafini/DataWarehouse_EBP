/**
 * Store d'authentification avec Zustand
 * Gère l'état de l'utilisateur connecté et les tokens JWT
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthTokens } from '../types/user.types';
import { apiService } from '../services/api.service';

interface AuthState {
  // État
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  login: (email: string, password: string) => Promise<void>;
  loginWithData: (user: User, tokens: AuthTokens) => Promise<void>;
  logout: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

// Clés AsyncStorage
const STORAGE_KEYS = {
  USER: '@auth/user',
  TOKENS: '@auth/tokens',
};

export const useAuthStore = create<AuthState>((set, get) => ({
  // État initial
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: true,

  // Définir l'utilisateur
  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },

  // Définir les tokens
  setTokens: (tokens) => {
    set({ tokens });
  },

  // Login - Appel API puis sauvegarde
  login: async (email, password) => {
    try {
      set({ isLoading: true });

      // Appeler l'API de login
      const response = await apiService.login({ email, password });

      const user: User = {
        id: response.user.id,
        email: response.user.email,
        role: response.user.role,
        colleagueId: response.user.colleagueId,
        name: response.user.name,
        isActive: response.user.isActive,
      };

      const tokens: AuthTokens = {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken || '',
        expiresIn: response.expiresIn,
      };

      // Sauvegarder dans AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      await AsyncStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(tokens));

      // Mettre à jour le state
      set({
        user,
        tokens,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  },

  // LoginWithData - Sauvegarde directe user + tokens (pour refresh, etc.)
  loginWithData: async (user, tokens) => {
    try {
      // Sauvegarder dans AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      await AsyncStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(tokens));

      // Mettre à jour le state
      set({
        user,
        tokens,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données de connexion:', error);
      throw error;
    }
  },

  // Logout - Nettoie tout
  logout: async () => {
    try {
      // Supprimer de AsyncStorage
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKENS);

      // Réinitialiser le state
      set({
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  },

  // Charger depuis AsyncStorage (au démarrage de l'app)
  loadFromStorage: async () => {
    try {
      set({ isLoading: true });

      const [userJson, tokensJson] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.TOKENS),
      ]);

      if (userJson && tokensJson) {
        const user = JSON.parse(userJson) as User;
        const tokens = JSON.parse(tokensJson) as AuthTokens;

        // TODO: Vérifier si le token est expiré
        // Si expiré, tenter un refresh

        set({
          user,
          tokens,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données de connexion:', error);
      set({ isLoading: false });
    }
  },

  // Mettre à jour les informations utilisateur
  updateUser: async (updates) => {
    const { user } = get();
    if (!user) return;

    const updatedUser = { ...user, ...updates };

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      set({ user: updatedUser });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      throw error;
    }
  },
}));
