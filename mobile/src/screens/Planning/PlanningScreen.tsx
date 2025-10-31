/**
 * Écran Planning
 * Affiche le planning avec vues jour/semaine/mois
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Text, Card, SegmentedButtons, FAB } from 'react-native-paper';
import { format, addDays, startOfWeek, addWeeks, startOfMonth, addMonths, endOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuthStore, authSelectors } from '../../stores/authStore.v2';
import { apiService } from '../../services/api.service';
import { useSyncStore } from '../../stores/syncStore';
import { showToast } from '../../utils/toast';

type ViewMode = 'day' | 'week' | 'month';

/**
 * Type pour les événements calendrier (ScheduleEvent + Incident)
 */
interface CalendarEvent {
  id: string;
  title: string;
  startDateTime: string;
  endDateTime?: string;
  eventType: 'intervention' | 'appointment' | 'maintenance' | 'meeting' | 'other';
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';
  colleagueId?: string;
  colleagueName?: string;
  customerId?: string;
  customerName?: string;
  address?: string;
  city?: string;
  zipcode?: string;
  latitude?: number;
  longitude?: number;
}

const PlanningScreen = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const user = useAuthStore(authSelectors.user);
  const { isSyncing } = useSyncStore();

  /**
   * Charger les événements depuis l'API
   */
  const loadEvents = async () => {
    try {
      // Calculer la plage de dates pour la vue actuelle
      let startDate: Date;
      let endDate: Date;

      switch (viewMode) {
        case 'day':
          startDate = new Date(currentDate);
          startDate.setHours(0, 0, 0, 0);
          endDate = endOfDay(currentDate);
          break;

        case 'week': {
          const weekStart = startOfWeek(currentDate, { locale: fr });
          startDate = weekStart;
          endDate = addDays(weekStart, 7);
          endDate.setHours(23, 59, 59, 999);
          break;
        }

        case 'month': {
          const monthStart = startOfMonth(currentDate);
          startDate = monthStart;
          endDate = addMonths(monthStart, 1);
          endDate.setHours(23, 59, 59, 999);
          break;
        }

        default:
          startDate = new Date();
          endDate = new Date();
      }

      const results = await apiService.getAllCalendarEvents(startDate, endDate);
      setEvents(results);
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
      showToast('Erreur lors du chargement du planning', 'error');
    }
  };

  /**
   * Rafraîchir les données depuis l'API
   */
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadEvents();
      showToast('Planning actualisé', 'success');
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
      showToast('Erreur lors de l\'actualisation', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  /**
   * Charger les événements au montage et quand la vue change
   */
  useEffect(() => {
    loadEvents();
  }, [user, viewMode, currentDate]);

  /**
   * Naviguer dans le temps
   */
  const navigateDate = (direction: 'prev' | 'next') => {
    switch (viewMode) {
      case 'day':
        setCurrentDate(direction === 'prev' ? addDays(currentDate, -1) : addDays(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(direction === 'prev' ? addWeeks(currentDate, -1) : addWeeks(currentDate, 1));
        break;
      case 'month':
        setCurrentDate(direction === 'prev' ? addMonths(currentDate, -1) : addMonths(currentDate, 1));
        break;
    }
  };

  /**
   * Obtenir le titre de la période affichée
   */
  const getPeriodTitle = (): string => {
    switch (viewMode) {
      case 'day':
        return format(currentDate, 'EEEE d MMMM yyyy', { locale: fr });
      case 'week': {
        const weekStart = startOfWeek(currentDate, { locale: fr });
        const weekEnd = addDays(weekStart, 6);
        return `Semaine du ${format(weekStart, 'd MMM', { locale: fr })} au ${format(weekEnd, 'd MMM yyyy', { locale: fr })}`;
      }
      case 'month':
        return format(currentDate, 'MMMM yyyy', { locale: fr });
      default:
        return '';
    }
  };

  /**
   * Obtenir la couleur selon le statut
   */
  const getStatusColor = (status: InterventionStatus): string => {
    switch (status) {
      case InterventionStatus.SCHEDULED:
        return '#2196F3'; // Bleu
      case InterventionStatus.IN_PROGRESS:
        return '#FF9800'; // Orange
      case InterventionStatus.COMPLETED:
        return '#4CAF50'; // Vert
      case InterventionStatus.CANCELLED:
        return '#F44336'; // Rouge
      case InterventionStatus.PENDING:
        return '#9E9E9E'; // Gris
      default:
        return '#9E9E9E';
    }
  };

  const filteredInterventions = getFilteredInterventions();

  return (
    <View style={styles.container}>
      {/* Sélecteur de vue */}
      <View style={styles.header}>
        <SegmentedButtons
          value={viewMode}
          onValueChange={(value) => setViewMode(value as ViewMode)}
          buttons={[
            { value: 'day', label: 'Jour' },
            { value: 'week', label: 'Semaine' },
            { value: 'month', label: 'Mois' },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      {/* Navigation de date */}
      <View style={styles.dateNavigation}>
        <TouchableOpacity onPress={() => navigateDate('prev')} style={styles.navButton}>
          <Text style={styles.navButtonText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.periodTitle}>{getPeriodTitle()}</Text>

        <TouchableOpacity onPress={() => navigateDate('next')} style={styles.navButton}>
          <Text style={styles.navButtonText}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Liste des interventions */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing || isSyncing} onRefresh={handleRefresh} />
        }
      >
        {filteredInterventions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Aucune intervention pour cette période
            </Text>
          </View>
        ) : (
          filteredInterventions.map((intervention) => (
            <Card key={intervention.id} style={styles.card}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <View
                    style={[
                      styles.statusIndicator,
                      { backgroundColor: getStatusColor(intervention.status) },
                    ]}
                  />
                  <Text variant="titleMedium">{intervention.title}</Text>
                </View>

                <View style={styles.cardDetails}>
                  <Text variant="bodyMedium">
                    🕒 {format(new Date(intervention.scheduledDate), 'HH:mm')}
                  </Text>
                  {intervention.customerName && (
                    <Text variant="bodySmall">
                      👤 {intervention.customerName}
                    </Text>
                  )}
                  {intervention.city && (
                    <Text variant="bodySmall">
                      📍 {intervention.city}
                    </Text>
                  )}
                  {intervention.projectName && (
                    <Text variant="bodySmall" style={styles.projectName}>
                      🏗️ {intervention.projectName}
                    </Text>
                  )}
                </View>

                <View style={styles.cardFooter}>
                  <Text variant="labelSmall" style={styles.statusLabel}>
                    {intervention.statusLabel}
                  </Text>
                  <Text variant="labelSmall" style={styles.typeLabel}>
                    {intervention.typeLabel}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      {/* FAB pour créer une intervention */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {
          // TODO: Navigation vers création d'intervention
          console.log('Créer une intervention');
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
  },
  segmentedButtons: {
    marginHorizontal: 0,
  },
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  navButton: {
    padding: 8,
  },
  navButtonText: {
    fontSize: 24,
    color: '#6200ee',
  },
  periodTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    textTransform: 'capitalize',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: 8,
  },
  cardDetails: {
    marginTop: 8,
    gap: 4,
  },
  projectName: {
    fontWeight: 'bold',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  statusLabel: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  typeLabel: {
    backgroundColor: '#f3e5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#6200ee',
  },
});

export default PlanningScreen;
