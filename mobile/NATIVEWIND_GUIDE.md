# NativeWind Configuration Guide

## 📦 Installation

NativeWind v4 est configuré pour le projet Expo SDK 54.

### Dépendances installées
```json
{
  "nativewind": "^4.x",
  "tailwindcss": "3.4.17"
}
```

## ⚙️ Configuration

### 1. tailwind.config.js
Configuration complète avec:
- ✅ Couleurs Material Design 3
- ✅ Espacement 4dp grid (Material Design)
- ✅ Elevation (shadows)
- ✅ Dark mode support
- ✅ Custom theme extension

### 2. babel.config.js
Plugin NativeWind ajouté avant Reanimated:
```javascript
plugins: [
  'nativewind/babel',           // ← NativeWind
  'react-native-reanimated/plugin', // ← Reanimated (toujours dernier)
]
```

### 3. global.d.ts
Types TypeScript pour className prop:
```typescript
/// <reference types="nativewind/types" />
```

### 4. tsconfig.json
Déjà configuré avec `strict: true`.

## 🚀 Utilisation

### Basic Usage

```typescript
import { View, Text } from 'react-native';

function MyComponent() {
  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-2xl font-bold text-primary">
        Hello NativeWind!
      </Text>
    </View>
  );
}
```

### Styles Conditionnels

```typescript
import { Pressable, Text } from 'react-native';

function Button({ disabled }: { disabled?: boolean }) {
  return (
    <Pressable
      className={`
        px-4 py-2 rounded-lg
        ${disabled ? 'bg-gray-300' : 'bg-primary'}
        active:opacity-80
      `}
    >
      <Text className={`
        font-semibold
        ${disabled ? 'text-gray-500' : 'text-white'}
      `}>
        Press Me
      </Text>
    </Pressable>
  );
}
```

### Dark Mode

```typescript
import { View, Text } from 'react-native';
import { useColorScheme } from 'nativewind';

function ThemedComponent() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <View className="flex-1 bg-background dark:bg-gray-900">
      <Text className="text-text-primary dark:text-white">
        Current theme: {colorScheme}
      </Text>
      <Button onPress={toggleColorScheme}>
        Toggle Dark Mode
      </Button>
    </View>
  );
}
```

### Material Design 3 Classes

```typescript
// Couleurs
<View className="bg-primary" />        // #6200ee
<View className="bg-secondary" />      // #03dac6
<View className="bg-error" />          // #b00020
<View className="bg-background" />     // #f5f5f5

// Élévation (shadows)
<View className="shadow-elevation-2" />
<View className="shadow-elevation-8" />

// Espacement (4dp grid)
<View className="p-2" />  // 8px
<View className="m-4" />  // 16px
<View className="gap-3" /> // 12px

// Border radius
<View className="rounded" />     // 8px
<View className="rounded-lg" />  // 16px
<View className="rounded-2xl" /> // 24px
```

### Responsive Design

```typescript
// Mobile-first approach
<View className="
  w-full          // Par défaut
  sm:w-1/2        // Small screens
  md:w-1/3        // Medium screens
  lg:w-1/4        // Large screens
" />

// Orientation
<View className="
  portrait:flex-col
  landscape:flex-row
" />
```

### Animations avec Reanimated

```typescript
import Animated from 'react-native-reanimated';

// NativeWind fonctionne avec Animated.View
<Animated.View
  entering={FadeIn}
  exiting={FadeOut}
  className="bg-primary p-4 rounded-lg"
>
  <Text className="text-white">Animated!</Text>
</Animated.View>
```

## 🎨 Design System

### Composants réutilisables

```typescript
// components/ui/Card.tsx
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  variant?: 'elevated' | 'outlined' | 'filled';
}

export function Card({ variant = 'elevated', className, children, ...props }: CardProps) {
  const baseClasses = 'bg-surface rounded-lg p-4';
  const variantClasses = {
    elevated: 'shadow-elevation-2',
    outlined: 'border border-gray-200',
    filled: 'bg-primary-50',
  };

  return (
    <View className={`${baseClasses} ${variantClasses[variant]} ${className || ''}`} {...props}>
      {children}
    </View>
  );
}

// Usage
<Card variant="elevated">
  <Text className="text-lg font-bold">Title</Text>
</Card>
```

### Buttons

