/**
 * CustomersScreen - Recherche et liste des clients
 *
 * Fonctionnalités :
 * - Recherche texte avec debouncing
 * - Filtres (ville, code postal)
 * - Pagination infinie
 * - Pull-to-refresh
 * - Navigation vers détails client
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput as RNTextInput,
} from 'react-native';
import {
  Text,
  Searchbar,
  Card,
  Chip,
  ActivityIndicator,
  Button,
  Portal,
  Modal,
  TextInput,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { CustomerService, Customer } from '../../services/customer.service';
import { showToast } from '../../utils/toast';
import { SkeletonCustomerList } from '../../components/ui/SkeletonLoaders';
import { AnimatedCard, AnimatedFadeIn } from '../../components/ui/AnimatedComponents';

type CustomersScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CustomerDetails'
>;

const CustomersScreen = () => {
  const navigation = useNavigation<CustomersScreenNavigationProp>();

  // État de recherche
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [postalCodeFilter, setPostalCodeFilter] = useState('');

  // État des données
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  // Modal filtres
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [tempCity, setTempCity] = useState('');
  const [tempPostalCode, setTempPostalCode] = useState('');

  const LIMIT = 50;

  /**
   * Charger les clients
   */
  const loadCustomers = useCallback(
    async (reset: boolean = false) => {
      if (loading) return;

      try {
        setLoading(true);
        const currentOffset = reset ? 0 : offset;

        const results = await CustomerService.searchCustomers({
          query: searchQuery || undefined,
          city: cityFilter || undefined,
          postalCode: postalCodeFilter || undefined,
          limit: LIMIT,
          offset: currentOffset,
        });

        if (reset) {
          setCustomers(results);
          setOffset(LIMIT);
        } else {
          setCustomers((prev) => [...prev, ...results]);
          setOffset((prev) => prev + LIMIT);
        }

        setHasMore(results.length === LIMIT);
      } catch (error: any) {
        console.error('Error loading customers:', error);
        showToast('Erreur lors du chargement des clients', 'error');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [searchQuery, cityFilter, postalCodeFilter, offset, loading]
  );

  /**
   * Debounce de recherche
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      loadCustomers(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, cityFilter, postalCodeFilter]);

  /**
   * Pull to refresh
   */
  const handleRefresh = () => {
    setRefreshing(true);
    setOffset(0);
    loadCustomers(true);
  };

  /**
   * Chargement page suivante
   */
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadCustomers(false);
    }
  };

  /**
   * Appliquer les filtres
   */
  const handleApplyFilters = () => {
    setCityFilter(tempCity);
    setPostalCodeFilter(tempPostalCode);
    setFiltersVisible(false);
  };

  /**
   * Réinitialiser les filtres
   */
  const handleClearFilters = () => {
    setTempCity('');
    setTempPostalCode('');
    setCityFilter('');
    setPostalCodeFilter('');
    setFiltersVisible(false);
  };

  /**
   * Ouvrir les filtres
   */
  const handleOpenFilters = () => {
    setTempCity(cityFilter);
    setTempPostalCode(postalCodeFilter);
    setFiltersVisible(true);
  };

  /**
   * Naviguer vers les détails
   */
  const handleNavigateToDetails = (customerId: string) => {
    navigation.navigate('CustomerDetails', { customerId });
  };

  /**
   * Indicateur de chargement bas de liste
   */
  const renderFooter = () => {
    if (!loading || refreshing) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#6200ee" />
        <Text variant="bodySmall" style={styles.footerText}>
          Chargement...
        </Text>
      </View>
    );
  };

  /**
   * État vide
   */
  const renderEmpty = () => {
    if (loading && !refreshing) {
      return <SkeletonCustomerList count={8} />;
    }

    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="people-outline" size={80} color="#bdbdbd" />
        <Text variant="headlineSmall" style={styles.emptyTitle}>
          Aucun client trouvé
        </Text>
        <Text variant="bodyMedium" style={styles.emptyText}>
          {searchQuery || cityFilter || postalCodeFilter
            ? 'Essayez de modifier vos filtres'
            : 'Commencez une recherche'}
        </Text>
      </View>
    );
  };

  /**
   * Item de liste client
   */
  const renderCustomerItem = ({ item }: { item: Customer }) => (
    <View style={styles.customerCard}>
      <AnimatedCard
        onPress={() => handleNavigateToDetails(item.customerId)}
        style={styles.card}
      >
        <Card.Content style={styles.cardContent}>
          <View style={styles.customerHeader}>
            <View style={styles.customerIcon}>
              <Ionicons name="person" size={24} color="#6200ee" />
            </View>
            <View style={styles.customerInfo}>
              <Text variant="titleMedium" style={styles.customerName}>
                {item.name}
              </Text>
              {item.contactName && (
                <Text variant="bodySmall" style={styles.contactName}>
                  <Ionicons name="person-outline" size={12} /> {item.contactName}
                </Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9e9e9e" />
          </View>

          {/* Adresse */}
          {(item.deliveryAddress || item.deliveryCity) && (
            <View style={styles.addressRow}>
              <Ionicons name="location-outline" size={14} color="#757575" />
              <Text variant="bodySmall" style={styles.addressText}>
                {item.deliveryAddress}
                {item.deliveryAddress && item.deliveryCity && ', '}
                {item.deliveryPostalCode} {item.deliveryCity}
              </Text>
            </View>
          )}

          {/* Contact */}
          <View style={styles.contactRow}>
            {item.contactPhone && (
              <View style={styles.contactChip}>
                <Ionicons name="call-outline" size={12} color="#6200ee" />
                <Text variant="bodySmall" style={styles.contactChipText}>
                  {item.contactPhone}
                </Text>
              </View>
            )}
            {item.contactEmail && (
              <View style={styles.contactChip}>
                <Ionicons name="mail-outline" size={12} color="#6200ee" />
                <Text
                  variant="bodySmall"
                  style={styles.contactChipText}
                  numberOfLines={1}
                >
                  {item.contactEmail}
                </Text>
              </View>
            )}
          </View>

          {/* GPS Badge */}
          {item.latitude && item.longitude && (
            <View style={styles.gpsBadge}>
              <Ionicons name="navigate" size={12} color="#4caf50" />
              <Text variant="bodySmall" style={styles.gpsBadgeText}>
                GPS disponible
              </Text>
            </View>
          )}
        </Card.Content>
      </AnimatedCard>
    </View>
  );

  // Compteur de filtres actifs
  const activeFiltersCount =
    (cityFilter ? 1 : 0) + (postalCodeFilter ? 1 : 0);

  return (
    <View style={styles.container}>
      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Rechercher un client..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          iconColor="#6200ee"
        />
        <TouchableOpacity
          onPress={handleOpenFilters}
          style={styles.filterButton}
        >
          <Ionicons
            name="filter"
            size={24}
            color={activeFiltersCount > 0 ? '#6200ee' : '#757575'}
          />
          {activeFiltersCount > 0 && (
            <View style={styles.filterBadge}>
              <Text variant="labelSmall" style={styles.filterBadgeText}>
                {activeFiltersCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Chips filtres actifs */}
      {(cityFilter || postalCodeFilter) && (
        <View style={styles.activeFilters}>
          {cityFilter && (
            <Chip
              icon="map-marker"
              onClose={() => setCityFilter('')}
              style={styles.filterChip}
            >
              Ville: {cityFilter}
            </Chip>
          )}
          {postalCodeFilter && (
            <Chip
              icon="mailbox"
              onClose={() => setPostalCodeFilter('')}
              style={styles.filterChip}
            >
              CP: {postalCodeFilter}
            </Chip>
          )}
        </View>
      )}

      {/* Liste clients */}
      <FlatList
        data={customers}
        renderItem={renderCustomerItem}
        keyExtractor={(item) => item.customerId}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
      />

      {/* Modal filtres */}
      <Portal>
        <Modal
          visible={filtersVisible}
          onDismiss={() => setFiltersVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Card>
            <Card.Title
              title="Filtres"
              left={(props) => <Ionicons name="filter" size={24} color="#6200ee" />}
            />
            <Card.Content>
              <TextInput
                label="Ville"
                value={tempCity}
                onChangeText={setTempCity}
                mode="outlined"
                style={styles.filterInput}
                left={<TextInput.Icon icon="map-marker" />}
              />

              <TextInput
                label="Code postal"
                value={tempPostalCode}
                onChangeText={setTempPostalCode}
                mode="outlined"
                keyboardType="numeric"
                style={styles.filterInput}
                left={<TextInput.Icon icon="mailbox" />}
              />

              <View style={styles.modalActions}>
                <Button
                  mode="outlined"
                  onPress={handleClearFilters}
                  style={styles.modalButton}
                >
                  Réinitialiser
                </Button>
                <Button
                  mode="contained"
                  onPress={handleApplyFilters}
                  style={styles.modalButton}
                >
                  Appliquer
                </Button>
              </View>
            </Card.Content>
          </Card>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchbar: {
    flex: 1,
    elevation: 0,
    backgroundColor: '#f5f5f5',
  },
  filterButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 24,
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#6200ee',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  activeFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterChip: {
    backgroundColor: '#e3f2fd',
  },
  listContent: {
    flexGrow: 1,
  },
  customerCard: {
    marginHorizontal: 12,
    marginVertical: 6,
  },
  cardContent: {
    paddingVertical: 12,
  },
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  customerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  contactName: {
    color: '#757575',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    gap: 6,
  },
  addressText: {
    color: '#757575',
    flex: 1,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  contactChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    maxWidth: '48%',
  },
  contactChipText: {
    color: '#6200ee',
    flex: 1,
  },
  gpsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    gap: 4,
  },
  gpsBadgeText: {
    color: '#4caf50',
    fontSize: 11,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    marginTop: 8,
    color: '#757575',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    color: '#424242',
  },
  emptyText: {
    color: '#757575',
    textAlign: 'center',
  },
  // Modal filtres
  modalContainer: {
    margin: 20,
  },
  filterInput: {
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
});

export default CustomersScreen;
