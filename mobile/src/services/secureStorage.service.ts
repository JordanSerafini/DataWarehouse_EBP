/**
 * SecureStorageService - Stockage sécurisé des credentials
 *
 * Utilise expo-secure-store pour stocker de manière chiffrée:
 * - Tokens JWT
 * - Credentials utilisateur (si biométrie activée)
 * - Refresh tokens
 *
 * Compatible Expo Go (utilise Keychain sur iOS, EncryptedSharedPreferences sur Android)
 */

import * as SecureStore from 'expo-secure-store';

// Clés de stockage
const KEYS = {
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  USER_EMAIL: 'auth_user_email',
  USER_PASSWORD: 'auth_user_password', // Stocké uniquement si biométrie activée
  BIOMETRIC_ENABLED: 'auth_biometric_enabled',
  USER_DATA: 'auth_user_data',
} as const;

export interface StoredCredentials {
  email: string;
  password: string;
}

export interface StoredTokens {
  accessToken: string;
  refreshToken?: string;
}

export class SecureStorageService {
  /**
   * Stocke le token d'accès
   */
  static async setAccessToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, token);
    } catch (error) {
      console.error('[SecureStorage] Error storing access token:', error);
      throw error;
    }
  }

  /**
   * Récupère le token d'accès
   */
  static async getAccessToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
    } catch (error) {
      console.error('[SecureStorage] Error getting access token:', error);
      return null;
    }
  }

  /**
   * Stocke le refresh token
   */
  static async setRefreshToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, token);
    } catch (error) {
      console.error('[SecureStorage] Error storing refresh token:', error);
      throw error;
    }
  }

  /**
   * Récupère le refresh token
   */
  static async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('[SecureStorage] Error getting refresh token:', error);
      return null;
    }
  }

  /**
   * Stocke les deux tokens (access + refresh)
   */
  static async setTokens(tokens: StoredTokens): Promise<void> {
    try {
      await this.setAccessToken(tokens.accessToken);
      if (tokens.refreshToken) {
        await this.setRefreshToken(tokens.refreshToken);
      }
    } catch (error) {
      console.error('[SecureStorage] Error storing tokens:', error);
      throw error;
    }
  }

  /**
   * Récupère les deux tokens (access + refresh)
   */
  static async getTokens(): Promise<StoredTokens | null> {
    try {
      const accessToken = await this.getAccessToken();
      if (!accessToken) return null;

      const refreshToken = await this.getRefreshToken();
      return {
        accessToken,
        refreshToken: refreshToken || undefined,
      };
    } catch (error) {
      console.error('[SecureStorage] Error getting tokens:', error);
      return null;
    }
  }

  /**
   * Stocke les credentials utilisateur (UNIQUEMENT si biométrie activée)
   * ⚠️ Ne jamais appeler cette fonction si la biométrie n'est pas activée!
   */
  static async setCredentials(credentials: StoredCredentials): Promise<void> {
    try {
      await SecureStore.setItemAsync(KEYS.USER_EMAIL, credentials.email);
      await SecureStore.setItemAsync(KEYS.USER_PASSWORD, credentials.password);
    } catch (error) {
      console.error('[SecureStorage] Error storing credentials:', error);
      throw error;
    }
  }

  /**
   * Récupère les credentials utilisateur
   */
  static async getCredentials(): Promise<StoredCredentials | null> {
    try {
      const email = await SecureStore.getItemAsync(KEYS.USER_EMAIL);
      const password = await SecureStore.getItemAsync(KEYS.USER_PASSWORD);

      if (!email || !password) return null;

      return { email, password };
    } catch (error) {
      console.error('[SecureStorage] Error getting credentials:', error);
      return null;
    }
  }

  /**
   * Active/désactive la biométrie
   */
  static async setBiometricEnabled(enabled: boolean): Promise<void> {
    try {
      await SecureStore.setItemAsync(KEYS.BIOMETRIC_ENABLED, enabled ? 'true' : 'false');
    } catch (error) {
      console.error('[SecureStorage] Error setting biometric status:', error);
      throw error;
    }
  }

  /**
   * Vérifie si la biométrie est activée
   */
  static async isBiometricEnabled(): Promise<boolean> {
    try {
      const value = await SecureStore.getItemAsync(KEYS.BIOMETRIC_ENABLED);
      return value === 'true';
    } catch (error) {
      console.error('[SecureStorage] Error checking biometric status:', error);
      return false;
    }
  }

  /**
   * Stocke les données utilisateur (JSON)
   */
  static async setUserData(userData: any): Promise<void> {
    try {
      await SecureStore.setItemAsync(KEYS.USER_DATA, JSON.stringify(userData));
    } catch (error) {
      console.error('[SecureStorage] Error storing user data:', error);
      throw error;
    }
  }

  /**
   * Récupère les données utilisateur
   */
  static async getUserData(): Promise<any | null> {
    try {
      const data = await SecureStore.getItemAsync(KEYS.USER_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('[SecureStorage] Error getting user data:', error);
      return null;
    }
  }

  /**
   * Supprime tous les tokens
   */
  static async clearTokens(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN);
      await SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('[SecureStorage] Error clearing tokens:', error);
    }
  }

  /**
   * Supprime les credentials stockés
   */
  static async clearCredentials(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(KEYS.USER_EMAIL);
      await SecureStore.deleteItemAsync(KEYS.USER_PASSWORD);
    } catch (error) {
      console.error('[SecureStorage] Error clearing credentials:', error);
    }
  }

  /**
   * Efface TOUTES les données sécurisées (logout complet)
   */
  static async clearAll(): Promise<void> {
    try {
      await Promise.all([
        this.clearTokens(),
        this.clearCredentials(),
        SecureStore.deleteItemAsync(KEYS.BIOMETRIC_ENABLED),
        SecureStore.deleteItemAsync(KEYS.USER_DATA),
      ]);
    } catch (error) {
      console.error('[SecureStorage] Error clearing all data:', error);
    }
  }

  /**
   * Vérifie si des credentials sont stockés
   */
  static async hasStoredCredentials(): Promise<boolean> {
    const credentials = await this.getCredentials();
    return credentials !== null;
  }

  /**
   * Vérifie si des tokens sont stockés
   */
  static async hasStoredTokens(): Promise<boolean> {
    const tokens = await this.getTokens();
    return tokens !== null;
  }
}
