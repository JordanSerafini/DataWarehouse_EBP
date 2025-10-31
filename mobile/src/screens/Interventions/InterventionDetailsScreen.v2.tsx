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
  TextInput,
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
import { InterventionService, Intervention, InterventionStatus } from '../../services/intervention.service';
import { ActivityService, Activity, ActivityCategory } from '../../services/activity.service';
import { showToast } from '../../utils/toast';
import { PhotoPicker } from '../../components/PhotoPicker';
import { PhotoGallery } from '../../components/PhotoGallery';
import { SignaturePad } from '../../components/SignaturePad';
import { TimeSheet } from '../../components/TimeSheet';
import { hapticService } from '../../services/haptic.service';
import { SkeletonInterventionDetails } from '../../components/ui/SkeletonLoaders';
import { AnimatedButton, AnimatedFadeIn, AnimatedCheckmark } from '../../components/ui/AnimatedComponents';

type InterventionDetailsRouteProp = RouteProp<RootStackParamList, 'InterventionDetails'>;

const InterventionDetailsScreenV2 = () => {
  const route = useRoute<InterventionDetailsRouteProp>();
  const navigation = useNavigation();
  const { interventionId } = route.params;

  const [intervention, setIntervention] = useState<Intervention | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showSuccessCheckmark, setShowSuccessCheckmark] = useState(false);

  // États pour la section Notes
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const [notes, setNotes] = useState<Activity[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);

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
    // Haptic feedback moyen pour refresh
    await hapticService.medium();
    // Réinitialiser les notes pour forcer un rechargement
    setNotes([]);
    await loadIntervention();
    // Si la section notes est dépliée, recharger les notes
    if (isNotesExpanded) {
      await loadNotes();
    }
    setRefreshing(false);
    // Haptic feedback léger à la fin du refresh
    await hapticService.light();
  };

  useEffect(() => {
    loadIntervention();
  }, [interventionId]);

  /**
   * Démarrer l'intervention (PENDING → IN_PROGRESS)
   */
  const handleStartIntervention = () => {
    // Haptic feedback léger sur ouverture du modal
    hapticService.light();

    Alert.alert(
      'Démarrer l\'intervention',
      'Voulez-vous démarrer cette intervention maintenant ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
          onPress: () => hapticService.light()
        },
        {
          text: 'Démarrer',
          onPress: async () => {
            try {
              // Haptic feedback moyen au début de l'action
              await hapticService.medium();

              setActionLoading(true);
              await InterventionService.startIntervention(interventionId, {
                startedAt: new Date().toISOString(),
                notes: 'Intervention démarrée depuis l\'app mobile',
              });

              // Haptic feedback succès après succès
              await hapticService.success();
              showToast('Intervention démarrée !', 'success');
              await loadIntervention(); // Recharger pour avoir le nouveau statut
            } catch (error: any) {
              console.error('Error starting intervention:', error);
              // Haptic feedback erreur en cas d'échec
              await hapticService.error();
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
    // Haptic feedback moyen sur ouverture du modal (action importante)
    hapticService.medium();

    Alert.prompt(
      'Clôturer l\'intervention',
      'Veuillez saisir votre rapport d\'intervention :',
      [
        {
          text: 'Annuler',
          style: 'cancel',
          onPress: () => hapticService.light()
        },
        {
          text: 'Clôturer',
          onPress: async (report) => {
            if (!report || report.trim().length === 0) {
              await hapticService.warning();
              showToast('Le rapport est obligatoire', 'error');
              return;
            }

            try {
              // Haptic feedback lourd pour action critique
              await hapticService.heavy();

              setActionLoading(true);
              await InterventionService.completeIntervention(interventionId, {
                completedAt: new Date().toISOString(),
                report: report.trim(),
                recommendations: '',
              });

              // Haptic feedback succès renforcé (triple tap) pour grande réussite
              await hapticService.successEnhanced();

              // Afficher l'animation de succès
              setShowSuccessCheckmark(true);

              showToast('Intervention clôturée !', 'success');
              await loadIntervention();
            } catch (error: any) {
              console.error('Error completing intervention:', error);
              // Haptic feedback erreur
              await hapticService.error();
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
  const handleOpenMaps = async () => {
    if (!intervention?.address) {
      await hapticService.error();
      showToast('Adresse non disponible', 'error');
      return;
    }

    // Haptic feedback léger pour navigation
    await hapticService.light();

    const address = encodeURIComponent(intervention.address);
    const url = Platform.select({
      ios: `maps:0,0?q=${address}`,
      android: `geo:0,0?q=${address}`,
    });

    if (url) {
      Linking.openURL(url).catch(async () => {
        await hapticService.error();
        showToast('Impossible d\'ouvrir Maps', 'error');
      });
    }
  };

  /**
   * Charger les notes de l'intervention
   */
  const loadNotes = async () => {
    if (notes.length > 0) {
      // Déjà chargées
      return;
    }

    try {
      setLoadingNotes(true);

      // Si on a un customerId, on peut filtrer par client
      if (intervention?.customerId) {
        const activities = await ActivityService.getActivityHistory({
          entityId: intervention.customerId,
          entityType: 'customer',
          limit: 100, // Augmenter la limite pour être sûr d'avoir toutes les notes du client
        });

        // Filtrer uniquement les notes liées à cette intervention
        const interventionNotes = activities.filter(
          (activity) => activity.scheduleEventId === interventionId
        );

        setNotes(interventionNotes);
      } else {
        // Pas de customer ID, on ne peut pas charger les notes
        setNotes([]);
      }
    } catch (error: any) {
      console.error('Error loading notes:', error);
      showToast('Erreur lors du chargement des notes', 'error');
    } finally {
      setLoadingNotes(false);
    }
  };

  /**
   * Toggle section notes
   */
  const handleToggleNotes = async () => {
    await hapticService.light();

    if (!isNotesExpanded) {
      // On déplie: charger les notes
      await loadNotes();
    }

    setIsNotesExpanded(!isNotesExpanded);
  };

  /**
   * Ajouter une nouvelle note
   */
  const handleAddNote = async () => {
    if (!newNoteText.trim()) {
      await hapticService.warning();
      showToast('Veuillez saisir une note', 'error');
      return;
    }

    try {
      setSavingNote(true);
      await hapticService.medium();

      await ActivityService.createInterventionNote(
        interventionId,
        newNoteText.trim(),
        intervention?.customerId
      );

      await hapticService.success();
      showToast('Note ajoutée !', 'success');

      // Réinitialiser le champ texte
      setNewNoteText('');

      // Recharger les notes
      setNotes([]); // Forcer le rechargement
      await loadNotes();
    } catch (error: any) {
      console.error('Error adding note:', error);
      await hapticService.error();
      showToast('Erreur lors de l\'ajout de la note', 'error');
    } finally {
      setSavingNote(false);
    }
  };

  /**
   * Obtenir la couleur du statut
   */
  const getStatusColor = (status?: InterventionStatus) => {
    switch (status) {
      case InterventionStatus.PENDING:
        return '#ff9800';
      case InterventionStatus.IN_PROGRESS:
        return '#2196f3';
      case InterventionStatus.COMPLETED:
        return '#4caf50';
      case InterventionStatus.CANCELLED:
        return '#f44336';
      case InterventionStatus.SCHEDULED:
        return '#9c27b0';
      default:
        return '#9e9e9e';
    }
  };

  /**
   * Obtenir le libellé du statut
   */
  const getStatusLabel = (status?: InterventionStatus) => {
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

  // Loading state with Skeleton
  if (loading) {
    return <SkeletonInterventionDetails />;
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

  const canStart = intervention.status === InterventionStatus.PENDING;
  const canComplete = intervention.status === InterventionStatus.IN_PROGRESS;
  const canAddMedia = intervention.status === InterventionStatus.IN_PROGRESS || intervention.status === InterventionStatus.COMPLETED;

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
        disabled={intervention.status !== InterventionStatus.IN_PROGRESS}
      />

      {/* Notes d'intervention */}
      <Card style={styles.card}>
        <Card.Title
          title="Notes"
          left={(props) => <Ionicons name="document-text" size={24} color="#6200ee" />}
          right={(props) => (
            <Button
              mode="text"
              onPress={handleToggleNotes}
              icon={isNotesExpanded ? "chevron-up" : "chevron-down"}
            >
              {isNotesExpanded ? 'Masquer' : `Voir (${notes.length})`}
            </Button>
          )}
        />
        <Card.Content>
          {/* Formulaire d'ajout de note */}
          <View style={styles.noteInputContainer}>
            <TextInput
              style={styles.noteInput}
              placeholder="Ajouter une note..."
              placeholderTextColor="#9e9e9e"
              value={newNoteText}
              onChangeText={setNewNoteText}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            <Button
              mode="contained"
              onPress={handleAddNote}
              loading={savingNote}
              disabled={savingNote || !newNoteText.trim()}
              style={styles.addNoteButton}
              icon="send"
              compact
            >
              Ajouter
            </Button>
          </View>

          {/* Liste des notes (dépliable) */}
          {isNotesExpanded && (
            <>
              <Divider style={styles.notesDivider} />

              {loadingNotes ? (
                <View style={styles.notesLoading}>
                  <ActivityIndicator size="large" color="#6200ee" />
                  <Text variant="bodyMedium" style={styles.loadingText}>
                    Chargement des notes...
                  </Text>
                </View>
              ) : notes.length === 0 ? (
                <View style={styles.emptyNotes}>
                  <Ionicons name="document-text-outline" size={48} color="#bdbdbd" />
                  <Text variant="bodyMedium" style={styles.emptyNotesText}>
                    Aucune note pour cette intervention
                  </Text>
                </View>
              ) : (
                notes.map((note, index) => (
                  <View key={note.id} style={styles.noteItem}>
                    <View style={styles.noteHeader}>
                      <View style={styles.noteInfo}>
                        <Ionicons name="person-circle" size={20} color="#6200ee" />
                        <Text variant="labelMedium" style={styles.noteAuthor}>
                          {note.creatorColleagueId || 'Mobile'}
                        </Text>
                      </View>
                      <Text variant="bodySmall" style={styles.noteDate}>
                        {format(new Date(note.createdAt), 'dd MMM yyyy HH:mm', {
                          locale: fr,
                        })}
                      </Text>
                    </View>
                    <Text variant="bodyMedium" style={styles.noteContent}>
                      {note.notesClear}
                    </Text>
                    <View style={styles.noteMeta}>
                      <Chip
                        icon="label"
                        mode="outlined"
                        compact
                        style={styles.noteCategory}
                      >
                        {note.categoryLabel}
                      </Chip>
                    </View>
                    {index !== notes.length - 1 && (
                      <Divider style={styles.noteDivider} />
                    )}
                  </View>
                ))
              )}
            </>
          )}
        </Card.Content>
      </Card>

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
      <AnimatedFadeIn delay={300}>
        <Card style={styles.card}>
          <Card.Content>
            {canStart && (
              <AnimatedButton
                mode="contained"
                icon="play"
                onPress={handleStartIntervention}
                loading={actionLoading}
                disabled={actionLoading}
                style={styles.actionButton}
              >
                Démarrer l'intervention
              </AnimatedButton>
            )}
            {canComplete && (
              <AnimatedButton
                mode="contained"
                icon="check-circle"
                onPress={handleCompleteIntervention}
                loading={actionLoading}
                disabled={actionLoading}
                style={[styles.actionButton, styles.completeButton]}
              >
                Clôturer l'intervention
              </AnimatedButton>
            )}
            {intervention.status === InterventionStatus.COMPLETED && (
              <AnimatedFadeIn delay={0}>
                <View style={styles.completedBadge}>
                  <Ionicons name="checkmark-circle" size={48} color="#4caf50" />
                  <Text variant="titleMedium" style={styles.completedText}>
                    Intervention terminée
                  </Text>
                </View>
              </AnimatedFadeIn>
            )}
          </Card.Content>
        </Card>
      </AnimatedFadeIn>

      {/* Success Checkmark Animation */}
      {showSuccessCheckmark && (
        <View style={styles.checkmarkOverlay}>
          <AnimatedCheckmark
            visible={showSuccessCheckmark}
            size={80}
            onAnimationEnd={() => setShowSuccessCheckmark(false)}
          />
        </View>
      )}

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
  checkmarkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 9999,
  },
  // ========================================
  // NOTES SECTION
  // ========================================
  noteInputContainer: {
    marginBottom: 16,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fafafa',
    minHeight: 80,
    marginBottom: 12,
  },
  addNoteButton: {
    alignSelf: 'flex-end',
  },
  notesDivider: {
    marginVertical: 16,
  },
  notesLoading: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyNotes: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyNotesText: {
    color: '#9e9e9e',
    marginTop: 12,
  },
  noteItem: {
    paddingVertical: 12,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  noteAuthor: {
    fontWeight: 'bold',
    color: '#6200ee',
  },
  noteDate: {
    color: '#757575',
  },
  noteContent: {
    marginBottom: 8,
    lineHeight: 20,
  },
  noteMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noteCategory: {
    backgroundColor: '#f3e5f5',
    borderColor: '#9c27b0',
  },
  noteDivider: {
    marginTop: 12,
  },
});

export default InterventionDetailsScreenV2;
