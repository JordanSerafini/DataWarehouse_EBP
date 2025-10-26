/**
 * Input Component - Material Design 3 avec NativeWind
 * Champ de saisie réutilisable avec label et erreur
 */

import React, { useState } from 'react';
import { View, TextInput, Text, Pressable } from 'react-native';
import type { TextInputProps } from 'react-native';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'outlined' | 'filled';
  fullWidth?: boolean;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  variant = 'outlined',
  fullWidth = true,
  className,
  editable = true,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  // Classes de variant
  const variantClasses = {
    outlined: `
      border-2
      ${error ? 'border-error' : isFocused ? 'border-primary' : 'border-gray-300'}
      bg-transparent
    `,
    filled: `
      border-b-2
      ${error ? 'border-error' : isFocused ? 'border-primary' : 'border-gray-300'}
      bg-gray-50
    `,
  };

  return (
    <View className={`${fullWidth ? 'w-full' : ''} ${className || ''}`}>
      {/* Label */}
      {label && (
        <Text
          className={`
            text-sm font-medium mb-1.5
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
          rounded-lg
          ${variantClasses[variant]}
          ${!editable ? 'opacity-50' : ''}
        `}
      >
        {/* Left Icon */}
        {leftIcon && (
          <View className="pl-3 pr-2">
            {leftIcon}
          </View>
        )}

        {/* TextInput */}
        <TextInput
          className={`
            flex-1
            px-4 py-3
            text-base text-text-primary
            ${leftIcon ? 'pl-0' : ''}
            ${rightIcon ? 'pr-0' : ''}
          `}
          placeholderTextColor="#00000099"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={editable}
          {...props}
        />

        {/* Right Icon */}
        {rightIcon && (
          <View className="pr-3 pl-2">
            {rightIcon}
          </View>
        )}
      </View>

      {/* Helper Text / Error */}
      {(error || helperText) && (
        <Text
          className={`
            text-xs mt-1 ml-1
            ${error ? 'text-error' : 'text-text-secondary'}
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
