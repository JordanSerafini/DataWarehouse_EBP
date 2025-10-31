/**
 * SkeletonLoaders - Composants Skeleton optimisés React Native Paper
 *
 * Tendance UI/UX 2025 : Skeleton loaders pour améliorer la perception de performance (+40%)
 * Remplace les ActivityIndicator par des placeholders animés élégants
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';

// ============================================================================
// COMPOSANT DE BASE
// ============================================================================

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  animation?: 'pulse' | 'wave' | 'none';
  style?: any;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  variant = 'text',
  animation = 'pulse',
  style,
}) => {
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

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  // Styles selon variant
  const variantStyles = {
    text: { borderRadius: 4 },
    circular: { borderRadius: 999 },
    rectangular: { borderRadius: 0 },
    rounded: { borderRadius: 8 },
  };

  return (
    <Animated.View
      style={[
        styles.skeletonBase,
        variantStyles[variant],
        {
          width,
          height,
          opacity: animation !== 'none' ? opacity : 0.3,
        },
        style,
      ]}
    />
  );
};

// ============================================================================
// SKELETON POUR INTERVENTION DETAILS
// ============================================================================

export const SkeletonInterventionDetails: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Header Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.row}>
            <Skeleton width="60%" height={24} style={styles.mb8} />
            <Skeleton width={80} height={32} variant="rounded" />
          </View>
        </Card.Content>
      </Card>

      {/* Client Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.row}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton width="30%" height={16} style={styles.ml8} />
          </View>
          <Skeleton width="100%" height={20} style={[styles.mt12, styles.mb8]} />
          <View style={styles.row}>
            <Skeleton variant="circular" width={20} height={20} />
            <Skeleton width="80%" height={14} style={styles.ml8} />
          </View>
          <Skeleton width="100%" height={36} variant="rounded" style={styles.mt12} />
        </Card.Content>
      </Card>

      {/* Informations Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.row}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton width="40%" height={16} style={styles.ml8} />
          </View>
          <View style={styles.mt16}>
            {[1, 2, 3].map((i) => (
              <View key={i} style={[styles.row, styles.mb12]}>
                <Skeleton width="30%" height={14} />
                <Skeleton width="50%" height={14} />
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Actions Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Skeleton width="100%" height={48} variant="rounded" style={styles.mb12} />
        </Card.Content>
      </Card>
    </View>
  );
};

// ============================================================================
// SKELETON POUR CUSTOMER DETAILS
// ============================================================================

export const SkeletonCustomerDetails: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Header Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.row}>
            <Skeleton variant="circular" width={56} height={56} />
            <View style={[styles.flex1, styles.ml12]}>
              <Skeleton width="70%" height={20} style={styles.mb8} />
              <Skeleton width="50%" height={14} />
            </View>
          </View>

          <View style={[styles.divider, styles.my16]} />

          {/* Adresse */}
          <View style={styles.row}>
            <Skeleton variant="circular" width={20} height={20} />
            <View style={[styles.flex1, styles.ml8]}>
              <Skeleton width="100%" height={14} style={styles.mb4} />
              <Skeleton width="60%" height={14} />
            </View>
          </View>

          {/* Actions rapides */}
          <View style={[styles.row, styles.mt16, styles.gap12]}>
            <Skeleton width={100} height={40} variant="rounded" />
            <Skeleton width={100} height={40} variant="rounded" />
            <Skeleton width={100} height={40} variant="rounded" />
          </View>
        </Card.Content>
      </Card>

      {/* KPIs Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.row}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton width="40%" height={16} style={styles.ml8} />
          </View>
          <View style={[styles.row, styles.mt16, styles.gap16]}>
            <View style={styles.flex1}>
              <Skeleton width="100%" height={48} variant="rounded" />
            </View>
            <View style={styles.flex1}>
              <Skeleton width="100%" height={48} variant="rounded" />
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Historique Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.row}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton width="50%" height={16} style={styles.ml8} />
          </View>
          {[1, 2, 3].map((i) => (
            <View key={i} style={[styles.row, styles.mt12]}>
              <Skeleton variant="circular" width={40} height={40} />
              <View style={[styles.flex1, styles.ml12]}>
                <Skeleton width="70%" height={14} style={styles.mb4} />
                <Skeleton width="50%" height={12} />
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>
    </View>
  );
};

// ============================================================================
// SKELETON POUR LISTE CUSTOMERS
// ============================================================================

interface SkeletonCustomerListProps {
  count?: number;
}

export const SkeletonCustomerList: React.FC<SkeletonCustomerListProps> = ({ count = 5 }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} style={styles.cardList}>
          <Card.Content>
            <View style={styles.row}>
              <Skeleton variant="circular" width={48} height={48} />
              <View style={[styles.flex1, styles.ml12]}>
                <Skeleton width="70%" height={16} style={styles.mb8} />
                <Skeleton width="50%" height={14} style={styles.mb8} />
                <View style={styles.row}>
                  <Skeleton width={80} height={24} variant="rounded" style={styles.mr8} />
                  <Skeleton width={80} height={24} variant="rounded" />
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>
      ))}
    </View>
  );
};

// ============================================================================
// SKELETON POUR LISTE INTERVENTIONS
// ============================================================================

interface SkeletonInterventionListProps {
  count?: number;
}

export const SkeletonInterventionList: React.FC<SkeletonInterventionListProps> = ({ count = 5 }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} style={styles.cardList}>
          <Card.Content>
            <View style={styles.row}>
              <Skeleton width="60%" height={18} />
              <Skeleton width={70} height={28} variant="rounded" />
            </View>
            <Skeleton width="100%" height={14} style={[styles.mt8, styles.mb8]} />
            <View style={styles.row}>
              <Skeleton variant="circular" width={16} height={16} />
              <Skeleton width="40%" height={12} style={styles.ml8} />
            </View>
            <View style={[styles.row, styles.mt8]}>
              <Skeleton variant="circular" width={16} height={16} />
              <Skeleton width="60%" height={12} style={styles.ml8} />
            </View>
          </Card.Content>
        </Card>
      ))}
    </View>
  );
};

// ============================================================================
// SKELETON POUR PLANNING
// ============================================================================

export const SkeletonPlanning: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Header avec segmented buttons */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.row}>
            <Skeleton width={80} height={40} variant="rounded" style={styles.mr8} />
            <Skeleton width={80} height={40} variant="rounded" style={styles.mr8} />
            <Skeleton width={80} height={40} variant="rounded" />
          </View>
        </Card.Content>
      </Card>

      {/* Liste interventions */}
      <SkeletonInterventionList count={3} />
    </View>
  );
};

