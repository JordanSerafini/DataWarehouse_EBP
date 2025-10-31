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
  TouchableOpacity,
  Modal,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Chip,
  ActivityIndicator,
  Divider,
  List,
  Portal,
} from 'react-native-paper';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { InterventionService, Intervention, InterventionStatus } from '../../services/intervention.service';
import { ActivityService, Activity, ActivityCategory } from '../../services/activity.service';
import { apiService } from '../../services/api.service';
import { showToast } from '../../utils/toast';
import { PhotoPicker } from '../../components/PhotoPicker';
import { PhotoGallery } from '../../components/PhotoGallery';
import { SignaturePad } from '../../components/SignaturePad';
import { TimeSheet } from '../../components/TimeSheet';
import { hapticService } from '../../services/haptic.service';
import { SkeletonInterventionDetails } from '../../components/ui/SkeletonLoaders';
import { AnimatedButton, AnimatedFadeIn, AnimatedCheckmark } from '../../components/ui/AnimatedComponents';
import { CollapsibleInfoSection, InfoField } from '../../components/CollapsibleInfoSection';
import { useAuthStore, authSelectors } from '../../stores/authStore.v2';
import { UserRole } from '../../types/user.types';

type InterventionDetailsRouteProp = RouteProp<RootStackParamList, 'InterventionDetails'>;

