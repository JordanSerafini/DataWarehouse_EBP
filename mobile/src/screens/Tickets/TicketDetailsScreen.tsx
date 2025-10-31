/**
 * Écran de détail d'un ticket NinjaOne
 * Affiche toutes les informations du ticket avec ses relations
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Card,
  Chip,
  Divider,
  ActivityIndicator,
  Button,
  IconButton,
} from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { ticketsService, TicketWithRelations } from '../../services/tickets.service';
import { showToast } from '../../utils/toast';

type TicketDetailsRouteProp = RouteProp<RootStackParamList, 'TicketDetails'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TicketDetailsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<TicketDetailsRouteProp>();
  const { ticketId } = route.params;

  const [ticketData, setTicketData] = useState<TicketWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Charger les détails du ticket
   */
  const loadTicketDetails = async () => {
    try {
      const data = await ticketsService.getTicketById(ticketId);
      setTicketData(data);
    } catch (error) {
      console.error('[TicketDetails] Erreur chargement:', error);
      showToast('Erreur lors du chargement du ticket', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Rafraîchir
   */
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadTicketDetails();
      showToast('Ticket actualisé', 'success');
    } catch (error) {
      console.error('Erreur rafraîchissement:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTicketDetails();
  }, [ticketId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text variant="bodyLarge" style={styles.loadingText}>
          Chargement du ticket...
        </Text>
      </View>
    );
  }

  if (!ticketData || !ticketData.ticket) {
    return (
      <View style={styles.errorContainer}>
        <Text variant="headlineSmall" style={styles.errorText}>
          Ticket introuvable
        </Text>
        <Button mode="contained" onPress={() => navigation.goBack()} style={styles.backButton}>
          Retour
        </Button>
      </View>
    );
  }

  const ticket = ticketData.ticket;
  const organization = ticketData.organization;
  const assignedTechnician = ticketData.assignedTechnician;
  const createdByTechnician = ticketData.createdByTechnician;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      {/* En-tête avec bouton retour */}
      <View style={styles.header}>
        <IconButton icon="arrow-left" size={24} onPress={() => navigation.goBack()} />
        <Text variant="titleLarge" style={styles.headerTitle}>
          Ticket #{ticket.ticketId}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Titre et priorité */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.titleRow}>
            <Text variant="headlineSmall" style={styles.title}>
              {ticket.title}
            </Text>
            <Chip
              style={[
                styles.priorityChip,
                { backgroundColor: ticketsService.getPriorityColor(ticket.priority) },
              ]}
              textStyle={styles.priorityChipText}
            >
              {ticketsService.getPriorityLabel(ticket.priority)}
            </Chip>
          </View>

          {/* Statut */}
          {ticket.status?.displayName && (
            <View style={styles.statusRow}>
              <Text variant="labelLarge" style={styles.statusLabel}>
                Statut:
              </Text>
              <Chip compact style={styles.statusChip}>
                {ticket.status.displayName}
              </Chip>
              {ticket.isOverdue && (
                <Chip compact icon="clock-alert" style={styles.overdueChip}>
                  En retard
                </Chip>
              )}
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Description */}
      {ticket.description && (
        <Card style={styles.card}>
          <Card.Title title="Description" />
          <Card.Content>
            <Text variant="bodyMedium">{ticket.description}</Text>
          </Card.Content>
        </Card>
      )}

      {/* Informations principales */}
      <Card style={styles.card}>
        <Card.Title title="Informations" />
        <Card.Content>
          <View style={styles.infoRow}>
            <Text variant="labelLarge" style={styles.infoLabel}>
              📅 Créé le:
            </Text>
            <Text variant="bodyMedium">
              {format(new Date(ticket.createdAt), 'EEEE d MMMM yyyy à HH:mm', { locale: fr })}
            </Text>
          </View>

          {ticket.updatedAt && (
            <View style={styles.infoRow}>
              <Text variant="labelLarge" style={styles.infoLabel}>
                🔄 Mis à jour:
              </Text>
              <Text variant="bodyMedium">
                {format(new Date(ticket.updatedAt), 'EEEE d MMMM yyyy à HH:mm', { locale: fr })}
              </Text>
            </View>
          )}

          {ticket.dueDate && (
            <View style={styles.infoRow}>
              <Text variant="labelLarge" style={styles.infoLabel}>
                ⏰ Échéance:
              </Text>
              <Text variant="bodyMedium">
                {format(new Date(ticket.dueDate), 'EEEE d MMMM yyyy à HH:mm', { locale: fr })}
              </Text>
            </View>
          )}

          {ticket.source && (
            <View style={styles.infoRow}>
              <Text variant="labelLarge" style={styles.infoLabel}>
                📍 Source:
              </Text>
              <Text variant="bodyMedium">{ticket.source}</Text>
            </View>
          )}

          {ticket.category && (
            <View style={styles.infoRow}>
              <Text variant="labelLarge" style={styles.infoLabel}>
                📂 Catégorie:
              </Text>
              <Text variant="bodyMedium">{ticket.category}</Text>
            </View>
          )}

          {ticket.severity && ticket.severity !== 'NONE' && (
            <View style={styles.infoRow}>
              <Text variant="labelLarge" style={styles.infoLabel}>
                ⚠️ Gravité:
              </Text>
              <Text variant="bodyMedium">{ticket.severity}</Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Temps */}
      <Card style={styles.card}>
        <Card.Title title="Temps" />
        <Card.Content>
          {ticket.timeSpentSeconds > 0 && (
            <View style={styles.infoRow}>
              <Text variant="labelLarge" style={styles.infoLabel}>
                ⏱️ Temps passé:
              </Text>
              <Text variant="bodyMedium" style={styles.timeText}>
                {ticketsService.formatDuration(ticket.timeSpentSeconds)}
              </Text>
            </View>
          )}

          {ticket.estimatedTimeSeconds && ticket.estimatedTimeSeconds > 0 && (
            <View style={styles.infoRow}>
              <Text variant="labelLarge" style={styles.infoLabel}>
                📊 Temps estimé:
              </Text>
              <Text variant="bodyMedium">
                {ticketsService.formatDuration(ticket.estimatedTimeSeconds)}
              </Text>
            </View>
          )}

          {ticket.timeToResolutionSeconds && ticket.timeToResolutionSeconds > 0 && (
            <View style={styles.infoRow}>
              <Text variant="labelLarge" style={styles.infoLabel}>
                🎯 Temps de résolution:
              </Text>
              <Text variant="bodyMedium">
                {ticketsService.formatDuration(ticket.timeToResolutionSeconds)}
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Organisation */}
      {organization && (
        <Card style={styles.card}>
          <Card.Title title="Client" />
          <Card.Content>
            <View style={styles.infoRow}>
              <Text variant="labelLarge" style={styles.infoLabel}>
                🏢 Organisation:
              </Text>
              <Text variant="bodyMedium" style={styles.orgName}>
                {organization.organizationName}
              </Text>
            </View>
            {organization.city && (
              <View style={styles.infoRow}>
                <Text variant="labelLarge" style={styles.infoLabel}>
                  📍 Ville:
                </Text>
                <Text variant="bodyMedium">{organization.city}</Text>
              </View>
            )}
          </Card.Content>
        </Card>
      )}

      {/* Techniciens */}
      <Card style={styles.card}>
        <Card.Title title="Techniciens" />
        <Card.Content>
          {assignedTechnician ? (
            <View style={styles.infoRow}>
              <Text variant="labelLarge" style={styles.infoLabel}>
                👤 Assigné à:
              </Text>
              <Text variant="bodyMedium" style={styles.techName}>
                {assignedTechnician.firstName} {assignedTechnician.lastName}
              </Text>
            </View>
          ) : (
            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={styles.unassignedText}>
                ⚠️ Non assigné
              </Text>
            </View>
          )}

          {createdByTechnician && (
            <View style={styles.infoRow}>
              <Text variant="labelLarge" style={styles.infoLabel}>
                ✍️ Créé par:
              </Text>
              <Text variant="bodyMedium">
                {createdByTechnician.firstName} {createdByTechnician.lastName}
              </Text>
            </View>
          )}

          {ticket.requesterName && (
            <View style={styles.infoRow}>
              <Text variant="labelLarge" style={styles.infoLabel}>
                📞 Demandeur:
              </Text>
              <Text variant="bodyMedium">{ticket.requesterName}</Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Tags */}
      {ticket.tags && ticket.tags.length > 0 && (
        <Card style={styles.card}>
          <Card.Title title="Tags" />
          <Card.Content>
            <View style={styles.tagsContainer}>
              {ticket.tags.map((tag, index) => (
                <Chip key={index} style={styles.tagChip} compact>
                  {tag}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Statistiques */}
      <Card style={styles.card}>
        <Card.Title title="Statistiques" />
        <Card.Content>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text variant="labelSmall" style={styles.statLabel}>
                Commentaires
              </Text>
              <Text variant="titleMedium" style={styles.statValue}>
                {ticket.commentsCount || 0}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="labelSmall" style={styles.statLabel}>
                Pièces jointes
              </Text>
              <Text variant="titleMedium" style={styles.statValue}>
                {ticket.attachmentsCount || 0}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="labelSmall" style={styles.statLabel}>
                Activités
              </Text>
              <Text variant="titleMedium" style={styles.statValue}>
                {ticket.activityCount || 0}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.bottomSpacer} />
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
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    marginBottom: 20,
    color: '#f44336',
  },
  backButton: {
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingRight: 16,
    elevation: 2,
  },
  headerTitle: {
    flex: 1,
    fontWeight: 'bold',
  },
  card: {
    margin: 12,
    elevation: 2,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    flex: 1,
    marginRight: 12,
    fontWeight: 'bold',
  },
  priorityChip: {
    height: 32,
  },
  priorityChipText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  statusLabel: {
    marginRight: 8,
  },
  statusChip: {
    marginRight: 8,
  },
  overdueChip: {
    backgroundColor: '#ff5722',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  infoLabel: {
    marginRight: 8,
    minWidth: 140,
    color: '#666',
  },
  timeText: {
    fontWeight: 'bold',
    color: '#6200ee',
  },
  orgName: {
    fontWeight: 'bold',
    color: '#2196f3',
  },
  techName: {
    fontWeight: 'bold',
    color: '#4caf50',
  },
  unassignedText: {
    color: '#ff9800',
    fontStyle: 'italic',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontWeight: 'bold',
    color: '#6200ee',
  },
  bottomSpacer: {
    height: 20,
  },
});

export default TicketDetailsScreen;
