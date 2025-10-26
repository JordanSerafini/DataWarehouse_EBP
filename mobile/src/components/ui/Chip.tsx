/**
 * Chip Component - Material Design 3 (2025 Trend)
 * Composant chip pour tags, filtres et sélections
 */

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';

export interface ChipProps {
  label: string;
  variant?: 'filled' | 'outlined' | 'elevated';
  selected?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  avatar?: React.ReactNode;
  onPress?: () => void;
  onDelete?: () => void;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Chip({
  label,
  variant = 'filled',
  selected = false,
  disabled = false,
  icon,
  avatar,
  onPress,
  onDelete,
  color = 'primary',
  size = 'md',
  className,
}: ChipProps) {
  // Classes de base
  const baseClasses = 'flex-row items-center rounded-full';

  // Classes de taille
  const sizeClasses = {
    sm: 'px-2 py-1 min-h-[24px]',
    md: 'px-3 py-1.5 min-h-[32px]',
    lg: 'px-4 py-2 min-h-[40px]',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  // Classes de variant et couleur
  const getColorClasses = () => {
    if (disabled) return 'bg-gray-200 text-gray-400';

    const colorMap = {
      primary: {
        filled: selected ? 'bg-primary text-white' : 'bg-primary-100 text-primary-700',
        outlined: `border-2 ${selected ? 'border-primary bg-primary-50' : 'border-gray-300'} text-primary`,
        elevated: `shadow-elevation-2 ${selected ? 'bg-primary text-white' : 'bg-white text-primary'}`,
      },
      secondary: {
        filled: selected ? 'bg-secondary text-white' : 'bg-secondary-100 text-secondary-700',
        outlined: `border-2 ${selected ? 'border-secondary bg-secondary-50' : 'border-gray-300'} text-secondary`,
        elevated: `shadow-elevation-2 ${selected ? 'bg-secondary text-white' : 'bg-white text-secondary'}`,
      },
      success: {
        filled: selected ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700',
        outlined: `border-2 ${selected ? 'border-green-600 bg-green-50' : 'border-gray-300'} text-green-700`,
        elevated: `shadow-elevation-2 ${selected ? 'bg-green-600 text-white' : 'bg-white text-green-700'}`,
      },
      error: {
        filled: selected ? 'bg-error text-white' : 'bg-red-100 text-error',
        outlined: `border-2 ${selected ? 'border-error bg-red-50' : 'border-gray-300'} text-error`,
        elevated: `shadow-elevation-2 ${selected ? 'bg-error text-white' : 'bg-white text-error'}`,
      },
      warning: {
        filled: selected ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-700',
        outlined: `border-2 ${selected ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300'} text-yellow-700`,
        elevated: `shadow-elevation-2 ${selected ? 'bg-yellow-500 text-white' : 'bg-white text-yellow-700'}`,
      },
      neutral: {
        filled: selected ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700',
        outlined: `border-2 ${selected ? 'border-gray-700 bg-gray-100' : 'border-gray-300'} text-gray-700`,
        elevated: `shadow-elevation-2 ${selected ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'}`,
      },
    };

    return colorMap[color][variant];
  };

  const handlePress = () => {
    if (!disabled && onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const handleDelete = () => {
    if (!disabled && onDelete) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onDelete();
    }
  };

  const Component = onPress ? Pressable : View;

  return (
    <Component
      // @ts-ignore
      onPress={handlePress}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${getColorClasses()}
        ${disabled ? 'opacity-50' : 'active:opacity-80'}
        ${className || ''}
      `}
    >
      {/* Avatar */}
      {avatar && <View className="mr-1 -ml-1">{avatar}</View>}

      {/* Icon */}
      {icon && !avatar && <View className="mr-1.5">{icon}</View>}

      {/* Label */}
      <Text className={`${textSizeClasses[size]} font-medium`} numberOfLines={1}>
        {label}
      </Text>

      {/* Delete Icon */}
      {onDelete && (
        <Pressable
          onPress={handleDelete}
          disabled={disabled}
          className="ml-1.5 -mr-1 p-0.5"
        >
          <Text className="text-base">✕</Text>
        </Pressable>
      )}
    </Component>
  );
}

/**
 * ChipGroup - Groupe de chips avec sélection unique ou multiple
 */
interface ChipGroupProps {
  chips: Array<{ id: string; label: string; icon?: React.ReactNode }>;
  selected: string | string[];
  onSelect: (id: string | string[]) => void;
  multiSelect?: boolean;
  variant?: ChipProps['variant'];
  color?: ChipProps['color'];
  className?: string;
}

export function ChipGroup({
  chips,
  selected,
  onSelect,
  multiSelect = false,
  variant,
  color,
  className,
}: ChipGroupProps) {
  const handleChipPress = (id: string) => {
    if (multiSelect) {
      const selectedArray = Array.isArray(selected) ? selected : [selected];
      const newSelected = selectedArray.includes(id)
        ? selectedArray.filter((s) => s !== id)
        : [...selectedArray, id];
      onSelect(newSelected);
    } else {
      onSelect(id);
    }
  };

  const isSelected = (id: string) => {
    return Array.isArray(selected) ? selected.includes(id) : selected === id;
  };

  return (
    <View className={`flex-row flex-wrap gap-2 ${className || ''}`}>
      {chips.map((chip) => (
        <Chip
          key={chip.id}
          label={chip.label}
          icon={chip.icon}
          selected={isSelected(chip.id)}
          onPress={() => handleChipPress(chip.id)}
          variant={variant}
          color={color}
        />
      ))}
    </View>
  );
}

/**
 * Exemples d'utilisation:
 *
 * // Chip simple
 * <Chip label="React Native" />
 *
 * // Chip avec icône
 * <Chip label="Terminé" icon={<Icon name="check" />} color="success" />
 *
 * // Chip sélectionnable
 * <Chip label="Frontend" selected onPress={() => {}} />
 *
 * // Chip avec delete
 * <Chip label="Tag" onDelete={() => {}} />
 *
 * // ChipGroup
 * <ChipGroup
 *   chips={[
 *     { id: '1', label: 'Tous' },
 *     { id: '2', label: 'En cours' },
 *     { id: '3', label: 'Terminés' },
 *   ]}
 *   selected="1"
 *   onSelect={(id) => setFilter(id)}
 * />
 */
