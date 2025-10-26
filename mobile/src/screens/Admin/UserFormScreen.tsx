/**
 * Formulaire de création/modification d'utilisateur
 * Accessible uniquement aux Super Admin et Admin
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  HelperText,
  SegmentedButtons,
  Switch,
  ActivityIndicator,
  Card,
} from 'react-native-paper';
import { apiService } from '../../services/api.service';
import { showToast } from '../../utils/toast';

const UserFormScreen = ({ route, navigation }: any) => {
  const { userId } = route.params || {};
  const isEdit = !!userId;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('technicien');
  const [colleagueId, setColleagueId] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  // Validation errors
  const [emailError, setEmailError] = useState('');
  const [fullNameError, setFullNameError] = useState('');

  useEffect(() => {
    if (isEdit) {
      loadUser();
    }
  }, [userId]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const userData = await apiService.getUserById(userId);

      setEmail(userData.email);
      setFullName(userData.full_name);
      setRole(userData.role);
      setColleagueId(userData.colleague_id || '');
      setIsActive(userData.is_active);
      setIsVerified(userData.is_verified);
    } catch (error: any) {
      console.error('Erreur chargement utilisateur:', error);
      showToast('Erreur lors du chargement', 'error');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;

    // Validate email
    if (!email) {
      setEmailError('Email requis');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Email invalide');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Validate full name
    if (!fullName) {
      setFullNameError('Nom complet requis');
      isValid = false;
    } else {
      setFullNameError('');
    }

    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const userData = {
        email,
        fullName,
        role,
        colleagueId: colleagueId || null,
        password: password || undefined,
        isActive,
        isVerified,
      };

      if (isEdit) {
        await apiService.updateUser(userId, userData);
        showToast('Utilisateur modifié avec succès', 'success');
      } else {
        await apiService.createUser(userData);
        showToast('Utilisateur créé avec succès', 'success');
      }

      navigation.goBack();
    } catch (error: any) {
      console.error('Erreur sauvegarde utilisateur:', error);
      const message =
        error.response?.data?.message || 'Erreur lors de la sauvegarde';
      showToast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text variant="bodyMedium" style={{ marginTop: 16 }}>
          Chargement...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>
              {isEdit ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
            </Text>

            {/* Email */}
            <TextInput
              label="Email *"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              error={!!emailError}
              style={styles.input}
            />
            {emailError ? (
              <HelperText type="error" visible={!!emailError}>
                {emailError}
              </HelperText>
            ) : null}

            {/* Full Name */}
            <TextInput
              label="Nom complet *"
              value={fullName}
              onChangeText={setFullName}
              mode="outlined"
              error={!!fullNameError}
              style={styles.input}
            />
            {fullNameError ? (
              <HelperText type="error" visible={!!fullNameError}>
                {fullNameError}
              </HelperText>
            ) : null}

            {/* Password (optional for edit, default pass123 for create) */}
            {!isEdit && (
              <>
                <TextInput
                  label="Mot de passe"
                  value={password}
                  onChangeText={setPassword}
                  mode="outlined"
                  secureTextEntry
                  placeholder="Laisser vide pour pass123 par défaut"
                  style={styles.input}
                />
                <HelperText type="info">
                  Laisser vide pour utiliser "pass123" par défaut
                </HelperText>
              </>
            )}

            {/* Role */}
            <Text variant="labelLarge" style={styles.label}>
              Rôle *
            </Text>
            <SegmentedButtons
              value={role}
              onValueChange={setRole}
              buttons={[
                {
                  value: 'super_admin',
                  label: 'Super Admin',
                  icon: 'shield-check',
                },
                {
                  value: 'admin',
                  label: 'Admin',
                  icon: 'shield',
                },
                {
                  value: 'patron',
                  label: 'Patron',
                  icon: 'briefcase',
                },
              ]}
              style={styles.segmentedButtons}
            />
            <SegmentedButtons
              value={role}
              onValueChange={setRole}
              buttons={[
                {
                  value: 'chef_chantier',
                  label: 'Chef chantier',
                  icon: 'hammer-wrench',
                },
                {
                  value: 'commercial',
                  label: 'Commercial',
                  icon: 'account-circle',
                },
                {
                  value: 'technicien',
                  label: 'Technicien',
                  icon: 'hammer',
                },
              ]}
              style={styles.segmentedButtons}
            />

            {/* Colleague ID (optional, for linking to EBP) */}
            <TextInput
              label="ID Collègue EBP (optionnel)"
              value={colleagueId}
              onChangeText={setColleagueId}
              mode="outlined"
              placeholder="Lien avec table Colleague d'EBP"
              style={styles.input}
            />
            <HelperText type="info">
              Pour lier à un collègue existant dans EBP
            </HelperText>

            {/* Is Active */}
            <View style={styles.switchRow}>
              <Text variant="bodyLarge">Actif</Text>
              <Switch value={isActive} onValueChange={setIsActive} />
            </View>

            {/* Is Verified */}
            <View style={styles.switchRow}>
              <Text variant="bodyLarge">Vérifié</Text>
              <Switch value={isVerified} onValueChange={setIsVerified} />
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <Button
                mode="outlined"
                onPress={() => navigation.goBack()}
                style={styles.button}
                disabled={saving}
              >
                Annuler
              </Button>
              <Button
                mode="contained"
                onPress={handleSave}
                loading={saving}
                disabled={saving}
                style={styles.button}
              >
                {isEdit ? 'Enregistrer' : 'Créer'}
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    elevation: 2,
  },
  title: {
    marginBottom: 24,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 8,
  },
  label: {
    marginTop: 16,
    marginBottom: 8,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  button: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

export default UserFormScreen;
