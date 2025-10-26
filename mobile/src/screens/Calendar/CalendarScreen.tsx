/**
 * CalendarScreen
 *
 * Écran de calendrier avec 3 vues : Mois, Semaine, Jour
 * Affiche les interventions planifiées avec navigation entre les vues
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  Text,
  Card,
  Chip,
  FAB,
  SegmentedButtons,
  Portal,
  Modal,
  Button,
  IconButton,
} from 'react-native-paper';
import { format, startOfWeek, addDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  CalendarService,
  CalendarEvent,
  getStatusLabel,
  getStatusColor,
} from '../../services/calendar.service.v2';
import { showToast } from '../../utils/toast';

const { width } = Dimensions.get('window');

type ViewMode = 'month' | 'week' | 'day';

export default function CalendarScreen({ navigation }: any) {
  // État
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Charger les événements selon la vue
  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      let fetchedEvents: CalendarEvent[] = [];

      if (viewMode === 'day') {
        // Aujourd'hui
        fetchedEvents = await CalendarService.getTodayEvents();
      } else if (viewMode === 'week') {
        // Semaine en cours
        fetchedEvents = await CalendarService.getWeekEvents();
      } else {
        // Mois en cours
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth() + 1;
        fetchedEvents = await CalendarService.getMonthEvents(year, month);
      }

      setEvents(fetchedEvents);
    } catch (error: any) {
      console.error('Error loading events:', error);
      showToast('Erreur lors du chargement des événements', 'error');
    } finally {
      setLoading(false);
    }
  }, [viewMode, selectedDate]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  // Changer de vue
  const handleViewModeChange = (newMode: string) => {
    setViewMode(newMode as ViewMode);
  };

  // Navigation mois/semaine/jour
  const goToPrevious = () => {
    if (viewMode === 'month') {
      setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
    } else if (viewMode === 'week') {
      setSelectedDate(addDays(selectedDate, -7));
    } else {
      setSelectedDate(addDays(selectedDate, -1));
    }
  };

  const goToNext = () => {
    if (viewMode === 'month') {
      setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
    } else if (viewMode === 'week') {
      setSelectedDate(addDays(selectedDate, 7));
    } else {
      setSelectedDate(addDays(selectedDate, 1));
    }
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  // Ouvrir détails événement
  const openEventDetails = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  // Obtenir la couleur selon le statut
  const getStatusColor = (status: number) => {
    switch (status) {
      case 0: return '#2196F3'; // SCHEDULED - Bleu
      case 1: return '#FF9800'; // IN_PROGRESS - Orange
      case 2: return '#4CAF50'; // COMPLETED - Vert
      case 3: return '#F44336'; // CANCELLED - Rouge
      case 4: return '#FFC107'; // PENDING - Jaune
      default: return '#9E9E9E';
    }
  };

  // Rendu d'un événement
  const renderEvent = (event: CalendarEvent, compact = false) => (
    <TouchableOpacity
      key={event.id}
      onPress={() => openEventDetails(event)}
      style={styles.eventCard}
    >
      <View style={[styles.eventIndicator, { backgroundColor: getStatusColor(event.status) }]} />
      <View style={styles.eventContent}>
        <Text variant="titleSmall" numberOfLines={1}>{event.title}</Text>
        {!compact && (
          <>
            <Text variant="bodySmall" style={styles.eventTime}>
              {format(new Date(event.scheduledDate), 'HH:mm', { locale: fr })}
              {event.scheduledEndDate && ` - ${format(new Date(event.scheduledEndDate), 'HH:mm', { locale: fr })}`}
            </Text>
            {event.customerName && (
              <Text variant="bodySmall" numberOfLines={1}>👤 {event.customerName}</Text>
            )}
          </>
        )}
      </View>
      <Chip compact style={[styles.statusChip, { backgroundColor: getStatusColor(event.status) }]}>
        {event.statusLabel}
      </Chip>
    </TouchableOpacity>
  );

  // VUE MENSUELLE
  const renderMonthView = () => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const eventsByDate = CalendarService.groupEventsByDate(events);

    return (
      <View>
        {/* Grille calendrier */}
        <View style={styles.monthGrid}>
          {/* En-têtes jours de la semaine */}
          <View style={styles.weekDaysRow}>
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => (
              <Text key={index} style={styles.weekDayText}>{day}</Text>
            ))}
          </View>

          {/* Jours du mois */}
          <View style={styles.daysGrid}>
            {daysInMonth.map((day) => {
              const dateKey = format(day, 'yyyy-MM-dd');
              const dayEvents = eventsByDate[dateKey] || [];
              const isToday = isSameDay(day, new Date());
              const isSelected = isSameDay(day, selectedDate);

              return (
                <TouchableOpacity
                  key={dateKey}
                  style={[
                    styles.dayCell,
                    isToday && styles.todayCell,
                    isSelected && styles.selectedCell,
                  ]}
                  onPress={() => {
                    setSelectedDate(day);
                    setViewMode('day');
                  }}
                >
                  <Text style={[styles.dayNumber, isToday && styles.todayNumber]}>
                    {format(day, 'd')}
                  </Text>
                  {dayEvents.length > 0 && (
                    <View style={styles.eventDots}>
                      {dayEvents.slice(0, 3).map((event, idx) => (
                        <View
                          key={idx}
                          style={[styles.eventDot, { backgroundColor: getStatusColor(event.status) }]}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <Text style={styles.moreDots}>+{dayEvents.length - 3}</Text>
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Liste événements du jour sélectionné */}
        <View style={styles.eventsSection}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
          </Text>
          {events
            .filter(event => isSameDay(new Date(event.scheduledDate), selectedDate))
            .map(event => renderEvent(event))}
          {events.filter(event => isSameDay(new Date(event.scheduledDate), selectedDate)).length === 0 && (
            <Text style={styles.noEvents}>Aucun événement ce jour</Text>
          )}
        </View>
      </View>
    );
  };

  // VUE HEBDOMADAIRE
  const renderWeekView = () => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const eventsByDate = CalendarService.groupEventsByDate(events);

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weekScroll}>
        {weekDays.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayEvents = eventsByDate[dateKey] || [];
          const isToday = isSameDay(day, new Date());

          return (
            <View key={dateKey} style={styles.weekDayColumn}>
              <View style={[styles.weekDayHeader, isToday && styles.todayHeader]}>
                <Text variant="labelSmall">{format(day, 'EEE', { locale: fr })}</Text>
                <Text variant="titleMedium" style={isToday && styles.todayNumber}>
                  {format(day, 'd')}
                </Text>
              </View>
              <ScrollView style={styles.weekDayEvents}>
                {dayEvents.map(event => renderEvent(event, true))}
                {dayEvents.length === 0 && (
                  <Text style={styles.noEventsCompact}>-</Text>
                )}
              </ScrollView>
            </View>
          );
        })}
      </ScrollView>
    );
  };

  // VUE QUOTIDIENNE
  const renderDayView = () => {
    const dayEvents = events.filter(event =>
      isSameDay(new Date(event.scheduledDate), selectedDate)
    ).sort((a, b) =>
      new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
    );

    return (
      <View style={styles.dayView}>
        <Text variant="titleLarge" style={styles.dayViewTitle}>
          {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
        </Text>
        {dayEvents.length > 0 ? (
          dayEvents.map(event => renderEvent(event))
        ) : (
          <View style={styles.noEventsContainer}>
            <Text style={styles.noEvents}>Aucun événement aujourd'hui</Text>
          </View>
        )}
      </View>
    );
  };

  // Modal détails événement
  const renderEventModal = () => (
    <Portal>
      <Modal
        visible={showEventModal}
        onDismiss={() => setShowEventModal(false)}
        contentContainerStyle={styles.modal}
      >
        {selectedEvent && (
          <View>
            <Text variant="titleLarge" style={styles.modalTitle}>
              {selectedEvent.title}
            </Text>
            <Chip style={[styles.modalChip, { backgroundColor: getStatusColor(selectedEvent.status) }]}>
              {selectedEvent.statusLabel}
            </Chip>

            {selectedEvent.description && (
              <Text variant="bodyMedium" style={styles.modalSection}>
                {selectedEvent.description}
              </Text>
            )}

            <View style={styles.modalInfo}>
              <Text variant="labelSmall">📅 Date</Text>
              <Text variant="bodyMedium">
                {format(new Date(selectedEvent.scheduledDate), 'PPPp', { locale: fr })}
              </Text>
            </View>

            {selectedEvent.customerName && (
              <View style={styles.modalInfo}>
                <Text variant="labelSmall">👤 Client</Text>
                <Text variant="bodyMedium">{selectedEvent.customerName}</Text>
              </View>
            )}

            {selectedEvent.address && (
              <View style={styles.modalInfo}>
                <Text variant="labelSmall">📍 Adresse</Text>
                <Text variant="bodyMedium">{selectedEvent.address}</Text>
              </View>
            )}

            <View style={styles.modalActions}>
              <Button mode="outlined" onPress={() => setShowEventModal(false)}>
                Fermer
              </Button>
              <Button
                mode="contained"
                onPress={() => {
                  setShowEventModal(false);
                  navigation.navigate('InterventionDetails', { interventionId: selectedEvent.id });
                }}
              >
                Voir détails
              </Button>
            </View>
          </View>
        )}
      </Modal>
    </Portal>
  );

  return (
    <View style={styles.container}>
      {/* Header avec navigation */}
      <View style={styles.header}>
        <IconButton icon="chevron-left" onPress={goToPrevious} />
        <TouchableOpacity onPress={goToToday}>
          <Text variant="titleLarge">
            {viewMode === 'month' && format(selectedDate, 'MMMM yyyy', { locale: fr })}
            {viewMode === 'week' && `Semaine du ${format(startOfWeek(selectedDate, { weekStartsOn: 1 }), 'd MMM', { locale: fr })}`}
            {viewMode === 'day' && format(selectedDate, 'd MMMM yyyy', { locale: fr })}
          </Text>
        </TouchableOpacity>
        <IconButton icon="chevron-right" onPress={goToNext} />
      </View>

      {/* Sélecteur de vue */}
      <SegmentedButtons
        value={viewMode}
        onValueChange={handleViewModeChange}
        buttons={[
          { value: 'month', label: 'Mois', icon: 'calendar-month' },
          { value: 'week', label: 'Semaine', icon: 'calendar-week' },
          { value: 'day', label: 'Jour', icon: 'calendar-today' },
        ]}
        style={styles.segmentedButtons}
      />

      {/* Contenu selon la vue */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'day' && renderDayView()}
      </ScrollView>

      {/* Modal */}
      {renderEventModal()}

      {/* FAB Aujourd'hui */}
      <FAB
        icon="calendar-today"
        style={styles.fab}
        onPress={goToToday}
        label="Aujourd'hui"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#FFF',
    elevation: 2,
  },
  segmentedButtons: {
    margin: 16,
  },
  content: {
    flex: 1,
  },

  // Vue mensuelle
  monthGrid: {
    backgroundColor: '#FFF',
    padding: 8,
    margin: 16,
    borderRadius: 12,
    elevation: 2,
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  weekDayText: {
    width: (width - 64) / 7,
    textAlign: 'center',
    fontWeight: '600',
    color: '#666',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: (width - 64) / 7,
    aspectRatio: 1,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  todayCell: {
    backgroundColor: '#E3F2FD',
  },
  selectedCell: {
    backgroundColor: '#BBDEFB',
  },
  dayNumber: {
    fontSize: 14,
    marginBottom: 2,
  },
  todayNumber: {
    fontWeight: 'bold',
    color: '#1976D2',
  },
  eventDots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    marginTop: 2,
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  moreDots: {
    fontSize: 8,
    color: '#666',
  },

  // Vue hebdomadaire
  weekScroll: {
    padding: 8,
  },
  weekDayColumn: {
    width: width * 0.25,
    marginRight: 8,
    backgroundColor: '#FFF',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  weekDayHeader: {
    padding: 8,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  todayHeader: {
    backgroundColor: '#E3F2FD',
  },
  weekDayEvents: {
    maxHeight: 400,
  },
  noEventsCompact: {
    textAlign: 'center',
    padding: 8,
    color: '#999',
  },

  // Vue quotidienne
  dayView: {
    padding: 16,
  },
  dayViewTitle: {
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  noEventsContainer: {
    padding: 32,
    alignItems: 'center',
  },
  noEvents: {
    color: '#999',
    fontStyle: 'italic',
  },

  // Événements
  eventsSection: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 12,
    textTransform: 'capitalize',
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 1,
  },
  eventIndicator: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
  },
  eventTime: {
    color: '#666',
    marginTop: 2,
  },
  statusChip: {
    marginLeft: 8,
  },

  // Modal
  modal: {
    backgroundColor: '#FFF',
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    marginBottom: 8,
  },
  modalChip: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  modalSection: {
    marginBottom: 16,
  },
  modalInfo: {
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },

  // FAB
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