const InterventionDetailsScreenV2 = () => {
  const route = useRoute<InterventionDetailsRouteProp>();
  const navigation = useNavigation();
  const { interventionId } = route.params;

  // Récupérer l'utilisateur connecté pour vérifier les permissions
  const user = useAuthStore(authSelectors.user);

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

  // États pour les sections dépliables
  const [isCostsExpanded, setIsCostsExpanded] = useState(false);
  const [isMaintenanceExpanded, setIsMaintenanceExpanded] = useState(false);
  const [isProjectExpanded, setIsProjectExpanded] = useState(false);
  const [isEquipmentExpanded, setIsEquipmentExpanded] = useState(false);
  const [isDocumentsExpanded, setIsDocumentsExpanded] = useState(false);
  const [isCustomFieldsExpanded, setIsCustomFieldsExpanded] = useState(false);

  // États pour l'édition (Admin/Patron/Super Admin)
  const [technicians, setTechnicians] = useState<Array<{ id: string; full_name: string; email: string }>>([]);
  const [showTechnicianPicker, setShowTechnicianPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loadingTechnicians, setLoadingTechnicians] = useState(false);

  // Vérifier si l'utilisateur peut éditer l'intervention
  const canEdit = user?.role === UserRole.SUPER_ADMIN ||
                  user?.role === UserRole.ADMIN ||
                  user?.role === UserRole.PATRON;

  // Permissions pour voir les sections sensibles
  const canViewFinancialInfo = user?.role === UserRole.SUPER_ADMIN ||
                                user?.role === UserRole.ADMIN ||
                                user?.role === UserRole.PATRON;

  const canViewProjectInfo = user?.role === UserRole.SUPER_ADMIN ||
                              user?.role === UserRole.ADMIN ||
                              user?.role === UserRole.PATRON ||
                              user?.role === UserRole.CHEF_CHANTIER ||
                              user?.role === UserRole.COMMERCIAL;

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
   * Charger la liste des techniciens (pour sélection)
   */
  const loadTechnicians = async () => {
    try {
      setLoadingTechnicians(true);
      const response = await apiService.getUsers({ role: 'technicien', limit: 100 });
      console.log('Techniciens chargés:', response);

      if (response && response.data) {
        setTechnicians(response.data);
      } else {
        setTechnicians([]);
        showToast('Aucun technicien trouvé', 'info');
      }
    } catch (error: any) {
      console.error('Error loading technicians:', error);
      // Si erreur 403, l'utilisateur n'a pas les permissions
      if (error?.response?.status === 403) {
        showToast('Vous n\'avez pas les permissions pour voir les techniciens', 'error');
      } else {
        showToast('Erreur lors du chargement des techniciens', 'error');
      }
      setTechnicians([]);
    } finally {
      setLoadingTechnicians(false);
    }
  };

  /**
   * Ouvrir le sélecteur de technicien
   */
  const handleOpenTechnicianPicker = async () => {
    if (!canEdit) return;
    await hapticService.light();
    if (technicians.length === 0) {
      await loadTechnicians();
    }
    setShowTechnicianPicker(true);
  };

  /**
   * Changer le technicien assigné
   */
  const handleChangeTechnician = async (technicianId: string, technicianName: string) => {
    try {
      await hapticService.medium();
      setShowTechnicianPicker(false);
      setActionLoading(true);

      await InterventionService.updateIntervention(interventionId, {
        technicianId,
        technicianName,
      });

      await hapticService.success();
      showToast('Technicien modifié !', 'success');
      await loadIntervention();
    } catch (error: any) {
      console.error('Error changing technician:', error);
      await hapticService.error();
      showToast('Erreur lors du changement de technicien', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Ouvrir le sélecteur de date
   */
  const handleOpenDatePicker = () => {
    if (!canEdit) return;
    hapticService.light();
    setSelectedDate(intervention?.scheduledDate ? new Date(intervention.scheduledDate) : new Date());
    setShowDatePicker(true);
  };

  /**
   * Changer la date planifiée
   */
  const handleChangeDate = async (event: any, date?: Date) => {
    try {
      // Sur Android, fermer immédiatement le picker
      if (Platform.OS === 'android') {
        setShowDatePicker(false);
      }

      // Vérifier si l'utilisateur a annulé (event peut être undefined sur iOS)
      if (!date) {
        return;
      }

      // Sur Android, vérifier le type d'événement si disponible
      if (Platform.OS === 'android' && event && event.type === 'dismissed') {
        return;
      }

      // Effectuer la mise à jour
      await hapticService.medium();
      setActionLoading(true);

      await InterventionService.updateIntervention(interventionId, {
        scheduledDate: date.toISOString(),
      });

      await hapticService.success();
      showToast('Date modifiée !', 'success');
      await loadIntervention();

      // Fermer le picker sur iOS après succès
      if (Platform.OS === 'ios') {
        setShowDatePicker(false);
      }
    } catch (error: any) {
      console.error('Error changing date:', error);
      await hapticService.error();
      showToast('Erreur lors du changement de date', 'error');
    } finally {
      setActionLoading(false);
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
          {/* Technicien (éditable si Admin/Patron/Super Admin) */}
          <TouchableOpacity
            style={[styles.infoRow, canEdit && styles.editableRow]}
            onPress={canEdit ? handleOpenTechnicianPicker : undefined}
            disabled={!canEdit}
          >
            <Text variant="labelMedium" style={styles.infoLabel}>
              Technicien:
            </Text>
            <View style={styles.editableField}>
              <Text variant="bodyMedium" style={canEdit && styles.editableText}>
                {intervention.technicianName || 'Non assigné'}
              </Text>
              {canEdit && (
                <Ionicons name="pencil" size={16} color="#6200ee" style={styles.editIcon} />
              )}
            </View>
          </TouchableOpacity>
          <Divider style={styles.divider} />

          {/* Date planifiée (éditable si Admin/Patron/Super Admin) */}
          <TouchableOpacity
            style={[styles.infoRow, canEdit && styles.editableRow]}
            onPress={canEdit ? handleOpenDatePicker : undefined}
            disabled={!canEdit}
          >
            <Text variant="labelMedium" style={styles.infoLabel}>
              Planifiée:
            </Text>
            <View style={styles.editableField}>
              <Text variant="bodyMedium" style={canEdit && styles.editableText}>
                {format(new Date(intervention.scheduledDate), "d MMMM yyyy 'à' HH:mm", {
                  locale: fr,
                })}
              </Text>
              {canEdit && (
                <Ionicons name="pencil" size={16} color="#6200ee" style={styles.editIcon} />
              )}
            </View>
          </TouchableOpacity>
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

      {/* Section Coûts & Facturation (ADMIN/PATRON/SUPER_ADMIN uniquement) */}
      {canViewFinancialInfo && (
        <CollapsibleInfoSection
          title="Coûts & Facturation"
          icon="cash-outline"
          iconColor="#4caf50"
          isExpanded={isCostsExpanded}
          onToggle={() => setIsCostsExpanded(!isCostsExpanded)}
          fields={[
            { label: 'Prix de vente HT', value: intervention.salePriceVatExcluded, format: 'currency', icon: 'pricetag-outline' },
            { label: 'Montant net HT', value: intervention.netAmountVatExcluded, format: 'currency', icon: 'calculator-outline' },
            { label: 'Coût horaire', value: intervention.hourlyCostPrice, format: 'currency', icon: 'time-outline' },
            { label: 'Montant du coût', value: intervention.costAmount, format: 'currency', icon: 'trending-down-outline' },
            { label: 'Coût prévu', value: intervention.predictedCostAmount, format: 'currency', icon: 'analytics-outline' },
            { label: 'À facturer', value: intervention.toInvoice, format: 'boolean', icon: 'checkbox-outline' },
            { label: 'ID Facture', value: intervention.invoiceId, format: 'text', icon: 'receipt-outline' },
          ]}
        />
      )}

      {/* Section Maintenance */}
      <CollapsibleInfoSection
        title="Maintenance"
        icon="construct-outline"
        iconColor="#ff9800"
        isExpanded={isMaintenanceExpanded}
        onToggle={() => setIsMaintenanceExpanded(!isMaintenanceExpanded)}
        fields={[
          { label: 'Référence', value: intervention.maintenanceReference, format: 'text', icon: 'bookmark-outline' },
          { label: 'Contrat', value: intervention.maintenanceContractId, format: 'text', icon: 'document-text-outline' },
          { label: 'Incident', value: intervention.maintenanceIncidentId, format: 'text', icon: 'warning-outline' },
          { label: 'Produit client', value: intervention.maintenanceCustomerProductId, format: 'text', icon: 'cube-outline' },
          { label: 'Durée trajet (min)', value: intervention.maintenanceTravelDuration, format: 'text', icon: 'car-outline' },
          { label: 'Heures décrémentées', value: intervention.maintenanceContractHoursDecremented, format: 'text', icon: 'timer-outline' },
          { label: 'Prochaine intervention', value: intervention.maintenanceNextEventDate, format: 'date', icon: 'calendar-outline' },
        ]}
      />

      {/* Section Projet/Chantier/Affaire */}
      <CollapsibleInfoSection
        title="Projet & Chantier"
        icon="hammer-outline"
        iconColor="#2196f3"
        isExpanded={isProjectExpanded}
        onToggle={() => setIsProjectExpanded(!isProjectExpanded)}
        fields={[
          { label: 'Chantier', value: intervention.constructionSiteName, format: 'text', icon: 'business-outline' },
          { label: 'Affaire', value: intervention.dealName, format: 'text', icon: 'briefcase-outline' },
          { label: 'Est un projet', value: intervention.isProject, format: 'boolean', icon: 'checkbox-outline' },
          { label: 'Avancement', value: intervention.globalPercentComplete, format: 'percent', icon: 'stats-chart-outline' },
        ]}
      />

      {/* Section Équipements & Articles */}
      <CollapsibleInfoSection
        title="Équipements & Articles"
        icon="hardware-chip-outline"
        iconColor="#9c27b0"
        isExpanded={isEquipmentExpanded}
        onToggle={() => setIsEquipmentExpanded(!isEquipmentExpanded)}
        fields={[
          { label: 'Équipement', value: intervention.equipmentName, format: 'text', icon: 'cog-outline' },
          { label: 'Article', value: intervention.itemName, format: 'text', icon: 'pricetag-outline' },
          { label: 'Quantité', value: intervention.quantity, format: 'text', icon: 'list-outline' },
        ]}
      />

      {/* Section Documents liés */}
      <CollapsibleInfoSection
        title="Documents liés"
        icon="folder-outline"
        iconColor="#795548"
        isExpanded={isDocumentsExpanded}
        onToggle={() => setIsDocumentsExpanded(!isDocumentsExpanded)}
        fields={[
          { label: 'Document de vente', value: intervention.saleDocumentId, format: 'text', icon: 'document-outline' },
          { label: 'Ligne document vente', value: intervention.saleDocumentLineId, format: 'text', icon: 'list-outline' },
          { label: 'Document d\'achat', value: intervention.purchaseDocumentId, format: 'text', icon: 'cart-outline' },
          { label: 'Document de stock', value: intervention.stockDocumentId, format: 'text', icon: 'cube-outline' },
          { label: 'Fichiers associés', value: intervention.hasAssociatedFiles, format: 'boolean', icon: 'attach-outline' },
        ]}
      />

      {/* Section Champs personnalisés métier */}
      <CollapsibleInfoSection
        title="Informations métier"
        icon="business-outline"
        iconColor="#00bcd4"
        isExpanded={isCustomFieldsExpanded}
        onToggle={() => setIsCustomFieldsExpanded(!isCustomFieldsExpanded)}
        fields={[
          { label: 'Type de tâche', value: intervention.customTaskType, format: 'text', icon: 'list-circle-outline' },
          { label: 'Thème', value: intervention.customTheme, format: 'text', icon: 'color-palette-outline' },
          { label: 'Services', value: intervention.customServices, format: 'text', icon: 'settings-outline' },
          { label: 'Activité', value: intervention.customActivity, format: 'text', icon: 'pulse-outline' },
          { label: 'Logiciel', value: intervention.customSoftware, format: 'text', icon: 'code-slash-outline' },
          { label: 'Fournisseur', value: intervention.customSupplier, format: 'text', icon: 'people-outline' },
          { label: 'Thème commercial', value: intervention.customCommercialTheme, format: 'text', icon: 'megaphone-outline' },
          { label: 'URGENT', value: intervention.isUrgent, format: 'boolean', icon: 'alert-circle-outline' },
          { label: 'Durée prévue (h)', value: intervention.customPlannedDuration, format: 'text', icon: 'hourglass-outline' },
          { label: 'Temps client (h)', value: intervention.customTimeClient, format: 'text', icon: 'person-outline' },
          { label: 'Temps interne (h)', value: intervention.customTimeInternal, format: 'text', icon: 'home-outline' },
          { label: 'Temps trajet (h)', value: intervention.customTimeTravel, format: 'text', icon: 'car-outline' },
          { label: 'Temps relationnel (h)', value: intervention.customTimeRelational, format: 'text', icon: 'chatbubbles-outline' },
          { label: 'Sous-traitant', value: intervention.subContractorName, format: 'text', icon: 'business-outline' },
          { label: 'Créé par', value: intervention.creatorName, format: 'text', icon: 'person-add-outline' },
        ]}
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
                          {note.creatorName || note.creatorColleagueId || 'Utilisateur'}
                        </Text>
                      </View>
                      <Text variant="bodySmall" style={styles.noteDate}>
                        {format(new Date(note.createdAt), 'dd/MM/yyyy à HH:mm', {
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

      {/* Modal Sélection Technicien */}
      <Portal>
        <Modal
          visible={showTechnicianPicker}
          onDismiss={() => setShowTechnicianPicker(false)}
        >
          <View style={styles.modalContainer}>
            <Card>
              <Card.Title title="Sélectionner un technicien" />
              <Card.Content>
                {loadingTechnicians ? (
                  <ActivityIndicator size="large" color="#6200ee" style={{ marginVertical: 20 }} />
                ) : technicians.length === 0 ? (
                  <View style={{ padding: 20, alignItems: 'center' }}>
                    <Ionicons name="people-outline" size={48} color="#bdbdbd" />
                    <Text variant="bodyMedium" style={{ marginTop: 12, color: '#757575', textAlign: 'center' }}>
                      Aucun technicien disponible
                    </Text>
                  </View>
                ) : (
                  <ScrollView style={styles.technicianList}>
                    {technicians.map((tech) => (
                      <List.Item
                        key={tech.id}
                        title={tech.full_name}
                        description={tech.email}
                        left={(props) => <List.Icon {...props} icon="account" />}
                        onPress={() => handleChangeTechnician(tech.id, tech.full_name)}
                        style={styles.technicianItem}
                      />
                    ))}
                  </ScrollView>
                )}
              </Card.Content>
              <Card.Actions>
                <Button onPress={() => setShowTechnicianPicker(false)}>Annuler</Button>
              </Card.Actions>
            </Card>
          </View>
        </Modal>
      </Portal>

      {/* Modal DateTimePicker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="datetime"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChangeDate}
          locale="fr-FR"
        />
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
  // Styles pour l'édition (Admin/Patron/Super Admin)
  editableRow: {
    backgroundColor: '#f0f4ff',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginVertical: 4,
  },
  editableField: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  editableText: {
    color: '#6200ee',
    fontWeight: '600',
  },
  editIcon: {
    marginLeft: 8,
  },
  // Styles pour les modals
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  technicianList: {
    maxHeight: 400,
  },
  technicianItem: {
    paddingVertical: 8,
  },
});

export default InterventionDetailsScreenV2;
