/**
 * BiometricPrompt - Modal pour activer la biométrie
 *
 * Affiche après un login réussi pour proposer l'activation de Face ID / Touch ID
 */

import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BiometricService } from '../services/biometric.service';
import { useAuthStore } from '../stores/authStore.v2';

interface BiometricPromptProps {
  visible: boolean;
  email: string;
  password: string;
  onClose: () => void;
}

export const BiometricPrompt: React.FC<BiometricPromptProps> = ({
  visible,
  email,
  password,
  onClose,
}) => {
  const enableBiometric = useAuthStore((state) => state.enableBiometric);
  const biometricCapabilities = useAuthStore((state) => state.biometricCapabilities);

  const handleEnable = async () => {
    try {
      await enableBiometric(email, password);
      onClose();
    } catch (error: any) {
      alert(error.message || 'Erreur lors de l\'activation de la biométrie');
    }
  };

  // Déterminer le nom de la biométrie disponible
  const biometricName = biometricCapabilities?.supportedTypes.length
    ? BiometricService.getBiometricTypeName(biometricCapabilities.supportedTypes[0])
    : 'Biométrie';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🔐</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>
            Activer {biometricName} ?
          </Text>

          {/* Description */}
          <Text style={styles.description}>
            Connectez-vous plus rapidement en utilisant {biometricName}.
            Vos identifiants seront stockés de manière sécurisée.
          </Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={onClose}
            >
              <Text style={styles.buttonTextSecondary}>Plus tard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={handleEnable}
            >
              <Text style={styles.buttonTextPrimary}>Activer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#6200ee',
  },
  buttonSecondary: {
    backgroundColor: '#f5f5f5',
  },
  buttonTextPrimary: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});
