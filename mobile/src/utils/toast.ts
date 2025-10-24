/**
 * Utilitaire de Toast notifications
 * Wrapper autour de toastify-react-native
 */

import { Toast } from 'toastify-react-native';

/**
 * Afficher un toast de succès
 */
export const showSuccessToast = (message: string, position?: 'top' | 'bottom' | 'center') => {
  Toast.success(message, position || 'bottom');
};

/**
 * Afficher un toast d'erreur
 */
export const showErrorToast = (message: string, position?: 'top' | 'bottom' | 'center') => {
  Toast.error(message, position || 'bottom');
};

/**
 * Afficher un toast d'avertissement
 */
export const showWarningToast = (message: string, position?: 'top' | 'bottom' | 'center') => {
  Toast.warn(message, position || 'bottom');
};

/**
 * Afficher un toast d'information
 */
export const showInfoToast = (message: string, position?: 'top' | 'bottom' | 'center') => {
  Toast.info(message, position || 'bottom');
};

/**
 * Afficher un toast avec type
 */
export const showToast = (
  message: string,
  type: 'success' | 'error' | 'warning' | 'info' = 'info',
  position?: 'top' | 'bottom' | 'center'
) => {
  const pos = position || 'bottom';

  switch (type) {
    case 'success':
      Toast.success(message, pos);
      break;
    case 'error':
      Toast.error(message, pos);
      break;
    case 'warning':
      Toast.warn(message, pos);
      break;
    case 'info':
    default:
      Toast.info(message, pos);
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
