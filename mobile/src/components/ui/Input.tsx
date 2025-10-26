/**
 * Input Component - Material Design 3 avec NativeWind (2025 Enhanced)
 * Champ de saisie avec floating labels, animations fluides et états visuels modernes
 */

import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Text, Pressable, Animated } from 'react-native';
import type { TextInputProps } from 'react-native';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'outlined' | 'filled' | 'standard'; // Ajout variant standard
  fullWidth?: boolean;
  floatingLabel?: boolean; // Tendance 2025: Label flottant animé
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  variant = 'outlined',
  fullWidth = true,
  floatingLabel = false,
  className,
  editable = true,
  value,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  // Animation pour le floating label (Tendance 2025)
  const labelAnimation = useRef(new Animated.Value(value ? 1 : 0)).current;
  const borderAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (floatingLabel) {
      Animated.timing(labelAnimation, {
        toValue: isFocused || value ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [isFocused, value, floatingLabel]);

  useEffect(() => {
    Animated.timing(borderAnimation, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  // Classes de variant (Material Design 3 2025)
  const variantClasses = {
    outlined: `
      border-2
      ${error ? 'border-error' : isFocused ? 'border-primary' : 'border-gray-300'}
      bg-transparent
      rounded-xl
    `,
    filled: `
      border-b-2
      ${error ? 'border-error' : isFocused ? 'border-primary' : 'border-gray-300'}
      bg-gray-50
      rounded-t-xl
    `,
    standard: `
      border-b-2
      ${error ? 'border-error' : isFocused ? 'border-primary' : 'border-gray-300'}
      bg-transparent
    `,
  };

  // Animation du label flottant
  const labelStyle = floatingLabel ? {
    position: 'absolute' as const,
    left: leftIcon ? 48 : 16,
    top: labelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [16, -8],
    }),
    fontSize: labelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    backgroundColor: variant === 'outlined' ? '#ffffff' : 'transparent',
    paddingHorizontal: 4,
  } : {};

  return (
    <View className={`${fullWidth ? 'w-full' : ''} ${className || ''}`}>
      <View className="relative">
        {/* Floating Label (Tendance 2025) */}
        {label && floatingLabel && (
          <Animated.Text
            style={labelStyle}
            className={`
              font-medium z-10
              ${error ? 'text-error' : isFocused ? 'text-primary' : 'text-text-secondary'}
            `}
          >
            {label}
          </Animated.Text>
        )}

        {/* Static Label */}
        {label && !floatingLabel && (
          <Text
            className={`
              text-sm font-medium mb-2
              ${error ? 'text-error' : isFocused ? 'text-primary' : 'text-text-secondary'}
            `}
          >
            {label}
          </Text>
        )}

        {/* Input Container */}
        <View
          className={`
            flex-row items-center
            ${variantClasses[variant]}
            ${!editable ? 'opacity-50' : ''}
            transition-all duration-200
          `}
        >
          {/* Left Icon */}
          {leftIcon && (
            <View className="pl-4 pr-2">
              {leftIcon}
            </View>
          )}

          {/* TextInput */}
          <TextInput
            className={`
              flex-1
              px-4 py-3.5
              text-base text-text-primary
              ${leftIcon ? 'pl-0' : ''}
              ${rightIcon ? 'pr-0' : ''}
              ${floatingLabel && (isFocused || value) ? 'pt-5' : ''}
            `}
            placeholderTextColor="#00000066"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            editable={editable}
            value={value}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <View className="pr-4 pl-2">
              {rightIcon}
            </View>
          )}
        </View>

        {/* Focus Indicator (Tendance 2025 - subtle animation) */}
        {isFocused && variant !== 'standard' && (
          <Animated.View
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
            style={{
              opacity: borderAnimation,
            }}
          />
        )}
      </View>

      {/* Helper Text / Error */}
      {(error || helperText) && (
        <Text
          className={`
            text-xs mt-1.5 ml-1
            ${error ? 'text-error font-medium' : 'text-text-secondary'}
          `}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
}

/**
 * PasswordInput - Input avec toggle show/hide password
 */
interface PasswordInputProps extends Omit<InputProps, 'secureTextEntry' | 'rightIcon'> {}

export function PasswordInput(props: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      {...props}
      secureTextEntry={!showPassword}
      rightIcon={
        <Pressable onPress={() => setShowPassword(!showPassword)}>
          <Text className="text-primary text-sm font-medium">
            {showPassword ? 'Masquer' : 'Afficher'}
          </Text>
        </Pressable>
      }
    />
  );
}

/**
 * SearchInput - Input avec icône de recherche
 */
interface SearchInputProps extends Omit<InputProps, 'leftIcon'> {
  onClear?: () => void;
}

export function SearchInput({ onClear, value, ...props }: SearchInputProps) {
  return (
    <Input
      {...props}
      value={value}
      leftIcon={
        <Text className="text-text-secondary">🔍</Text>
      }
      rightIcon={
        value ? (
          <Pressable onPress={onClear}>
            <Text className="text-text-secondary">✕</Text>
          </Pressable>
        ) : undefined
      }
    />
  );
}

/**
 * Exemples d'utilisation:
 *
 * // Input simple
 * <Input
 *   label="Email"
 *   placeholder="votre@email.com"
 *   keyboardType="email-address"
 *   value={email}
 *   onChangeText={setEmail}
 * />
 *
 * // Input avec erreur
 * <Input
 *   label="Téléphone"
 *   error="Numéro invalide"
 *   value={phone}
 *   onChangeText={setPhone}
 * />
 *
 * // Password Input
 * <PasswordInput
 *   label="Mot de passe"
 *   placeholder="••••••••"
 *   value={password}
 *   onChangeText={setPassword}
 * />
 *
 * // Search Input
 * <SearchInput
 *   placeholder="Rechercher..."
 *   value={search}
 *   onChangeText={setSearch}
 *   onClear={() => setSearch('')}
 * />
 *
 * // Input avec icônes custom
 * <Input
 *   label="Montant"
 *   leftIcon={<Text>€</Text>}
 *   keyboardType="numeric"
 *   value={amount}
 *   onChangeText={setAmount}
 * />
 */
