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
  Image,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  HelperText,
  Card,
  ActivityIndicator,
} from 'react-native-paper';
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

    if (text.length < 6) {
      setPasswordError('Minimum 6 caractères');
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
   * Remplissage rapide (dev)
   */
  const fillTestCredentials = (role: string) => {
    switch (role) {
      case 'technicien':
        setEmail('technicien@test.local');
        setPassword('pass123');
        break;
      case 'admin':
        setEmail('admin@test.local');
        setPassword('pass123');
        break;
      case 'chef':
        setEmail('chef@test.local');
        setPassword('pass123');
        break;
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

          {/* Boutons de test (DEV uniquement) */}
          {__DEV__ && (
            <View style={styles.devSection}>
              <Text variant="labelSmall" style={styles.devLabel}>
                🔧 Mode développement
              </Text>
              <View style={styles.devButtons}>
                <Button
                  mode="outlined"
                  onPress={() => fillTestCredentials('technicien')}
                  compact
                  style={styles.devButton}
                >
                  Technicien
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => fillTestCredentials('chef')}
                  compact
                  style={styles.devButton}
                >
                  Chef
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => fillTestCredentials('admin')}
                  compact
                  style={styles.devButton}
                >
                  Admin
                </Button>
              </View>
              <Text variant="labelSmall" style={styles.devHint}>
                Mot de passe : pass123
              </Text>
            </View>
          )}

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
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  devLabel: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#856404',
  },
  devButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
  },
  devButton: {
    flex: 1,
    borderColor: '#ffc107',
  },
  devHint: {
    textAlign: 'center',
    marginTop: 8,
    color: '#856404',
  },
  footer: {
    textAlign: 'center',
    marginTop: 32,
    color: '#9e9e9e',
  },
});

export default LoginScreen;
