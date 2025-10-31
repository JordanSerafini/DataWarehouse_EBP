/**
 * Écran de détail d'intervention
 * Affiche toutes les informations et permet les actions (Démarrer, Terminer, Annuler)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Chip,
  FAB,
  Portal,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native-paper';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { database } from '../../config/database';
import Intervention from '../../models/Intervention';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { InterventionStatus } from '../../types/intervention.types';
import { apiService } from '../../services/api.service';
import { uploadService } from '../../services/upload.service';
import toast from '../../utils/toast';
import { logger } from '../../utils/logger';
import { useAuthStore, authSelectors } from '../../stores/authStore.v2';
import PhotoCapture, { CapturedPhoto } from '../../components/PhotoCapture';
import SignatureCanvas, { SignatureData } from '../../components/SignatureCanvas';

type InterventionDetailsRouteProp = RouteProp<RootStackParamList, 'InterventionDetails'>;

const InterventionDetailsScreen = () => {
  const route = useRoute<InterventionDetailsRouteProp>();
  const navigation = useNavigation();
  const { interventionId } = route.params;
  const user = useAuthStore(authSelectors.user);

  const [intervention, setIntervention] = useState<Intervention | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [signature, setSignature] = useState<SignatureData | null>(null);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  /**
   * Charger l'intervention depuis WatermelonDB
   */
  const loadIntervention = async () => {
    try {
      setLoading(true);
      const interventionsCollection = database.get<Intervention>('interventions');

      const result = await interventionsCollection
        .query()
        .where('server_id', interventionId)
        .fetch();

      if (result.length > 0) {
        setIntervention(result[0]);
      } else {
        toast.warning('Intervention non trouvée localement');
      }
    } catch (error) {
      logger.error('INTERVENTION_DETAILS', 'Erreur chargement', { error });
      toast.error('Erreur lors du chargement de l\'intervention');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIntervention();
  }, [interventionId]);

  /**
   * Démarrer l'intervention
   */
  const handleStartIntervention = async () => {
    if (!intervention) return;

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

              // Mettre à jour localement
              await database.write(async () => {
                await intervention.update((record) => {
                  record.status = InterventionStatus.IN_PROGRESS;
                  record.statusLabel = 'En cours';
                  record.actualStartDate = new Date();
                });
              });

              logger.info('INTERVENTION', 'Intervention démarrée', { id: interventionId });
              toast.success('Intervention démarrée !');
              await loadIntervention();
            } catch (error) {
              logger.error('INTERVENTION', 'Erreur démarrage', { error });
              toast.error('Erreur lors du démarrage');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  /**
   * Terminer l'intervention
   */
  const handleCompleteIntervention = () => {
    setShowNotesModal(true);
  };

  /**
   * Confirmer la fin de l'intervention
   */
  const confirmComplete = async () => {
    if (!intervention) return;

    try {
      setActionLoading(true);
      setShowNotesModal(false);
      setUploadingMedia(true);

      // Upload photos si présentes
      if (photos.length > 0) {
        logger.info('INTERVENTION', 'Upload photos', { count: photos.length });
        toast.info(`Upload de ${photos.length} photo(s)...`);

        try {
          await uploadService.uploadMultiplePhotos(
            interventionId,
            photos,
            (current, total) => {
              logger.info('UPLOAD', `Photo ${current}/${total} uploadée`);
            }
          );
          toast.success('Photos uploadées !');
        } catch (error) {
          logger.error('UPLOAD', 'Erreur upload photos', { error });
          toast.warning('Certaines photos n\'ont pas pu être uploadées');
        }
      }

      // Upload signature si présente
      if (signature) {
        logger.info('INTERVENTION', 'Upload signature');
        toast.info('Upload de la signature...');

        try {
          await uploadService.uploadInterventionSignature(interventionId, signature);
          toast.success('Signature uploadée !');
        } catch (error) {
          logger.error('UPLOAD', 'Erreur upload signature', { error });
          toast.warning('La signature n\'a pas pu être uploadée');
        }
      }

      setUploadingMedia(false);

      // Mettre à jour localement
      await database.write(async () => {
        await intervention.update((record) => {
          record.status = InterventionStatus.COMPLETED;
          record.statusLabel = 'Terminée';
          record.actualEndDate = new Date();
          if (notes) {
            record.notes = notes;
          }
        });
      });

      logger.info('INTERVENTION', 'Intervention terminée', { id: interventionId });
      toast.success('Intervention terminée !');
      setNotes('');
      setPhotos([]);
      setSignature(null);
      await loadIntervention();
    } catch (error) {
      logger.error('INTERVENTION', 'Erreur fin', { error });
      toast.error('Erreur lors de la fin de l\'intervention');
    } finally {
      setActionLoading(false);
      setUploadingMedia(false);
    }
  };

  /**
   * Annuler l'intervention
   */
  const handleCancelIntervention = () => {
    if (!intervention) return;

    Alert.alert(
      'Annuler l\'intervention',
      'Pourquoi souhaitez-vous annuler cette intervention ?',
      [
        { text: 'Retour', style: 'cancel' },
        {
          text: 'Client absent',
          onPress: () => cancelWithReason('Client absent'),
        },
        {
          text: 'Problème technique',
          onPress: () => cancelWithReason('Problème technique'),
        },
        {
          text: 'Autre raison',
          onPress: () => cancelWithReason('Autre raison'),
        },
      ]
    );
  };

  /**
   * Annuler avec une raison
   */
  const cancelWithReason = async (reason: string) => {
    if (!intervention) return;

    try {
      setActionLoading(true);

      // Mettre à jour localement
      await database.write(async () => {
        await intervention.update((record) => {
          record.status = InterventionStatus.CANCELLED;
          record.statusLabel = 'Annulée';
          record.notes = `Annulée: ${reason}`;
        });
      });

      logger.info('INTERVENTION', 'Intervention annulée', { id: interventionId, reason });
      toast.warning('Intervention annulée');
      await loadIntervention();
    } catch (error) {
      logger.error('INTERVENTION', 'Erreur annulation', { error });
      toast.error('Erreur lors de l\'annulation');
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Appeler le client
   */
  const handleCallCustomer = () => {
    const phoneNumber = '0612345678'; // TODO: Récupérer depuis le client
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url);
  };

  /**
   * Ouvrir Maps
   */
  const handleOpenMaps = () => {
    if (!intervention?.latitude || !intervention?.longitude) {
      toast.warning('Pas de coordonnées GPS disponibles');
      return;
    }

    const scheme = Platform.select({
      ios: 'maps://0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${intervention.latitude},${intervention.longitude}`;
    const label = intervention.title;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    if (url) {
      Linking.openURL(url);
    }
  };

  /**
   * Obtenir la couleur du statut
   */
  const getStatusColor = (status: InterventionStatus): string => {
    switch (status) {
      case InterventionStatus.SCHEDULED:
        return '#2196F3';
      case InterventionStatus.IN_PROGRESS:
        return '#FF9800';
      case InterventionStatus.COMPLETED:
        return '#4CAF50';
      case InterventionStatus.CANCELLED:
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (!intervention) {
    return (
      <View style={styles.errorContainer}>
        <Text variant="headlineSmall">Intervention introuvable</Text>
        <Button mode="contained" onPress={() => navigation.goBack()} style={styles.backButton}>
          Retour
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* En-tête avec statut */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <View style={styles.headerTop}>
              <Text variant="headlineSmall" style={styles.title}>
                {intervention.title}
              </Text>
              <Chip
                style={[
                  styles.statusChip,
                  { backgroundColor: getStatusColor(intervention.status) },
                ]}
                textStyle={styles.statusChipText}
              >
                {intervention.statusLabel}
              </Chip>
            </View>

            <Text variant="bodyLarge" style={styles.reference}>
              Réf: {intervention.reference}
            </Text>

            <Chip
              icon="tag"
              style={styles.typeChip}
              textStyle={styles.typeChipText}
            >
              {intervention.typeLabel}
            </Chip>
          </Card.Content>
        </Card>

        {/* Dates */}
        <Card style={styles.card}>
          <Card.Title title="📅 Planning" />
          <Card.Content>
            <View style={styles.infoRow}>
              <Text variant="labelLarge">Date prévue:</Text>
              <Text variant="bodyMedium">
                {format(intervention.scheduledDate, "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr })}
              </Text>
            </View>

            {intervention.actualStartDate && (
              <View style={styles.infoRow}>
                <Text variant="labelLarge">Démarrée:</Text>
                <Text variant="bodyMedium">
                  {format(intervention.actualStartDate, "d MMM yyyy 'à' HH:mm", { locale: fr })}
                </Text>
              </View>
            )}

            {intervention.actualEndDate && (
              <View style={styles.infoRow}>
                <Text variant="labelLarge">Terminée:</Text>
                <Text variant="bodyMedium">
                  {format(intervention.actualEndDate, "d MMM yyyy 'à' HH:mm", { locale: fr })}
                </Text>
              </View>
            )}

            {intervention.estimatedDuration && (
              <View style={styles.infoRow}>
                <Text variant="labelLarge">Durée estimée:</Text>
                <Text variant="bodyMedium">{intervention.estimatedDuration} minutes</Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Client */}
        {intervention.customerName && (
          <Card style={styles.card}>
            <Card.Title title="👤 Client" />
            <Card.Content>
              <Text variant="titleMedium" style={styles.clientName}>
                {intervention.customerName}
              </Text>

              {intervention.address && (
                <View style={styles.addressContainer}>
                  <Text variant="bodyMedium">📍 {intervention.address}</Text>
                  {intervention.postalCode && intervention.city && (
                    <Text variant="bodyMedium">
                      {intervention.postalCode} {intervention.city}
                    </Text>
                  )}
                </View>
              )}

              <View style={styles.actionButtons}>
                <Button
                  mode="outlined"
                  icon="phone"
                  onPress={handleCallCustomer}
                  style={styles.actionButton}
                >
                  Appeler
                </Button>
                {intervention.latitude && intervention.longitude && (
                  <Button
                    mode="outlined"
                    icon="map-marker"
                    onPress={handleOpenMaps}
                    style={styles.actionButton}
                  >
                    Itinéraire
                  </Button>
                )}
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Projet */}
        {intervention.projectName && (
          <Card style={styles.card}>
            <Card.Title title="🏗️ Projet" />
            <Card.Content>
              <Text variant="titleMedium">{intervention.projectName}</Text>
            </Card.Content>
          </Card>
        )}

        {/* Description */}
        {intervention.description && (
          <Card style={styles.card}>
            <Card.Title title="📝 Description" />
            <Card.Content>
              <Text variant="bodyMedium">{intervention.description}</Text>
            </Card.Content>
          </Card>
        )}

        {/* Notes */}
        {intervention.notes && (
          <Card style={styles.card}>
            <Card.Title title="💬 Notes" />
            <Card.Content>
              <Text variant="bodyMedium" style={styles.notes}>
                {intervention.notes}
              </Text>
            </Card.Content>
          </Card>
        )}

        {/* Photos - Disponible quand IN_PROGRESS ou COMPLETED */}
        {(intervention.status === InterventionStatus.IN_PROGRESS ||
          intervention.status === InterventionStatus.COMPLETED) && (
          <Card style={styles.card}>
            <Card.Content>
              <PhotoCapture
                maxPhotos={10}
                onPhotosChange={setPhotos}
                existingPhotos={photos}
                disabled={intervention.status === InterventionStatus.COMPLETED || uploadingMedia}
              />
            </Card.Content>
          </Card>
        )}

        {/* Signature - Disponible quand IN_PROGRESS ou COMPLETED */}
        {(intervention.status === InterventionStatus.IN_PROGRESS ||
          intervention.status === InterventionStatus.COMPLETED) && (
          <Card style={styles.card}>
            <Card.Content>
              <SignatureCanvas
                label="Signature du client"
                required={false}
                onSignatureSaved={setSignature}
                existingSignature={signature}
                disabled={intervention.status === InterventionStatus.COMPLETED || uploadingMedia}
              />
            </Card.Content>
          </Card>
        )}

        {/* Indicateur d'upload */}
        {uploadingMedia && (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.uploadingContainer}>
                <ActivityIndicator size="large" color="#6200ee" />
                <Text variant="bodyLarge" style={styles.uploadingText}>
                  Upload en cours...
                </Text>
              </View>
            </Card.Content>
          </Card>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* FAB Actions selon le statut */}
      {intervention.status === InterventionStatus.SCHEDULED && (
        <FAB
          icon="play"
          label="Démarrer"
          onPress={handleStartIntervention}
          loading={actionLoading}
          style={styles.fab}
        />
      )}

      {intervention.status === InterventionStatus.IN_PROGRESS && (
        <>
          <FAB
            icon="check"
            label="Terminer"
            onPress={handleCompleteIntervention}
            loading={actionLoading}
            style={styles.fab}
          />
          <FAB
            icon="close"
            onPress={handleCancelIntervention}
            style={styles.fabSecondary}
            small
          />
        </>
      )}

      {/* Modal Notes de fin */}
      <Portal>
        <Modal
          visible={showNotesModal}
          onDismiss={() => setShowNotesModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text variant="headlineSmall" style={styles.modalTitle}>
            Terminer l'intervention
          </Text>
          <TextInput
            label="Notes (optionnel)"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            mode="outlined"
            style={styles.modalInput}
          />
          <View style={styles.modalButtons}>
            <Button mode="outlined" onPress={() => setShowNotesModal(false)}>
              Annuler
            </Button>
            <Button mode="contained" onPress={confirmComplete} loading={actionLoading}>
              Terminer
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#757575',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    marginTop: 16,
  },
  headerCard: {
    margin: 16,
    marginBottom: 8,
    elevation: 4,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontWeight: 'bold',
    marginRight: 8,
  },
  reference: {
    color: '#757575',
    marginBottom: 12,
  },
  statusChip: {
    height: 32,
  },
  statusChipText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  typeChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#f3e5f5',
  },
  typeChipText: {
    fontSize: 12,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  clientName: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  addressContainer: {
    marginVertical: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
  },
  notes: {
    fontStyle: 'italic',
  },
  bottomSpacer: {
    height: 100,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#6200ee',
  },
  fabSecondary: {
    position: 'absolute',
    right: 16,
    bottom: 88,
    backgroundColor: '#F44336',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  modalInput: {
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  uploadingContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  uploadingText: {
    marginTop: 12,
    color: '#757575',
  },
});

export default InterventionDetailsScreen;
