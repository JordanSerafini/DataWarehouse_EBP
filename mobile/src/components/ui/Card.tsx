/**
 * Card Component - Material Design 3 avec NativeWind
 * Composant carte réutilisable avec variants
 */

import React from 'react';
import { View, Pressable, Text } from 'react-native';
import type { ViewProps, PressableProps } from 'react-native';

interface BaseCardProps {
  variant?: 'elevated' | 'filled' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

type CardProps = BaseCardProps &
  (
    | ({ onPress?: never } & ViewProps)
    | ({ onPress: () => void } & Omit<PressableProps, 'children'>)
  );

export function Card({
  variant = 'elevated',
  padding = 'md',
  children,
  className,
  onPress,
  ...props
}: CardProps) {
  // Classes de base
  const baseClasses = 'bg-surface rounded-lg overflow-hidden';

  // Classes de variant
  const variantClasses = {
    elevated: 'shadow-elevation-2',
    filled: 'bg-primary-50',
    outlined: 'border border-gray-200',
  };

  // Classes de padding
  const paddingClasses = {
    none: '',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
  };

  const combinedClassName = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${paddingClasses[padding]}
    ${className || ''}
  `;

  // Si onPress est fourni, utiliser Pressable
  if (onPress) {
    return (
      <Pressable
        className={`${combinedClassName} active:opacity-80`}
        onPress={onPress}
        {...(props as PressableProps)}
      >
        {children}
      </Pressable>
    );
  }

  // Sinon, utiliser View simple
  return (
    <View className={combinedClassName} {...(props as ViewProps)}>
      {children}
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
