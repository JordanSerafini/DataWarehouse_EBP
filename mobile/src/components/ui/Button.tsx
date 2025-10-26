/**
 * Button Component - Material Design 3 avec NativeWind
 * Composant bouton réutilisable avec variants et tailles
 */

import React from 'react';
import { Pressable, Text, ActivityIndicator, View } from 'react-native';
import type { PressableProps } from 'react-native';

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  children: string | React.ReactNode;
  variant?: 'filled' | 'outlined' | 'text' | 'elevated';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
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
  ...props
}: ButtonProps) {
  // Classes de taille
  const sizeClasses = {
    sm: 'px-3 py-1.5 min-h-[32px]',
    md: 'px-4 py-2 min-h-[40px]',
    lg: 'px-6 py-3 min-h-[48px]',
  };

  // Classes de variant
  const variantClasses = {
    filled: `bg-primary ${disabled ? 'opacity-50' : 'active:bg-primary-700'}`,
    outlined: `border-2 border-primary bg-transparent ${
      disabled ? 'opacity-50' : 'active:bg-primary-50'
    }`,
    text: `bg-transparent ${disabled ? 'opacity-50' : 'active:bg-gray-100'}`,
    elevated: `bg-surface shadow-elevation-2 ${
      disabled ? 'opacity-50' : 'active:shadow-elevation-8'
    }`,
  };

  // Classes de texte selon variant
  const textClasses = {
    filled: 'text-white',
    outlined: 'text-primary',
    text: 'text-primary',
    elevated: 'text-primary',
  };

  // Taille de texte selon size
  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const isDisabled = disabled || loading;

  return (
    <Pressable
      className={`
        rounded-lg
        flex-row items-center justify-center
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className || ''}
      `}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'filled' ? '#ffffff' : '#6200ee'}
          size={size === 'sm' ? 'small' : 'small'}
        />
      ) : (
        <>
          {leftIcon && <View className="mr-2">{leftIcon}</View>}

          {typeof children === 'string' ? (
            <Text
              className={`
                font-semibold text-center
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
