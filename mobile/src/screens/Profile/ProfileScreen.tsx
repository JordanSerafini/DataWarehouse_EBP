import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Button, Avatar, ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../stores/authStore';
import { useSyncStore } from '../../stores/syncStore';
import { showToast } from '../../utils/toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ProfileScreen = () => {
  const { user, logout } = useAuthStore();
  const { lastSyncDate } = useSyncStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ScrollView style={styles.container}>
      {/* En-tête profil */}
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Text
            size={80}
            label={user ? `${user.firstName[0]}${user.lastName[0]}` : '??'}
            style={styles.avatar}
          />
          <Text variant="headlineMedium" style={styles.userName}>
            {user?.firstName} {user?.lastName}
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
            <Text variant="labelMedium">Nom d'utilisateur:</Text>
            <Text variant="bodyMedium">{user?.username}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text variant="labelMedium">Statut:</Text>
            <Text variant="bodyMedium">
              {user?.isActive ? '✅ Actif' : '❌ Inactif'}
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

      {/* Actions */}
      <Card style={styles.actionsCard}>
        <Card.Content>
          <Button
            mode="contained"
            onPress={handleLogout}
            icon="logout"
            style={styles.logoutButton}
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
