/**
 * Écran liste complète des interventions
 * Avec filtres avancés, RBAC, recherche et tri
 * Version améliorée suivant le modèle TicketsScreen
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  Text,
  Card,
  Chip,
  Searchbar,
  FAB,
  Menu,
  Button,
  Divider,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Intervention, InterventionStatus, InterventionType } from '../../types/intervention.types';
import { InterventionService } from '../../services/intervention.service';
import { useSyncStore } from '../../stores/syncStore';
import { useAuthStore, authSelectors } from '../../stores/authStore.v2';
import { showToast } from '../../utils/toast';
import { hasPermission, Permission } from '../../utils/permissions';
import { InterventionsMap, MapIntervention } from '../../components/InterventionsMap';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

const InterventionsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const user = useAuthStore(authSelectors.user);
  const { isSyncing } = useSyncStore();

  // États principaux
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [filteredInterventions, setFilteredInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filtres
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<InterventionStatus[]>([]);
  const [showOnlyUrgent, setShowOnlyUrgent] = useState(false);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  // UI
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [isFiltersVisible, setIsFiltersVisible] = useState(true);

  /**
   * Vérifie si l'utilisateur peut voir toutes les interventions
   */
  const canViewAllInterventions = useMemo(() => {
    if (!user?.role) return false;
    return hasPermission(user.role, Permission.VIEW_ALL_INTERVENTIONS);
  }, [user?.role]);

  /**
   * Charger les interventions depuis l'API (avec RBAC)
   */
  const loadInterventions = async () => {
    try {
      if (!user) {
        console.log('[InterventionsScreen] Utilisateur non chargé, attente...');
        return;
      }

      console.log('[InterventionsScreen] Chargement interventions...');
      let results: Intervention[];

      // Admin/Patron: toutes les interventions via search
      // Technicien/Commercial/Chef: uniquement leurs interventions
      if (canViewAllInterventions) {
        console.log('[InterventionsScreen] Admin/Patron - Toutes les interventions');
        results = await InterventionService.searchInterventions({
          // Pas de filtre technicien - on charge tout
          // Les filtres Admin sont appliqués après en fonction des états
        });
      } else {
        console.log('[InterventionsScreen] Technicien - Mes interventions');
        results = await InterventionService.getMyInterventions();
      }

      setInterventions(results);
      console.log(`[InterventionsScreen] ${results.length} interventions chargées`);
    } catch (error) {
      console.error('[InterventionsScreen] Erreur chargement:', error);
      showToast('Erreur lors du chargement des interventions', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Rafraîchir depuis l'API
   */
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadInterventions();
      showToast('Interventions actualisées', 'success');
    } catch (error) {
      console.error('Erreur rafraîchissement:', error);
      showToast('Erreur lors de l\'actualisation', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadInterventions();
    }
  }, [user, canViewAllInterventions]);

  /**
   * Extraire les techniciens uniques (pour filtres Admin)
   */
  const availableTechnicians = useMemo(() => {
    const map = new Map<string, string>();
    interventions.forEach((intervention) => {
      if (intervention.technicianId && intervention.technicianName) {
        map.set(intervention.technicianId, intervention.technicianName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [interventions]);

  /**
   * Filtrer les interventions
   */
  useEffect(() => {
    let filtered = [...interventions];

    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.title?.toLowerCase().includes(query) ||
          i.reference?.toLowerCase().includes(query) ||
          i.customerName?.toLowerCase().includes(query) ||
          i.city?.toLowerCase().includes(query) ||
          i.address?.toLowerCase().includes(query)
      );
    }

    // Filtre par statuts
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((i) => selectedStatuses.includes(i.status));
    }

    // Filtre Urgent
    if (showOnlyUrgent) {
      filtered = filtered.filter((i) => i.isUrgent === true);
    }

    // Filtre Technicien (Admin uniquement)
    if (selectedTechnicianId) {
      filtered = filtered.filter((i) => i.technicianId === selectedTechnicianId);
    }

    // Tri par priorité (urgent d'abord) puis par date
    filtered.sort((a, b) => {
      // Urgent en premier
      if (a.isUrgent && !b.isUrgent) return -1;
      if (!a.isUrgent && b.isUrgent) return 1;

      // Puis par date
      const dateDiff = new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime();
      return sortOrder === 'DESC' ? dateDiff : -dateDiff;
    });

    setFilteredInterventions(filtered);
  }, [interventions, searchQuery, selectedStatuses, showOnlyUrgent, selectedTechnicianId, sortOrder]);

  /**
   * Toggle statut filter
   */
  const toggleStatusFilter = (status: InterventionStatus) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  /**
   * Obtenir la couleur du statut
   */
  const getStatusColor = (status: InterventionStatus): string => {
    switch (status) {
      case InterventionStatus.SCHEDULED: // 0
        return '#2196F3'; // Bleu
      case InterventionStatus.IN_PROGRESS: // 1
        return '#FF9800'; // Orange
      case InterventionStatus.COMPLETED: // 2
        return '#4CAF50'; // Vert
      case InterventionStatus.CANCELLED: // 3
        return '#F44336'; // Rouge
      case InterventionStatus.PENDING: // 4
        return '#9C27B0'; // Violet
      default:
        return '#9E9E9E'; // Gris
    }
  };

  /**
   * Obtenir le label du statut
   */
  const getStatusLabel = (status: InterventionStatus): string => {
    switch (status) {
      case InterventionStatus.SCHEDULED:
        return 'Planifiée';
      case InterventionStatus.IN_PROGRESS:
        return 'En cours';
      case InterventionStatus.COMPLETED:
        return 'Terminée';
      case InterventionStatus.CANCELLED:
        return 'Annulée';
      case InterventionStatus.PENDING:
        return 'En attente';
      default:
        return 'Inconnu';
    }
  };

  /**
   * Render item
   */
  const renderItem = ({ item }: { item: Intervention }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('InterventionDetails', { interventionId: item.id })
      }
    >
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.statusIndicator,
                { backgroundColor: getStatusColor(item.status) },
              ]}
            />
            <View style={styles.cardHeaderText}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text variant="titleMedium" style={styles.cardTitle}>
                  {item.title}
                </Text>
                {item.isUrgent && (
                  <Ionicons name="alert-circle" size={20} color="#f44336" />
                )}
              </View>
              <Text variant="bodySmall" style={styles.reference}>
                Réf: {item.reference}
              </Text>
            </View>
            <Chip
              style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
              textStyle={styles.statusChipText}
              compact
            >
              {getStatusLabel(item.status)}
            </Chip>
          </View>

          <View style={styles.cardDetails}>
            <Text variant="bodyMedium">
              🕒 {format(new Date(item.scheduledDate), "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr })}
            </Text>

            {item.customerName && (
              <Text variant="bodySmall" style={styles.detailText}>
                👤 {item.customerName}
              </Text>
            )}

            {item.city && (
              <Text variant="bodySmall" style={styles.detailText}>
                📍 {item.city}
              </Text>
            )}

            {item.technicianName && (
              <Text variant="bodySmall" style={styles.detailText}>
                🔧 {item.technicianName}
              </Text>
            )}

            {item.constructionSiteName && (
              <Text variant="bodySmall" style={styles.projectName}>
                🏗️ {item.constructionSiteName}
              </Text>
            )}
          </View>

          {item.isUrgent && (
            <Chip
              style={styles.urgentChip}
              textStyle={styles.urgentChipText}
              compact
              icon="alert"
            >
              Urgent
            </Chip>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  // Écran de chargement
  if (loading && user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text variant="bodyLarge" style={styles.loadingText}>
          Chargement des interventions...
        </Text>
      </View>
    );
  }

  // En attente de l'authentification
  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text variant="bodyLarge" style={styles.loadingText}>
          En attente de l'authentification...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Barre de recherche */}
      <Searchbar
        placeholder="Rechercher..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      {/* En-tête Filtres */}
      <TouchableOpacity
        style={styles.filtersHeader}
        onPress={() => setIsFiltersVisible(!isFiltersVisible)}
      >
        <Text variant="titleMedium" style={styles.filtersTitle}>
          Filtres
        </Text>
        <Button
          mode="text"
          icon={isFiltersVisible ? 'chevron-up' : 'chevron-down'}
          compact
        >
          {isFiltersVisible ? 'Masquer' : 'Afficher'}
        </Button>
      </TouchableOpacity>

      {isFiltersVisible && (
        <>
          {/* Filtres Statuts */}
          <View style={styles.filtersContainer}>
            <Text variant="labelMedium" style={styles.filtersLabel}>
              Statuts:
            </Text>
            <View style={styles.filtersChips}>
              <Chip
                selected={selectedStatuses.includes(InterventionStatus.SCHEDULED)}
                onPress={() => toggleStatusFilter(InterventionStatus.SCHEDULED)}
                style={styles.filterChip}
                selectedColor="#2196F3"
              >
                Planifiées
              </Chip>
              <Chip
                selected={selectedStatuses.includes(InterventionStatus.IN_PROGRESS)}
                onPress={() => toggleStatusFilter(InterventionStatus.IN_PROGRESS)}
                style={styles.filterChip}
                selectedColor="#FF9800"
              >
                En cours
              </Chip>
              <Chip
                selected={selectedStatuses.includes(InterventionStatus.COMPLETED)}
                onPress={() => toggleStatusFilter(InterventionStatus.COMPLETED)}
                style={styles.filterChip}
                selectedColor="#4CAF50"
              >
                Terminées
              </Chip>
              <Chip
                selected={selectedStatuses.includes(InterventionStatus.PENDING)}
                onPress={() => toggleStatusFilter(InterventionStatus.PENDING)}
                style={styles.filterChip}
                selectedColor="#9C27B0"
              >
                En attente
              </Chip>
              <Chip
                selected={selectedStatuses.includes(InterventionStatus.CANCELLED)}
                onPress={() => toggleStatusFilter(InterventionStatus.CANCELLED)}
                style={styles.filterChip}
                selectedColor="#F44336"
              >
                Annulées
              </Chip>
            </View>
          </View>

          {/* Filtre Urgent + Tri */}
          <View style={styles.filtersContainer}>
            <Text variant="labelMedium" style={styles.filtersLabel}>
              Priorité & Tri:
            </Text>
            <View style={styles.filtersChips}>
              <Chip
                selected={showOnlyUrgent}
                onPress={() => setShowOnlyUrgent(!showOnlyUrgent)}
                style={styles.filterChip}
                icon="alert"
                selectedColor="#f44336"
              >
                Urgent uniquement
              </Chip>
              <Chip
                selected={sortOrder === 'DESC'}
                onPress={() => setSortOrder('DESC')}
                style={styles.filterChip}
                icon="sort-calendar-descending"
              >
                Plus récents
              </Chip>
              <Chip
                selected={sortOrder === 'ASC'}
                onPress={() => setSortOrder('ASC')}
                style={styles.filterChip}
                icon="sort-calendar-ascending"
              >
                Plus anciens
              </Chip>
            </View>
          </View>

          {/* Filtre Technicien (Admin uniquement) */}
          {canViewAllInterventions && availableTechnicians.length > 0 && (
            <View style={styles.filtersContainer}>
              <Text variant="labelMedium" style={styles.filtersLabel}>
                Technicien:
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filtersChips}
              >
                <Chip
                  selected={selectedTechnicianId === null}
                  onPress={() => setSelectedTechnicianId(null)}
                  style={styles.filterChip}
                >
                  Tous
                </Chip>
                {availableTechnicians.map((tech) => (
                  <Chip
                    key={tech.id}
                    selected={selectedTechnicianId === tech.id}
                    onPress={() => setSelectedTechnicianId(tech.id)}
                    style={styles.filterChip}
                  >
                    {tech.name}
                  </Chip>
                ))}
              </ScrollView>
            </View>
          )}
        </>
      )}

      {/* Statistiques et toggle vue */}
      <View style={styles.statsContainer}>
        <Text variant="bodyMedium" style={styles.statsText}>
          {filteredInterventions.length} intervention(s)
          {selectedStatuses.length > 0 && ' filtrée(s)'}
          {!canViewAllInterventions && ' (mes interventions)'}
        </Text>
        <View style={styles.controlsContainer}>
          {(selectedStatuses.length > 0 ||
            showOnlyUrgent ||
            selectedTechnicianId !== null) && (
            <Button
              mode="text"
              onPress={() => {
                setSelectedStatuses([]);
                setShowOnlyUrgent(false);
                setSelectedTechnicianId(null);
              }}
              compact
              style={styles.clearButton}
              icon="filter-off"
            >
              Réinitialiser
            </Button>
          )}
          <Button
            mode={viewMode === 'list' ? 'contained' : 'outlined'}
            onPress={() => setViewMode('list')}
            compact
            icon="format-list-bulleted"
            style={styles.viewButton}
          >
            Liste
          </Button>
          <Button
            mode={viewMode === 'map' ? 'contained' : 'outlined'}
            onPress={() => setViewMode('map')}
            compact
            icon="map"
            style={styles.viewButton}
          >
            Carte
          </Button>
        </View>
      </View>

      {/* Vue Liste ou Carte */}
      {viewMode === 'list' ? (
        <FlatList
          data={filteredInterventions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing || isSyncing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text variant="titleLarge" style={styles.emptyText}>
                Aucune intervention
              </Text>
              <Text variant="bodyMedium" style={styles.emptySubtext}>
                {searchQuery || selectedStatuses.length > 0
                  ? 'Essayez de modifier vos filtres'
                  : 'Aucune intervention à afficher'}
              </Text>
            </View>
          }
          contentContainerStyle={
            filteredInterventions.length === 0 ? styles.emptyContentContainer : undefined
          }
        />
      ) : (
        <InterventionsMap
          interventions={filteredInterventions.map((i) => ({
            id: i.id,
            reference: i.reference || '',
            customerName: i.customerName || '',
            address: i.address,
            latitude: i.latitude,
            longitude: i.longitude,
            status: i.status || InterventionStatus.PENDING,
            scheduledDate: i.scheduledDate,
          }))}
          onMarkerPress={(interventionId) => {
            navigation.navigate('InterventionDetails', { interventionId });
          }}
        />
      )}

      {/* FAB Créer */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {
          // TODO: Navigation vers création
          console.log('Créer intervention');
        }}
      />
    </View>
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
  searchbar: {
    margin: 16,
    marginBottom: 8,
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filtersTitle: {
    fontWeight: 'bold',
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filtersLabel: {
    marginBottom: 8,
    color: '#757575',
  },
  filtersChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    marginRight: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    flexWrap: 'wrap',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statsText: {
    color: '#757575',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clearButton: {
    marginVertical: -8,
  },
  viewButton: {
    minWidth: 80,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  statusIndicator: {
    width: 4,
    height: 60,
    borderRadius: 2,
    marginRight: 12,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reference: {
    color: '#757575',
  },
  statusChip: {
    height: 28,
  },
  statusChipText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  cardDetails: {
    marginLeft: 16,
    gap: 4,
  },
  detailText: {
    color: '#757575',
  },
  projectName: {
    fontWeight: 'bold',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginLeft: 16,
  },
  typeChip: {
    backgroundColor: '#f3e5f5',
  },
  typeChipText: {
    fontSize: 11,
  },
  duration: {
    color: '#757575',
  },
  urgentChip: {
    backgroundColor: '#ffebee',
    marginTop: 8,
    marginLeft: 16,
    alignSelf: 'flex-start',
  },
  urgentChipText: {
    color: '#f44336',
    fontSize: 11,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyContentContainer: {
    flexGrow: 1,
  },
  emptyText: {
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#757575',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#6200ee',
  },
});

export default InterventionsScreen;
