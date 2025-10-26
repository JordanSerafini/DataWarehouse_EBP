/**
 * BiometricService - Gestion de l'authentification biométrique
 *
 * Supporte Face ID (iOS) et Touch ID/Fingerprint (iOS/Android)
 * Compatible Expo Go pour le développement
 */

import * as LocalAuthentication from 'expo-local-authentication';

export type BiometricType = 'FACIAL_RECOGNITION' | 'FINGERPRINT' | 'IRIS' | 'NONE';

export interface BiometricCapabilities {
  isAvailable: boolean;
  isEnrolled: boolean;
  supportedTypes: BiometricType[];
  securityLevel: LocalAuthentication.SecurityLevel;
}

export class BiometricService {
  /**
   * Vérifie si le device supporte la biométrie
   */
  static async getCapabilities(): Promise<BiometricCapabilities> {
    try {
      const isAvailable = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypesRaw = await LocalAuthentication.supportedAuthenticationTypesAsync();
      const securityLevel = await LocalAuthentication.getEnrolledLevelAsync();

      // Mapper les types Expo vers nos types custom
      const supportedTypes: BiometricType[] = supportedTypesRaw.map((type) => {
        switch (type) {
          case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
            return 'FACIAL_RECOGNITION';
          case LocalAuthentication.AuthenticationType.FINGERPRINT:
            return 'FINGERPRINT';
          case LocalAuthentication.AuthenticationType.IRIS:
            return 'IRIS';
          default:
            return 'NONE';
        }
      }).filter((type) => type !== 'NONE');

      return {
        isAvailable,
        isEnrolled,
        supportedTypes,
        securityLevel,
      };
    } catch (error) {
      console.error('[BiometricService] Error checking capabilities:', error);
      return {
        isAvailable: false,
        isEnrolled: false,
        supportedTypes: [],
        securityLevel: LocalAuthentication.SecurityLevel.NONE,
      };
    }
  }

  /**
   * Authentifie l'utilisateur avec la biométrie
   * @param promptMessage - Message affiché à l'utilisateur
   * @returns true si authentifié, false sinon
   */
  static async authenticate(promptMessage?: string): Promise<boolean> {
    try {
      const capabilities = await this.getCapabilities();

      // Vérifier que la biométrie est disponible
      if (!capabilities.isAvailable) {
        console.warn('[BiometricService] Biometric hardware not available');
        return false;
      }

      if (!capabilities.isEnrolled) {
        console.warn('[BiometricService] No biometric credentials enrolled');
        return false;
      }

      // Déterminer le message selon le type de biométrie
      const defaultMessage = this.getDefaultPromptMessage(capabilities.supportedTypes);

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: promptMessage || defaultMessage,
        cancelLabel: 'Annuler',
        disableDeviceFallback: false, // Permet PIN/Pattern si biométrie échoue
        requireConfirmation: false,
      });

      return result.success;
    } catch (error) {
      console.error('[BiometricService] Authentication error:', error);
      return false;
    }
  }

  /**
   * Retourne un message adapté au type de biométrie disponible
   */
  private static getDefaultPromptMessage(types: BiometricType[]): string {
    if (types.includes('FACIAL_RECOGNITION')) {
      return 'Utilisez Face ID pour vous connecter';
    }
    if (types.includes('FINGERPRINT')) {
      return 'Utilisez votre empreinte digitale pour vous connecter';
    }
    if (types.includes('IRIS')) {
      return 'Utilisez la reconnaissance de l\'iris pour vous connecter';
    }
    return 'Authentifiez-vous pour continuer';
  }

  /**
   * Retourne un nom user-friendly pour le type de biométrie
   */
  static getBiometricTypeName(type: BiometricType): string {
    switch (type) {
      case 'FACIAL_RECOGNITION':
        return 'Face ID';
      case 'FINGERPRINT':
        return 'Empreinte digitale';
      case 'IRIS':
        return 'Reconnaissance de l\'iris';
      default:
        return 'Biométrie';
    }
  }

  /**
   * Vérifie rapidement si la biométrie est utilisable (disponible + enrollée)
   */
  static async isUsable(): Promise<boolean> {
    const capabilities = await this.getCapabilities();
    return capabilities.isAvailable && capabilities.isEnrolled;
  }
}
