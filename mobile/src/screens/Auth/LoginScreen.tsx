/**
 * Écran de connexion
 * Authentification par email/mot de passe
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  HelperText,
  Card,
  ActivityIndicator,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore, authSelectors } from '../../stores/authStore.v2';
import { showToast } from '../../utils/toast';
import { apiService } from '../../services/api.service';
import { BiometricService } from '../../services/biometric.service';
import { BiometricPrompt } from '../../components/BiometricPrompt';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [usersList, setUsersList] = useState<Array<{ email: string; full_name: string; role: string }>>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Biométrie
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState({ email: '', password: '' });

  const { login, loginWithBiometric, checkBiometricCapabilities } = useAuthStore();
  const canUseBiometric = useAuthStore(authSelectors.canUseBiometric);
  const biometricEnabled = useAuthStore(authSelectors.biometricEnabled);
  const biometricCapabilities = useAuthStore(authSelectors.biometricCapabilities);

  /**
   * Récupérer la liste des utilisateurs depuis l'API
   * et vérifier les capacités biométriques
   */
  useEffect(() => {
    loadUsers();
    checkBiometricCapabilities();
  }, []);

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const users = await apiService.getUsersList();
      setUsersList(users);
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
      // Fallback sur liste vide en cas d'erreur réseau
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
      super_admin: { icon: 'shield-checkmark-outline', color: '#e74c3c' },
      admin: { icon: 'shield-outline', color: '#e67e22' },
      patron: { icon: 'briefcase-outline', color: '#f39c12' },
      chef_chantier: { icon: 'construct-outline', color: '#3498db' },
      commercial: { icon: 'person-circle-outline', color: '#9b59b6' },
      technicien: { icon: 'hammer-outline', color: '#2ecc71' },
    };

    return configs[role] || { icon: 'person-outline', color: '#95a5a6' };
  };

  /**
   * Valider l'email
   */
  const validateEmail = (text: string): boolean => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!text) {
      setEmailError('Email requis');
      return false;
    }

    if (!emailRegex.test(text)) {
      setEmailError('Email invalide');
      return false;
    }

    setEmailError('');
    return true;
  };

  /**
   * Valider le mot de passe
   */
  const validatePassword = (text: string): boolean => {
    setPassword(text);

    if (!text) {
      setPasswordError('Mot de passe requis');
      return false;
    }

    if (text.length < 3) {
      setPasswordError('Minimum 3 caractères');
      return false;
    }

    setPasswordError('');
    return true;
  };

  /**
   * Gérer la connexion
   */
  const handleLogin = async () => {
    // Validation
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      showToast('Connexion réussie', 'success');

      // Proposer d'activer la biométrie si disponible et pas déjà activée
      if (canUseBiometric && !biometricEnabled) {
        setLoginCredentials({ email, password });
        setShowBiometricPrompt(true);
      }
    } catch (error: any) {
      console.error('Login error:', error);

      if (error.response?.status === 401) {
        showToast('Email ou mot de passe incorrect', 'error');
      } else if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        showToast('Erreur réseau - Vérifiez votre connexion', 'error');
      } else {
        showToast('Erreur de connexion', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Connexion avec biométrie
   */
  const handleBiometricLogin = async () => {
    setLoading(true);

    try {
      await loginWithBiometric();
      showToast('Connexion biométrique réussie', 'success');
    } catch (error: any) {
      console.error('Biometric login error:', error);
      showToast(error.message || 'Erreur de connexion biométrique', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Connexion rapide avec un utilisateur de test
   */
  const quickLogin = async (userEmail: string) => {
    setEmail(userEmail);
    setPassword('pass123');
    setEmailError('');
    setPasswordError('');
    setLoading(true);

    try {
      await login(userEmail, 'pass123');
      showToast('Connexion réussie', 'success');
    } catch (error: any) {
      console.error('Quick login error:', error);

      if (error.response?.status === 401) {
        showToast('Erreur d\'authentification', 'error');
      } else {
        showToast('Erreur de connexion', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Logo/Titre */}
          <View style={styles.header}>
            <Text variant="displaySmall" style={styles.title}>
              EBP Mobile
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Connectez-vous pour continuer
            </Text>
          </View>

          {/* Bouton biométrie (si activée) */}
          {biometricEnabled && canUseBiometric && (
            <TouchableOpacity
              style={styles.biometricButton}
              onPress={handleBiometricLogin}
              disabled={loading}
            >
              <View style={styles.biometricIcon}>
                <Ionicons name="finger-print" size={32} color="#6200ee" />
              </View>
              <Text variant="labelLarge" style={styles.biometricText}>
                Connexion {BiometricService.getBiometricTypeName(
                  biometricCapabilities?.supportedTypes[0] || 'NONE'
                )}
              </Text>
            </TouchableOpacity>
          )}

          {/* Séparateur (si biométrie active) */}
          {biometricEnabled && canUseBiometric && (
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text variant="bodySmall" style={styles.dividerText}>
                ou
              </Text>
              <View style={styles.dividerLine} />
            </View>
          )}

          {/* Formulaire */}
          <Card style={styles.card}>
            <Card.Content>
              {/* Email */}
              <TextInput
                label="Email"
                value={email}
                onChangeText={validateEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                mode="outlined"
                error={!!emailError}
                disabled={loading}
                left={<TextInput.Icon icon="email" />}
                style={styles.input}
              />
              {emailError ? (
                <HelperText type="error" visible={!!emailError}>
                  {emailError}
                </HelperText>
              ) : null}

              {/* Mot de passe */}
              <TextInput
                label="Mot de passe"
                value={password}
                onChangeText={validatePassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
                mode="outlined"
                error={!!passwordError}
                disabled={loading}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                style={styles.input}
              />
              {passwordError ? (
                <HelperText type="error" visible={!!passwordError}>
                  {passwordError}
                </HelperText>
              ) : null}

              {/* Bouton de connexion */}
              <Button
                mode="contained"
                onPress={handleLogin}
                disabled={loading || !email || !password}
                style={styles.loginButton}
                contentStyle={styles.loginButtonContent}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  'Se connecter'
                )}
              </Button>

              {/* Mot de passe oublié */}
              <Button
                mode="text"
                onPress={() => showToast('Fonctionnalité bientôt disponible', 'info')}
                style={styles.forgotButton}
                disabled={loading}
              >
                Mot de passe oublié ?
              </Button>
            </Card.Content>
          </Card>

          {/* Liste complète des utilisateurs */}
          <View style={styles.devSection}>
            <Text variant="titleSmall" style={styles.devTitle}>
              🚀 Connexion rapide
            </Text>
            <Text variant="labelSmall" style={styles.devSubtitle}>
              Cliquez sur un utilisateur pour vous connecter
            </Text>

            {loadingUsers ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6200ee" />
                <Text variant="bodySmall" style={{ marginTop: 8 }}>
                  Chargement des utilisateurs...
                </Text>
              </View>
            ) : (
              <View style={styles.usersList}>
                {usersList.map((user) => {
                  const roleConfig = getRoleConfig(user.role);
                  return (
                    <TouchableOpacity
                      key={user.email}
                      onPress={() => quickLogin(user.email)}
                      style={styles.userCard}
                      disabled={loading}
                    >
                      <View style={[styles.userIcon, { backgroundColor: roleConfig.color }]}>
                        <Ionicons name={roleConfig.icon as any} size={24} color="#fff" />
                      </View>
                      <View style={styles.userInfo}>
                        <Text variant="labelMedium" style={styles.userName}>
                          {user.full_name}
                        </Text>
                        <Text variant="bodySmall" style={styles.userEmail}>
                          {user.email}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color="#9e9e9e" />
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            <Text variant="labelSmall" style={styles.devHint}>
              💡 Mot de passe : pass123 (tous les comptes)
            </Text>
          </View>

          {/* Footer */}
          <Text variant="bodySmall" style={styles.footer}>
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>

      {/* Modal pour activer la biométrie */}
      <BiometricPrompt
        visible={showBiometricPrompt}
        email={loginCredentials.email}
        password={loginCredentials.password}
        onClose={() => setShowBiometricPrompt(false)}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 8,
  },
  subtitle: {
    color: '#757575',
  },
  card: {
    elevation: 4,
  },
  input: {
    marginBottom: 8,
  },
  loginButton: {
    marginTop: 16,
  },
  loginButtonContent: {
    paddingVertical: 8,
  },
  forgotButton: {
    marginTop: 8,
  },
  devSection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4caf50',
  },
  devTitle: {
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  devSubtitle: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#558b2f',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
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
  userName: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  userEmail: {
    color: '#757575',
  },
  devHint: {
    textAlign: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#c8e6c9',
    color: '#2e7d32',
  },
  footer: {
    textAlign: 'center',
    marginTop: 32,
    color: '#9e9e9e',
  },
  // Styles biométrie
  biometricButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#6200ee',
    shadowColor: '#6200ee',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  biometricIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f3e5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  biometricText: {
    color: '#6200ee',
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#9e9e9e',
  },
});

export default LoginScreen;
