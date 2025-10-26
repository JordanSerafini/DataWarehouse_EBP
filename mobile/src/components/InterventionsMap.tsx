/**
 * InterventionsMap - Carte GPS avec interventions à proximité
 *
 * Fonctionnalités :
 * - Affichage interventions sur carte
 * - Géolocalisation utilisateur
 * - Marqueurs colorés par statut
 * - Navigation vers détails intervention
 * - Calcul distance
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { Text, Card, Chip, ActivityIndicator, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { showToast } from '../utils/toast';
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
  initialRegion,
}) => {
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [region, setRegion] = useState(
    initialRegion || {
      latitude: 48.8566, // Paris par défaut
      longitude: 2.3522,
      latitudeDelta: 0.5,
      longitudeDelta: 0.5,
    }
  );

  /**
   * Demander permission géolocalisation
   */
  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        showToast('Permission de géolocalisation refusée', 'error');
        setLoadingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setUserLocation(location);

      // Centrer la carte sur la position utilisateur
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });

      setLoadingLocation(false);
    } catch (error) {
      console.error('Error getting location:', error);
      showToast('Erreur lors de la géolocalisation', 'error');
      setLoadingLocation(false);
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  /**
   * Couleur marqueur selon statut
   */
  const getMarkerColor = (status: InterventionStatus): string => {
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

  /**
   * Calculer distance entre 2 points (formule haversine)
   */
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 10) / 10; // Arrondi 1 décimale
  };

  /**
   * Centrer sur position utilisateur
   */
  const centerOnUser = () => {
    if (userLocation) {
      setRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });
    } else {
      showToast('Position non disponible', 'error');
    }
  };

  // Filtrer interventions avec GPS
  const interventionsWithGPS = interventions.filter(
    (i) => i.latitude !== undefined && i.longitude !== undefined
  );

  if (loadingLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text variant="bodyMedium" style={styles.loadingText}>
          Chargement de la carte...
        </Text>
      </View>
    );
  }

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
              Les interventions sans coordonnées GPS ne peuvent pas être affichées sur la carte.
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
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {/* Marqueurs interventions */}
        {interventionsWithGPS.map((intervention) => (
          <Marker
            key={intervention.id}
            coordinate={{
              latitude: intervention.latitude!,
              longitude: intervention.longitude!,
            }}
            pinColor={getMarkerColor(intervention.status)}
            onPress={() => onMarkerPress?.(intervention.id)}
          >
            <Callout onPress={() => onMarkerPress?.(intervention.id)}>
              <View style={styles.callout}>
                <Text variant="labelLarge" style={styles.calloutTitle}>
                  {intervention.reference}
                </Text>
                <Text variant="bodySmall" style={styles.calloutCustomer}>
                  <Ionicons name="person" size={12} /> {intervention.customerName}
                </Text>
                {intervention.address && (
                  <Text variant="bodySmall" style={styles.calloutAddress}>
                    <Ionicons name="location" size={12} /> {intervention.address}
                  </Text>
                )}
                <Chip
                  mode="flat"
                  style={[
                    styles.calloutChip,
                    { backgroundColor: getMarkerColor(intervention.status) },
                  ]}
                  textStyle={styles.calloutChipText}
                >
                  {getStatusLabel(intervention.status)}
                </Chip>
                {userLocation && (
                  <Text variant="bodySmall" style={styles.calloutDistance}>
                    <Ionicons name="navigate" size={12} />{' '}
                    {calculateDistance(
                      userLocation.coords.latitude,
                      userLocation.coords.longitude,
                      intervention.latitude!,
                      intervention.longitude!
                    )}{' '}
                    km
                  </Text>
                )}
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Bouton centrer sur utilisateur */}
      {userLocation && (
        <View style={styles.controls}>
          <Button
            mode="contained"
            icon="navigation"
            onPress={centerOnUser}
            style={styles.centerButton}
          >
            Me localiser
          </Button>
        </View>
      )}

      {/* Info interventions */}
      <View style={styles.info}>
        <Card style={styles.infoCard}>
          <Card.Content style={styles.infoContent}>
            <Ionicons name="map" size={20} color="#6200ee" />
            <Text variant="bodySmall">
              {interventionsWithGPS.length} intervention{interventionsWithGPS.length > 1 ? 's' : ''} sur la carte
            </Text>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    color: '#757575',
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
  controls: {
    position: 'absolute',
    bottom: 100,
    right: 20,
  },
  centerButton: {
    elevation: 4,
  },
  info: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
  },
  infoCard: {
    elevation: 4,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  // Callout
  callout: {
    width: 200,
    padding: 8,
  },
  calloutTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  calloutCustomer: {
    marginBottom: 2,
    color: '#757575',
  },
  calloutAddress: {
    marginBottom: 8,
    color: '#757575',
  },
  calloutChip: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  calloutChipText: {
    color: '#fff',
    fontSize: 11,
  },
  calloutDistance: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
});
