/**
 * AnimatedComponents - Micro-interactions avec Reanimated
 *
 * Tendance UI/UX 2025 : Micro-interactions pour +30% satisfaction utilisateur
 * Animations fluides 60fps avec React Native Reanimated
 */

import React, { useEffect } from 'react';
import { Pressable, StyleSheet, ViewStyle, PressableProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  Easing,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { Card, Button as PaperButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { hapticService } from '../../services/haptic.service';

// ============================================================================
// ANIMATED PRESSABLE - Composant générique avec scale on press
// ============================================================================

interface AnimatedPressableProps extends PressableProps {
  children: React.ReactNode;
  scaleValue?: number;
  hapticFeedback?: boolean;
  hapticType?: 'light' | 'medium' | 'heavy';
  style?: ViewStyle;
}

export const AnimatedPressable: React.FC<AnimatedPressableProps> = ({
  children,
  scaleValue = 0.95,
  hapticFeedback = true,
  hapticType = 'light',
  onPress,
  style,
  ...props
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(scaleValue, {
      damping: 15,
      stiffness: 150,
    });

    if (hapticFeedback) {
      runOnJS(hapticService[hapticType])();
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      {...props}
    >
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </Pressable>
  );
};

// ============================================================================
// ANIMATED BUTTON - Bouton Material Design avec scale
// ============================================================================

interface AnimatedButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  mode?: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';
  icon?: string;
  loading?: boolean;
  disabled?: boolean;
  hapticFeedback?: boolean;
  style?: any;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onPress,
  mode = 'contained',
  icon,
  loading,
  disabled,
  hapticFeedback = true,
  style,
}) => {
  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled || loading}
      hapticFeedback={hapticFeedback}
      hapticType="medium"
      scaleValue={0.96}
    >
      <PaperButton
        mode={mode}
        icon={icon}
        loading={loading}
        disabled={disabled}
        style={style}
        onPress={() => {}} // onPress géré par AnimatedPressable
      >
        {children}
      </PaperButton>
    </AnimatedPressable>
  );
};

// ============================================================================
// ANIMATED CARD - Card avec lift effect on press
// ============================================================================

interface AnimatedCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  hapticFeedback?: boolean;
  style?: any;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  onPress,
  hapticFeedback = true,
  style,
}) => {
  const scale = useSharedValue(1);
  const elevation = useSharedValue(2);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    elevation: elevation.value,
    shadowOpacity: interpolate(elevation.value, [2, 8], [0.2, 0.4]),
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, {
      damping: 15,
      stiffness: 150,
    });
    elevation.value = withSpring(8, {
      damping: 15,
      stiffness: 150,
    });

    if (hapticFeedback) {
      runOnJS(hapticService.light)();
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
    elevation.value = withSpring(2, {
      damping: 15,
      stiffness: 150,
    });
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View style={[animatedStyle]}>
        <Card style={style}>{children}</Card>
      </Animated.View>
    </Pressable>
  );
};

// ============================================================================
// ANIMATED CHECKMARK - Checkmark animé pour succès
// ============================================================================

interface AnimatedCheckmarkProps {
  visible: boolean;
  size?: number;
  color?: string;
  onAnimationEnd?: () => void;
}

export const AnimatedCheckmark: React.FC<AnimatedCheckmarkProps> = ({
  visible,
  size = 64,
  color = '#4caf50',
  onAnimationEnd,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Animation d'entrée avec bounce
      scale.value = withSequence(
        withSpring(1.2, { damping: 8, stiffness: 100 }),
        withSpring(1, { damping: 10, stiffness: 100 })
      );
      opacity.value = withTiming(1, { duration: 300 });
      rotation.value = withSequence(
        withTiming(360, { duration: 500, easing: Easing.out(Easing.cubic) }),
        withTiming(360, { duration: 0 }) // Reset pour prochaine animation
      );

      // Callback après animation
      if (onAnimationEnd) {
        setTimeout(() => {
          runOnJS(onAnimationEnd)();
        }, 800);
      }
    } else {
      // Animation de sortie
      scale.value = withSpring(0, { damping: 10, stiffness: 100 });
      opacity.value = withTiming(0, { duration: 200 });
      rotation.value = 0;
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.checkmarkContainer, animatedStyle]}>
      <Ionicons name="checkmark-circle" size={size} color={color} />
    </Animated.View>
  );
};

// ============================================================================
// ANIMATED FADE IN - Fade in entrance animation
// ============================================================================

interface AnimatedFadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: any;
}

