/**
 * Écran d'administration des utilisateurs
 * Accessible uniquement aux Super Admin et Admin
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Searchbar,
  Button,
  Card,
  Chip,
  IconButton,
  Menu,
  ActivityIndicator,
  FAB,
  SegmentedButtons,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../../services/api.service';
import { showToast } from '../../utils/toast';
import { useAuthStore } from '../../stores/authStore';

const AdminUsersScreen = ({ navigation }: any) => {
  const { user } = useAuthStore();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [syncing, setSyncing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Menu par utilisateur
  const [menuVisible, setMenuVisible] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    loadUsers();
  }, [page, searchQuery, statusFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUsers({
        page,
        limit: 20,
        search: searchQuery || undefined,
      });

      // Filtrer localement par statut
      let filteredData = response.data;
      if (statusFilter === 'active') {
        filteredData = response.data.filter((u: any) => u.is_active);
      } else if (statusFilter === 'inactive') {
        filteredData = response.data.filter((u: any) => !u.is_active);
      }

      setUsers(filteredData);
      setTotalPages(response.totalPages);
    } catch (error: any) {
      console.error('Erreur chargement utilisateurs:', error);
      showToast('Erreur lors du chargement', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    loadUsers();
  };

  const handleSyncColleagues = async () => {
    try {
      setSyncing(true);
      const result = await apiService.syncColleagues();
      showToast(result.details || 'Synchronisation terminée', 'success');
      loadUsers(); // Recharger la liste
    } catch (error: any) {
      console.error('Erreur sync collègues:', error);
      showToast('Erreur lors de la synchronisation', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const handleResetPassword = async (userId: string, userName: string) => {
    Alert.alert(
      'Réinitialiser le mot de passe',
      `Voulez-vous réinitialiser le mot de passe de ${userName} à "pass123" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiService.resetUserPassword(userId);
              showToast('Mot de passe réinitialisé à "pass123"', 'success');
            } catch (error) {
              showToast('Erreur lors de la réinitialisation', 'error');
            }
          },
        },
      ]
    );
  };

  const handleToggleUserStatus = async (userId: string, userName: string, currentStatus: boolean) => {
    const action = currentStatus ? 'désactiver' : 'activer';
    const actionCap = currentStatus ? 'Désactiver' : 'Activer';

    Alert.alert(
      `${actionCap} l'utilisateur`,
      `Voulez-vous vraiment ${action} ${userName} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: actionCap,
          style: currentStatus ? 'destructive' : 'default',
          onPress: async () => {
            try {
              await apiService.updateUser(userId, { isActive: !currentStatus });
              showToast(`Utilisateur ${action === 'activer' ? 'activé' : 'désactivé'}`, 'success');
              loadUsers();
            } catch (error) {
              showToast(`Erreur lors de la ${action === 'activer' ? 'activation' : 'désactivation'}`, 'error');
            }
          },
        },
      ]
    );
  };

  const getRoleLabel = (role: string): string => {
    const labels: Record<string, string> = {
      super_admin: 'Super Admin',
      admin: 'Admin',
      patron: 'Patron',
      chef_chantier: 'Chef de chantier',
      commercial: 'Commercial',
      technicien: 'Technicien',
    };
    return labels[role] || role;
  };

  const getRoleColor = (role: string): string => {
    const colors: Record<string, string> = {
      super_admin: '#e74c3c',
      admin: '#e67e22',
      patron: '#f39c12',
      chef_chantier: '#3498db',
      commercial: '#9b59b6',
      technicien: '#2ecc71',
    };
    return colors[role] || '#95a5a6';
  };

  const toggleMenu = (userId: string) => {
    setMenuVisible((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const renderUserItem = ({ item }: { item: any }) => (
    <Card style={styles.userCard} key={item.id}>
      <Card.Content style={styles.userContent}>
        <View style={styles.userHeader}>
          <View style={styles.userInfo}>
            <Text variant="titleMedium" style={styles.userName}>
              {item.full_name}
            </Text>
            <Text variant="bodySmall" style={styles.userEmail}>
              {item.email}
            </Text>
            <View style={styles.badges}>
              <Chip
                icon="shield"
                style={[styles.roleChip, { backgroundColor: getRoleColor(item.role) + '20' }]}
                textStyle={{ color: getRoleColor(item.role), fontSize: 11 }}
              >
                {getRoleLabel(item.role)}
              </Chip>
              {!item.is_active && (
                <Chip
                  icon="cancel"
                  style={styles.inactiveChip}
                  textStyle={{ fontSize: 11 }}
                >
                  Inactif
                </Chip>
              )}
              {item.colleague_id && (
                <Chip
                  icon="link"
                  style={styles.linkedChip}
                  textStyle={{ fontSize: 11 }}
                >
                  EBP
                </Chip>
              )}
            </View>
          </View>

          <Menu
            visible={menuVisible[item.id] || false}
            onDismiss={() => toggleMenu(item.id)}
            anchor={
              <IconButton
                icon="dots-vertical"
                size={24}
                onPress={() => toggleMenu(item.id)}
              />
            }
          >
            <Menu.Item
              onPress={() => {
                toggleMenu(item.id);
                navigation.navigate('UserForm', { userId: item.id });
              }}
              title="Modifier"
              leadingIcon="pencil"
            />
            <Menu.Item
              onPress={() => {
                toggleMenu(item.id);
                handleResetPassword(item.id, item.full_name);
              }}
              title="Réinitialiser mot de passe"
              leadingIcon="key-variant"
            />
            <Menu.Item
              onPress={() => {
                toggleMenu(item.id);
                handleToggleUserStatus(item.id, item.full_name, item.is_active);
              }}
              title={item.is_active ? 'Désactiver' : 'Activer'}
              leadingIcon={item.is_active ? 'cancel' : 'check-circle'}
            />
          </Menu>
        </View>

        {item.last_login_at && (
          <Text variant="bodySmall" style={styles.lastLogin}>
            Dernière connexion :{' '}
            {new Date(item.last_login_at).toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        )}
      </Card.Content>
    </Card>
  );

  if (user?.role !== 'super_admin' && user?.role !== 'admin') {
    return (
      <View style={styles.container}>
        <Card style={styles.errorCard}>
          <Card.Content>
            <Ionicons name="lock-closed" size={48} color="#e74c3c" style={{ alignSelf: 'center' }} />
            <Text variant="titleLarge" style={styles.errorTitle}>
              Accès refusé
            </Text>
            <Text variant="bodyMedium" style={styles.errorText}>
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </Text>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header avec recherche et sync */}
      <View style={styles.header}>
        <Searchbar
          placeholder="Rechercher un utilisateur..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        {/* Filtre par statut */}
        <SegmentedButtons
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as any)}
          buttons={[
            {
              value: 'all',
              label: 'Tous',
              icon: 'account-multiple',
            },
            {
              value: 'active',
              label: 'Actifs',
              icon: 'check-circle',
            },
            {
              value: 'inactive',
              label: 'Inactifs',
              icon: 'cancel',
            },
          ]}
          style={styles.statusFilter}
        />

        <Button
          mode="contained-tonal"
          icon="sync"
          onPress={handleSyncColleagues}
          loading={syncing}
          disabled={syncing}
          style={styles.syncButton}
        >
          Sync EBP
        </Button>
      </View>

      {/* Liste des utilisateurs */}
      {loading && page === 1 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
          <Text variant="bodyMedium" style={{ marginTop: 16 }}>
            Chargement des utilisateurs...
          </Text>
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={64} color="#9e9e9e" />
              <Text variant="titleMedium" style={styles.emptyText}>
                Aucun utilisateur trouvé
              </Text>
            </View>
          }
          ListFooterComponent={
            page < totalPages ? (
              <Button
                mode="outlined"
                onPress={() => setPage(page + 1)}
                loading={loading}
                style={styles.loadMoreButton}
              >
                Charger plus ({page}/{totalPages})
              </Button>
            ) : null
          }
        />
      )}

      {/* FAB pour ajouter un utilisateur */}
      <FAB
        icon="plus"
        label="Nouvel utilisateur"
        style={styles.fab}
        onPress={() => navigation.navigate('UserForm')}
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
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
    gap: 12,
  },
  searchbar: {
    elevation: 0,
    backgroundColor: '#f5f5f5',
  },
  statusFilter: {
    marginVertical: 8,
  },
  syncButton: {
    alignSelf: 'flex-start',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Space for FAB
  },
  userCard: {
    marginBottom: 12,
    elevation: 2,
  },
  userContent: {
    paddingVertical: 12,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    color: '#757575',
    marginBottom: 8,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  roleChip: {
    height: 28,
  },
  inactiveChip: {
    height: 28,
    backgroundColor: '#ffebee',
  },
  linkedChip: {
    height: 28,
    backgroundColor: '#e3f2fd',
  },
  lastLogin: {
    marginTop: 8,
    color: '#9e9e9e',
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
  emptyText: {
    marginTop: 16,
    color: '#9e9e9e',
  },
  loadMoreButton: {
    marginTop: 16,
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
  errorCard: {
    margin: 32,
    padding: 16,
  },
  errorTitle: {
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
    color: '#e74c3c',
  },
  errorText: {
    textAlign: 'center',
    color: '#757575',
  },
});

export default AdminUsersScreen;