// ============================================================================
// SKELETON GÉNÉRIQUE CARD
// ============================================================================

export const SkeletonCard: React.FC = () => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        {/* Header */}
        <View style={styles.row}>
          <Skeleton variant="circular" width={40} height={40} />
          <View style={[styles.flex1, styles.ml12]}>
            <Skeleton width="60%" height={16} style={styles.mb8} />
            <Skeleton width="40%" height={12} />
          </View>
        </View>

        {/* Content */}
        <View style={styles.mt16}>
          <Skeleton width="100%" height={12} style={styles.mb8} />
          <Skeleton width="90%" height={12} style={styles.mb8} />
          <Skeleton width="70%" height={12} />
        </View>

        {/* Footer */}
        <View style={[styles.row, styles.mt16, styles.justifyEnd]}>
          <Skeleton width={80} height={32} variant="rounded" style={styles.mr8} />
          <Skeleton width={80} height={32} variant="rounded" />
        </View>
      </Card.Content>
    </Card>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  // Base
  skeletonBase: {
    backgroundColor: '#e0e0e0',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    elevation: 2,
  },
  cardList: {
    marginHorizontal: 16,
    marginTop: 12,
    elevation: 2,
  },

  // Layouts
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  justifyEnd: {
    justifyContent: 'flex-end',
  },
  flex1: {
    flex: 1,
  },

  // Spacing
  mb4: {
    marginBottom: 4,
  },
  mb8: {
    marginBottom: 8,
  },
  mb12: {
    marginBottom: 12,
  },
  mt8: {
    marginTop: 8,
  },
  mt12: {
    marginTop: 12,
  },
  mt16: {
    marginTop: 16,
  },
  ml8: {
    marginLeft: 8,
  },
  ml12: {
    marginLeft: 12,
  },
  mr8: {
    marginRight: 8,
  },
  my16: {
    marginVertical: 16,
  },
  gap12: {
    gap: 12,
  },
  gap16: {
    gap: 16,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
});

/**
 * Exemples d'utilisation:
 *
 * // Skeleton pour intervention details
 * if (loading) {
 *   return <SkeletonInterventionDetails />;
 * }
 *
 * // Skeleton pour customer details
 * if (loading) {
 *   return <SkeletonCustomerDetails />;
 * }
 *
 * // Skeleton pour liste customers
 * if (loading) {
 *   return <SkeletonCustomerList count={5} />;
 * }
 *
 * // Skeleton pour liste interventions
 * if (loading) {
 *   return <SkeletonInterventionList count={3} />;
 * }
 *
 * // Skeleton pour planning
 * if (loading) {
 *   return <SkeletonPlanning />;
 * }
 *
 * // Skeleton card générique
 * <SkeletonCard />
 */
