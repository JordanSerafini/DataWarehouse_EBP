/**
 * InterventionDetailsScreen v3 - Inspiré de TicketDetailsScreen
 *
 * Page de détails complète pour ScheduleEvent avec design moderne
 * - Sections organisées par Cards Material Design 3
 * - Affichage conditionnel selon permissions RBAC
 * - Actions contextuelles (Démarrer, Compléter, Photos, Signature)
 * - Formatage dates français
 * - Icônes émojis pour meilleure lisibilité
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Chip,
  ActivityIndicator,
  Button,
  Divider,
  IconButton,
} from 'react-native-paper';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { InterventionService, Intervention, InterventionStatus } from '../../services/intervention.service';
import { showToast } from '../../utils/toast';
import { useAuthStore, authSelectors } from '../../stores/authStore.v2';
import { UserRole } from '../../types/user.types';
import { PhotoPicker } from '../../components/PhotoPicker';
import { PhotoGallery } from '../../components/PhotoGallery';
import { SignaturePad } from '../../components/SignaturePad';
import { TimeSheet } from '../../components/TimeSheet';
import { hapticService } from '../../services/haptic.service';

type InterventionDetailsRouteProp = RouteProp<RootStackParamList, 'InterventionDetails'>;

const InterventionDetailsScreenV3 = () => {
  const route = useRoute<InterventionDetailsRouteProp>();
  const navigation = useNavigation();
  const { interventionId } = route.params;
  const user = useAuthStore(authSelectors.user);

  const [intervention, setIntervention] = useState<Intervention | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [trackedSeconds, setTrackedSeconds] = useState<number>(0);
  const [existingSignatureId, setExistingSignatureId] = useState<string | undefined>(undefined);

  // Permissions
  const canEdit = user?.role === UserRole.SUPER_ADMIN ||
                  user?.role === UserRole.ADMIN ||
                  user?.role === UserRole.PATRON;

  const canViewFinancial = user?.role === UserRole.SUPER_ADMIN ||
                           user?.role === UserRole.ADMIN ||
                           user?.role === UserRole.PATRON;

  const canViewProject = user?.role === UserRole.SUPER_ADMIN ||
                         user?.role === UserRole.ADMIN ||
                         user?.role === UserRole.PATRON ||
                         user?.role === UserRole.CHEF_CHANTIER ||
                         user?.role === UserRole.COMMERCIAL;

  // Média (photos/signature) autorisés si intervention en cours ou terminée
  // Autoriser médias (photos/signature) quel que soit le statut
  const canAddMedia = true;

  /**
   * Charger l'intervention
   */
  const loadIntervention = async () => {
    try {
      setLoading(true);
      const data = await InterventionService.getInterventionById(interventionId);
      setIntervention(data);
      setTrackedSeconds(data.timeSpentSeconds || 0);

      // Charger l'état des fichiers pour savoir si une signature existe
      try {
        const files = await InterventionService.getInterventionFiles(interventionId);
        setExistingSignatureId(files.signature?.id);
      } catch (e) {
        // silencieux si endpoint indisponible
        setExistingSignatureId(undefined);
      }
    } catch (error: any) {
      console.error('[InterventionDetails] Erreur chargement:', error);
      showToast('Erreur lors du chargement', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Rafraîchir (pull-to-refresh)
   */
  const handleRefresh = async () => {
    setRefreshing(true);
    await hapticService.medium();
    await loadIntervention();
    setRefreshing(false);
    await hapticService.light();
  };

  useEffect(() => {
    loadIntervention();
  }, [interventionId]);

  /**
   * Démarrer l'intervention
   */
  const handleStart = async () => {
    await hapticService.medium();
    Alert.alert(
      'Démarrer l\'intervention',
      'Voulez-vous démarrer cette intervention maintenant ?',
      [
        { text: 'Annuler', style: 'cancel', onPress: () => hapticService.light() },
        {
          text: 'Démarrer',
          onPress: async () => {
            try {
              setActionLoading(true);
              await InterventionService.startIntervention(interventionId, {
                notes: "Démarrée depuis l'app mobile",
              });
              await hapticService.success();
              showToast('Intervention démarrée !', 'success');
              await loadIntervention();
            } catch (error) {
              console.error('Erreur démarrage:', error);
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
   * Terminer l'intervention
   */
  const handleComplete = async () => {
    await hapticService.medium();
    Alert.prompt(
      'Clôturer l\'intervention',
      'Résumé de l\'intervention (optionnel):',
      [
        { text: 'Annuler', style: 'cancel', onPress: () => hapticService.light() },
        {
          text: 'Terminer',
          onPress: async (report) => {
            try {
              setActionLoading(true);
              const hours = Math.max(trackedSeconds, 0) / 3600; // convertir secondes → heures
              await InterventionService.completeIntervention(interventionId, {
                report: (report && report.trim()) || 'Intervention terminée',
                timeSpentHours: hours > 0 ? hours : 0.01,
              });
              await hapticService.successEnhanced();
              showToast('Intervention terminée !', 'success');
              await loadIntervention();
            } catch (error) {
              console.error('Erreur clôture:', error);
              await hapticService.error();
              showToast('Erreur lors de la clôture', 'error');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ],
      'plain-text',
      '',
      'default'
    );
  };

  /**
   * Ouvrir Google Maps
   */
  const openMaps = () => {
    if (intervention?.latitude && intervention?.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${intervention.latitude},${intervention.longitude}`;
      Linking.openURL(url);
    }
  };

  /**
   * Appeler le client
   */
  const callClient = () => {
    if (intervention?.contactPhone) {
      Linking.openURL(`tel:${intervention.contactPhone}`);
    }
  };

  /**
   * Helpers
   */
  const getStatusColor = (status: InterventionStatus): string => {
    switch (status) {
      case InterventionStatus.IN_PROGRESS: return '#ff9800'; // Orange
      case InterventionStatus.COMPLETED: return '#4caf50'; // Vert
      case InterventionStatus.CANCELLED: return '#f44336'; // Rouge
      case InterventionStatus.PENDING: return '#9c27b0'; // Violet
      case InterventionStatus.SCHEDULED: return '#2196f3'; // Bleu
      default: return '#9e9e9e'; // Gris
    }
  };

  const getStatusLabel = (status: InterventionStatus): string => {
    switch (status) {
      case InterventionStatus.SCHEDULED: return 'Planifiée';
      case InterventionStatus.IN_PROGRESS: return 'En cours';
      case InterventionStatus.COMPLETED: return 'Terminée';
      case InterventionStatus.CANCELLED: return 'Annulée';
      case InterventionStatus.PENDING: return 'En attente';
      default: return 'Inconnu';
    }
  };

  const formatDuration = (hours?: number | null): string => {
    if (!hours) return '0h';
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return 'Non définie';
    try {
      return format(new Date(date), 'EEEE d MMMM yyyy à HH:mm', { locale: fr });
    } catch {
      return 'Date invalide';
    }
  };

  const formatDateShort = (date: Date | string | null | undefined): string => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: fr });
    } catch {
      return 'N/A';
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

  // Error state
  if (!intervention) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#f44336" />
        <Text style={styles.errorText}>Intervention introuvable</Text>
        <Button mode="contained" onPress={() => navigation.goBack()} style={styles.errorButton}>
          Retour
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header avec retour */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Détail intervention</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* ========== SECTION 1: Titre et Statut ========== */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.titleRow}>
              <Text variant="headlineSmall" style={styles.title}>
                {intervention.title}
              </Text>
            </View>

            <View style={styles.chipsRow}>
              <Chip
                icon="tag"
                style={[styles.chip, { backgroundColor: getStatusColor(intervention.status) + '20' }]}
                textStyle={{ color: getStatusColor(intervention.status), fontWeight: 'bold' }}
              >
                {getStatusLabel(intervention.status)}
              </Chip>

              {intervention.isUrgent && (
                <Chip
                  icon="alert"
                  style={[styles.chip, { backgroundColor: '#f4433620' }]}
                  textStyle={{ color: '#f44336', fontWeight: 'bold' }}
                >
                  Urgent
                </Chip>
              )}
            </View>

            <View style={styles.referenceRow}>
              <Ionicons name="document-text" size={16} color="#757575" />
              <Text style={styles.referenceText}>Réf: {intervention.reference}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* ========== SECTION 2: Description ========== */}
        {intervention.description && (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                📝 Description
              </Text>
              <Text style={styles.description}>{intervention.description}</Text>
            </Card.Content>
          </Card>
        )}

        {/* ========== SECTION 3: Rapport (si terminée) ========== */}
        {intervention.report && (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                📋 Rapport d'intervention
              </Text>
              <Text style={styles.description}>{intervention.report}</Text>
            </Card.Content>
          </Card>
        )}

        {/* ========== SECTION 4: Informations principales ========== */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              ℹ️ Informations
            </Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📅 Date planifiée</Text>
              <Text style={styles.infoValue}>{formatDate(intervention.scheduledDate)}</Text>
            </View>

            {intervention.scheduledEndDate && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>🏁 Date fin prévue</Text>
                <Text style={styles.infoValue}>{formatDate(intervention.scheduledEndDate)}</Text>
              </View>
            )}

            {intervention.type && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>🏷️ Type</Text>
                <Text style={styles.infoValue}>{intervention.type}</Text>
              </View>
            )}

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>🕐 Créée le</Text>
              <Text style={styles.infoValue}>{formatDateShort(intervention.createdAt)}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>🔄 Modifiée le</Text>
              <Text style={styles.infoValue}>{formatDateShort(intervention.updatedAt)}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* ========== SECTION 5: Temps ========== */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              ⏱️ Temps
            </Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Temps passé</Text>
              <Text style={[styles.infoValue, styles.timeValue]}>
                {formatDuration(
                  intervention.timeSpentSeconds ? intervention.timeSpentSeconds / 3600 : undefined,
                )}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Temps estimé</Text>
              <Text style={styles.infoValue}>
                {formatDuration(intervention.estimatedDurationHours)}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* ========== SECTION 6: Client ========== */}
        {intervention.customerName && (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                🏢 Client
              </Text>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Nom</Text>
                <Text style={[styles.infoValue, styles.customerName]}>
                  {intervention.customerName}
                </Text>
              </View>

              {intervention.city && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>📍 Ville</Text>
                  <Text style={styles.infoValue}>{intervention.city}</Text>
                </View>
              )}

              {intervention.contactPhone && (
                <TouchableOpacity onPress={callClient} style={styles.infoRow}>
                  <Text style={styles.infoLabel}>📞 Téléphone</Text>
                  <Text style={[styles.infoValue, styles.linkText]}>
                    {intervention.contactPhone}
                  </Text>
                </TouchableOpacity>
              )}
            </Card.Content>
          </Card>
        )}

        {/* ========== SECTION 7: Technicien ========== */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              👤 Technicien
            </Text>

            {intervention.technicianName ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Assigné à</Text>
                <Text style={[styles.infoValue, styles.technicianName]}>
                  {intervention.technicianName}
                </Text>
              </View>
            ) : (
              <View style={styles.warningBox}>
                <Ionicons name="warning" size={20} color="#ff9800" />
                <Text style={styles.warningText}>Non assigné</Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* ========== SECTION 8: Localisation ========== */}
        {intervention.address && (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  📍 Localisation
                </Text>
                {intervention.latitude && intervention.longitude && (
                  <Button
                    mode="outlined"
                    compact
                    onPress={openMaps}
                    icon="map"
                  >
                    Itinéraire
                  </Button>
                )}
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Adresse</Text>
                <Text style={styles.infoValue}>{intervention.address}</Text>
              </View>

              {intervention.city && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Ville</Text>
                  <Text style={styles.infoValue}>
                    {intervention.postalCode && `${intervention.postalCode} - `}
                    {intervention.city}
                  </Text>
                </View>
              )}

              {intervention.latitude && intervention.longitude && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>GPS</Text>
                  <Text style={styles.infoValue}>
                    {intervention.latitude}, {intervention.longitude}
                  </Text>
                </View>
              )}
            </Card.Content>
          </Card>
        )}

        {/* ========== SECTION 9: Maintenance (si applicable) ========== */}
        {(intervention.maintenanceReference || intervention.maintenanceContractId) && (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                🔧 Maintenance
              </Text>

              {intervention.maintenanceReference && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Référence</Text>
                  <Text style={styles.infoValue}>{intervention.maintenanceReference}</Text>
                </View>
              )}

              {intervention.maintenanceContractId && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Contrat</Text>
                  <Text style={styles.infoValue}>{intervention.maintenanceContractId}</Text>
                </View>
              )}

              {intervention.maintenanceNextEventDate && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Prochaine intervention</Text>
                  <Text style={styles.infoValue}>
                    {formatDateShort(intervention.maintenanceNextEventDate)}
                  </Text>
                </View>
              )}
            </Card.Content>
          </Card>
        )}

        {/* ========== SECTION 10: Projet/Chantier (si permissions) ========== */}
        {canViewProject && (intervention.constructionSiteName || intervention.dealName) && (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                🏗️ Projet
              </Text>

              {intervention.constructionSiteName && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Chantier</Text>
                  <Text style={styles.infoValue}>{intervention.constructionSiteName}</Text>
                </View>
              )}

              {intervention.dealName && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Affaire</Text>
                  <Text style={styles.infoValue}>{intervention.dealName}</Text>
                </View>
              )}

              {intervention.globalPercentComplete !== null && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Progression</Text>
                  <Text style={styles.infoValue}>{intervention.globalPercentComplete}%</Text>
                </View>
              )}
            </Card.Content>
          </Card>
        )}

        {/* ========== SECTION 11: Coûts (si permissions) ========== */}
        {canViewFinancial && (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                💰 Coûts
              </Text>

              {intervention.salePriceVatExcluded !== null && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Prix vente HT</Text>
                  <Text style={[styles.infoValue, styles.priceValue]}>
                    {intervention.salePriceVatExcluded?.toFixed(2)} €
                  </Text>
                </View>
              )}

              {intervention.costAmount !== null && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Coût</Text>
                  <Text style={styles.infoValue}>
                    {intervention.costAmount?.toFixed(2)} €
                  </Text>
                </View>
              )}

              {intervention.predictedCostAmount !== null && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Coût prévu</Text>
                  <Text style={styles.infoValue}>
                    {intervention.predictedCostAmount?.toFixed(2)} €
                  </Text>
                </View>
              )}

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>À facturer</Text>
                <Chip
                  compact
                  style={{
                    backgroundColor: intervention.toInvoice ? '#4caf5020' : '#f4433620',
                  }}
                  textStyle={{
                    color: intervention.toInvoice ? '#4caf50' : '#f44336',
                    fontSize: 12,
                  }}
                >
                  {intervention.toInvoice ? 'Oui' : 'Non'}
                </Chip>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* ========== SECTION 12: Photos ========== */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="camera" size={20} color="#6200ee" />
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Photos
              </Text>
            </View>

            {/* Galerie des photos existantes */}
            <PhotoGallery
              interventionId={interventionId}
              onPhotoDeleted={loadIntervention}
            />

            <Divider style={styles.divider} />

            {/* Ajouter de nouvelles photos si autorisé */}
            {canAddMedia ? (
              <PhotoPicker
                interventionId={interventionId}
                onPhotosChanged={() => loadIntervention()}
              />
            ) : (
              <Text style={styles.infoText}>Ajout de photos désactivé pour ce statut</Text>
            )}
          </Card.Content>
        </Card>

        {/* ========== SECTION 13: Signature client ========== */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="create" size={20} color="#6200ee" />
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Signature client
              </Text>
            </View>

            {canAddMedia ? (
              <SignaturePad
                interventionId={interventionId}
                existingSignatureId={existingSignatureId}
                onSignatureSaved={() => loadIntervention()}
              />
            ) : (
              <Text style={styles.infoText}>Capture de signature désactivée pour ce statut</Text>
            )}
          </Card.Content>
        </Card>

        {/* ========== SECTION 14: TimeSheet (si en cours) ========== */}
        {intervention.status === InterventionStatus.IN_PROGRESS && (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                ⏲️ Pointage
              </Text>
              <TimeSheet
                interventionId={interventionId}
                initialTime={trackedSeconds}
                onTimeSaved={(s) => setTrackedSeconds(s)}
                disabled={false}
              />
            </Card.Content>
          </Card>
        )}

        {/* ========== SECTION 15: Actions ========== */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              ⚡ Actions
            </Text>

            <View style={styles.actionsContainer}>
              {/* Bouton Démarrer (si SCHEDULED ou PENDING) */}
              {(intervention.status === InterventionStatus.SCHEDULED || intervention.status === InterventionStatus.PENDING) && (
                <Button
                  mode="contained"
                  icon="play"
                  onPress={handleStart}
                  loading={actionLoading}
                  disabled={actionLoading}
                  style={styles.actionButton}
                  buttonColor="#4caf50"
                >
                  Démarrer
                </Button>
              )}

              {/* Bouton Terminer (si IN_PROGRESS) */}
              {intervention.status === InterventionStatus.IN_PROGRESS && (
                <Button
                  mode="contained"
                  icon="check"
                  onPress={handleComplete}
                  loading={actionLoading}
                  disabled={actionLoading}
                  style={styles.actionButton}
                  buttonColor="#2196f3"
                >
                  Terminer
                </Button>
              )}

              {/* Info si terminée ou facturée */}
              {intervention.status === InterventionStatus.COMPLETED && (
                <View style={styles.completedBadge}>
                  <Ionicons name="checkmark-circle" size={24} color="#4caf50" />
                  <Text style={styles.completedText}>
                    Terminée
                  </Text>
                </View>
              )}
            </View>
          </Card.Content>
        </Card>

        {/* Espace en bas pour scroll */}
        <View style={{ height: 40 }} />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f44336',
  },
  errorButton: {
    marginTop: 24,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    elevation: 2,
    backgroundColor: '#fff',
  },
  titleRow: {
    marginBottom: 12,
  },
  title: {
    fontWeight: 'bold',
    color: '#000',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    borderRadius: 16,
  },
  referenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  referenceText: {
    fontSize: 14,
    color: '#757575',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#757575',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  infoText: {
    fontSize: 14,
    color: '#757575',
    fontStyle: 'italic',
  },
  timeValue: {
    color: '#ff9800',
    fontWeight: 'bold',
  },
  customerName: {
    color: '#2196f3',
    fontWeight: 'bold',
  },
  technicianName: {
    color: '#4caf50',
    fontWeight: 'bold',
  },
  priceValue: {
    color: '#4caf50',
    fontWeight: 'bold',
  },
  linkText: {
    color: '#2196f3',
    textDecorationLine: 'underline',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ff980020',
    padding: 12,
    borderRadius: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#ff9800',
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 16,
  },
  actionsContainer: {
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    borderRadius: 8,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4caf5020',
    padding: 16,
    borderRadius: 8,
  },
  completedText: {
    fontSize: 16,
    color: '#4caf50',
    fontWeight: 'bold',
  },
});

export default InterventionDetailsScreenV3;
