/**
 * Badge Component - Material Design 3 (2025 Trend)
 * Composant badge pour notifications, statuts et compteurs
 */

import React from 'react';
import { View, Text } from 'react-native';

export interface BadgeProps {
  count?: number;
  dot?: boolean;
  max?: number;
  variant?: 'filled' | 'outlined' | 'dot';
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  className?: string;
  children?: React.ReactNode;
}

export function Badge({
  count,
  dot = false,
  max = 99,
  variant = 'filled',
  color = 'error',
  size = 'md',
  position = 'top-right',
  className,
  children,
}: BadgeProps) {
  // Si pas de count et pas de dot, ne rien afficher
  if (!dot && !count && count !== 0) return null;

  // Classes de couleur
  const colorClasses = {
    filled: {
      primary: 'bg-primary text-white',
      secondary: 'bg-secondary text-white',
      error: 'bg-error text-white',
      success: 'bg-green-600 text-white',
      warning: 'bg-yellow-500 text-white',
    },
    outlined: {
      primary: 'border-2 border-primary text-primary bg-white',
      secondary: 'border-2 border-secondary text-secondary bg-white',
      error: 'border-2 border-error text-error bg-white',
      success: 'border-2 border-green-600 text-green-600 bg-white',
      warning: 'border-2 border-yellow-500 text-yellow-500 bg-white',
    },
    dot: {
      primary: 'bg-primary',
      secondary: 'bg-secondary',
      error: 'bg-error',
      success: 'bg-green-600',
      warning: 'bg-yellow-500',
    },
  };

  // Classes de taille
  const sizeClasses = {
    sm: dot ? 'w-2 h-2' : 'min-w-[16px] h-4 px-1',
    md: dot ? 'w-2.5 h-2.5' : 'min-w-[20px] h-5 px-1.5',
    lg: dot ? 'w-3 h-3' : 'min-w-[24px] h-6 px-2',
  };

  const textSizeClasses = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  // Classes de position
  const positionClasses = {
    'top-right': '-top-1 -right-1',
    'top-left': '-top-1 -left-1',
    'bottom-right': '-bottom-1 -right-1',
    'bottom-left': '-bottom-1 -left-1',
  };

  // Affichage du badge seul (sans enfant)
  if (!children) {
    return (
      <View
        className={`
          rounded-full
          flex items-center justify-center
          ${sizeClasses[size]}
          ${colorClasses[variant][color]}
          ${className || ''}
        `}
      >
        {!dot && count !== undefined && (
          <Text className={`${textSizeClasses[size]} font-bold`}>
            {count > max ? `${max}+` : count}
          </Text>
        )}
      </View>
    );
  }

  // Badge avec enfant (position absolue)
  return (
    <View className="relative inline-flex">
      {children}
      <View
        className={`
          absolute
          rounded-full
          flex items-center justify-center
          ${positionClasses[position]}
          ${sizeClasses[size]}
          ${colorClasses[variant][color]}
          ${className || ''}
        `}
      >
        {!dot && count !== undefined && (
          <Text className={`${textSizeClasses[size]} font-bold`}>
            {count > max ? `${max}+` : count}
          </Text>
        )}
      </View>
    </View>
  );
}

/**
 * Exemples d'utilisation:
 *
 * // Badge avec compteur
 * <Badge count={5} color="error">
 *   <IconButton icon="notifications" />
 * </Badge>
 *
 * // Badge dot
 * <Badge dot color="success">
 *   <Avatar src="..." />
 * </Badge>
 *
 * // Badge standalone
 * <Badge count={12} variant="outlined" color="primary" />
 */
