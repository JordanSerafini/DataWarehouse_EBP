/**
 * SignaturePad - Composant pour capturer une signature client
 *
 * Fonctionnalités :
 * - Canvas de signature tactile
 * - Effacer et recommencer
 * - Validation et upload
 * - Nom du signataire
 */

import React, { useRef, useState } from 'react';
import { View, StyleSheet, Modal, Image } from 'react-native';
import { Button, Text, TextInput, Portal, Card } from 'react-native-paper';
import SignatureCanvas from 'react-native-signature-canvas';
import { Ionicons } from '@expo/vector-icons';
import { InterventionService } from '../services/intervention.service';
import { showToast } from '../utils/toast';
import { hapticService } from '../services/haptic.service';

interface SignaturePadProps {
  interventionId: string;
  onSignatureSaved?: (signatureId: string) => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  interventionId,
  onSignatureSaved,
}) => {
  const signatureRef = useRef<any>(null);
  const [visible, setVisible] = useState(false);
  const [signerName, setSignerName] = useState('');
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [signatureId, setSignatureId] = useState<string | null>(null);

  /**
   * Ouvrir le modal de signature
   */
  const handleOpenModal = async () => {
    // Haptic feedback léger à l'ouverture du modal
    await hapticService.light();
    setVisible(true);
    setSignerName('');
    setSignatureData(null);
  };

  /**
   * Fermer le modal
   */
  const handleCloseModal = async () => {
    // Haptic feedback léger à la fermeture
    await hapticService.light();
    setVisible(false);
    setSignatureData(null);
  };

  /**
   * Effacer la signature
   */
  const handleClear = async () => {
    // Haptic feedback moyen pour clear (action importante)
    await hapticService.medium();
    signatureRef.current?.clearSignature();
    setSignatureData(null);
  };

  /**
   * Callback quand la signature est terminée
   */
  const handleEnd = async () => {
    // Haptic feedback léger quand signature terminée
    await hapticService.light();
    signatureRef.current?.readSignature();
  };

  /**
   * Callback quand la signature est capturée (base64)
   */
  const handleOK = async (signature: string) => {
    // Haptic feedback succès quand signature capturée
    await hapticService.success();
    setSignatureData(signature);
  };

  /**
   * Upload la signature vers le backend
   */
  const handleUpload = async () => {
    if (!signatureData) {
      await hapticService.warning();
      showToast('Veuillez signer d\'abord', 'error');
      return;
    }

    if (!signerName.trim()) {
      await hapticService.warning();
      showToast('Veuillez saisir le nom du signataire', 'error');
      return;
    }

    try {
      // Haptic feedback lourd pour action critique (enregistrement signature)
      await hapticService.heavy();

      setUploading(true);

      // Convertir base64 en blob
      const base64Data = signatureData.replace(/^data:image\/png;base64,/, '');
      const blob = await fetch(`data:image/png;base64,${base64Data}`).then((res) =>
        res.blob()
      );

      // Créer un fichier temporaire
      const fileName = `signature_${Date.now()}.png`;

      // Upload vers le backend
      const result = await InterventionService.uploadSignature(
        interventionId,
        {
          uri: signatureData,
          name: fileName,
          type: 'image/png',
        },
        signerName.trim()
      );

      setSignatureId(result.id);

      // Haptic feedback succès renforcé (triple tap) pour grande réussite
      await hapticService.successEnhanced();
      showToast('Signature enregistrée avec succès', 'success');
      onSignatureSaved?.(result.id);
      handleCloseModal();
    } catch (error: any) {
      console.error('Error uploading signature:', error);
      // Haptic feedback erreur
      await hapticService.error();
      showToast('Erreur lors de l\'enregistrement de la signature', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* Bouton pour ouvrir le modal */}
      {!signatureId ? (
        <Button
          mode="contained"
          icon="draw"
          onPress={handleOpenModal}
          style={styles.openButton}
        >
          Capture signature client
        </Button>
      ) : (
        <View style={styles.signedContainer}>
          <Ionicons name="checkmark-circle" size={32} color="#4caf50" />
          <Text variant="titleMedium" style={styles.signedText}>
            Signature enregistrée
          </Text>
        </View>
      )}

      {/* Modal de signature */}
      <Portal>
        <Modal
          visible={visible}
          onDismiss={handleCloseModal}
          contentContainerStyle={styles.modal}
        >
          <Card>
            <Card.Title title="Signature client" />
            <Card.Content>
              {/* Nom du signataire */}
              <TextInput
                label="Nom du signataire *"
                value={signerName}
                onChangeText={setSignerName}
                mode="outlined"
                style={styles.nameInput}
                disabled={uploading}
              />

              {/* Canvas de signature */}
              <View style={styles.canvasContainer}>
                <Text variant="bodySmall" style={styles.instruction}>
                  Signez dans le cadre ci-dessous
                </Text>
                <SignatureCanvas
                  ref={signatureRef}
                  onEnd={handleEnd}
                  onOK={handleOK}
                  descriptionText=""
                  clearText="Effacer"
                  confirmText="Valider"
                  webStyle={webStyle}
                  style={styles.canvas}
                />
              </View>

              {/* Preview signature */}
              {signatureData && (
                <View style={styles.previewContainer}>
                  <Text variant="labelMedium" style={styles.previewLabel}>
                    Aperçu de la signature :
                  </Text>
                  <Image
                    source={{ uri: signatureData }}
                    style={styles.previewImage}
                    resizeMode="contain"
                  />
                  <View style={styles.previewInfo}>
                    <Ionicons name="checkmark-circle" size={16} color="#4caf50" />
                    <Text variant="bodySmall" style={styles.previewText}>
                      Signature capturée - Vous pouvez valider
                    </Text>
                  </View>
                </View>
              )}

              {/* Actions */}
              <View style={styles.actions}>
                <Button
                  mode="outlined"
                  onPress={handleClear}
                  disabled={uploading}
                  style={styles.actionButton}
                >
                  Effacer
                </Button>
                <Button
                  mode="outlined"
                  onPress={handleCloseModal}
                  disabled={uploading}
                  style={styles.actionButton}
                >
                  Annuler
                </Button>
                <Button
                  mode="contained"
                  onPress={handleUpload}
                  loading={uploading}
                  disabled={uploading || !signatureData}
                  style={styles.actionButton}
                >
                  Valider
                </Button>
              </View>
            </Card.Content>
          </Card>
        </Modal>
      </Portal>
    </>
  );
};

// Style pour le canvas Web (WebView)
const webStyle = `.m-signature-pad {
  box-shadow: none;
  border: 2px solid #6200ee;
  border-radius: 8px;
}
.m-signature-pad--body {
  border: none;
}
.m-signature-pad--footer {
  display: none;
}`;

const styles = StyleSheet.create({
  openButton: {
    marginVertical: 12,
  },
  signedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    marginVertical: 12,
    gap: 12,
  },
  signedText: {
    color: '#4caf50',
    fontWeight: 'bold',
  },
  modal: {
    padding: 20,
  },
  nameInput: {
    marginBottom: 16,
  },
  canvasContainer: {
    marginBottom: 16,
  },
  instruction: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#757575',
  },
  canvas: {
    height: 300,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  // Preview
  previewContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  previewLabel: {
    marginBottom: 8,
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  previewImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  previewInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  previewText: {
    color: '#4caf50',
    flex: 1,
  },
});
