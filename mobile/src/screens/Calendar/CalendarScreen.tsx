/**
 * CalendarScreen - Écran Calendrier
 * Affiche les événements du technicien dans un calendrier mensuel
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, Card, Chip, FAB, Portal, Modal, Button, ActivityIndicator } from 'react-native-paper';
import { Calendar, DateData } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { database } from '../../config/database';
import CalendarEvent from '../../models/CalendarEvent';
import { Q } from '@nozbe/watermelondb';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import logger from '../../utils/logger';
import toast from '../../utils/toast';

// Types d'événements avec couleurs
const EVENT_TYPE_COLORS: Record<string, string> = {
  intervention: '#e74c3c',
  appointment: '#3498db',
  maintenance: '#f39c12',
  meeting: '#9b59b6',
  other: '#95a5a6',
};

const EVENT_TYPE_LABELS: Record<string, string> = {
  intervention: 'Intervention',
  appointment: 'Rendez-vous',
  maintenance: 'Maintenance',
  meeting: 'Réunion',
  other: 'Autre',
};

const EVENT_STATUS_LABELS: Record<string, string> = {
  planned: 'Planifié',
  in_progress: 'En cours',
  completed: 'Terminé',
  cancelled: 'Annulé',
  rescheduled: 'Reprogrammé',
};

export default function CalendarScreen() {
  const navigation = useNavigation();

  // État
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [markedDates, setMarkedDates] = useState<any>({});
  const [dayEvents, setDayEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  /**
   * Charge les événements du mois
   */
  const loadMonthEvents = useCallback(async (date: Date) => {
    try {
      setLoading(true);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);

      const calendarEvents = await database
        .get<CalendarEvent>('calendar_events')
        .query(
          Q.where('start_datetime', Q.gte(monthStart.getTime())),
          Q.where('start_datetime', Q.lte(monthEnd.getTime())),
          Q.sortBy('start_datetime', Q.asc)
        )
        .fetch();

      setEvents(calendarEvents);

      // Créer les marques pour le calendrier
      const marks: any = {};
      calendarEvents.forEach((event) => {
        const dateKey = format(event.startDateTime, 'yyyy-MM-dd');
        if (!marks[dateKey]) {
          marks[dateKey] = { marked: true, dots: [] };
        }
        marks[dateKey].dots.push({
          key: event.id,
          color: EVENT_TYPE_COLORS[event.eventType] || EVENT_TYPE_COLORS.other,
        });
      });

      // Marquer le jour sélectionné
      marks[selectedDate] = {
        ...marks[selectedDate],
        selected: true,
        selectedColor: '#2196F3',
      };

      setMarkedDates(marks);
      logger.info('CALENDAR', `Chargé ${calendarEvents.length} événements pour ${format(date, 'MMMM yyyy', { locale: fr })}`);
    } catch (error) {
      logger.error('CALENDAR', 'Erreur chargement événements mois', error);
      toast.error('Erreur lors du chargement des événements');
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  /**
   * Charge les événements d'un jour spécifique
   */
  const loadDayEvents = useCallback(async (dateString: string) => {
    try {
      const date = new Date(dateString);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));

      const calendarEvents = await database
        .get<CalendarEvent>('calendar_events')
        .query(
          Q.where('start_datetime', Q.gte(dayStart.getTime())),
          Q.where('start_datetime', Q.lte(dayEnd.getTime())),
          Q.sortBy('start_datetime', Q.asc)
        )
        .fetch();

      setDayEvents(calendarEvents);
      logger.info('CALENDAR', `Chargé ${calendarEvents.length} événements pour ${dateString}`);
    } catch (error) {
      logger.error('CALENDAR', 'Erreur chargement événements jour', error);
    }
  }, []);

  /**
   * Rafraîchir les données
   */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadMonthEvents(currentMonth);
    await loadDayEvents(selectedDate);
    setRefreshing(false);
  }, [currentMonth, selectedDate, loadMonthEvents, loadDayEvents]);

  /**
   * Changement de jour
   */
  const onDayPress = useCallback((day: DateData) => {
    setSelectedDate(day.dateString);
    loadDayEvents(day.dateString);
  }, [loadDayEvents]);

  /**
   * Changement de mois
   */
  const onMonthChange = useCallback((month: DateData) => {
    const newMonth = new Date(month.year, month.month - 1, 1);
    setCurrentMonth(newMonth);
    loadMonthEvents(newMonth);
  }, [loadMonthEvents]);

  /**
   * Ouvrir détails événement
   */
  const openEventDetails = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setModalVisible(true);
  }, []);

  /**
   * Fermer modal
   */
  const closeModal = useCallback(() => {
    setModalVisible(false);
    setSelectedEvent(null);
  }, []);

  // Chargement initial
  useEffect(() => {
    loadMonthEvents(currentMonth);
    loadDayEvents(selectedDate);
  }, []);

  /**
   * Render item événement
   */
  const renderEventItem = ({ item }: { item: CalendarEvent }) => {
    const startTime = format(item.startDateTime, 'HH:mm');
    const endTime = item.endDateTime ? format(item.endDateTime, 'HH:mm') : '';

    return (
      <TouchableOpacity onPress={() => openEventDetails(item)}>
        <Card style={styles.eventCard}>
          <Card.Content>
            <View style={styles.eventHeader}>
              <View style={styles.eventTimeContainer}>
                <Text style={styles.eventTime}>{startTime}</Text>
                {endTime && <Text style={styles.eventTime}>- {endTime}</Text>}
              </View>
              <Chip
                mode="outlined"
                style={[
                  styles.eventTypeChip,
                  { borderColor: EVENT_TYPE_COLORS[item.eventType] || EVENT_TYPE_COLORS.other },
                ]}
                textStyle={{ color: EVENT_TYPE_COLORS[item.eventType] || EVENT_TYPE_COLORS.other }}
              >
                {EVENT_TYPE_LABELS[item.eventType] || 'Autre'}
              </Chip>
            </View>

            <Text style={styles.eventTitle}>{item.title}</Text>

            {item.customerName && (
              <Text style={styles.eventCustomer}>Client: {item.customerName}</Text>
            )}

            {item.address && (
              <Text style={styles.eventAddress} numberOfLines={1}>
                📍 {item.address}
              </Text>
            )}

            <Chip
              mode="flat"
              style={styles.eventStatusChip}
              textStyle={styles.eventStatusText}
            >
              {EVENT_STATUS_LABELS[item.status] || item.status}
            </Chip>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Calendrier */}
      <Calendar
        current={format(currentMonth, 'yyyy-MM-dd')}
        onDayPress={onDayPress}
        onMonthChange={onMonthChange}
        markedDates={markedDates}
        markingType="multi-dot"
        theme={{
          todayTextColor: '#2196F3',
          selectedDayBackgroundColor: '#2196F3',
          selectedDayTextColor: '#ffffff',
          arrowColor: '#2196F3',
          monthTextColor: '#212121',
          textMonthFontWeight: 'bold',
          textMonthFontSize: 18,
        }}
        firstDay={1} // Lundi comme premier jour
      />

      {/* Liste événements du jour */}
      <View style={styles.dayEventsContainer}>
        <Text style={styles.dayEventsTitle}>
          {format(new Date(selectedDate), 'EEEE d MMMM yyyy', { locale: fr })}
        </Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2196F3" />
          </View>
        ) : dayEvents.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun événement ce jour</Text>
          </View>
        ) : (
          <FlatList
            data={dayEvents}
            renderItem={renderEventItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.eventsList}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </View>

      {/* Modal détails événement */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={closeModal}
          contentContainerStyle={styles.modalContainer}
        >
          {selectedEvent && (
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedEvent.title}</Text>

              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Type:</Text>
                <Chip
                  mode="outlined"
                  style={[
                    styles.modalChip,
                    { borderColor: EVENT_TYPE_COLORS[selectedEvent.eventType] },
                  ]}
                >
                  {EVENT_TYPE_LABELS[selectedEvent.eventType]}
                </Chip>
              </View>

              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Statut:</Text>
                <Text style={styles.modalValue}>
                  {EVENT_STATUS_LABELS[selectedEvent.status]}
                </Text>
              </View>

              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Début:</Text>
                <Text style={styles.modalValue}>
                  {format(selectedEvent.startDateTime, 'dd/MM/yyyy HH:mm')}
                </Text>
              </View>

              {selectedEvent.endDateTime && (
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Fin:</Text>
                  <Text style={styles.modalValue}>
                    {format(selectedEvent.endDateTime, 'dd/MM/yyyy HH:mm')}
                  </Text>
                </View>
              )}

              {selectedEvent.customerName && (
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Client:</Text>
                  <Text style={styles.modalValue}>{selectedEvent.customerName}</Text>
                </View>
              )}

              {selectedEvent.address && (
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Adresse:</Text>
                  <Text style={styles.modalValue}>{selectedEvent.address}</Text>
                </View>
              )}

              {selectedEvent.description && (
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Description:</Text>
                  <Text style={styles.modalValue}>{selectedEvent.description}</Text>
                </View>
              )}

              <Button mode="contained" onPress={closeModal} style={styles.modalButton}>
                Fermer
              </Button>
            </View>
          )}
        </Modal>
      </Portal>

      {/* FAB pour synchroniser */}
      <FAB
        icon="sync"
        style={styles.fab}
        onPress={onRefresh}
        label="Sync"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  dayEventsContainer: {
    flex: 1,
    paddingTop: 16,
  },
  dayEventsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingBottom: 8,
    color: '#212121',
    textTransform: 'capitalize',
  },
  eventsList: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  eventCard: {
    marginBottom: 12,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2196F3',
    marginRight: 4,
  },
  eventTypeChip: {
    height: 28,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#212121',
  },
  eventCustomer: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  eventAddress: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  eventStatusChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#e3f2fd',
  },
  eventStatusText: {
    fontSize: 12,
    color: '#2196F3',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#2196F3',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalContent: {
    gap: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#212121',
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    width: 100,
  },
  modalValue: {
    fontSize: 14,
    color: '#212121',
    flex: 1,
  },
  modalChip: {
    height: 28,
  },
  modalButton: {
    marginTop: 16,
  },
});
