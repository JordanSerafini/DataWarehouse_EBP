/**
 * CalendarScreen - Écran Calendrier
 * Affiche les événements du technicien dans un calendrier mensuel
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, Card, Chip, FAB, Portal, Modal, Button, ActivityIndicator } from 'react-native-paper';
import { Calendar, DateData } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { format, startOfMonth, endOfMonth, isAfter, isBefore, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import logger from '../../utils/logger';
import { showToast } from '../../utils/toast';
import { apiService } from '../../services/api.service';
import { Intervention } from '../../types/intervention.types';

// Couleurs pour les statuts d'interventions
const STATUS_COLORS: Record<number, string> = {
  0: '#95a5a6', // Pending
  1: '#3498db', // Scheduled
  2: '#f39c12', // In Progress
  3: '#27ae60', // Completed
  4: '#e74c3c', // Cancelled
};

export default function CalendarScreen() {
  const navigation = useNavigation();

  // État
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [markedDates, setMarkedDates] = useState<any>({});
  const [dayInterventions, setDayInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  /**
   * Charge les interventions du mois depuis l'API
   */
  const loadMonthEvents = useCallback(async (date: Date) => {
    try {
      setLoading(true);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);

      // Récupérer toutes les interventions
      const allInterventions = await apiService.getMyInterventions();

      // Filtrer pour le mois
      const monthInterventions = allInterventions.filter((intervention) => {
        const interventionDate = new Date(intervention.scheduledDate);
        return !isBefore(interventionDate, monthStart) && !isAfter(interventionDate, monthEnd);
      });

      setInterventions(monthInterventions);

      // Créer les marques pour le calendrier
      const marks: any = {};
      monthInterventions.forEach((intervention) => {
        const dateKey = format(new Date(intervention.scheduledDate), 'yyyy-MM-dd');
        if (!marks[dateKey]) {
          marks[dateKey] = { marked: true, dots: [] };
        }
        marks[dateKey].dots.push({
          key: intervention.id,
          color: STATUS_COLORS[intervention.status] || '#95a5a6',
        });
      });

      // Marquer le jour sélectionné
      marks[selectedDate] = {
        ...marks[selectedDate],
        selected: true,
        selectedColor: '#2196F3',
      };

      setMarkedDates(marks);
      logger.info('CALENDAR', `Chargé ${monthInterventions.length} interventions pour ${format(date, 'MMMM yyyy', { locale: fr })}`);
    } catch (error) {
      logger.error('CALENDAR', 'Erreur chargement interventions mois', error);
      showToast('Erreur lors du chargement du calendrier', 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  /**
   * Charge les interventions d'un jour spécifique
   */
  const loadDayEvents = useCallback(async (dateString: string) => {
    try {
      const selectedDay = new Date(dateString);

      // Filtrer les interventions du jour sélectionné
      const dayInterventionsList = interventions.filter((intervention) => {
        const interventionDate = new Date(intervention.scheduledDate);
        return isSameDay(interventionDate, selectedDay);
      });

      // Trier par heure
      dayInterventionsList.sort((a, b) =>
        new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
      );

      setDayInterventions(dayInterventionsList);
      logger.info('CALENDAR', `Chargé ${dayInterventionsList.length} interventions pour ${dateString}`);
    } catch (error) {
      logger.error('CALENDAR', 'Erreur chargement interventions jour', error);
    }
  }, [interventions]);

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
   * Ouvrir détails intervention
   */
  const openEventDetails = useCallback((intervention: Intervention) => {
    setSelectedIntervention(intervention);
    setModalVisible(true);
  }, []);

  /**
   * Fermer modal
   */
  const closeModal = useCallback(() => {
    setModalVisible(false);
    setSelectedIntervention(null);
  }, []);

  // Chargement initial
  useEffect(() => {
    loadMonthEvents(currentMonth);
    loadDayEvents(selectedDate);
  }, []);

  /**
   * Render item intervention
   */
  const renderEventItem = ({ item }: { item: Intervention }) => {
    const startTime = format(new Date(item.scheduledDate), 'HH:mm');
    const endTime = item.scheduledEndDate ? format(new Date(item.scheduledEndDate), 'HH:mm') : '';

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
                  { borderColor: STATUS_COLORS[item.status] || '#95a5a6' },
                ]}
                textStyle={{ color: STATUS_COLORS[item.status] || '#95a5a6' }}
              >
                {item.typeLabel}
              </Chip>
            </View>

            <Text style={styles.eventTitle}>{item.title}</Text>

            {item.customerName && (
              <Text style={styles.eventCustomer}>Client: {item.customerName}</Text>
            )}

            {item.city && (
              <Text style={styles.eventAddress} numberOfLines={1}>
                📍 {item.city}
              </Text>
            )}

            <Chip
              mode="flat"
              style={styles.eventStatusChip}
              textStyle={styles.eventStatusText}
            >
              {item.statusLabel}
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
        ) : dayInterventions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune intervention ce jour</Text>
          </View>
        ) : (
          <FlatList
            data={dayInterventions}
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
          {selectedIntervention && (
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedIntervention.title}</Text>

              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Type:</Text>
                <Chip
                  mode="outlined"
                  style={[
                    styles.modalChip,
                    { borderColor: STATUS_COLORS[selectedIntervention.status] },
                  ]}
                >
                  {selectedIntervention.typeLabel}
                </Chip>
              </View>

              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Statut:</Text>
                <Text style={styles.modalValue}>
                  {selectedIntervention.statusLabel}
                </Text>
              </View>

              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Début:</Text>
                <Text style={styles.modalValue}>
                  {format(new Date(selectedIntervention.scheduledDate), 'dd/MM/yyyy HH:mm')}
                </Text>
              </View>

              {selectedIntervention.scheduledEndDate && (
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Fin:</Text>
                  <Text style={styles.modalValue}>
                    {format(new Date(selectedIntervention.scheduledEndDate), 'dd/MM/yyyy HH:mm')}
                  </Text>
                </View>
              )}

              {selectedIntervention.customerName && (
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Client:</Text>
                  <Text style={styles.modalValue}>{selectedIntervention.customerName}</Text>
                </View>
              )}

              {selectedIntervention.city && (
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Ville:</Text>
                  <Text style={styles.modalValue}>{selectedIntervention.city}</Text>
                </View>
              )}

              {selectedIntervention.description && (
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Description:</Text>
                  <Text style={styles.modalValue}>{selectedIntervention.description}</Text>
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
