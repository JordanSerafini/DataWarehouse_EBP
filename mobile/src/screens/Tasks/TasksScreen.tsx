/**
 * Écran Tâches du jour
 * Agrège les différents points d'entrée: ScheduleEvent, tickets de maintenance, etc.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Text, Card, Chip, ProgressBar } from 'react-native-paper';
import { format, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuthStore, authSelectors } from '../../stores/authStore.v2';
import { Intervention, InterventionStatus } from '../../types/intervention.types';
import { apiService } from '../../services/api.service';
import { useSyncStore } from '../../stores/syncStore';
import { showToast } from '../../utils/toast';

interface TaskGroup {
  title: string;
  count: number;
  color: string;
  tasks: Intervention[];
}

const TasksScreen = () => {
  const [tasks, setTasks] = useState<Intervention[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const user = useAuthStore(authSelectors.user);
  const { isSyncing } = useSyncStore();

  /**
   * Charger les tâches du jour depuis l'API
   */
  const loadTasks = async () => {
    try {
      const allInterventions = await apiService.getMyInterventions();

      // Filtrer uniquement les tâches du jour
      const todayTasks = allInterventions.filter((intervention) =>
        isToday(new Date(intervention.scheduledDate))
      );

      setTasks(todayTasks);
    } catch (error) {
      console.error('Erreur lors du chargement des tâches:', error);
      showToast('Erreur lors du chargement des tâches', 'error');
    }
  };

  /**
   * Rafraîchir les données depuis l'API
   */
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadTasks();
      showToast('Tâches actualisées', 'success');
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
      showToast('Erreur lors de l\'actualisation', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [user]);

  /**
   * Grouper les tâches par statut
   */
  const groupTasksByStatus = (): TaskGroup[] => {
    const groups: TaskGroup[] = [
      {
        title: 'À faire',
        count: 0,
        color: '#2196F3',
        tasks: tasks.filter((t) => t.status === InterventionStatus.SCHEDULED),
      },
      {
        title: 'En cours',
        count: 0,
        color: '#FF9800',
        tasks: tasks.filter((t) => t.status === InterventionStatus.IN_PROGRESS),
      },
      {
        title: 'Terminées',
        count: 0,
        color: '#4CAF50',
        tasks: tasks.filter((t) => t.status === InterventionStatus.COMPLETED),
      },
    ];

    groups.forEach((group) => {
      group.count = group.tasks.length;
    });

    return groups;
  };

  /**
   * Calculer la progression du jour
   */
  const getDayProgress = (): number => {
    if (tasks.length === 0) return 0;

    const completed = tasks.filter(
      (t) => t.status === InterventionStatus.COMPLETED
    ).length;

    return completed / tasks.length;
  };

  const taskGroups = groupTasksByStatus();
  const dayProgress = getDayProgress();

  return (
    <View style={styles.container}>
      {/* En-tête avec statistiques */}
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.headerTitle}>
          {format(new Date(), 'EEEE d MMMM', { locale: fr })}
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text variant="headlineLarge" style={styles.statNumber}>
              {tasks.length}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Tâches totales
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text variant="headlineLarge" style={styles.statNumber}>
              {taskGroups[2].count}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Terminées
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text variant="headlineLarge" style={styles.statNumber}>
              {Math.round(dayProgress * 100)}%
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Progression
            </Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <Text variant="labelSmall" style={styles.progressLabel}>
            Progression du jour
          </Text>
          <ProgressBar progress={dayProgress} color="#6200ee" style={styles.progressBar} />
        </View>
      </View>

      {/* Liste des tâches groupées */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing || isSyncing} onRefresh={handleRefresh} />
        }
      >
        {taskGroups.map((group) => (
          <View key={group.title} style={styles.groupContainer}>
            <View style={styles.groupHeader}>
              <Text variant="titleLarge" style={styles.groupTitle}>
                {group.title}
              </Text>
              <Chip
                style={[styles.groupChip, { backgroundColor: group.color }]}
                textStyle={styles.groupChipText}
              >
                {group.count}
              </Chip>
            </View>

            {group.tasks.length === 0 ? (
              <Card style={styles.emptyCard}>
                <Card.Content>
                  <Text style={styles.emptyText}>
                    Aucune tâche dans cette catégorie
                  </Text>
                </Card.Content>
              </Card>
            ) : (
              group.tasks.map((task) => (
                <TouchableOpacity
                  key={task.id}
                  onPress={() => {
                    // TODO: Navigation vers détails
                    console.log('Ouvrir tâche:', task.id);
                  }}
                >
                  <Card style={styles.taskCard}>
                    <Card.Content>
                      <View style={styles.taskHeader}>
                        <Text variant="titleMedium" style={styles.taskTitle}>
                          {task.title}
                        </Text>
                        <Text variant="labelMedium" style={styles.taskTime}>
                          {format(new Date(task.scheduledDate), 'HH:mm')}
                        </Text>
                      </View>

                      {task.customerName && (
                        <Text variant="bodyMedium" style={styles.taskCustomer}>
                          👤 {task.customerName}
                        </Text>
                      )}

                      {task.address && (
                        <Text variant="bodySmall" style={styles.taskAddress}>
                          📍 {task.address}, {task.city}
                        </Text>
                      )}

                      {task.projectName && (
                        <Text variant="bodySmall" style={styles.taskProject}>
                          🏗️ {task.projectName}
                        </Text>
                      )}

                      {task.description && (
                        <Text
                          variant="bodySmall"
                          style={styles.taskDescription}
                          numberOfLines={2}
                        >
                          {task.description}
                        </Text>
                      )}

                      <View style={styles.taskFooter}>
                        <Chip
                          compact
                          style={styles.typeChip}
                          textStyle={styles.typeChipText}
                        >
                          {task.typeLabel}
                        </Chip>
                        {task.estimatedDuration && (
                          <Text variant="labelSmall" style={styles.duration}>
                            ⏱️ {task.estimatedDuration} min
                          </Text>
                        )}
                      </View>
                    </Card.Content>
                  </Card>
                </TouchableOpacity>
              ))
            )}
          </View>
        ))}

        {tasks.length === 0 && (
          <View style={styles.emptyState}>
            <Text variant="headlineSmall" style={styles.emptyStateTitle}>
              🎉 Aucune tâche aujourd'hui
            </Text>
            <Text variant="bodyMedium" style={styles.emptyStateText}>
              Profitez de votre journée !
            </Text>
          </View>
        )}
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
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: 'bold',
    color: '#6200ee',
  },
  statLabel: {
    color: '#757575',
    marginTop: 4,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressLabel: {
    marginBottom: 8,
    color: '#757575',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  scrollView: {
    flex: 1,
  },
  groupContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  groupTitle: {
    fontWeight: 'bold',
  },
  groupChip: {
    height: 28,
  },
  groupChipText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  taskCard: {
    marginHorizontal: 16,
    marginVertical: 6,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    flex: 1,
    fontWeight: 'bold',
  },
  taskTime: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
  taskCustomer: {
    marginTop: 4,
  },
  taskAddress: {
    marginTop: 4,
    color: '#757575',
  },
  taskProject: {
    marginTop: 4,
    fontWeight: 'bold',
  },
  taskDescription: {
    marginTop: 8,
    color: '#757575',
    fontStyle: 'italic',
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
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
  emptyCard: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9E9E9E',
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyStateTitle: {
    marginBottom: 8,
  },
  emptyStateText: {
    color: '#757575',
  },
});

export default TasksScreen;
