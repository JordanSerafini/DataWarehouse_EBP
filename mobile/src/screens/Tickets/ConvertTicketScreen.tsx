/**
 * Écran de conversion d'un ticket NinjaOne en intervention EBP
 * Formulaire pré-rempli avec données modifiables
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
  Card,
  Chip,
  Switch,
  ActivityIndicator,
  Portal,
  Dialog,
  HelperText,
  Divider,
} from 'react-native-paper';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RootStackParamList } from '../../navigation/AppNavigator';
import {
  ninjaoneConversionService,
  TargetType,
  TicketPreview,
  ConvertTicketParams,
} from '../../services/ninjaone-conversion.service';
import { showToast } from '../../utils/toast';

type ConvertTicketScreenRouteProp = RouteProp<RootStackParamList, 'ConvertTicket'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ConvertTicketScreen = () => {
  const route = useRoute<ConvertTicketScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();

  const { ticketId, targetType } = route.params;

  // État du chargement
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Données de prévisualisation
  const [preview, setPreview] = useState<TicketPreview | null>(null);

  // Formulaire (données éditables)
  const [formData, setFormData] = useState<Partial<ConvertTicketParams>>({
    ticketId,
    targetType,
    caption: '',
    description: '',
    customerId: '',
    customerName: '',
    colleagueId: '',
    colleagueName: '',
    startDateTime: new Date().toISOString(),
    endDateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // +2h
    estimatedDurationHours: 2.0,
    priority: 'NORMAL',
    isUrgent: false,
    addressLine1: '',
    city: '',
    zipcode: '',
    contactPhone: '',
    maintenanceReference: '',
    maintenanceInterventionDescription: '',
  });

  // État des date pickers
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // Dialog d'avertissement
  const [showWarningsDialog, setShowWarningsDialog] = useState(false);

  /**
   * Charger la prévisualisation au montage
   */
  useEffect(() => {
    loadPreview();
  }, []);

  const loadPreview = async () => {
    try {
      setLoading(true);
      const data = await ninjaoneConversionService.getTicketPreview(ticketId, targetType);
      setPreview(data);

      // Pré-remplir le formulaire
      setFormData({
        ticketId,
        targetType,
        caption: data.caption,
        description: data.description || '',
        customerId: data.customerId || '',
        customerName: data.customerName || '',
        colleagueId: data.colleagueId || '',
        colleagueName: data.colleagueName || '',
        startDateTime: data.startDateTime,
        endDateTime: data.endDateTime,
        estimatedDurationHours: data.estimatedDurationHours,
        priority: data.priority,
        isUrgent: data.isUrgent,
        addressLine1: data.addressLine1 || '',
        city: data.city || '',
        zipcode: data.zipcode || '',
        contactPhone: data.contactPhone || '',
        maintenanceReference: data.maintenanceReference || '',
        maintenanceInterventionDescription: data.description || '',
      });

      // Afficher avertissements si présents
      if (data.warnings && data.warnings.length > 0) {
        setShowWarningsDialog(true);
      }
    } catch (error) {
      console.error('[ConvertTicketScreen] Error loading preview:', error);
      showToast('Erreur lors du chargement du ticket', 'error');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  /**
   * Soumettre la conversion
   */
  const handleSubmit = async () => {
    // Validation
    if (!formData.caption || formData.caption.trim().length === 0) {
      showToast('Le titre est obligatoire', 'error');
      return;
    }

    if (!formData.customerId || formData.customerId.trim().length === 0) {
      showToast('Le client est obligatoire', 'error');
      return;
    }

    try {
      setSubmitting(true);

      const result = await ninjaoneConversionService.convertTicket(formData as ConvertTicketParams);

      if (result.success) {
        showToast(result.message, 'success');
        navigation.goBack();
      } else {
        showToast(result.message, 'error');
      }
    } catch (error: any) {
      console.error('[ConvertTicketScreen] Error converting ticket:', error);
      const message = error?.response?.data?.message || 'Erreur lors de la conversion';
      showToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Gestion des dates
   */
  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      const current = new Date(formData.startDateTime!);
      selectedDate.setHours(current.getHours(), current.getMinutes(), 0, 0);
      setFormData({ ...formData, startDateTime: selectedDate.toISOString() });
    }
  };

  const handleStartTimeChange = (event: any, selectedDate?: Date) => {
    setShowStartTimePicker(false);
    if (selectedDate) {
      const current = new Date(formData.startDateTime!);
      const newDate = new Date(
        current.getFullYear(),
        current.getMonth(),
        current.getDate(),
        selectedDate.getHours(),
        selectedDate.getMinutes(),
        0,
        0
      );
      setFormData({ ...formData, startDateTime: newDate.toISOString() });
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      const current = new Date(formData.endDateTime!);
      selectedDate.setHours(current.getHours(), current.getMinutes(), 0, 0);
      setFormData({ ...formData, endDateTime: selectedDate.toISOString() });
    }
  };

  const handleEndTimeChange = (event: any, selectedDate?: Date) => {
    setShowEndTimePicker(false);
    if (selectedDate) {
      const current = new Date(formData.endDateTime!);
      const newDate = new Date(
        current.getFullYear(),
        current.getMonth(),
        current.getDate(),
        selectedDate.getHours(),
        selectedDate.getMinutes(),
        0,
        0
      );
      setFormData({ ...formData, endDateTime: newDate.toISOString() });
    }
  };

  if (loading || !preview) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Chargement du ticket...</Text>
      </View>
    );
  }

  const startDate = new Date(formData.startDateTime!);
  const endDate = new Date(formData.endDateTime!);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container}>
        {/* En-tête ticket source */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Ticket NinjaOne</Text>
            <Text style={styles.ticketTitle}>{preview.ticketTitle}</Text>
            <Text style={styles.ticketNumber}>#{preview.ticketNumber}</Text>

            <View style={styles.chipRow}>
              <Chip
                icon="file-document"
                style={{ backgroundColor: ninjaoneConversionService.getPriorityColor(preview.priority) }}
                textStyle={{ color: '#fff' }}
              >
                {ninjaoneConversionService.getPriorityLabel(preview.priority)}
              </Chip>
              <Chip icon="target">{targetType === 'schedule_event' ? 'Intervention' : 'Incident'}</Chip>
            </View>
          </Card.Content>
        </Card>

        {/* Formulaire */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Informations de base</Text>

            <TextInput
              label="Titre de l'intervention *"
              value={formData.caption}
              onChangeText={(text) => setFormData({ ...formData, caption: text.substring(0, 80) })}
              mode="outlined"
              style={styles.input}
              maxLength={80}
            />
            <HelperText type="info">Maximum 80 caractères</HelperText>

            <TextInput
              label="Description"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.input}
            />
          </Card.Content>
        </Card>

        {/* Client */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Client / Demandeur *</Text>

            {!preview.customerMapped && (
              <HelperText type="error" visible>
                ⚠️ Client non mappé. Vous devez saisir manuellement l'ID client EBP.
              </HelperText>
            )}

            <TextInput
              label="ID Client EBP *"
              value={formData.customerId}
              onChangeText={(text) => setFormData({ ...formData, customerId: text })}
              mode="outlined"
              style={styles.input}
              placeholder="CUST001"
            />

            <TextInput
              label="Nom du client (informatif)"
              value={formData.customerName}
              onChangeText={(text) => setFormData({ ...formData, customerName: text })}
              mode="outlined"
              style={styles.input}
              disabled
            />
          </Card.Content>
        </Card>

        {/* Technicien */}
        {targetType === 'schedule_event' && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Technicien assigné (optionnel)</Text>

              {preview.colleagueId && !preview.technicianMapped && (
                <HelperText type="warning" visible>
                  ⚠️ Technicien non mappé. Vous pouvez saisir manuellement l'ID collègue EBP.
                </HelperText>
              )}

              <TextInput
                label="ID Collègue EBP"
                value={formData.colleagueId}
                onChangeText={(text) => setFormData({ ...formData, colleagueId: text })}
                mode="outlined"
                style={styles.input}
                placeholder="TECH01"
              />

              <TextInput
                label="Nom du technicien (informatif)"
                value={formData.colleagueName}
                onChangeText={(text) => setFormData({ ...formData, colleagueName: text })}
                mode="outlined"
                style={styles.input}
                disabled
              />
            </Card.Content>
          </Card>
        )}

        {/* Dates et horaires */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Dates et horaires *</Text>

            {/* Date de début */}
            <Text style={styles.fieldLabel}>Date de début</Text>
            <Button
              mode="outlined"
              onPress={() => setShowStartDatePicker(true)}
              style={styles.dateButton}
            >
              {startDate.toLocaleDateString('fr-FR', {
                weekday: 'short',
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </Button>

            {/* Heure de début */}
            <Text style={styles.fieldLabel}>Heure de début</Text>
            <Button
              mode="outlined"
              onPress={() => setShowStartTimePicker(true)}
              style={styles.dateButton}
            >
              {startDate.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Button>

            <Divider style={styles.divider} />

            {/* Date de fin */}
            <Text style={styles.fieldLabel}>Date de fin</Text>
            <Button
              mode="outlined"
              onPress={() => setShowEndDatePicker(true)}
              style={styles.dateButton}
            >
              {endDate.toLocaleDateString('fr-FR', {
                weekday: 'short',
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </Button>

            {/* Heure de fin */}
            <Text style={styles.fieldLabel}>Heure de fin</Text>
            <Button
              mode="outlined"
              onPress={() => setShowEndTimePicker(true)}
              style={styles.dateButton}
            >
              {endDate.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Button>

            {/* Durée estimée */}
            <TextInput
              label="Durée estimée (heures)"
              value={formData.estimatedDurationHours?.toString()}
              onChangeText={(text) => {
                const value = parseFloat(text);
                if (!isNaN(value)) {
                  setFormData({ ...formData, estimatedDurationHours: value });
                }
              }}
              mode="outlined"
              keyboardType="decimal-pad"
              style={styles.input}
            />
          </Card.Content>
        </Card>

        {/* Priorité */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Priorité</Text>

            <View style={styles.switchRow}>
              <Text>Marquer comme urgent</Text>
              <Switch
                value={formData.isUrgent}
                onValueChange={(value) => {
                  setFormData({
                    ...formData,
                    isUrgent: value,
                    priority: value ? 'URGENT' : 'NORMAL',
                  });
                }}
              />
            </View>

            <Chip
              icon="flag"
              style={{
                backgroundColor: ninjaoneConversionService.getPriorityColor(formData.priority || 'NORMAL'),
                marginTop: 8,
              }}
              textStyle={{ color: '#fff' }}
            >
              {ninjaoneConversionService.getPriorityLabel(formData.priority || 'NORMAL')}
            </Chip>
          </Card.Content>
        </Card>

        {/* Localisation */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Localisation</Text>

            <TextInput
              label="Adresse"
              value={formData.addressLine1}
              onChangeText={(text) => setFormData({ ...formData, addressLine1: text })}
              mode="outlined"
              style={styles.input}
            />

            <View style={styles.row}>
              <TextInput
                label="Code postal"
                value={formData.zipcode}
                onChangeText={(text) => setFormData({ ...formData, zipcode: text })}
                mode="outlined"
                style={[styles.input, styles.halfWidth]}
              />
              <TextInput
                label="Ville"
                value={formData.city}
                onChangeText={(text) => setFormData({ ...formData, city: text })}
                mode="outlined"
                style={[styles.input, styles.halfWidth]}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Contact */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Contact</Text>

            <TextInput
              label="Téléphone"
              value={formData.contactPhone}
              onChangeText={(text) => setFormData({ ...formData, contactPhone: text })}
              mode="outlined"
              keyboardType="phone-pad"
              style={styles.input}
            />
          </Card.Content>
        </Card>

        {/* Champs maintenance (si intervention) */}
        {targetType === 'schedule_event' && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Maintenance</Text>

              <TextInput
                label="Référence maintenance"
                value={formData.maintenanceReference}
                onChangeText={(text) => setFormData({ ...formData, maintenanceReference: text })}
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="Description intervention"
                value={formData.maintenanceInterventionDescription}
                onChangeText={(text) => setFormData({ ...formData, maintenanceInterventionDescription: text })}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.input}
              />
            </Card.Content>
          </Card>
        )}

        {/* Boutons d'action */}
        <View style={styles.actionsContainer}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={submitting}
            disabled={submitting || !formData.customerId}
            style={styles.submitButton}
          >
            {submitting ? 'Conversion en cours...' : 'Convertir'}
          </Button>

          <Button mode="outlined" onPress={() => navigation.goBack()} disabled={submitting}>
            Annuler
          </Button>
        </View>

        {/* Espacement en bas */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Date/Time Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}

      {showStartTimePicker && (
        <DateTimePicker
          value={startDate}
          mode="time"
          display="default"
          onChange={handleStartTimeChange}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
        />
      )}

      {showEndTimePicker && (
        <DateTimePicker
          value={endDate}
          mode="time"
          display="default"
          onChange={handleEndTimeChange}
        />
      )}

      {/* Dialog d'avertissements */}
      <Portal>
        <Dialog visible={showWarningsDialog} onDismiss={() => setShowWarningsDialog(false)}>
          <Dialog.Title>⚠️ Avertissements</Dialog.Title>
          <Dialog.Content>
            {preview?.warnings.map((warning, index) => (
              <Text key={index} style={styles.warningText}>
                • {warning}
              </Text>
            ))}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowWarningsDialog(false)}>Compris</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  card: {
    margin: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  ticketNumber: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  input: {
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  halfWidth: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 4,
    color: '#333',
  },
  dateButton: {
    marginBottom: 8,
  },
  divider: {
    marginVertical: 12,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionsContainer: {
    margin: 16,
    gap: 12,
  },
  submitButton: {
    paddingVertical: 8,
  },
  warningText: {
    marginBottom: 8,
    color: '#ff9800',
  },
});

export default ConvertTicketScreen;
