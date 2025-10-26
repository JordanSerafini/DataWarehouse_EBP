/**
 * Avatar Component - Material Design 3 (2025 Trend)
 * Composant avatar pour photos de profil et icônes utilisateur
 */

import React from 'react';
import { View, Text, Image, ImageSourcePropType } from 'react';

export interface AvatarProps {
  src?: ImageSourcePropType | string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'circular' | 'rounded' | 'square';
  fallback?: string; // Initiales ou texte
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'neutral';
  status?: 'online' | 'offline' | 'away' | 'busy'; // Tendance 2025: Status indicator
  className?: string;
}

export function Avatar({
  src,
  alt,
  size = 'md',
  variant = 'circular',
  fallback,
  color = 'primary',
  status,
  className,
}: AvatarProps) {
  // Classes de taille
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-24 h-24',
  };

  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-2xl',
    '2xl': 'text-4xl',
  };

  // Classes de variant
  const variantClasses = {
    circular: 'rounded-full',
    rounded: 'rounded-lg',
    square: 'rounded-none',
  };

  // Classes de couleur (pour fallback)
  const colorClasses = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    success: 'bg-green-600 text-white',
    error: 'bg-error text-white',
    warning: 'bg-yellow-500 text-white',
    neutral: 'bg-gray-400 text-white',
  };

  // Status indicator colors (Tendance 2025)
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-error',
  };

  // Taille du status indicator
  const statusSizeClasses = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5',
  };

  return (
    <View className="relative inline-flex">
      <View
        className={`
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${!src ? colorClasses[color] : 'bg-gray-200'}
          flex items-center justify-center
          overflow-hidden
          ${className || ''}
        `}
      >
        {src ? (
          <Image
            source={typeof src === 'string' ? { uri: src } : src}
            alt={alt}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : fallback ? (
          <Text
            className={`${textSizeClasses[size]} font-semibold uppercase`}
            numberOfLines={1}
          >
            {fallback}
          </Text>
        ) : (
          <Text className={`${textSizeClasses[size]}`}>👤</Text>
        )}
      </View>

      {/* Status Indicator (Tendance 2025) */}
      {status && (
        <View
          className={`
            absolute -bottom-0.5 -right-0.5
            ${statusSizeClasses[size]}
            ${statusColors[status]}
            rounded-full
            border-2 border-white
          `}
        />
      )}
    </View>
  );
}

/**
 * AvatarGroup - Groupe d'avatars empilés
 */
interface AvatarGroupProps {
  avatars: Array<{
    id: string;
    src?: ImageSourcePropType | string;
    alt?: string;
    fallback?: string;
  }>;
  max?: number;
  size?: AvatarProps['size'];
  variant?: AvatarProps['variant'];
  className?: string;
}

export function AvatarGroup({
  avatars,
  max = 3,
  size = 'md',
  variant,
  className,
}: AvatarGroupProps) {
  const displayedAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <View className={`flex-row ${className || ''}`}>
      {displayedAvatars.map((avatar, index) => (
        <View
          key={avatar.id}
          className={index > 0 ? '-ml-2' : ''}
          style={{ zIndex: displayedAvatars.length - index }}
        >
          <Avatar
            src={avatar.src}
            alt={avatar.alt}
            fallback={avatar.fallback}
            size={size}
            variant={variant}
            className="border-2 border-white"
          />
        </View>
      ))}

      {remainingCount > 0 && (
        <View className="-ml-2" style={{ zIndex: 0 }}>
          <Avatar
            fallback={`+${remainingCount}`}
            size={size}
            variant={variant}
            color="neutral"
            className="border-2 border-white"
          />
        </View>
      )}
    </View>
  );
}

/**
 * Exemples d'utilisation:
 *
 * // Avatar avec image
 * <Avatar src="https://..." alt="John Doe" />
 *
 * // Avatar avec initiales
 * <Avatar fallback="JD" color="primary" />
 *
 * // Avatar avec status
 * <Avatar src="..." status="online" />
 *
 * // AvatarGroup
 * <AvatarGroup
 *   avatars={[
 *     { id: '1', src: '...', alt: 'User 1' },
 *     { id: '2', fallback: 'AB' },
 *     { id: '3', src: '...' },
 *   ]}
 *   max={3}
 * />
 */
