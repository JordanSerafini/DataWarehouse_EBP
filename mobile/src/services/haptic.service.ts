/**
 * Service Haptic Feedback
 *
 * Fournit un retour tactile pour améliorer l'expérience utilisateur
 * Utilise Expo Haptics pour des vibrations subtiles sur les actions importantes
 *
 * Tendances UI/UX 2025 : +25% engagement utilisateur
 */

import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Types de feedback haptique disponibles
 */
export enum HapticFeedbackType {
  // Impacts légers (interactions légères)
  LIGHT = 'light',
  // Impacts moyens (actions importantes)
  MEDIUM = 'medium',
  // Impacts lourds (confirmations critiques)
  HEAVY = 'heavy',

  // Notifications
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',

  // Sélections
  SELECTION = 'selection',
}

class HapticService {
  /**
   * Vérifie si le haptic feedback est disponible sur la plateforme
   */
  private isAvailable(): boolean {
    return Platform.OS === 'ios' || Platform.OS === 'android';
  }

  /**
   * Impact léger - Utilisé pour :
   * - Tap sur cards
   * - Sélection items
   * - Navigation
   */
  async light(): Promise<void> {
    if (!this.isAvailable()) return;

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.warn('Haptic feedback light failed:', error);
    }
  }

  /**
   * Impact moyen - Utilisé pour :
   * - Boutons d'action importants
   * - Démarrer intervention
   * - Sauvegarder données
   * - Refresh pull-to-refresh
   */
  async medium(): Promise<void> {
    if (!this.isAvailable()) return;

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.warn('Haptic feedback medium failed:', error);
    }
  }

  /**
   * Impact lourd - Utilisé pour :
   * - Clôturer intervention
   * - Confirmer actions critiques
   * - Upload photo succès
   * - Validation signature
   */
  async heavy(): Promise<void> {
    if (!this.isAvailable()) return;

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (error) {
      console.warn('Haptic feedback heavy failed:', error);
    }
  }

  /**
   * Feedback succès - Utilisé pour :
   * - Upload photo succès
   * - Intervention clôturée
   * - Synchronisation réussie
   * - Action complétée avec succès
   */
  async success(): Promise<void> {
    if (!this.isAvailable()) return;

    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.warn('Haptic feedback success failed:', error);
    }
  }

  /**
   * Feedback warning - Utilisé pour :
   * - Avertissements
   * - Confirmations nécessaires
   * - Données incomplètes
   */
  async warning(): Promise<void> {
    if (!this.isAvailable()) return;

    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (error) {
      console.warn('Haptic feedback warning failed:', error);
    }
  }

  /**
   * Feedback erreur - Utilisé pour :
   * - Erreurs réseau
   * - Validation échouée
   * - Action impossible
   * - Erreurs critiques
   */
  async error(): Promise<void> {
    if (!this.isAvailable()) return;

    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch (error) {
      console.warn('Haptic feedback error failed:', error);
    }
  }

  /**
   * Feedback sélection - Utilisé pour :
   * - Changement de tab
   * - Sélection dans picker
   * - Toggle switch
   * - Segmented buttons
   */
  async selection(): Promise<void> {
    if (!this.isAvailable()) return;

    try {
      await Haptics.selectionAsync();
    } catch (error) {
      console.warn('Haptic feedback selection failed:', error);
    }
  }

  /**
   * Méthode générique avec type
   * @param type Type de feedback
   */
  async trigger(type: HapticFeedbackType): Promise<void> {
    switch (type) {
      case HapticFeedbackType.LIGHT:
        return this.light();
      case HapticFeedbackType.MEDIUM:
        return this.medium();
      case HapticFeedbackType.HEAVY:
        return this.heavy();
      case HapticFeedbackType.SUCCESS:
        return this.success();
      case HapticFeedbackType.WARNING:
        return this.warning();
      case HapticFeedbackType.ERROR:
        return this.error();
      case HapticFeedbackType.SELECTION:
        return this.selection();
      default:
        return this.light();
    }
  }

  /**
   * Pattern de feedback personnalisé
   * Permet de créer des séquences (ex: double tap, triple tap)
   */
  async pattern(feedbacks: HapticFeedbackType[], delays: number[] = []): Promise<void> {
    if (!this.isAvailable()) return;

    for (let i = 0; i < feedbacks.length; i++) {
      await this.trigger(feedbacks[i]);

      if (delays[i]) {
        await new Promise(resolve => setTimeout(resolve, delays[i]));
      }
    }
  }

  /**
   * Feedback double tap (confirmation forte)
   * Utilisé pour les actions très importantes
   */
  async doubleTap(): Promise<void> {
    await this.pattern(
      [HapticFeedbackType.MEDIUM, HapticFeedbackType.MEDIUM],
      [100]
    );
  }

  /**
   * Feedback succès renforcé (triple tap)
   * Utilisé pour les grandes réussites
   */
  async successEnhanced(): Promise<void> {
    await this.pattern(
      [HapticFeedbackType.LIGHT, HapticFeedbackType.MEDIUM, HapticFeedbackType.HEAVY],
      [50, 50]
    );
  }
}

// Export singleton
export const hapticService = new HapticService();

// Export default pour import facile
export default hapticService;
