/**
 * Écran liste complète des interventions
 * Avec filtres, recherche et tri
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
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
import { apiService } from '../../services/api.service';
import { useSyncStore } from '../../stores/syncStore';
import { useAuthStore, authSelectors } from '../../stores/authStore.v2';
import { showToast } from '../../utils/toast';
import { InterventionsMap, MapIntervention } from '../../components/InterventionsMap';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

const InterventionsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const user = useAuthStore(authSelectors.user);
  const { isSyncing } = useSyncStore();

  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [filteredInterventions, setFilteredInterventions] = useState<Intervention[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<InterventionStatus[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  /**
   * Charger les interventions depuis l'API
   */
  const loadInterventions = async () => {
    try {
      // Récupérer les interventions depuis le backend
      const results = await apiService.getMyInterventions();
      setInterventions(results);
    } catch (error) {
      console.error('Erreur chargement interventions:', error);
      showToast('Erreur lors du chargement des interventions', 'error');
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
    loadInterventions();
  }, [user]);

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
          i.city?.toLowerCase().includes(query)
      );
    }

    // Filtre par statuts
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((i) => selectedStatuses.includes(i.status));
    }

    // Tri par date
    filtered.sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime());

    setFilteredInterventions(filtered);
  }, [interventions, searchQuery, selectedStatuses]);

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
              <Text variant="titleMedium" style={styles.cardTitle}>
                {item.title}
              </Text>
              <Text variant="bodySmall" style={styles.reference}>
                Réf: {item.reference}
              </Text>
            </View>
            <Chip
              style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
              textStyle={styles.statusChipText}
              compact
            >
              {item.statusLabel}
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

            {item.projectName && (
              <Text variant="bodySmall" style={styles.projectName}>
                🏗️ {item.projectName}
              </Text>
            )}
          </View>

          <View style={styles.cardFooter}>
            <Chip compact style={styles.typeChip} textStyle={styles.typeChipText}>
              {item.typeLabel}
            </Chip>
            {item.estimatedDuration && (
              <Text variant="labelSmall" style={styles.duration}>
                ⏱️ {item.estimatedDuration} min
              </Text>
            )}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Barre de recherche */}
      <Searchbar
        placeholder="Rechercher..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      {/* Filtres statuts */}
      <View style={styles.filtersContainer}>
        <Text variant="labelMedium" style={styles.filtersLabel}>
          Filtres:
        </Text>
        <View style={styles.filtersChips}>
          <Chip
            selected={selectedStatuses.includes(InterventionStatus.SCHEDULED)}
            onPress={() => toggleStatusFilter(InterventionStatus.SCHEDULED)}
            style={styles.filterChip}
          >
            Planifiées
          </Chip>
          <Chip
            selected={selectedStatuses.includes(InterventionStatus.IN_PROGRESS)}
            onPress={() => toggleStatusFilter(InterventionStatus.IN_PROGRESS)}
            style={styles.filterChip}
          >
            En cours
          </Chip>
          <Chip
            selected={selectedStatuses.includes(InterventionStatus.COMPLETED)}
            onPress={() => toggleStatusFilter(InterventionStatus.COMPLETED)}
            style={styles.filterChip}
          >
            Terminées
          </Chip>
          <Chip
            selected={selectedStatuses.includes(InterventionStatus.CANCELLED)}
            onPress={() => toggleStatusFilter(InterventionStatus.CANCELLED)}
            style={styles.filterChip}
          >
            Annulées
          </Chip>
        </View>
      </View>

      {/* Statistiques et toggle vue */}
      <View style={styles.statsContainer}>
        <Text variant="bodyMedium" style={styles.statsText}>
          {filteredInterventions.length} intervention(s)
          {selectedStatuses.length > 0 && ' filtrée(s)'}
        </Text>
        <View style={styles.viewToggle}>
          {selectedStatuses.length > 0 && (
            <Button
              mode="text"
              onPress={() => setSelectedStatuses([])}
              compact
              style={styles.clearButton}
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
            status: i.status || '',
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
  searchbar: {
    margin: 16,
    marginBottom: 8,
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
  clearButton: {
    marginVertical: -8,
  },
  viewToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
