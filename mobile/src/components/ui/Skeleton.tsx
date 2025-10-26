/**
 * Skeleton Component - Material Design 3 (2025 Trend)
 * Composant skeleton loader pour états de chargement élégants
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
}

export function Skeleton({
  width = '100%',
  height = 16,
  variant = 'text',
  animation = 'pulse',
  className,
}: SkeletonProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animation === 'pulse') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else if (animation === 'wave') {
      Animated.loop(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [animation]);

  // Classes de variant
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      className={`
        bg-gray-300
        ${variantClasses[variant]}
        ${className || ''}
      `}
      style={{
        width,
        height,
        opacity: animation !== 'none' ? opacity : 0.3,
      }}
    />
  );
}

/**
 * SkeletonCard - Skeleton préconfiguré pour une carte
 */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <View className={`p-4 bg-white rounded-2xl shadow-elevation-2 ${className || ''}`}>
      {/* Header */}
      <View className="flex-row items-center mb-3">
        <Skeleton variant="circular" width={40} height={40} />
        <View className="ml-3 flex-1">
          <Skeleton width="60%" height={16} className="mb-2" />
          <Skeleton width="40%" height={12} />
        </View>
      </View>

      {/* Content */}
      <View className="mb-3">
        <Skeleton width="100%" height={12} className="mb-2" />
        <Skeleton width="90%" height={12} className="mb-2" />
        <Skeleton width="70%" height={12} />
      </View>

      {/* Footer */}
      <View className="flex-row justify-end gap-2">
        <Skeleton variant="rounded" width={80} height={32} />
        <Skeleton variant="rounded" width={80} height={32} />
      </View>
    </View>
  );
}

/**
 * SkeletonList - Skeleton pour une liste
 */
interface SkeletonListProps {
  count?: number;
  itemHeight?: number;
  className?: string;
}

export function SkeletonList({ count = 3, itemHeight = 60, className }: SkeletonListProps) {
  return (
    <View className={`gap-2 ${className || ''}`}>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          className="flex-row items-center p-3 bg-white rounded-xl"
          style={{ height: itemHeight }}
        >
          <Skeleton variant="circular" width={40} height={40} />
          <View className="ml-3 flex-1">
            <Skeleton width="70%" height={14} className="mb-2" />
            <Skeleton width="50%" height={12} />
          </View>
        </View>
      ))}
    </View>
  );
}

/**
 * SkeletonText - Skeleton pour du texte multiligne
 */
interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <View className={`gap-2 ${className || ''}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 ? '60%' : '100%'}
          height={12}
        />
      ))}
    </View>
  );
}

/**
 * SkeletonAvatar - Skeleton pour un avatar avec texte
 */
interface SkeletonAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
  className?: string;
}

export function SkeletonAvatar({ size = 'md', withText = true, className }: SkeletonAvatarProps) {
  const sizeMap = {
    sm: 32,
    md: 40,
    lg: 56,
  };

  return (
    <View className={`flex-row items-center ${className || ''}`}>
      <Skeleton variant="circular" width={sizeMap[size]} height={sizeMap[size]} />
      {withText && (
        <View className="ml-3 flex-1">
          <Skeleton width="60%" height={14} className="mb-2" />
          <Skeleton width="40%" height={12} />
        </View>
      )}
    </View>
  );
}

/**
 * Exemples d'utilisation:
 *
 * // Skeleton simple
 * <Skeleton width={200} height={20} />
 *
 * // Skeleton circulaire
 * <Skeleton variant="circular" width={40} height={40} />
 *
 * // Skeleton card complète
 * <SkeletonCard />
 *
 * // Liste de skeletons
 * <SkeletonList count={5} />
 *
 * // Texte multiligne
 * <SkeletonText lines={4} />
 *
 * // Avatar avec texte
 * <SkeletonAvatar size="lg" />
 */
