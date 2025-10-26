/**
 * Card Component - Material Design 3 avec NativeWind (2025 Enhanced)
 * Composant carte réutilisable avec glassmorphism et animations
 */

import React from 'react';
import { View, Pressable, Text, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import type { ViewProps, PressableProps } from 'react-native';

interface BaseCardProps {
  variant?: 'elevated' | 'filled' | 'outlined' | 'glass'; // Tendance 2025: Glassmorphism
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  blur?: boolean; // Tendance 2025: Effet de flou
}

type CardProps = BaseCardProps &
  (
    | ({ onPress?: never } & ViewProps)
    | ({ onPress: () => void } & Omit<PressableProps, 'children'>)
  );

export function Card({
  variant = 'elevated',
  padding = 'md',
  blur = false,
  children,
  className,
  onPress,
  ...props
}: CardProps) {
  // Classes de base (Material Design 3 2025)
  const baseClasses = 'bg-surface rounded-2xl overflow-hidden'; // rounded-2xl pour look plus moderne

  // Classes de variant
  const variantClasses = {
    elevated: 'shadow-elevation-3 bg-white',
    filled: 'bg-primary-50',
    outlined: 'border-2 border-gray-200 bg-white',
    glass: 'bg-white/20 border border-white/30', // Glassmorphism (Tendance 2025)
  };

  // Classes de padding
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const combinedClassName = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${paddingClasses[padding]}
    ${className || ''}
  `;

  // Contenu de la carte
  const InnerCardContent = () => (
    <>
      {/* Glassmorphism avec BlurView (Tendance 2025) */}
      {variant === 'glass' && blur && Platform.OS !== 'web' ? (
        <BlurView intensity={20} tint="light" className="absolute inset-0" />
      ) : null}
      <View className={variant === 'glass' ? 'relative z-10' : ''}>
        {children}
      </View>
    </>
  );

  // Si onPress est fourni, utiliser Pressable avec animation
  if (onPress) {
    return (
      <Pressable
        className={`${combinedClassName} active:scale-[0.98] transition-transform duration-150`}
        onPress={onPress}
        {...(props as PressableProps)}
      >
        <InnerCardContent />
      </Pressable>
    );
  }

  // Sinon, utiliser View simple
  return (
    <View className={combinedClassName} {...(props as ViewProps)}>
      <InnerCardContent />
    </View>
  );
}

/**
 * CardHeader - En-tête de carte avec titre et sous-titre
 */
interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, action, className }: CardHeaderProps) {
  return (
    <View className={`flex-row items-start justify-between mb-3 ${className || ''}`}>
      <View className="flex-1">
        <Text className="text-lg font-bold text-text-primary">{title}</Text>
        {subtitle && (
          <Text className="text-sm text-text-secondary mt-1">{subtitle}</Text>
        )}
      </View>
      {action && <View className="ml-3">{action}</View>}
    </View>
  );
}

/**
 * CardContent - Contenu de la carte
 */
interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <View className={className}>{children}</View>;
}

/**
 * CardActions - Actions de la carte (boutons)
 */
interface CardActionsProps {
  children: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  className?: string;
}

export function CardActions({ children, align = 'right', className }: CardActionsProps) {
  const alignClasses = {
    left: 'justify-start',
    right: 'justify-end',
    center: 'justify-center',
  };

  return (
    <View
      className={`
        flex-row items-center gap-2 mt-4
        ${alignClasses[align]}
        ${className || ''}
      `}
    >
      {children}
    </View>
  );
}

/**
 * Exemples d'utilisation:
 *
 * // Card simple
 * <Card variant="elevated">
 *   <Text>Contenu de la carte</Text>
 * </Card>
 *
 * // Card complète
 * <Card variant="outlined" padding="lg">
 *   <CardHeader
 *     title="Intervention #123"
 *     subtitle="Client: ACME Corp"
 *     action={<IconButton icon="more-vert" />}
 *   />
 *   <CardContent>
 *     <Text>Description de l'intervention...</Text>
 *   </CardContent>
 *   <CardActions>
 *     <Button variant="text">Annuler</Button>
 *     <Button variant="filled">Démarrer</Button>
 *   </CardActions>
 * </Card>
 *
 * // Card cliquable
 * <Card onPress={() => navigation.navigate('Details')}>
 *   <Text>Appuyez pour plus de détails</Text>
 * </Card>
 */
