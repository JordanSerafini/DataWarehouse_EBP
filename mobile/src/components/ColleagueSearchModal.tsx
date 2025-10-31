/**
 * Modal de recherche et sélection de technicien (collègue)
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
  Chip,
} from 'react-native-paper';
import { apiService } from '../services/api.service';
import { showToast } from '../utils/toast';

interface Colleague {
  Id: string;
  Contact_Name: string;
  Contact_FirstName?: string;
  Contact_Email?: string;
}

interface ColleagueSearchModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSelectColleague: (colleagueId: string, colleagueName: string) => void;
  currentColleagueId?: string;
}

const ColleagueSearchModal: React.FC<ColleagueSearchModalProps> = ({
  visible,
  onDismiss,
  onSelectColleague,
  currentColleagueId,
}) => {
  const [colleagues, setColleagues] = useState<Colleague[]>([]);
  const [filteredColleagues, setFilteredColleagues] = useState<Colleague[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Charger tous les collègues au montage
   */
  useEffect(() => {
    if (visible) {
      loadColleagues();
    }
  }, [visible]);

  /**
   * Charger la liste des collègues depuis la BD
   */
  const loadColleagues = async () => {
    try {
      setLoading(true);
      // On va chercher directement dans la base via un endpoint SQL
      const response = await apiService.get<Colleague[]>('/api/v1/ninjaone/colleagues');
      setColleagues(response.data);
      setFilteredColleagues(response.data);
    } catch (error) {
      console.error('[ColleagueSearch] Erreur chargement:', error);
      showToast('Erreur lors du chargement des techniciens', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filtrer les collègues localement
   */
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setFilteredColleagues(colleagues);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = colleagues.filter((colleague) => {
        const fullName = `${colleague.Contact_Name} ${colleague.Contact_FirstName || ''}`.toLowerCase();
        const email = colleague.Contact_Email?.toLowerCase() || '';
        return fullName.includes(query) || email.includes(query) || colleague.Id.toLowerCase().includes(query);
      });
      setFilteredColleagues(filtered);
    }
  }, [searchQuery, colleagues]);

  /**
   * Sélectionner un collègue
   */
  const handleSelectColleague = (colleague: Colleague) => {
    const fullName = colleague.Contact_FirstName
      ? `${colleague.Contact_FirstName} ${colleague.Contact_Name}`
      : colleague.Contact_Name;
    onSelectColleague(colleague.Id, fullName);
    onDismiss();
    setSearchQuery('');
  };

  /**
   * Supprimer la sélection (optionnel)
   */
  const handleClearSelection = () => {
    onSelectColleague('', '');
    onDismiss();
    setSearchQuery('');
  };

  /**
   * Render un collègue
   */
  const renderColleague = ({ item }: { item: Colleague }) => {
    const isSelected = item.Id === currentColleagueId;
    const fullName = item.Contact_FirstName
      ? `${item.Contact_FirstName} ${item.Contact_Name}`
      : item.Contact_Name;

    return (
      <>
        <TouchableOpacity onPress={() => handleSelectColleague(item)}>
          <List.Item
            title={fullName}
            description={item.Contact_Email || `ID: ${item.Id}`}
            left={(props) => (
              <List.Icon {...props} icon={isSelected ? 'check-circle' : 'account-hard-hat'} />
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
        <Dialog.Title>Sélectionner un technicien</Dialog.Title>
        <Dialog.Content>
          <Searchbar
            placeholder="Nom, prénom ou email..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
            autoFocus
          />

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#6200ee" />
              <Text variant="bodySmall" style={styles.loadingText}>
                Chargement...
              </Text>
            </View>
          )}

          {!loading && colleagues.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text variant="bodyMedium" style={styles.emptyText}>
                Aucun technicien disponible
              </Text>
            </View>
          )}

          {!loading && filteredColleagues.length === 0 && colleagues.length > 0 && (
            <View style={styles.emptyContainer}>
              <Text variant="bodyMedium" style={styles.emptyText}>
                Aucun technicien trouvé pour "{searchQuery}"
              </Text>
            </View>
          )}

          {!loading && filteredColleagues.length > 0 && (
            <>
              <View style={styles.countContainer}>
                <Chip icon="account-group" compact>
                  {filteredColleagues.length} technicien(s)
                </Chip>
              </View>
              <FlatList
                data={filteredColleagues}
                renderItem={renderColleague}
                keyExtractor={(item) => item.Id}
                style={styles.list}
              />
            </>
          )}
        </Dialog.Content>
        <Dialog.Actions style={styles.actions}>
          {currentColleagueId && (
            <Button onPress={handleClearSelection} textColor="#ff5722">
              Aucun technicien
            </Button>
          )}
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
  countContainer: {
    flexDirection: 'row',
    marginBottom: 8,
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
  actions: {
    justifyContent: 'space-between',
  },
});

export default ColleagueSearchModal;
