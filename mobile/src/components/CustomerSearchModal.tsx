/**
 * Modal de recherche et sélection de client
 * Utilisé dans le formulaire de conversion de tickets
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import {
  Portal,
  Dialog,
  Text,
  Searchbar,
  List,
  ActivityIndicator,
  Button,
  Divider,
} from 'react-native-paper';
import { apiService } from '../services/api.service';
import { showToast } from '../utils/toast';

interface Customer {
  Id: string;
  Name: string;
  MainDeliveryAddress_City?: string;
  MainDeliveryAddress_ZipCode?: string;
}

interface CustomerSearchModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSelectCustomer: (customerId: string, customerName: string) => void;
  currentCustomerId?: string;
}

const CustomerSearchModal: React.FC<CustomerSearchModalProps> = ({
  visible,
  onDismiss,
  onSelectCustomer,
  currentCustomerId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * Rechercher des clients
   */
  const searchCustomers = async (query: string) => {
    if (query.trim().length < 2) {
      setCustomers([]);
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.get<Customer[]>('/api/v1/customers/search', {
        params: {
          search: query,
          limit: 50,
        },
      });
      setCustomers(response.data);
    } catch (error) {
      console.error('[CustomerSearch] Erreur recherche:', error);
      showToast('Erreur lors de la recherche', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Debounce de la recherche
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        searchCustomers(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  /**
   * Sélectionner un client
   */
  const handleSelectCustomer = (customer: Customer) => {
    onSelectCustomer(customer.Id, customer.Name);
    onDismiss();
    setSearchQuery('');
    setCustomers([]);
  };

  /**
   * Render un client
   */
  const renderCustomer = ({ item }: { item: Customer }) => {
    const isSelected = item.Id === currentCustomerId;
    const location =
      item.MainDeliveryAddress_City && item.MainDeliveryAddress_ZipCode
        ? `${item.MainDeliveryAddress_ZipCode} ${item.MainDeliveryAddress_City}`
        : item.MainDeliveryAddress_City || '';

    return (
      <>
        <TouchableOpacity onPress={() => handleSelectCustomer(item)}>
          <List.Item
            title={item.Name}
            description={location || `ID: ${item.Id}`}
            left={(props) => (
              <List.Icon {...props} icon={isSelected ? 'check-circle' : 'office-building'} />
            )}
            right={(props) =>
              isSelected ? (
                <List.Icon {...props} icon="check" color="#4caf50" />
              ) : null
            }
            style={isSelected ? styles.selectedItem : undefined}
          />
        </TouchableOpacity>
        <Divider />
      </>
    );
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title>Rechercher un client</Dialog.Title>
        <Dialog.Content>
          <Searchbar
            placeholder="Nom, ville ou code postal..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
            autoFocus
          />

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#6200ee" />
              <Text variant="bodySmall" style={styles.loadingText}>
                Recherche en cours...
              </Text>
            </View>
          )}

          {!loading && searchQuery.length < 2 && (
            <View style={styles.emptyContainer}>
              <Text variant="bodyMedium" style={styles.emptyText}>
                Tapez au moins 2 caractères pour rechercher
              </Text>
            </View>
          )}

          {!loading && searchQuery.length >= 2 && customers.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text variant="bodyMedium" style={styles.emptyText}>
                Aucun client trouvé
              </Text>
            </View>
          )}

          {!loading && customers.length > 0 && (
            <FlatList
              data={customers}
              renderItem={renderCustomer}
              keyExtractor={(item) => item.Id}
              style={styles.list}
              maxToRender={10}
            />
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Annuler</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    maxHeight: '80%',
  },
  searchbar: {
    marginBottom: 16,
  },
  list: {
    maxHeight: 400,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 12,
    color: '#666',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
  },
  selectedItem: {
    backgroundColor: '#e8f5e9',
  },
});

export default CustomerSearchModal;
