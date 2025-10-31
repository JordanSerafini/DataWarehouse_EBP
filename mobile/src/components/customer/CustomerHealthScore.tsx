/**
 * CustomerHealthScore - Indicateur visuel circulaire du score de santé client
 *
 * Affiche un score de 0 à 100 avec :
 * - Gauge circulaire animée
 * - Couleur dynamique (rouge/orange/vert)
 * - Label de statut
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { Circle } from 'react-native-svg';

interface CustomerHealthScoreProps {
  score: number; // 0-100
  size?: number; // Taille du cercle (default: 120)
  strokeWidth?: number; // Épaisseur du cercle (default: 10)
}

const CustomerHealthScore: React.FC<CustomerHealthScoreProps> = ({
  score,
  size = 120,
  strokeWidth = 10,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: score,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [score]);

  // Calcul des dimensions
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Couleur selon le score
  const getScoreColor = (value: number): string => {
    if (value >= 80) return '#4caf50'; // Vert - Excellent
    if (value >= 60) return '#8bc34a'; // Vert clair - Bon
    if (value >= 40) return '#ff9800'; // Orange - Moyen
    if (value >= 20) return '#ff5722'; // Orange foncé - Faible
    return '#f44336'; // Rouge - Critique
  };

  // Label selon le score
  const getScoreLabel = (value: number): string => {
    if (value >= 80) return 'Excellent';
    if (value >= 60) return 'Bon';
    if (value >= 40) return 'Moyen';
    if (value >= 20) return 'Faible';
    return 'Critique';
  };

  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  return (
    <View style={styles.container}>
      <View style={[styles.scoreCircle, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          {/* Cercle de fond */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#e0e0e0"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Cercle de progression */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - score / 100)}
            strokeLinecap="round"
            rotation="-90"
            origin={`${center}, ${center}`}
          />
        </Svg>

        {/* Score au centre */}
        <View style={styles.scoreContent}>
          <Text variant="displaySmall" style={[styles.scoreText, { color }]}>
            {Math.round(score)}
          </Text>
          <Text variant="labelSmall" style={styles.maxText}>
            / 100
          </Text>
        </View>
      </View>

      {/* Label */}
      <Text variant="labelLarge" style={[styles.label, { color }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  scoreCircle: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreContent: {
    position: 'absolute',
    alignItems: 'center',
  },
  scoreText: {
    fontWeight: 'bold',
    lineHeight: 48,
  },
  maxText: {
    color: '#9e9e9e',
    marginTop: -4,
  },
  label: {
    marginTop: 8,
    fontWeight: '600',
  },
});

export default CustomerHealthScore;
