/**
 * InterventionsMap (Web Version)
 *
 * Version simplifiée pour le web - affiche les interventions en liste
 * car react-native-maps n'est pas compatible web
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { InterventionStatus } from '../services/intervention.service';

/**
 * Interface Intervention simplifiée pour la carte
 */
export interface MapIntervention {
  id: string;
  reference: string;
  customerName: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  status: InterventionStatus;
  scheduledDate?: string;
}

interface InterventionsMapProps {
  interventions: MapIntervention[];
  onMarkerPress?: (interventionId: string) => void;
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

export const InterventionsMap: React.FC<InterventionsMapProps> = ({
  interventions,
  onMarkerPress,
}) => {
  /**
   * Couleur selon statut
   */
  const getStatusColor = (status: InterventionStatus): string => {
    switch (status) {
      case InterventionStatus.PENDING:
        return '#ff9800'; // Orange
      case InterventionStatus.IN_PROGRESS:
        return '#2196f3'; // Bleu
      case InterventionStatus.COMPLETED:
        return '#4caf50'; // Vert
      case InterventionStatus.CANCELLED:
        return '#f44336'; // Rouge
      case InterventionStatus.SCHEDULED:
        return '#9c27b0'; // Violet
      default:
        return '#9e9e9e'; // Gris
    }
  };

  /**
   * Label statut
   */
  const getStatusLabel = (status: InterventionStatus): string => {
    switch (status) {
      case InterventionStatus.PENDING:
        return 'En attente';
      case InterventionStatus.IN_PROGRESS:
        return 'En cours';
      case InterventionStatus.COMPLETED:
        return 'Terminée';
      case InterventionStatus.CANCELLED:
        return 'Annulée';
      case InterventionStatus.SCHEDULED:
        return 'Planifiée';
      default:
        return 'Inconnu';
    }
  };

  // Filtrer interventions avec GPS
  const interventionsWithGPS = interventions.filter(
    (i) => i.latitude !== undefined && i.longitude !== undefined
  );

  // Si aucune intervention n'a de GPS
  if (interventionsWithGPS.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Card style={styles.emptyCard}>
          <Card.Content style={styles.emptyContent}>
            <Ionicons name="location-outline" size={64} color="#9e9e9e" />
            <Text variant="titleLarge" style={styles.emptyTitle}>
              Aucune intervention géolocalisée
            </Text>
            <Text variant="bodyMedium" style={styles.emptyText}>
              Les interventions sans coordonnées GPS ne peuvent pas être affichées.
            </Text>
            {interventions.length > 0 && (
              <Text variant="bodySmall" style={styles.emptyHint}>
                {interventions.length} intervention{interventions.length > 1 ? 's' : ''} au total
              </Text>
            )}
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Info header */}
      <View style={styles.header}>
        <Card style={styles.headerCard}>
          <Card.Content style={styles.headerContent}>
            <Ionicons name="information-circle" size={20} color="#2196f3" />
            <Text variant="bodyMedium" style={styles.headerText}>
              Vue web - Carte interactive disponible sur mobile
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* Liste des interventions */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.listContainer}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          {interventionsWithGPS.length} intervention{interventionsWithGPS.length > 1 ? 's' : ''} géolocalisée{interventionsWithGPS.length > 1 ? 's' : ''}
        </Text>

        {interventionsWithGPS.map((intervention) => (
          <Card
            key={intervention.id}
            style={styles.card}
            onPress={() => onMarkerPress?.(intervention.id)}
          >
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text variant="titleMedium" style={styles.reference}>
                  {intervention.reference}
                </Text>
                <Chip
                  mode="flat"
                  style={[
                    styles.statusChip,
                    { backgroundColor: getStatusColor(intervention.status) },
                  ]}
                  textStyle={styles.statusChipText}
                >
                  {getStatusLabel(intervention.status)}
                </Chip>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                  <Ionicons name="person" size={16} color="#757575" />
                  <Text variant="bodyMedium" style={styles.infoText}>
                    {intervention.customerName}
                  </Text>
                </View>

                {intervention.address && (
                  <View style={styles.infoRow}>
                    <Ionicons name="location" size={16} color="#757575" />
                    <Text variant="bodySmall" style={styles.infoText}>
                      {intervention.address}
                    </Text>
                  </View>
                )}

                {intervention.latitude && intervention.longitude && (
                  <View style={styles.infoRow}>
                    <Ionicons name="navigate" size={16} color="#757575" />
                    <Text variant="bodySmall" style={styles.coordinates}>
                      {intervention.latitude.toFixed(6)}, {intervention.longitude.toFixed(6)}
                    </Text>
                  </View>
                )}

                {intervention.scheduledDate && (
                  <View style={styles.infoRow}>
                    <Ionicons name="calendar" size={16} color="#757575" />
                    <Text variant="bodySmall" style={styles.infoText}>
                      {new Date(intervention.scheduledDate).toLocaleDateString('fr-FR')}
                    </Text>
                  </View>
                )}
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerCard: {
    backgroundColor: '#e3f2fd',
    elevation: 0,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  headerText: {
    flex: 1,
    color: '#1976d2',
  },
  scrollView: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#424242',
  },
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reference: {
    fontWeight: 'bold',
    color: '#1976d2',
  },
  statusChip: {
    height: 24,
  },
  statusChipText: {
    color: '#fff',
    fontSize: 11,
  },
  cardBody: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    flex: 1,
    color: '#424242',
  },
  coordinates: {
    flex: 1,
    color: '#757575',
    fontFamily: 'monospace',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 32,
  },
  emptyCard: {
    width: '100%',
    maxWidth: 400,
    elevation: 4,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  emptyText: {
    marginTop: 8,
    textAlign: 'center',
    color: '#757575',
  },
  emptyHint: {
    marginTop: 16,
    color: '#9e9e9e',
    fontStyle: 'italic',
  },
});
