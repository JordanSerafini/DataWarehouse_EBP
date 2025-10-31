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
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'planned':
        return '#2196F3'; // Bleu
      case 'in_progress':
        return '#FF9800'; // Orange
      case 'completed':
        return '#4CAF50'; // Vert
      case 'cancelled':
        return '#F44336'; // Rouge
      case 'rescheduled':
        return '#9C27B0'; // Violet
      default:
        return '#9E9E9E';
    }
  };

  /**
   * Obtenir l'icône selon le type d'événement
   */
  const getEventIcon = (eventType: string): string => {
    switch (eventType) {
      case 'intervention':
        return '🔧'; // Intervention technique
      case 'maintenance':
        return '⚙️'; // Maintenance
      case 'appointment':
        return '📅'; // Rendez-vous
      case 'meeting':
        return '👥'; // Réunion
      default:
        return '📌'; // Autre
    }
  };

  /**
   * Obtenir le style de fond selon le type d'événement
   */
  const getEventBackgroundColor = (eventType: string): string => {
    switch (eventType) {
      case 'intervention':
        return '#E3F2FD'; // Bleu clair
      case 'maintenance':
        return '#FFF3E0'; // Orange clair
      case 'appointment':
        return '#F3E5F5'; // Violet clair
      case 'meeting':
        return '#E8F5E9'; // Vert clair
      default:
        return '#FAFAFA'; // Gris très clair
    }
  };

  /**
   * Obtenir le libellé du type d'événement
   */
  const getEventTypeLabel = (eventType: string): string => {
    switch (eventType) {
      case 'intervention':
        return 'Intervention';
      case 'maintenance':
        return 'Maintenance';
      case 'appointment':
        return 'Rendez-vous';
      case 'meeting':
        return 'Réunion';
      default:
        return 'Autre';
    }
  };

  /**
   * Obtenir le libellé du statut
   */
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'planned':
        return 'Planifié';
      case 'in_progress':
        return 'En cours';
      case 'completed':
        return 'Terminé';
      case 'cancelled':
        return 'Annulé';
      case 'rescheduled':
        return 'Reprogrammé';
      default:
        return status;
    }
  };

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

      {/* Liste des événements */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing || isSyncing} onRefresh={handleRefresh} />
        }
      >
        {events.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Aucun événement pour cette période
            </Text>
          </View>
        ) : (
          events.map((event) => (
            <Card
              key={event.id}
              style={[
                styles.card,
                { backgroundColor: getEventBackgroundColor(event.eventType) }
              ]}
            >
              <Card.Content>
                <View style={styles.cardHeader}>
                  <View
                    style={[
                      styles.statusIndicator,
                      { backgroundColor: getStatusColor(event.status) },
                    ]}
                  />
                  <Text variant="titleMedium" style={styles.eventIcon}>
                    {getEventIcon(event.eventType)}
                  </Text>
                  <Text variant="titleMedium" style={styles.eventTitle}>
                    {event.title}
                  </Text>
                </View>

                <View style={styles.cardDetails}>
                  <Text variant="bodyMedium">
                    🕒 {format(new Date(event.startDateTime), 'HH:mm')}
                    {event.endDateTime && ` - ${format(new Date(event.endDateTime), 'HH:mm')}`}
                  </Text>
                  {event.customerName && (
                    <Text variant="bodySmall">
                      👤 {event.customerName}
                    </Text>
                  )}
                  {event.city && (
                    <Text variant="bodySmall">
                      📍 {event.city}
                    </Text>
                  )}
                  {event.address && (
                    <Text variant="bodySmall" style={styles.address}>
                      {event.address}
                    </Text>
                  )}
                </View>

                <View style={styles.cardFooter}>
                  <Text variant="labelSmall" style={styles.statusLabel}>
                    {getStatusLabel(event.status)}
                  </Text>
                  <Text variant="labelSmall" style={[
                    styles.typeLabel,
                    { backgroundColor: getEventBackgroundColor(event.eventType) }
                  ]}>
                    {getEventTypeLabel(event.eventType)}
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
  eventIcon: {
    marginRight: 8,
    fontSize: 18,
  },
  eventTitle: {
    flex: 1,
  },
  cardDetails: {
    marginTop: 8,
    gap: 4,
  },
  address: {
    fontStyle: 'italic',
    color: '#666',
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
