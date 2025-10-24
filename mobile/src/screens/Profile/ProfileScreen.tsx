import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Button, Avatar, ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../stores/authStore';
import { useSyncStore } from '../../stores/syncStore';
import { showToast } from '../../utils/toast';
import { apiService } from '../../services/api.service';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ProfileScreen = () => {
  const { user, logout, login } = useAuthStore();
  const { lastSyncDate } = useSyncStore();
  const [switching, setSwitching] = useState(false);
  const [usersList, setUsersList] = useState<Array<{ email: string; full_name: string; role: string }>>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  /**
   * Charger la liste des utilisateurs au montage
   */
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const users = await apiService.getUsersList();
      setUsersList(users);
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
      setUsersList([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  /**
   * Récupérer icône et couleur selon le rôle
   */
  const getRoleConfig = (role: string): { icon: string; color: string } => {
    const configs: Record<string, { icon: string; color: string }> = {
      super_admin: { icon: 'shield-checkmark', color: '#e74c3c' },
      admin: { icon: 'shield', color: '#e67e22' },
      patron: { icon: 'briefcase', color: '#f39c12' },
      chef_chantier: { icon: 'construct', color: '#3498db' },
      commercial: { icon: 'person-circle', color: '#9b59b6' },
      technicien: { icon: 'hammer', color: '#2ecc71' },
    };

    return configs[role] || { icon: 'person', color: '#95a5a6' };
  };

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Déconnexion réussie', 'success');
    } catch (error) {
      console.error('Logout error:', error);
      showToast('Erreur lors de la déconnexion', 'error');
    }
  };

  /**
   * Changement rapide d'utilisateur
   */
  const quickSwitch = async (userEmail: string) => {
    // Ne pas recharger si c'est déjà l'utilisateur actuel
    if (user?.email === userEmail) {
      showToast('Vous êtes déjà connecté avec ce compte', 'info');
      return;
    }

    setSwitching(true);

    try {
      // Déconnexion puis reconnexion
      await logout();
      await login(userEmail, 'pass123');
      showToast('Changement de compte réussi', 'success');
    } catch (error: any) {
      console.error('Quick switch error:', error);

      if (error.response?.status === 401) {
        showToast('Erreur d\'authentification', 'error');
      } else {
        showToast('Erreur lors du changement de compte', 'error');
      }
    } finally {
      setSwitching(false);
    }
  };

  // Obtenir les initiales pour l'avatar
  const getInitials = () => {
    if (!user?.fullName) return '??';
    const names = user.fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return user.fullName.substring(0, 2).toUpperCase();
  };

  return (
    <ScrollView style={styles.container}>
      {/* En-tête profil */}
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Text
            size={80}
            label={getInitials()}
            style={styles.avatar}
          />
          <Text variant="headlineMedium" style={styles.userName}>
            {user?.fullName}
          </Text>
          <Text variant="bodyMedium" style={styles.userEmail}>
            {user?.email}
          </Text>
          <Text variant="labelMedium" style={styles.userRole}>
            {user?.role}
          </Text>
        </Card.Content>
      </Card>

      {/* Informations */}
      <Card style={styles.infoCard}>
        <Card.Title title="Informations" />
        <Card.Content>
          <View style={styles.infoRow}>
            <Text variant="labelMedium">Email:</Text>
            <Text variant="bodyMedium">{user?.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text variant="labelMedium">Rôle:</Text>
            <Text variant="bodyMedium">{user?.role}</Text>
          </View>
          {user?.colleagueId && (
            <View style={styles.infoRow}>
              <Text variant="labelMedium">ID Collègue:</Text>
              <Text variant="bodyMedium">{user.colleagueId}</Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Text variant="labelMedium">Statut:</Text>
            <Text variant="bodyMedium">
              {user?.isActive !== false ? '✅ Actif' : '❌ Inactif'}
            </Text>
          </View>
          {user?.lastLoginAt && (
            <View style={styles.infoRow}>
              <Text variant="labelMedium">Dernière connexion:</Text>
              <Text variant="bodyMedium">
                {format(new Date(user.lastLoginAt), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Synchronisation */}
      <Card style={styles.infoCard}>
        <Card.Title title="Synchronisation" />
        <Card.Content>
          {lastSyncDate ? (
            <View style={styles.infoRow}>
              <Text variant="labelMedium">Dernière sync:</Text>
              <Text variant="bodyMedium">
                {format(new Date(lastSyncDate), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
              </Text>
            </View>
          ) : (
            <Text variant="bodyMedium">Aucune synchronisation effectuée</Text>
          )}
        </Card.Content>
      </Card>

      {/* Changement rapide d'utilisateur */}
      <View style={styles.switchSection}>
        <Text variant="titleSmall" style={styles.switchTitle}>
          🔄 Changement rapide
        </Text>
        <Text variant="labelSmall" style={styles.switchSubtitle}>
          Cliquez pour changer de compte
        </Text>

        {loadingUsers ? (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#6200ee" />
            <Text variant="bodyMedium" style={styles.loadingText}>
              Chargement des utilisateurs...
            </Text>
          </View>
        ) : (
          <View style={styles.usersList}>
            {usersList.map((dbUser) => {
              const roleConfig = getRoleConfig(dbUser.role);
              return (
                <TouchableOpacity
                  key={dbUser.email}
                  onPress={() => quickSwitch(dbUser.email)}
                  style={[
                    styles.userCard,
                    user?.email === dbUser.email && styles.userCardActive,
                  ]}
                  disabled={switching}
                >
                  <View style={[styles.userIcon, { backgroundColor: roleConfig.color }]}>
                    <Ionicons name={roleConfig.icon as any} size={24} color="#fff" />
                  </View>
                  <View style={styles.userInfo}>
                    <Text variant="labelMedium" style={styles.userCardName}>
                      {dbUser.full_name}
                    </Text>
                    <Text variant="bodySmall" style={styles.userCardEmail}>
                      {dbUser.email}
                    </Text>
                  </View>
                  {user?.email === dbUser.email ? (
                    <Ionicons name="checkmark-circle" size={24} color="#4caf50" />
                  ) : (
                    <Ionicons name="chevron-forward" size={20} color="#9e9e9e" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {switching && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#6200ee" />
            <Text variant="bodyMedium" style={styles.loadingText}>
              Changement en cours...
            </Text>
          </View>
        )}

        <Text variant="labelSmall" style={styles.switchHint}>
          💡 Mot de passe : pass123 (tous les comptes)
        </Text>
      </View>

      {/* Actions */}
      <Card style={styles.actionsCard}>
        <Card.Content>
          <Button
            mode="contained"
            onPress={handleLogout}
            icon="logout"
            style={styles.logoutButton}
            disabled={switching}
          >
            Se déconnecter
          </Button>
        </Card.Content>
      </Card>

      <View style={styles.footer}>
        <Text variant="bodySmall" style={styles.footerText}>
          Version 1.0.0
        </Text>
        <Text variant="bodySmall" style={styles.footerText}>
          © 2025 EBP Mobile
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileCard: {
    margin: 16,
    elevation: 2,
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    backgroundColor: '#6200ee',
    marginBottom: 12,
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    color: '#757575',
    marginBottom: 8,
  },
  userRole: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    overflow: 'hidden',
  },
  infoCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  switchSection: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff3e0',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ff9800',
  },
  switchTitle: {
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: 'bold',
    color: '#e65100',
  },
  switchSubtitle: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#ef6c00',
  },
  usersList: {
    gap: 8,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userCardActive: {
    borderColor: '#4caf50',
    borderWidth: 2,
    backgroundColor: '#f1f8e9',
  },
  userIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userCardName: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  userCardEmail: {
    color: '#757575',
  },
  loadingOverlay: {
    marginTop: 16,
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
  },
  loadingText: {
    marginTop: 8,
    color: '#6200ee',
  },
  switchHint: {
    textAlign: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ffe0b2',
    color: '#e65100',
  },
  actionsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  logoutButton: {
    backgroundColor: '#d32f2f',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    color: '#9E9E9E',
    marginVertical: 2,
  },
});

export default ProfileScreen;