export const AnimatedFadeIn: React.FC<AnimatedFadeInProps> = ({
  children,
  delay = 0,
  duration = 500,
  style,
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    setTimeout(() => {
      opacity.value = withTiming(1, { duration, easing: Easing.out(Easing.cubic) });
      translateY.value = withTiming(0, { duration, easing: Easing.out(Easing.cubic) });
    }, delay);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
};

// ============================================================================
// ANIMATED STAGGER LIST - Liste avec entrée stagger
// ============================================================================

interface AnimatedStaggerListProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  itemDuration?: number;
}

export const AnimatedStaggerList: React.FC<AnimatedStaggerListProps> = ({
  children,
  staggerDelay = 100,
  itemDuration = 400,
}) => {
  return (
    <>
      {React.Children.map(children, (child, index) => (
        <AnimatedFadeIn delay={index * staggerDelay} duration={itemDuration}>
          {child}
        </AnimatedFadeIn>
      ))}
    </>
  );
};

// ============================================================================
// ANIMATED BADGE - Badge avec pulse animation
// ============================================================================

interface AnimatedBadgeProps {
  children: React.ReactNode;
  pulse?: boolean;
  style?: any;
}

export const AnimatedBadge: React.FC<AnimatedBadgeProps> = ({
  children,
  pulse = false,
  style,
}) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (pulse) {
      scale.value = withSequence(
        withTiming(1.1, { duration: 500 }),
        withTiming(1, { duration: 500 })
      );

      // Loop pulse
      const interval = setInterval(() => {
        scale.value = withSequence(
          withTiming(1.1, { duration: 500 }),
          withTiming(1, { duration: 500 })
        );
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
};

// ============================================================================
// ANIMATED ICON BUTTON - Icon button avec rotation on press
// ============================================================================

interface AnimatedIconButtonProps {
  icon: string;
  onPress?: () => void;
  size?: number;
  color?: string;
  hapticFeedback?: boolean;
  rotateOnPress?: boolean;
}

export const AnimatedIconButton: React.FC<AnimatedIconButtonProps> = ({
  icon,
  onPress,
  size = 24,
  color = '#6200ee',
  hapticFeedback = true,
  rotateOnPress = false,
}) => {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` }
    ],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.85, {
      damping: 15,
      stiffness: 150,
    });

    if (rotateOnPress) {
      rotation.value = withTiming(90, { duration: 200 });
    }

    if (hapticFeedback) {
      runOnJS(hapticService.light)();
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });

    if (rotateOnPress) {
      rotation.value = withTiming(0, { duration: 200 });
    }
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
    >
      <Animated.View style={animatedStyle}>
        <Ionicons name={icon as any} size={size} color={color} />
      </Animated.View>
    </Pressable>
  );
};

// ============================================================================
// ANIMATED PULL TO REFRESH INDICATOR (Custom)
// ============================================================================

interface AnimatedPullToRefreshProps {
  progress: number; // 0 à 1
}

export const AnimatedPullToRefreshIndicator: React.FC<AnimatedPullToRefreshProps> = ({
  progress,
}) => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    rotation.value = progress * 360;
    scale.value = withSpring(progress, {
      damping: 15,
      stiffness: 100,
    });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value }
    ],
    opacity: scale.value,
  }));

  return (
    <Animated.View style={[styles.pullToRefreshContainer, animatedStyle]}>
      <Ionicons name="reload-circle" size={32} color="#6200ee" />
    </Animated.View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  checkmarkContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pullToRefreshContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});

/**
 * Exemples d'utilisation:
 *
 * // Bouton animé
 * <AnimatedButton onPress={handleSave} icon="save">
 *   Enregistrer
 * </AnimatedButton>
 *
 * // Card animée
 * <AnimatedCard onPress={handlePress}>
 *   <Card.Content>...</Card.Content>
 * </AnimatedCard>
 *
 * // Pressable générique
 * <AnimatedPressable onPress={handlePress}>
 *   <View>...</View>
 * </AnimatedPressable>
 *
 * // Checkmark animé
 * <AnimatedCheckmark visible={success} />
 *
 * // Fade in
 * <AnimatedFadeIn delay={200}>
 *   <Text>Contenu</Text>
 * </AnimatedFadeIn>
 *
 * // Liste stagger
 * <AnimatedStaggerList>
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 *   <Card>Item 3</Card>
 * </AnimatedStaggerList>
 *
 * // Badge pulse
 * <AnimatedBadge pulse>
 *   <Chip>New</Chip>
 * </AnimatedBadge>
 *
 * // Icon button animé
 * <AnimatedIconButton
 *   icon="heart"
 *   onPress={handleLike}
 *   rotateOnPress
 * />
 */
