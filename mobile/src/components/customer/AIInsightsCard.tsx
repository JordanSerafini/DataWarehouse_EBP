/**
 * AIInsightsCard - Carte affichant des insights et suggestions intelligentes
 *
 * Utilise les données d'activité pour générer des suggestions automatiques :
 * - Dernière visite
 * - Prochaine intervention suggérée
 * - Alertes de suivi
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AIInsightsCardProps {
  lastInterventionDate?: string;
  daysSinceLastIntervention?: number;
  totalInterventions: number;
  customerHealthScore?: number;
}

const AIInsightsCard: React.FC<AIInsightsCardProps> = ({
  lastInterventionDate,
  daysSinceLastIntervention,
  totalInterventions,
  customerHealthScore,
}) => {
  // Générer les insights
  const insights: Array<{
    icon: string;
    text: string;
    color: string;
    type: 'info' | 'warning' | 'success';
  }> = [];

  // Insight sur la dernière intervention
  if (lastInterventionDate && daysSinceLastIntervention !== undefined) {
    const lastDate = new Date(lastInterventionDate);
    const relativeDate = formatDistanceToNow(lastDate, {
      addSuffix: true,
      locale: fr,
    });

    if (daysSinceLastIntervention > 180) {
      insights.push({
        icon: 'alert-circle',
        text: `Dernière intervention ${relativeDate} - Client à contacter`,
        color: '#ff5722',
        type: 'warning',
      });
    } else if (daysSinceLastIntervention > 90) {
      insights.push({
        icon: 'time',
        text: `Dernière intervention ${relativeDate} - Suivi recommandé`,
        color: '#ff9800',
        type: 'info',
      });
    } else {
      insights.push({
        icon: 'checkmark-circle',
        text: `Dernière intervention ${relativeDate}`,
        color: '#4caf50',
        type: 'success',
      });
    }
  } else if (totalInterventions === 0) {
    insights.push({
      icon: 'star',
      text: 'Nouveau client - Première intervention à planifier',
      color: '#2196f3',
      type: 'info',
    });
  }

  // Insight sur la fréquence
  if (totalInterventions > 0 && daysSinceLastIntervention) {
    const avgDaysBetween = daysSinceLastIntervention / totalInterventions;

    if (avgDaysBetween < 30) {
      insights.push({
        icon: 'trending-up',
        text: `Client très actif (${totalInterventions} interventions)`,
        color: '#4caf50',
        type: 'success',
      });
    } else if (avgDaysBetween > 90 && totalInterventions > 3) {
      insights.push({
        icon: 'calendar',
        text: `Prochaine intervention suggérée dans ${Math.round(avgDaysBetween - daysSinceLastIntervention)} jours`,
        color: '#2196f3',
        type: 'info',
      });
    }
  }

  // Insight sur le score de santé
  if (customerHealthScore !== undefined) {
    if (customerHealthScore < 40) {
      insights.push({
        icon: 'warning',
        text: 'Score de santé faible - Attention particulière requise',
        color: '#f44336',
        type: 'warning',
      });
    } else if (customerHealthScore >= 80) {
      insights.push({
        icon: 'heart',
        text: 'Client en excellente santé',
        color: '#4caf50',
        type: 'success',
      });
    }
  }

  // Ne rien afficher si aucun insight
  if (insights.length === 0) {
    return null;
  }

  return (
    <Card style={styles.card}>
      <Card.Title
        title="Insights & Suggestions"
        left={(props) => <Ionicons name="bulb" size={24} color="#6200ee" />}
        subtitle="Générés automatiquement"
      />
      <Card.Content>
        {insights.map((insight, index) => (
          <View key={index} style={styles.insightRow}>
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor:
                    insight.type === 'warning'
                      ? '#fff3e0'
                      : insight.type === 'success'
                        ? '#e8f5e9'
                        : '#e3f2fd',
                },
              ]}
            >
              <Ionicons
                name={insight.icon as any}
                size={20}
                color={insight.color}
              />
            </View>
            <Text variant="bodyMedium" style={styles.insightText}>
              {insight.text}
            </Text>
          </View>
        ))}

        {/* Action suggérée */}
        {daysSinceLastIntervention && daysSinceLastIntervention > 90 && (
          <Chip
            icon="lightbulb"
            mode="flat"
            style={styles.actionChip}
            textStyle={styles.actionChipText}
          >
            💡 Suggestion: Planifier un appel de suivi
          </Chip>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 12,
    elevation: 2,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightText: {
    flex: 1,
    lineHeight: 20,
  },
  actionChip: {
    backgroundColor: '#fff8e1',
    marginTop: 8,
  },
  actionChipText: {
    color: '#f57c00',
    fontSize: 13,
  },
});

export default AIInsightsCard;
