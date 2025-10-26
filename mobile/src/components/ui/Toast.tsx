/**
 * Toast/Snackbar Component - Material Design 3 (2025 Trend)
 * Composant toast moderne pour notifications temporaires
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  position?: 'top' | 'bottom';
  action?: {
    label: string;
    onPress: () => void;
  };
  onClose?: () => void;
  visible: boolean;
}

export function Toast({
  message,
  type = 'info',
  duration = 3000,
  position = 'bottom',
  action,
  onClose,
  visible,
}: ToastProps) {
  const translateY = useRef(new Animated.Value(position === 'bottom' ? 100 : -100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Haptic feedback
      if (Platform.OS !== 'web') {
        const feedbackStyle =
          type === 'error'
            ? Haptics.NotificationFeedbackType.Error
            : type === 'success'
            ? Haptics.NotificationFeedbackType.Success
            : Haptics.NotificationFeedbackType.Warning;

        Haptics.notificationAsync(feedbackStyle);
      }

      // Animation d'entrée
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          friction: 8,
          tension: 40,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-close
      if (duration > 0 && onClose) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      handleClose();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: position === 'bottom' ? 100 : -100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onClose) onClose();
    });
  };

  if (!visible && translateY._value !== (position === 'bottom' ? 100 : -100)) {
    return null;
  }

  // Classes de type
  const typeConfig = {
    success: {
      bg: 'bg-green-600',
      icon: '✓',
    },
    error: {
      bg: 'bg-error',
      icon: '✕',
    },
    warning: {
      bg: 'bg-yellow-500',
      icon: '⚠',
    },
    info: {
      bg: 'bg-gray-800',
      icon: 'ℹ',
    },
  };

  const positionClasses = {
    top: 'top-12',
    bottom: 'bottom-8',
  };

  return (
    <Animated.View
      className={`
        absolute left-4 right-4 z-50
        ${positionClasses[position]}
      `}
      style={{
        transform: [{ translateY }],
        opacity,
      }}
    >
      <View
        className={`
          ${typeConfig[type].bg}
          rounded-2xl
          shadow-elevation-8
          px-4 py-3
          flex-row items-center
        `}
      >
        {/* Icon */}
        <View className="mr-3">
          <Text className="text-white text-lg font-bold">{typeConfig[type].icon}</Text>
        </View>

        {/* Message */}
        <Text className="flex-1 text-white text-base font-medium">{message}</Text>

        {/* Action Button */}
        {action && (
          <Pressable
            onPress={() => {
              action.onPress();
              handleClose();
            }}
            className="ml-2 px-3 py-1 rounded-full bg-white/20 active:bg-white/30"
          >
            <Text className="text-white text-sm font-semibold uppercase">
              {action.label}
            </Text>
          </Pressable>
        )}

        {/* Close Button */}
        {!action && onClose && (
          <Pressable onPress={handleClose} className="ml-2 p-1">
            <Text className="text-white text-lg">✕</Text>
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
}

/**
 * Hook useToast - Hook pour gérer les toasts facilement
 */
export function useToast() {
  const [toast, setToast] = React.useState<{
    visible: boolean;
    message: string;
    type: ToastProps['type'];
    duration?: number;
    action?: ToastProps['action'];
  }>({
    visible: false,
    message: '',
    type: 'info',
  });

  const show = React.useCallback(
    (
      message: string,
      type: ToastProps['type'] = 'info',
      duration = 3000,
      action?: ToastProps['action']
    ) => {
      setToast({ visible: true, message, type, duration, action });
    },
    []
  );

  const hide = React.useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  const success = React.useCallback(
    (message: string, duration = 3000) => show(message, 'success', duration),
    [show]
  );

  const error = React.useCallback(
    (message: string, duration = 3000) => show(message, 'error', duration),
    [show]
  );

  const warning = React.useCallback(
    (message: string, duration = 3000) => show(message, 'warning', duration),
    [show]
  );

  const info = React.useCallback(
    (message: string, duration = 3000) => show(message, 'info', duration),
    [show]
  );

  return {
    toast,
    show,
    hide,
    success,
    error,
    warning,
    info,
  };
}

/**
 * Exemples d'utilisation:
 *
 * // Utilisation avec le hook
 * function MyComponent() {
 *   const toast = useToast();
 *
 *   return (
 *     <>
 *       <Button onPress={() => toast.success('Enregistré !')}>
 *         Sauvegarder
 *       </Button>
 *
 *       <Toast
 *         {...toast.toast}
 *         onClose={toast.hide}
 *       />
 *     </>
 *   );
 * }
 *
 * // Toast avec action
 * toast.show('Fichier supprimé', 'info', 5000, {
 *   label: 'Annuler',
 *   onPress: () => undoDelete(),
 * });
 */
