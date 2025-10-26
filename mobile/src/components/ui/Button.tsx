/**
 * Button Component - Material Design 3 avec NativeWind (2025 Enhanced)
 * Composant bouton réutilisable avec ripple effect, haptic feedback et animations
 */

import React from 'react';
import { Pressable, Text, ActivityIndicator, View, Platform, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { PressableProps } from 'react-native';

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  children: string | React.ReactNode;
  variant?: 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  hapticFeedback?: boolean; // Tendance 2025: Retour haptique
  rippleEffect?: boolean; // Tendance 2025: Ripple Android-like
}

export function Button({
  children,
  variant = 'filled',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  className,
  hapticFeedback = true,
  rippleEffect = true,
  onPress,
  ...props
}: ButtonProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  // Classes de taille
  const sizeClasses = {
    sm: 'px-3 py-1.5 min-h-[32px]',
    md: 'px-4 py-2.5 min-h-[44px]',
    lg: 'px-6 py-3.5 min-h-[52px]',
  };

  // Classes de variant (Material Design 3 2025)
  const variantClasses = {
    filled: `bg-primary ${disabled ? 'opacity-40' : 'active:bg-primary-700'}`,
    outlined: `border-2 border-primary bg-transparent ${
      disabled ? 'opacity-40' : 'active:bg-primary-50'
    }`,
    text: `bg-transparent ${disabled ? 'opacity-40' : 'active:bg-gray-100'}`,
    elevated: `bg-surface shadow-elevation-3 ${
      disabled ? 'opacity-40' : 'active:shadow-elevation-8'
    }`,
    tonal: `bg-primary-100 ${disabled ? 'opacity-40' : 'active:bg-primary-200'}`, // Nouveau variant 2025
  };

  // Classes de texte selon variant
  const textClasses = {
    filled: 'text-white',
    outlined: 'text-primary',
    text: 'text-primary',
    elevated: 'text-primary',
    tonal: 'text-primary-700',
  };

  // Taille de texte selon size
  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base font-semibold',
    lg: 'text-lg font-bold',
  };

  const isDisabled = disabled || loading;

  // Haptic feedback (Tendance 2025)
  const handlePress = (event: any) => {
    if (hapticFeedback && !isDisabled && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Animation de press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.96,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (onPress) {
      onPress(event);
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        className={`
          rounded-full
          flex-row items-center justify-center
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${fullWidth ? 'w-full' : ''}
          ${className || ''}
        `}
        disabled={isDisabled}
        onPress={handlePress}
        android_ripple={
          rippleEffect && !isDisabled
            ? {
                color: variant === 'filled' ? '#ffffff40' : '#6200ee20',
                borderless: false,
              }
            : undefined
        }
        {...props}
      >
        {loading ? (
          <ActivityIndicator
            color={variant === 'filled' || variant === 'tonal' ? '#ffffff' : '#6200ee'}
            size={size === 'sm' ? 'small' : 'small'}
          />
        ) : (
          <>
            {leftIcon && <View className="mr-2">{leftIcon}</View>}

            {typeof children === 'string' ? (
              <Text
                className={`
                  text-center
                  ${textSizeClasses[size]}
                  ${textClasses[variant]}
                `}
              >
                {children}
              </Text>
            ) : (
              children
            )}

            {rightIcon && <View className="ml-2">{rightIcon}</View>}
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}

/**
 * Exemples d'utilisation:
 *
 * <Button variant="filled" size="lg" onPress={handleSubmit}>
 *   Connexion
 * </Button>
 *
 * <Button variant="outlined" leftIcon={<Icon name="add" />}>
 *   Ajouter
 * </Button>
 *
 * <Button variant="text" size="sm" loading={isLoading}>
 *   Charger plus
 * </Button>
 *
 * <Button variant="elevated" fullWidth disabled>
 *   Désactivé
 * </Button>
 */
