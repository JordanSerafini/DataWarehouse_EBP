/**
 * TimeSheet - Enregistrement du temps passé sur une intervention
 *
 * Fonctionnalités :
 * - Chronomètre automatique (démarrage/pause)
 * - Saisie manuelle du temps
 * - Affichage temps total
 * - Sauvegarde vers backend
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button, IconButton, Portal, Modal, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { showToast } from '../utils/toast';

interface TimeSheetProps {
  interventionId: string;
  initialTime?: number; // Temps initial en secondes
  onTimeSaved?: (timeSpent: number) => void;
  disabled?: boolean;
}

export const TimeSheet: React.FC<TimeSheetProps> = ({
  interventionId,
  initialTime = 0,
  onTimeSaved,
  disabled = false,
}) => {
  const [timeSpent, setTimeSpent] = useState(initialTime); // En secondes
  const [isRunning, setIsRunning] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [manualHours, setManualHours] = useState('');
  const [manualMinutes, setManualMinutes] = useState('');
  const [saving, setSaving] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  /**
   * Démarrer le chronomètre
   */
  const handleStart = () => {
    if (disabled) return;

    startTimeRef.current = Date.now();
    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    showToast('Chronomètre démarré', 'info');
  };

  /**
   * Pause du chronomètre
   */
  const handlePause = () => {
    setIsRunning(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    showToast('Chronomètre en pause', 'info');
  };

  /**
   * Réinitialiser
   */
  const handleReset = () => {
    setIsRunning(false);
    setTimeSpent(initialTime);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    showToast('Chronomètre réinitialisé', 'info');
  };

  /**
   * Ouvrir modal saisie manuelle
   */
  const handleOpenManualInput = () => {
    const hours = Math.floor(timeSpent / 3600);
    const minutes = Math.floor((timeSpent % 3600) / 60);

    setManualHours(hours.toString());
    setManualMinutes(minutes.toString());
    setModalVisible(true);
  };

  /**
   * Appliquer saisie manuelle
   */
  const handleApplyManualInput = () => {
    const hours = parseInt(manualHours || '0', 10);
    const minutes = parseInt(manualMinutes || '0', 10);

    if (isNaN(hours) || isNaN(minutes)) {
      showToast('Valeurs invalides', 'error');
      return;
    }

    if (hours < 0 || minutes < 0 || minutes >= 60) {
      showToast('Heures ou minutes invalides', 'error');
      return;
    }

    const totalSeconds = hours * 3600 + minutes * 60;
    setTimeSpent(totalSeconds);
    setModalVisible(false);
    showToast('Temps mis à jour', 'success');
  };

  /**
   * Sauvegarder le temps
   */
  const handleSave = async () => {
    if (disabled || saving) return;

    try {
      setSaving(true);

      // Appel API pour sauvegarder le temps
      const { InterventionService } = await import('../services/intervention.service');
      await InterventionService.updateTimeSpent(interventionId, timeSpent);

      showToast('Temps enregistré avec succès', 'success');
      onTimeSaved?.(timeSpent);
    } catch (error: any) {
      console.error('Error saving time:', error);
      showToast('Erreur lors de l\'enregistrement', 'error');
    } finally {
      setSaving(false);
    }
  };

  /**
   * Cleanup interval au démontage
   */
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  /**
   * Formater temps HH:MM:SS
   */
  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s
      .toString()
      .padStart(2, '0')}`;
  };

  /**
   * Formater temps en texte (ex: "2h 30min")
   */
  const formatTimeText = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);

    if (h === 0 && m === 0) {
      return `${seconds}s`;
    }

    if (h === 0) {
      return `${m} min`;
    }

    if (m === 0) {
      return `${h}h`;
    }

    return `${h}h ${m}min`;
  };

  return (
    <>
      <Card style={styles.card}>
        <Card.Title
          title="Temps d'intervention"
          left={(props) => <Ionicons name="time" size={24} color="#6200ee" />}
        />
        <Card.Content>
          {/* Affichage temps */}
          <View style={styles.timeDisplay}>
            <Text variant="displaySmall" style={styles.timeText}>
              {formatTime(timeSpent)}
            </Text>
            <Text variant="bodySmall" style={styles.timeSubtext}>
              {formatTimeText(timeSpent)} enregistrées
            </Text>
          </View>

          {/* Contrôles chronomètre */}
          <View style={styles.controls}>
            {!isRunning ? (
              <Button
                mode="contained"
                onPress={handleStart}
                icon="play"
                style={styles.controlButton}
                disabled={disabled}
              >
                Démarrer
              </Button>
            ) : (
              <Button
                mode="contained"
                onPress={handlePause}
                icon="pause"
                style={[styles.controlButton, styles.pauseButton]}
                disabled={disabled}
              >
                Pause
              </Button>
            )}

            <IconButton
              icon="refresh"
              size={24}
              onPress={handleReset}
              disabled={disabled || timeSpent === 0}
              style={styles.iconButton}
            />

            <IconButton
              icon="pencil"
              size={24}
              onPress={handleOpenManualInput}
              disabled={disabled}
              style={styles.iconButton}
            />
          </View>

          {/* État */}
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusIndicator,
                isRunning ? styles.statusRunning : styles.statusPaused,
              ]}
            />
            <Text variant="bodySmall" style={styles.statusText}>
              {isRunning ? 'En cours...' : 'En pause'}
            </Text>
          </View>

          {/* Bouton sauvegarder */}
          {timeSpent > 0 && (
            <Button
              mode="outlined"
              onPress={handleSave}
              loading={saving}
              disabled={disabled || saving || isRunning}
              style={styles.saveButton}
              icon="content-save"
            >
              Enregistrer le temps
            </Button>
          )}

          {disabled && (
            <View style={styles.disabledInfo}>
              <Ionicons name="information-circle" size={16} color="#757575" />
              <Text variant="bodySmall" style={styles.disabledText}>
                L'intervention doit être démarrée pour enregistrer le temps
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Modal saisie manuelle */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Card>
            <Card.Title
              title="Saisie manuelle"
              left={(props) => <Ionicons name="pencil" size={24} color="#6200ee" />}
            />
            <Card.Content>
              <Text variant="bodyMedium" style={styles.modalInstruction}>
                Saisissez le temps passé manuellement
              </Text>

              <View style={styles.manualInputs}>
                <TextInput
                  label="Heures"
                  value={manualHours}
                  onChangeText={setManualHours}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.manualInput}
                  left={<TextInput.Icon icon="clock-outline" />}
                />

                <Text variant="headlineMedium" style={styles.timeSeparator}>
                  :
                </Text>

                <TextInput
                  label="Minutes"
                  value={manualMinutes}
                  onChangeText={setManualMinutes}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.manualInput}
                  left={<TextInput.Icon icon="clock-outline" />}
                />
              </View>

              <View style={styles.modalActions}>
                <Button
                  mode="outlined"
                  onPress={() => setModalVisible(false)}
                  style={styles.modalButton}
                >
                  Annuler
                </Button>
                <Button
                  mode="contained"
                  onPress={handleApplyManualInput}
                  style={styles.modalButton}
                >
                  Appliquer
                </Button>
              </View>
            </Card.Content>
          </Card>
        </Modal>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 12,
    elevation: 2,
  },
  timeDisplay: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 16,
  },
  timeText: {
    fontWeight: 'bold',
    color: '#6200ee',
    fontVariant: ['tabular-nums'],
  },
  timeSubtext: {
    marginTop: 8,
    color: '#757575',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  controlButton: {
    flex: 1,
  },
  pauseButton: {
    backgroundColor: '#ff9800',
  },
  iconButton: {
    margin: 0,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 8,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusRunning: {
    backgroundColor: '#4caf50',
  },
  statusPaused: {
    backgroundColor: '#9e9e9e',
  },
  statusText: {
    color: '#757575',
  },
  saveButton: {
    marginTop: 8,
  },
  disabledInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 12,
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    gap: 8,
  },
  disabledText: {
    color: '#757575',
    flex: 1,
  },
  // Modal
  modalContainer: {
    margin: 20,
  },
  modalInstruction: {
    marginBottom: 16,
    textAlign: 'center',
    color: '#757575',
  },
  manualInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 8,
  },
  manualInput: {
    flex: 1,
  },
  timeSeparator: {
    fontWeight: 'bold',
    color: '#6200ee',
    marginTop: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
});