```typescript
// components/ui/Button.tsx
import { Pressable, Text, PressableProps } from 'react-native';

interface ButtonProps extends PressableProps {
  variant?: 'filled' | 'outlined' | 'text';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  variant = 'filled',
  size = 'md',
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5',
    md: 'px-4 py-2',
    lg: 'px-6 py-3',
  };

  const variantClasses = {
    filled: `bg-primary ${disabled ? 'opacity-50' : 'active:bg-primary-700'}`,
    outlined: `border-2 border-primary ${disabled ? 'opacity-50' : 'active:bg-primary-50'}`,
    text: `${disabled ? 'opacity-50' : 'active:bg-gray-100'}`,
  };

  return (
    <Pressable
      className={`
        rounded-lg
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className || ''}
      `}
      disabled={disabled}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text className={`
          font-semibold text-center
          ${variant === 'filled' ? 'text-white' : 'text-primary'}
        `}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

// Usage
<Button variant="filled" size="lg">Submit</Button>
<Button variant="outlined" onPress={handleCancel}>Cancel</Button>
```

## 🔧 Advanced Usage

### Custom Utilities

```javascript
// tailwind.config.js
theme: {
  extend: {
    utilities: {
      '.safe-area-top': {
        paddingTop: 'env(safe-area-inset-top)',
      },
      '.safe-area-bottom': {
        paddingBottom: 'env(safe-area-inset-bottom)',
      },
    },
  },
},
```

### Platform-Specific Styles

```typescript
import { Platform } from 'react-native';

<View className={`
  p-4
  ${Platform.OS === 'ios' ? 'shadow-lg' : 'elevation-4'}
`} />
```

## 📱 Migration Existante

### Convertir StyleSheet → NativeWind

**Avant:**
```typescript
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
  },
});

<View style={styles.container}>
  <Text style={styles.title}>Hello</Text>
</View>
```

**Après:**
```typescript
<View className="flex-1 bg-background p-4">
  <Text className="text-2xl font-bold text-primary">Hello</Text>
</View>
```

### Compatibilité

NativeWind fonctionne en parallèle avec StyleSheet:
```typescript
// OK! Vous pouvez mélanger
<View className="flex-1 p-4" style={{ borderWidth: 1 }}>
  {/* ... */}
</View>
```

## 🎯 Best Practices

### 1. Utilisez des composants réutilisables
```typescript
// components/ui/Typography.tsx
export const Title = ({ children, className }: any) => (
  <Text className={`text-2xl font-bold text-text-primary ${className || ''}`}>
    {children}
  </Text>
);

export const Body = ({ children, className }: any) => (
  <Text className={`text-base text-text-secondary ${className || ''}`}>
    {children}
  </Text>
);
```

### 2. Utilisez clsx pour conditions complexes
```bash
npm install clsx
```

```typescript
import clsx from 'clsx';

<View className={clsx(
  'p-4 rounded-lg',
  isActive && 'bg-primary',
  isDisabled && 'opacity-50',
  variant === 'large' && 'p-6',
)} />
```

### 3. Créez un design system
```typescript
// constants/theme.ts
export const SPACING = {
  xs: '1',
  sm: '2',
  md: '4',
  lg: '6',
  xl: '8',
} as const;

export const COLORS = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  error: 'bg-error',
} as const;

// Usage
<View className={`p-${SPACING.md} ${COLORS.primary}`} />
```

## 🐛 Troubleshooting

### Classes not applying?
1. Clear cache: `npx expo start -c`
2. Rebuild: `npx expo prebuild --clean`
3. Check tailwind.config.js content paths

### TypeScript errors?
Add to tsconfig.json:
```json
{
  "compilerOptions": {
    "types": ["nativewind/types"]
  }
}
```

### Dark mode not working?
```typescript
// App.tsx
import { NativeWindStyleSheet } from 'nativewind';

// Configure dark mode
NativeWindStyleSheet.setColorScheme('light'); // ou 'dark'
```

## 📚 Ressources

- [NativeWind Docs](https://www.nativewind.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Material Design 3](https://m3.material.io/)
- [Expo SDK 54](https://docs.expo.dev/)

## 🎉 Next Steps

1. Créer composants UI réutilisables dans `src/components/ui/`
2. Convertir progressivement les screens existants
3. Implémenter dark mode complet
4. Tester sur devices physiques
