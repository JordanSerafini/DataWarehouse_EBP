/**
 * Switch Component - Material Design 3 (2025 Trend)
 * Composant switch moderne avec animations fluides
 */

import React, { useRef, useEffect } from 'react';
import { Pressable, Animated, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'error';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Switch({
  value,
  onValueChange,
  disabled = false,
  color = 'primary',
  size = 'md',
  className,
}: SwitchProps) {
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: value ? 1 : 0,
      useNativeDriver: false,
      friction: 6,
      tension: 40,
    }).start();
  }, [value]);

  // Classes de taille
  const sizeConfig = {
    sm: {
      track: 'w-10 h-6',
      thumb: 16,
      translateX: { off: 2, on: 22 },
    },
    md: {
      track: 'w-12 h-7',
      thumb: 20,
      translateX: { off: 2, on: 26 },
    },
    lg: {
      track: 'w-14 h-8',
      thumb: 24,
      translateX: { off: 2, on: 32 },
    },
  };

  // Couleurs
  const colorClasses = {
    primary: value ? 'bg-primary' : 'bg-gray-300',
    secondary: value ? 'bg-secondary' : 'bg-gray-300',
    success: value ? 'bg-green-600' : 'bg-gray-300',
    error: value ? 'bg-error' : 'bg-gray-300',
  };

  const handlePress = () => {
    if (!disabled) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onValueChange(!value);
    }
  };

  const thumbTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [sizeConfig[size].translateX.off, sizeConfig[size].translateX.on],
  });

  const thumbScale = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.2, 1],
  });

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      className={`
        ${sizeConfig[size].track}
        ${colorClasses[color]}
        ${disabled ? 'opacity-40' : ''}
        rounded-full
        justify-center
        transition-colors duration-200
        ${className || ''}
      `}
    >
      <Animated.View
        className="bg-white rounded-full shadow-md"
        style={{
          width: sizeConfig[size].thumb,
          height: sizeConfig[size].thumb,
          transform: [{ translateX: thumbTranslateX }, { scale: thumbScale }],
        }}
      />
    </Pressable>
  );
}

/**
 * Exemples d'utilisation:
 *
 * // Switch simple
 * <Switch value={enabled} onValueChange={setEnabled} />
 *
 * // Switch avec couleur custom
 * <Switch value={darkMode} onValueChange={setDarkMode} color="success" />
 *
 * // Switch désactivé
 * <Switch value={true} onValueChange={() => {}} disabled />
 */
