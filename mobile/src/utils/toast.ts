/**
 * Utilitaire de Toast notifications
 * Wrapper autour de toastify-react-native
 */

import ToastManager from 'toastify-react-native';

/**
 * Afficher un toast de succès
 */
export const showSuccessToast = (message: string, duration?: number) => {
  ToastManager.success(message, duration || 3000, 'bottom');
};

/**
 * Afficher un toast d'erreur
 */
export const showErrorToast = (message: string, duration?: number) => {
  ToastManager.error(message, duration || 4000, 'bottom');
};

/**
 * Afficher un toast d'avertissement
 */
export const showWarningToast = (message: string, duration?: number) => {
  ToastManager.warn(message, duration || 3000, 'bottom');
};

/**
 * Afficher un toast d'information
 */
export const showInfoToast = (message: string, duration?: number) => {
  ToastManager.info(message, duration || 3000, 'bottom');
};

/**
 * Afficher un toast avec type
 */
export const showToast = (
  message: string,
  type: 'success' | 'error' | 'warning' | 'info' = 'info',
  duration?: number
) => {
  const defaultDuration = duration || 3000;

  switch (type) {
    case 'success':
      ToastManager.success(message, defaultDuration, 'bottom');
      break;
    case 'error':
      ToastManager.error(message, defaultDuration, 'bottom');
      break;
    case 'warning':
      ToastManager.warn(message, defaultDuration, 'bottom');
      break;
    case 'info':
    default:
      ToastManager.info(message, defaultDuration, 'bottom');
      break;
  }
};

export default {
  success: showSuccessToast,
  error: showErrorToast,
  warning: showWarningToast,
  info: showInfoToast,
  show: showToast,
};
