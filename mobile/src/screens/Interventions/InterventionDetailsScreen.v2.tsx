/**
 * InterventionDetailsScreen v2 - API-first (sans WatermelonDB)
 *
 * Version simplifiée qui utilise directement les appels API backend
 * pour le workflow START → COMPLETE
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
  Platform,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Chip,
  ActivityIndicator,
  Divider,
} from 'react-native-paper';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { InterventionService, Intervention } from '../../services/intervention.service';
import { showToast } from '../../utils/toast';
import { PhotoPicker } from '../../components/PhotoPicker';
import { PhotoGallery } from '../../components/PhotoGallery';
import { SignaturePad } from '../../components/SignaturePad';
import { TimeSheet } from '../../components/TimeSheet';

type InterventionDetailsRouteProp = RouteProp<RootStackParamList, 'InterventionDetails'>;

const InterventionDetailsScreenV2 = () => {
  const route = useRoute<InterventionDetailsRouteProp>();
  const navigation = useNavigation();
  const { interventionId } = route.params;

  const [intervention, setIntervention] = useState<Intervention | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  /**
   * Charger l'intervention depuis l'API
   */
  const loadIntervention = async () => {
    try {
      setLoading(true);
      const data = await InterventionService.getInterventionById(interventionId);
      setIntervention(data);
    } catch (error: any) {
      console.error('Error loading intervention:', error);
      showToast('Erreur lors du chargement de l\'intervention', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Rafraîchir (pull-to-refresh)
   */
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadIntervention();
    setRefreshing(false);
  };

  useEffect(() => {
    loadIntervention();
  }, [interventionId]);

  /**
   * Démarrer l'intervention (PENDING → IN_PROGRESS)
   */
  const handleStartIntervention = () => {
    Alert.alert(
      'Démarrer l\'intervention',
      'Voulez-vous démarrer cette intervention maintenant ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Démarrer',
          onPress: async () => {
            try {
              setActionLoading(true);
              await InterventionService.startIntervention(interventionId, {
                startedAt: new Date().toISOString(),
                notes: 'Intervention démarrée depuis l\'app mobile',
              });
              showToast('Intervention démarrée !', 'success');
              await loadIntervention(); // Recharger pour avoir le nouveau statut
            } catch (error: any) {
              console.error('Error starting intervention:', error);
              showToast('Erreur lors du démarrage', 'error');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  /**
   * Clôturer l'intervention (IN_PROGRESS → COMPLETED)
   */
  const handleCompleteIntervention = () => {
    Alert.prompt(
      'Clôturer l\'intervention',
      'Veuillez saisir votre rapport d\'intervention :',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Clôturer',
          onPress: async (report) => {
            if (!report || report.trim().length === 0) {
              showToast('Le rapport est obligatoire', 'error');
              return;
            }

            try {
              setActionLoading(true);
              await InterventionService.completeIntervention(interventionId, {
                completedAt: new Date().toISOString(),
                report: report.trim(),
                recommendations: '',
              });
              showToast('Intervention clôturée !', 'success');
              await loadIntervention();
            } catch (error: any) {
              console.error('Error completing intervention:', error);
              showToast('Erreur lors de la clôture', 'error');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ],
      'plain-text'
    );
  };

  /**
   * Ouvrir l'adresse dans Maps
   */
  const handleOpenMaps = () => {
    if (!intervention?.address) {
      showToast('Adresse non disponible', 'error');
      return;
    }

    const address = encodeURIComponent(intervention.address);
    const url = Platform.select({
      ios: `maps:0,0?q=${address}`,
      android: `geo:0,0?q=${address}`,
    });

    if (url) {
      Linking.openURL(url).catch(() => {
        showToast('Impossible d\'ouvrir Maps', 'error');
      });
    }
  };

  /**
   * Obtenir la couleur du statut
   */
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'PENDING':
        return '#ff9800';
      case 'IN_PROGRESS':
        return '#2196f3';
      case 'COMPLETED':
        return '#4caf50';
      case 'CANCELLED':
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  };

  /**
   * Obtenir le libellé du statut
   */
  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'PENDING':
        return 'En attente';
      case 'IN_PROGRESS':
        return 'En cours';
      case 'COMPLETED':
        return 'Terminée';
      case 'CANCELLED':
        return 'Annulée';
      default:
        return 'Inconnu';
    }
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  // Not found
  if (!intervention) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#f44336" />
        <Text style={styles.errorText}>Intervention non trouvée</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Retour
        </Button>
      </View>
    );
  }

  const canStart = intervention.status === 'PENDING';
  const canComplete = intervention.status === 'IN_PROGRESS';
  const canAddMedia = intervention.status === 'IN_PROGRESS' || intervention.status === 'COMPLETED';

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* En-tête */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Text variant="headlineSmall" style={styles.reference}>
              {intervention.reference}
            </Text>
            <Chip
              mode="flat"
              style={[
                styles.statusChip,
                { backgroundColor: getStatusColor(intervention.status) },
              ]}
              textStyle={styles.statusText}
            >
              {getStatusLabel(intervention.status)}
            </Chip>
          </View>
        </Card.Content>
      </Card>

      {/* Client */}
      <Card style={styles.card}>
        <Card.Title
          title="Client"
          left={(props) => <Ionicons name="person" size={24} color="#6200ee" />}
        />
        <Card.Content>
          <Text variant="titleMedium" style={styles.customerName}>
            {intervention.customerName}
          </Text>
          {intervention.address && (
            <View style={styles.addressRow}>
              <Ionicons name="location-outline" size={20} color="#757575" />
              <Text variant="bodyMedium" style={styles.address}>
                {intervention.address}
              </Text>
            </View>
          )}
          {intervention.address && (
            <Button
              mode="outlined"
              icon="map"
              onPress={handleOpenMaps}
              style={styles.mapsButton}
            >
              Ouvrir dans Maps
            </Button>
          )}
        </Card.Content>
      </Card>

      {/* Informations */}
      <Card style={styles.card}>
        <Card.Title
          title="Informations"
          left={(props) => <Ionicons name="information-circle" size={24} color="#6200ee" />}
        />
        <Card.Content>
          <View style={styles.infoRow}>
            <Text variant="labelMedium" style={styles.infoLabel}>
              Technicien:
            </Text>
            <Text variant="bodyMedium">
              {intervention.technicianName || 'Non assigné'}
            </Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.infoRow}>
            <Text variant="labelMedium" style={styles.infoLabel}>
              Planifiée:
            </Text>
            <Text variant="bodyMedium">
              {format(new Date(intervention.scheduledDate), "d MMMM yyyy 'à' HH:mm", {
                locale: fr,
              })}
            </Text>
          </View>
          {intervention.startedAt && (
            <>
              <Divider style={styles.divider} />
              <View style={styles.infoRow}>
                <Text variant="labelMedium" style={styles.infoLabel}>
                  Démarrée:
                </Text>
                <Text variant="bodyMedium">
                  {format(new Date(intervention.startedAt), "d MMMM yyyy 'à' HH:mm", {
                    locale: fr,
                  })}
                </Text>
              </View>
            </>
          )}
          {intervention.completedAt && (
            <>
              <Divider style={styles.divider} />
              <View style={styles.infoRow}>
                <Text variant="labelMedium" style={styles.infoLabel}>
                  Terminée:
                </Text>
                <Text variant="bodyMedium">
                  {format(new Date(intervention.completedAt), "d MMMM yyyy 'à' HH:mm", {
                    locale: fr,
                  })}
                </Text>
              </View>
            </>
          )}
          {intervention.description && (
            <>
              <Divider style={styles.divider} />
              <Text variant="labelMedium" style={styles.infoLabel}>
                Description:
              </Text>
              <Text variant="bodyMedium" style={styles.description}>
                {intervention.description}
              </Text>
            </>
          )}
        </Card.Content>
      </Card>

      {/* TimeSheet (si intervention en cours) */}
      <TimeSheet
        interventionId={interventionId}
        initialTime={intervention.timeSpentSeconds || 0}
        onTimeSaved={(timeSpent) => {
          console.log('Time saved:', timeSpent);
          loadIntervention(); // Recharger pour rafraîchir
        }}
        disabled={intervention.status !== 'IN_PROGRESS'}
      />

      {/* Photos (si intervention en cours ou terminée) */}
      {canAddMedia && (
        <Card style={styles.card}>
          <Card.Title
            title="Photos"
            left={(props) => <Ionicons name="camera" size={24} color="#6200ee" />}
          />
          <Card.Content>
            {/* Galerie des photos existantes */}
            <PhotoGallery
              interventionId={interventionId}
              onPhotoDeleted={loadIntervention}
            />

            <Divider style={styles.photoDivider} />

            {/* Ajouter de nouvelles photos */}
            <PhotoPicker
              interventionId={interventionId}
              onPhotosChanged={(count) => {
                console.log(`${count} photos uploadées`);
                loadIntervention(); // Recharger pour rafraîchir la galerie
              }}
            />
          </Card.Content>
        </Card>
      )}

      {/* Signature client (si intervention en cours ou terminée) */}
      {canAddMedia && (
        <Card style={styles.card}>
          <Card.Title
            title="Signature client"
            left={(props) => <Ionicons name="create" size={24} color="#6200ee" />}
          />
          <Card.Content>
            <SignaturePad
              interventionId={interventionId}
              onSignatureSaved={(signatureId) => {
                console.log('Signature saved:', signatureId);
              }}
            />
          </Card.Content>
        </Card>
      )}

      {/* Actions */}
      <Card style={styles.card}>
        <Card.Content>
          {canStart && (
            <Button
              mode="contained"
              icon="play"
              onPress={handleStartIntervention}
              loading={actionLoading}
              disabled={actionLoading}
              style={styles.actionButton}
            >
              Démarrer l'intervention
            </Button>
          )}
          {canComplete && (
            <Button
              mode="contained"
              icon="check-circle"
              onPress={handleCompleteIntervention}
              loading={actionLoading}
              disabled={actionLoading}
              style={[styles.actionButton, styles.completeButton]}
            >
              Clôturer l'intervention
            </Button>
          )}
          {intervention.status === 'COMPLETED' && (
            <View style={styles.completedBadge}>
              <Ionicons name="checkmark-circle" size={48} color="#4caf50" />
              <Text variant="titleMedium" style={styles.completedText}>
                Intervention terminée
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Espacement bas */}
      <View style={{ height: 32 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 18,
    color: '#f44336',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reference: {
    fontWeight: 'bold',
    flex: 1,
  },
  statusChip: {
    marginLeft: 8,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  customerName: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  address: {
    flex: 1,
    marginLeft: 8,
    color: '#757575',
  },
  mapsButton: {
    marginTop: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontWeight: 'bold',
    marginRight: 16,
  },
  divider: {
    marginVertical: 12,
  },
  description: {
    marginTop: 8,
    lineHeight: 20,
  },
  actionButton: {
    marginBottom: 12,
  },
  completeButton: {
    backgroundColor: '#4caf50',
  },
  completedBadge: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  completedText: {
    color: '#4caf50',
    marginTop: 8,
    fontWeight: 'bold',
  },
  photoDivider: {
    marginVertical: 16,
  },
});

export default InterventionDetailsScreenV2;
