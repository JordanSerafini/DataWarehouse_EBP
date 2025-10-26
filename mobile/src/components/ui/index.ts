/**
 * UI Components - Barrel exports (2025 Enhanced)
 * Import centralisé de tous les composants UI Material Design 3
 */

// Core Components (Enhanced 2025)
export { Button } from './Button';
export type { ButtonProps } from './Button';

export { Card, CardHeader, CardContent, CardActions } from './Card';

export { Input, PasswordInput, SearchInput } from './Input';
export type { InputProps } from './Input';

// New 2025 Components
export { Badge } from './Badge';
export type { BadgeProps } from './Badge';

export { Chip, ChipGroup } from './Chip';
export type { ChipProps } from './Chip';

export { Switch } from './Switch';
export type { SwitchProps } from './Switch';

export { Avatar, AvatarGroup } from './Avatar';
export type { AvatarProps } from './Avatar';

export {
  Skeleton,
  SkeletonCard,
  SkeletonList,
  SkeletonText,
  SkeletonAvatar
} from './Skeleton';
export type { SkeletonProps } from './Skeleton';

export { Toast, useToast } from './Toast';
export type { ToastProps } from './Toast';

/**
 * Usage:
 * import { Button, Card, Input, Badge, Chip, Toast, useToast } from '@/components/ui';
 */
