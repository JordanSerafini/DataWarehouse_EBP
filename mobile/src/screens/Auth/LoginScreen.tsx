/**
 * Écran de connexion
 * Authentification par email/mot de passe
 */

import React, { useState } from 'react';
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
import { useAuthStore } from '../../stores/authStore';
import { showToast } from '../../utils/toast';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { login } = useAuthStore();

  /**
   * Liste complète des utilisateurs de test
   */
  const testUsers = [
    { email: 'admin@test.local', role: 'Super Admin', icon: 'shield-crown', color: '#e74c3c' },
    { email: 'manager@test.local', role: 'Admin', icon: 'shield-account', color: '#e67e22' },
    { email: 'patron@test.local', role: 'Patron', icon: 'briefcase', color: '#f39c12' },
    { email: 'chef@test.local', role: 'Chef de chantier', icon: 'hard-hat', color: '#3498db' },
    { email: 'commercial@test.local', role: 'Commercial', icon: 'account-tie', color: '#9b59b6' },
    { email: 'technicien@test.local', role: 'Technicien 1', icon: 'tools', color: '#2ecc71' },
    { email: 'technicien2@test.local', role: 'Technicien 2', icon: 'tools', color: '#27ae60' },
  ];

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

          {/* Liste complète des utilisateurs de test (DEV) */}
          <View style={styles.devSection}>
            <Text variant="titleSmall" style={styles.devTitle}>
              🚀 Connexion rapide
            </Text>
            <Text variant="labelSmall" style={styles.devSubtitle}>
              Cliquez sur un utilisateur pour vous connecter
            </Text>

            <View style={styles.usersList}>
              {testUsers.map((user) => (
                <TouchableOpacity
                  key={user.email}
                  onPress={() => quickLogin(user.email)}
                  style={styles.userCard}
                  disabled={loading}
                >
                  <View style={[styles.userIcon, { backgroundColor: user.color }]}>
                    <Ionicons name={user.icon as any} size={24} color="#fff" />
                  </View>
                  <View style={styles.userInfo}>
                    <Text variant="labelMedium" style={styles.userName}>
                      {user.role}
                    </Text>
                    <Text variant="bodySmall" style={styles.userEmail}>
                      {user.email}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9e9e9e" />
                </TouchableOpacity>
              ))}
            </View>

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
});

export default LoginScreen;
