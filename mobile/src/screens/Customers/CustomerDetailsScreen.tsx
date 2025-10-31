/**
 * CustomerDetailsScreen - Vue 360° Client
 *
 * Fonctionnalités :
 * - Informations complètes du client
 * - Historique des interventions
 * - Statistiques documents (devis, factures)
 * - KPIs (nombre interventions, CA total)
 * - Actions rapides (appel, email, navigation GPS)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Card,
  ActivityIndicator,
  Divider,
  Chip,
  Button,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import {
  CustomerService,
  CustomerSummary,
  CustomerHistoryItem,
  CustomerDocumentStats,
} from '../../services/customer.service';
import { showToast } from '../../utils/toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { hapticService } from '../../services/haptic.service';
import { SkeletonCustomerDetails } from '../../components/ui/SkeletonLoaders';
import CustomerHealthScore from '../../components/customer/CustomerHealthScore';
import FinancialHealthCard from '../../components/customer/FinancialHealthCard';
import AIInsightsCard from '../../components/customer/AIInsightsCard';
import { FAB } from 'react-native-paper';

type CustomerDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  'CustomerDetails'
>;

type CustomerDetailsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CustomerDetails'
>;

const CustomerDetailsScreen = () => {
  const route = useRoute<CustomerDetailsScreenRouteProp>();
  const navigation = useNavigation<CustomerDetailsScreenNavigationProp>();
  const { customerId } = route.params;

  const [summary, setSummary] = useState<CustomerSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Charger le résumé client
   */
  const loadCustomerSummary = async () => {
    try {
      setLoading(true);
      const data = await CustomerService.getCustomerSummary(customerId);
      setSummary(data);
    } catch (error: any) {
      console.error('Error loading customer summary:', error);
      showToast('Erreur lors du chargement du client', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCustomerSummary();
  }, [customerId]);

  /**
   * Pull to refresh
   */
  const handleRefresh = async () => {
    setRefreshing(true);
    // Haptic feedback moyen pour refresh
    await hapticService.medium();
    await loadCustomerSummary();
    // Haptic feedback léger à la fin du refresh
    await hapticService.light();
  };

  /**
   * Appeler le client
   */
  const handleCallCustomer = async () => {
    if (!summary?.customer.contactPhone) {
      await hapticService.error();
      return;
    }

    // Haptic feedback medium pour action importante (appel)
    await hapticService.medium();

    const phoneNumber = summary.customer.contactPhone.replace(/\s/g, '');
    Linking.openURL(`tel:${phoneNumber}`);
  };

  /**
   * Envoyer un email
   */
  const handleEmailCustomer = async () => {
    if (!summary?.customer.contactEmail) {
      await hapticService.error();
      return;
    }

    // Haptic feedback léger pour email
    await hapticService.light();

    Linking.openURL(`mailto:${summary.customer.contactEmail}`);
  };

  /**
   * Navigation GPS
   */
  const handleNavigateGPS = async () => {
    if (!summary?.customer.latitude || !summary?.customer.longitude) {
      await hapticService.error();
      return;
    }

    // Haptic feedback medium pour navigation GPS
    await hapticService.medium();

    const { latitude, longitude } = summary.customer;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

    Linking.openURL(url);
  };

  /**
   * Naviguer vers une intervention
   */
  const handleNavigateToIntervention = async (interventionId: string) => {
    // Haptic feedback léger pour navigation
    await hapticService.light();
    navigation.navigate('InterventionDetails', { interventionId });
  };

  /**
   * Formater montant en euros
   */
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  // Loading with Skeleton
  if (loading && !refreshing) {
    return <SkeletonCustomerDetails />;
  }

  // Error
  if (!summary) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={80} color="#f44336" />
        <Text variant="headlineSmall" style={styles.errorTitle}>
          Client introuvable
        </Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Retour
        </Button>
      </View>
    );
  }

  const {
    customer,
    recentInterventions,
    documentStats,
    totalInterventions,
    totalRevenue,
    customerHealthScore,
    lastInterventionDate,
    daysSinceLastIntervention,
  } = summary;

  /**
   * Naviguer vers nouvelle intervention
   */
  const handleNewIntervention = async () => {
    await hapticService.medium();
    // TODO: Navigation vers création intervention
    showToast('Fonctionnalité à venir', 'info');
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* ========================================= */}
        {/* HERO SECTION - Header enrichi            */}
        {/* ========================================= */}
        <Card style={styles.heroCard}>
          <Card.Content>
            <View style={styles.heroHeader}>
              {/* Avatar + Info */}
              <View style={styles.heroLeft}>
                <View style={styles.customerIcon}>
                  <Ionicons name="person" size={40} color="#6200ee" />
                </View>
                <View style={styles.customerInfo}>
                  <Text variant="headlineSmall" style={styles.customerName}>
                    {customer.name}
                  </Text>
                  {customer.contactName && (
                    <Text variant="bodyMedium" style={styles.contactName}>
                      <Ionicons name="person-outline" size={14} />{' '}
                      {customer.contactName}
                    </Text>
                  )}
                  {/* Badge statut */}
                  {customer.activeState !== 0 && (
                    <Chip
                      icon="alert-circle"
                      mode="flat"
                      compact
                      style={styles.inactiveChip}
                      textStyle={styles.inactiveChipText}
                    >
                      Inactif
                    </Chip>
                  )}
                </View>
              </View>

              {/* Score de santé */}
              {customerHealthScore !== undefined && (
                <View style={styles.heroRight}>
                  <CustomerHealthScore score={customerHealthScore} size={100} />
                </View>
              )}
            </View>

          <Divider style={styles.divider} />

          {/* Adresse */}
          {(customer.deliveryAddress || customer.deliveryCity) && (
            <View style={styles.infoRow}>
              <Ionicons name="location" size={20} color="#6200ee" />
              <View style={styles.infoContent}>
                <Text variant="labelMedium" style={styles.infoLabel}>
                  Adresse
                </Text>
                <Text variant="bodyMedium">
                  {customer.deliveryAddress}
                  {customer.deliveryAddress && '\n'}
                  {customer.deliveryPostalCode} {customer.deliveryCity}
                </Text>
              </View>
            </View>
          )}

          {/* Téléphone */}
          {customer.contactPhone && (
            <TouchableOpacity onPress={handleCallCustomer} style={styles.infoRow}>
              <Ionicons name="call" size={20} color="#6200ee" />
              <View style={styles.infoContent}>
                <Text variant="labelMedium" style={styles.infoLabel}>
                  Téléphone
                </Text>
                <Text variant="bodyMedium" style={styles.linkText}>
                  {customer.contactPhone}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9e9e9e" />
            </TouchableOpacity>
          )}

          {/* Email */}
          {customer.contactEmail && (
            <TouchableOpacity onPress={handleEmailCustomer} style={styles.infoRow}>
              <Ionicons name="mail" size={20} color="#6200ee" />
              <View style={styles.infoContent}>
                <Text variant="labelMedium" style={styles.infoLabel}>
                  Email
                </Text>
                <Text variant="bodyMedium" style={styles.linkText}>
                  {customer.contactEmail}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9e9e9e" />
            </TouchableOpacity>
          )}

          {/* GPS */}
          {customer.latitude && customer.longitude && (
            <View style={styles.gpsRow}>
              <Chip
                icon="navigate"
                mode="flat"
                onPress={handleNavigateGPS}
                style={styles.gpsChip}
              >
                Navigation GPS
              </Chip>
              <Text variant="bodySmall" style={styles.gpsInfo}>
                {customer.gpsProvider || 'unknown'} • Qualité:{' '}
                {((customer.gpsQuality || 0) * 100).toFixed(0)}%
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* KPIs */}
      <View style={styles.kpisContainer}>
        <Card style={styles.kpiCard}>
          <Card.Content style={styles.kpiContent}>
            <Ionicons name="construct" size={32} color="#2196f3" />
            <Text variant="headlineMedium" style={styles.kpiValue}>
              {totalInterventions}
            </Text>
            <Text variant="bodySmall" style={styles.kpiLabel}>
              Interventions
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.kpiCard}>
          <Card.Content style={styles.kpiContent}>
            <Ionicons name="cash" size={32} color="#4caf50" />
            <Text variant="headlineMedium" style={styles.kpiValue}>
              {formatCurrency(totalRevenue)}
            </Text>
            <Text variant="bodySmall" style={styles.kpiLabel}>
              CA Total
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* ========================================= */}
      {/* FINANCIAL HEALTH CARD (Admin/Bureau)     */}
      {/* ========================================= */}
      <FinancialHealthCard customer={customer} totalRevenue={totalRevenue} />

      {/* ========================================= */}
      {/* AI INSIGHTS CARD                          */}
      {/* ========================================= */}
      <AIInsightsCard
        lastInterventionDate={lastInterventionDate}
        daysSinceLastIntervention={daysSinceLastIntervention}
        totalInterventions={totalInterventions}
        customerHealthScore={customerHealthScore}
      />

      {/* Statistiques documents */}
      {documentStats.length > 0 && (
        <Card style={styles.card}>
          <Card.Title
            title="Documents"
            left={(props) => <Ionicons name="document-text" size={24} color="#6200ee" />}
          />
          <Card.Content>
            {documentStats.map((stat, index) => (
              <View key={index} style={styles.documentStatRow}>
                <View style={styles.documentStatInfo}>
                  <Text variant="labelLarge">{stat.documentTypeLabel}</Text>
                  <Text variant="bodySmall" style={styles.documentStatCount}>
                    {stat.documentCount} document{stat.documentCount > 1 ? 's' : ''}
                  </Text>
                </View>
                <Text variant="titleMedium" style={styles.documentStatAmount}>
                  {formatCurrency(stat.totalAmount)}
                </Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      {/* Historique interventions */}
      <Card style={styles.card}>
        <Card.Title
          title={`Interventions récentes (${recentInterventions.length})`}
          left={(props) => <Ionicons name="time" size={24} color="#6200ee" />}
        />
        <Card.Content>
          {recentInterventions.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Text variant="bodyMedium" style={styles.emptyText}>
                Aucune intervention enregistrée
              </Text>
            </View>
          ) : (
            recentInterventions.map((intervention) => (
              <TouchableOpacity
                key={intervention.interventionId}
                onPress={() =>
                  handleNavigateToIntervention(intervention.interventionId)
                }
                style={styles.interventionItem}
              >
                <View style={styles.interventionHeader}>
                  <Text variant="labelLarge" style={styles.interventionTitle}>
                    {intervention.title}
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#9e9e9e" />
                </View>

                {intervention.description && (
                  <Text
                    variant="bodySmall"
                    style={styles.interventionDescription}
                    numberOfLines={2}
                  >
                    {intervention.description}
                  </Text>
                )}

                <View style={styles.interventionMeta}>
                  <View style={styles.interventionMetaItem}>
                    <Ionicons name="calendar-outline" size={14} color="#757575" />
                    <Text variant="bodySmall" style={styles.interventionMetaText}>
                      {format(new Date(intervention.startDate), 'dd MMM yyyy', {
                        locale: fr,
                      })}
                    </Text>
                  </View>

                  {intervention.technicianName && (
                    <View style={styles.interventionMetaItem}>
                      <Ionicons name="person-outline" size={14} color="#757575" />
                      <Text variant="bodySmall" style={styles.interventionMetaText}>
                        {intervention.technicianName}
                      </Text>
                    </View>
                  )}
                </View>

                {intervention !== recentInterventions[recentInterventions.length - 1] && (
                  <Divider style={styles.interventionDivider} />
                )}
              </TouchableOpacity>
            ))
          )}
        </Card.Content>
      </Card>

        <View style={styles.footer} />
      </ScrollView>

      {/* ========================================= */}
      {/* FLOATING ACTION BUTTON                    */}
      {/* ========================================= */}
      <FAB
        icon="plus"
        label="Nouvelle intervention"
        style={styles.fab}
        onPress={handleNewIntervention}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // ========================================
  // HERO SECTION
  // ========================================
  heroCard: {
    margin: 12,
    marginBottom: 8,
    elevation: 3,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  heroLeft: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 12,
  },
  heroRight: {
    alignItems: 'center',
  },
  inactiveChip: {
    backgroundColor: '#ffebee',
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  inactiveChipText: {
    color: '#f44336',
    fontSize: 11,
  },
  // ========================================
  // FAB
  // ========================================
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#6200ee',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#f5f5f5',
  },
  errorTitle: {
    marginTop: 16,
    marginBottom: 24,
    color: '#f44336',
  },
  card: {
    margin: 12,
    elevation: 2,
  },
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  customerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contactName: {
    color: '#757575',
  },
  divider: {
    marginVertical: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    color: '#757575',
    marginBottom: 4,
  },
  linkText: {
    color: '#6200ee',
  },
  gpsRow: {
    alignItems: 'flex-start',
    marginTop: 8,
  },
  gpsChip: {
    backgroundColor: '#e8f5e9',
  },
  gpsInfo: {
    marginTop: 8,
    color: '#757575',
  },
  // KPIs
  kpisContainer: {
    flexDirection: 'row',
    marginHorizontal: 12,
    gap: 12,
  },
  kpiCard: {
    flex: 1,
    elevation: 2,
  },
  kpiContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  kpiValue: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  kpiLabel: {
    color: '#757575',
    marginTop: 4,
  },
  // Documents
  documentStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  documentStatInfo: {
    flex: 1,
  },
  documentStatCount: {
    color: '#757575',
    marginTop: 2,
  },
  documentStatAmount: {
    fontWeight: 'bold',
    color: '#4caf50',
  },
  // Historique
  emptyHistory: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9e9e9e',
  },
  interventionItem: {
    paddingVertical: 12,
  },
  interventionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  interventionTitle: {
    flex: 1,
    fontWeight: 'bold',
  },
  interventionDescription: {
    color: '#757575',
    marginBottom: 8,
  },
  interventionMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  interventionMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  interventionMetaText: {
    color: '#757575',
  },
  interventionDivider: {
    marginTop: 12,
  },
  footer: {
    height: 24,
  },
});

export default CustomerDetailsScreen;
