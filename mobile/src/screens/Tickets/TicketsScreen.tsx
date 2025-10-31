/**
 * Écran liste des tickets NinjaOne RMM
 * Affichage avec filtres selon le rôle utilisateur
 * - Technicien: uniquement ses tickets
 * - Admin/Patron: tous les tickets
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
  Button,
  Divider,
  ActivityIndicator,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { ticketsService, NinjaOneTicket } from '../../services/tickets.service';
import { useAuthStore } from '../../stores/authStore';
import { showToast } from '../../utils/toast';
import { hasPermission, Permission } from '../../utils/permissions';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

const TicketsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuthStore();

  const [tickets, setTickets] = useState<NinjaOneTicket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<NinjaOneTicket[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [showClosed, setShowClosed] = useState(false);

  /**
   * Vérifier si l'utilisateur peut voir tous les tickets
   */
  const canViewAllTickets = user?.role
    ? hasPermission(user.role, Permission.VIEW_ALL_TICKETS)
    : false;

  /**
   * Charger les tickets depuis l'API
   */
  const loadTickets = async () => {
    try {
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      let response;

      // Si technicien/commercial/chef de chantier: uniquement ses tickets
      if (!canViewAllTickets && user.ninjaOneTechnicianId) {
        response = await ticketsService.getTechnicianTickets(
          user.ninjaOneTechnicianId,
          {
            isClosed: showClosed ? undefined : false,
            sortBy: 'createdAt',
            sortOrder: 'DESC',
          }
        );
      } else {
        // Admin/Patron: tous les tickets
        response = await ticketsService.getTickets({
          isClosed: showClosed ? undefined : false,
          sortBy: 'createdAt',
          sortOrder: 'DESC',
          limit: 100,
        });
      }

      setTickets(response.data.map((item) => item.ticket));
    } catch (error) {
      console.error('Erreur chargement tickets:', error);
      showToast('Erreur lors du chargement des tickets', 'error');
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
      await loadTickets();
      showToast('Tickets actualisés', 'success');
    } catch (error) {
      console.error('Erreur rafraîchissement:', error);
      showToast("Erreur lors de l'actualisation", 'error');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [user, showClosed]);

  /**
   * Filtrer les tickets
   */
  useEffect(() => {
    let filtered = [...tickets];

    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title?.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query) ||
          t.ticketId?.toString().includes(query)
      );
    }

    // Filtre par priorités
    if (selectedPriorities.length > 0) {
      filtered = filtered.filter((t) => selectedPriorities.includes(t.priority));
    }

    // Tri par priorité et date
    filtered.sort((a, b) => {
      // Priorité HIGH en premier
      const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2, NONE: 3 };
      const priorityDiff =
        priorityOrder[a.priority as keyof typeof priorityOrder] -
        priorityOrder[b.priority as keyof typeof priorityOrder];
      if (priorityDiff !== 0) return priorityDiff;

      // Puis par date (plus récent en premier)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFilteredTickets(filtered);
  }, [tickets, searchQuery, selectedPriorities]);

  /**
   * Toggle filtre priorité
   */
  const togglePriorityFilter = (priority: string) => {
    if (selectedPriorities.includes(priority)) {
      setSelectedPriorities(selectedPriorities.filter((p) => p !== priority));
    } else {
      setSelectedPriorities([...selectedPriorities, priority]);
    }
  };

  /**
   * Render item
   */
  const renderItem = ({ item }: { item: NinjaOneTicket }) => (
    <TouchableOpacity
      onPress={() => {
        // TODO: Navigation vers détails ticket
        console.log('Voir ticket', item.ticketId);
      }}
    >
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.priorityIndicator,
                { backgroundColor: ticketsService.getPriorityColor(item.priority) },
              ]}
            />
            <View style={styles.cardHeaderText}>
              <Text variant="titleMedium" style={styles.cardTitle}>
                {item.title}
              </Text>
              <Text variant="bodySmall" style={styles.ticketId}>
                Ticket #{item.ticketId}
              </Text>
            </View>
            <Chip
              style={[
                styles.priorityChip,
                { backgroundColor: ticketsService.getPriorityColor(item.priority) },
              ]}
              textStyle={styles.priorityChipText}
              compact
            >
              {ticketsService.getPriorityLabel(item.priority)}
            </Chip>
          </View>

          <View style={styles.cardDetails}>
            <Text variant="bodyMedium">
              🕒 Créé le {format(new Date(item.createdAt), 'EEEE d MMMM yyyy', { locale: fr })}
            </Text>

            {item.status?.displayName && (
              <Text variant="bodySmall" style={styles.detailText}>
                📊 Statut: {item.status.displayName}
              </Text>
            )}

            {item.timeSpentSeconds > 0 && (
              <Text variant="bodySmall" style={styles.detailText}>
                ⏱️ Temps passé: {ticketsService.formatDuration(item.timeSpentSeconds)}
              </Text>
            )}

            {item.estimatedTimeSeconds && item.estimatedTimeSeconds > 0 && (
              <Text variant="bodySmall" style={styles.detailText}>
                📅 Temps estimé: {ticketsService.formatDuration(item.estimatedTimeSeconds)}
              </Text>
            )}

            {item.isOverdue && (
              <Chip
                style={styles.overdueChip}
                textStyle={styles.overdueChipText}
                compact
                icon="clock-alert"
              >
                En retard
              </Chip>
            )}
          </View>

          <View style={styles.cardFooter}>
            {item.isClosed && (
              <Chip compact style={styles.closedChip} textStyle={styles.closedChipText}>
                Fermé
              </Chip>
            )}
            {item.isResolved && !item.isClosed && (
              <Chip compact style={styles.resolvedChip} textStyle={styles.resolvedChipText}>
                Résolu
              </Chip>
            )}
            {item.hasComments && (
              <Text variant="labelSmall" style={styles.commentsText}>
                💬 {item.commentsCount}
              </Text>
            )}
            {item.hasAttachments && (
              <Text variant="labelSmall" style={styles.attachmentsText}>
                📎 {item.attachmentsCount}
              </Text>
            )}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text variant="bodyLarge" style={styles.loadingText}>
          Chargement des tickets...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Barre de recherche */}
      <Searchbar
        placeholder="Rechercher un ticket..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      {/* Filtres priorités */}
      <View style={styles.filtersContainer}>
        <Text variant="labelMedium" style={styles.filtersLabel}>
          Priorités:
        </Text>
        <View style={styles.filtersChips}>
          <Chip
            selected={selectedPriorities.includes('HIGH')}
            onPress={() => togglePriorityFilter('HIGH')}
            style={styles.filterChip}
            selectedColor="#f44336"
          >
            Haute
          </Chip>
          <Chip
            selected={selectedPriorities.includes('MEDIUM')}
            onPress={() => togglePriorityFilter('MEDIUM')}
            style={styles.filterChip}
            selectedColor="#ff9800"
          >
            Moyenne
          </Chip>
          <Chip
            selected={selectedPriorities.includes('LOW')}
            onPress={() => togglePriorityFilter('LOW')}
            style={styles.filterChip}
            selectedColor="#2196f3"
          >
            Basse
          </Chip>
          <Chip
            selected={selectedPriorities.includes('NONE')}
            onPress={() => togglePriorityFilter('NONE')}
            style={styles.filterChip}
            selectedColor="#9e9e9e"
          >
            Aucune
          </Chip>
        </View>
      </View>

      {/* Statistiques et filtres */}
      <View style={styles.statsContainer}>
        <Text variant="bodyMedium" style={styles.statsText}>
          {filteredTickets.length} ticket(s)
          {selectedPriorities.length > 0 && ' filtré(s)'}
          {!canViewAllTickets && ' (mes tickets)'}
        </Text>
        <View style={styles.controlsContainer}>
          {selectedPriorities.length > 0 && (
            <Button
              mode="text"
              onPress={() => setSelectedPriorities([])}
              compact
              style={styles.clearButton}
            >
              Réinitialiser
            </Button>
          )}
          <Button
            mode={showClosed ? 'contained' : 'outlined'}
            onPress={() => setShowClosed(!showClosed)}
            compact
            icon={showClosed ? 'check-circle' : 'check-circle-outline'}
            style={styles.closedButton}
          >
            {showClosed ? 'Tous' : 'Ouverts'}
          </Button>
        </View>
      </View>

      {/* Liste des tickets */}
      <FlatList
        data={filteredTickets}
        renderItem={renderItem}
        keyExtractor={(item) => item.ticketId.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="titleLarge" style={styles.emptyText}>
              Aucun ticket
            </Text>
            <Text variant="bodyMedium" style={styles.emptySubtext}>
              {searchQuery || selectedPriorities.length > 0
                ? 'Essayez de modifier vos filtres'
                : 'Aucun ticket à afficher'}
            </Text>
          </View>
        }
        contentContainerStyle={
          filteredTickets.length === 0 ? styles.emptyContentContainer : undefined
        }
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
  closedButton: {
    minWidth: 100,
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
  priorityIndicator: {
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
  ticketId: {
    color: '#757575',
  },
  priorityChip: {
    height: 28,
  },
  priorityChipText: {
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
  overdueChip: {
    backgroundColor: '#ffebee',
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  overdueChipText: {
    color: '#f44336',
    fontSize: 11,
    fontWeight: 'bold',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 12,
    marginLeft: 16,
    gap: 8,
  },
  closedChip: {
    backgroundColor: '#e0e0e0',
  },
  closedChipText: {
    fontSize: 11,
  },
  resolvedChip: {
    backgroundColor: '#c8e6c9',
  },
  resolvedChipText: {
    color: '#2e7d32',
    fontSize: 11,
  },
  commentsText: {
    color: '#757575',
  },
  attachmentsText: {
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
});

export default TicketsScreen;
