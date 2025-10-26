/**
 * Composant de signature tactile
 * Utilise react-native-signature-canvas pour la capture
 */

import React, { useRef, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import {
  Button,
  Portal,
  Modal,
  Text,
  Surface,
  IconButton,
} from 'react-native-paper';
import SignatureScreen from 'react-native-signature-canvas';
import { logger } from '../utils/logger';
import toast from '../utils/toast';

export interface SignatureData {
  base64: string;
  timestamp: Date;
  fileName: string;
}

interface SignatureCanvasProps {
  onSignatureSaved?: (signature: SignatureData) => void;
  existingSignature?: SignatureData | null;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

const SignatureCanvas: React.FC<SignatureCanvasProps> = ({
  onSignatureSaved,
  existingSignature = null,
  label = 'Signature',
  required = false,
  disabled = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [signature, setSignature] = useState<SignatureData | null>(existingSignature);
  const signatureRef = useRef<any>(null);

  /**
   * Ouvrir le modal de signature
   */
  const openSignatureModal = () => {
    if (disabled) return;
    setModalVisible(true);
  };

  /**
   * Sauvegarder la signature
   */
  const handleSignature = (signatureBase64: string) => {
    const signatureData: SignatureData = {
      base64: signatureBase64,
      timestamp: new Date(),
      fileName: `signature_${Date.now()}.png`,
    };

    setSignature(signatureData);
    onSignatureSaved?.(signatureData);
    setModalVisible(false);

    logger.info('SIGNATURE', 'Signature capturée', {
      fileName: signatureData.fileName,
      timestamp: signatureData.timestamp,
    });
    toast.success('Signature enregistrée !');
  };

  /**
   * Effacer la signature
   */
  const clearSignature = () => {
    setSignature(null);
    onSignatureSaved?.(null as any);
    logger.info('SIGNATURE', 'Signature effacée');
    toast.success('Signature effacée');
  };

  /**
   * Annuler la signature en cours
   */
  const handleCancel = () => {
    setModalVisible(false);
  };

  /**
   * Effacer le canvas
   */
  const handleClear = () => {
    signatureRef.current?.clearSignature();
  };

  /**
   * Confirmer la signature
   */
  const handleConfirm = () => {
    signatureRef.current?.readSignature();
  };

  /**
   * Style pour le canvas
   */
  const webStyle = `.m-signature-pad {
    box-shadow: none;
    border: none;
  }
  .m-signature-pad--body {
    border: none;
  }
  .m-signature-pad--footer {
    display: none;
  }
  body,html {
    width: 100%;
    height: 100%;
  }`;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="titleMedium" style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      </View>

      {/* État de la signature */}
      {signature ? (
        <Surface style={styles.signatureSurface}>
          <View style={styles.signatureContainer}>
            {/* Affichage de la signature existante */}
            <View style={styles.signaturePreview}>
              <img
                src={signature.base64}
                alt="Signature"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </View>

            {/* Informations */}
            <View style={styles.signatureInfo}>
              <Text variant="bodySmall" style={styles.signatureTimestamp}>
                Signée le {signature.timestamp.toLocaleDateString('fr-FR')} à{' '}
                {signature.timestamp.toLocaleTimeString('fr-FR')}
              </Text>
            </View>

            {/* Actions */}
            <View style={styles.signatureActions}>
              <Button
                mode="outlined"
                icon="pencil"
                onPress={openSignatureModal}
                disabled={disabled}
                compact
              >
                Modifier
              </Button>
              <Button
                mode="text"
                icon="delete"
                onPress={clearSignature}
                disabled={disabled}
                textColor="#F44336"
                compact
              >
                Effacer
              </Button>
            </View>
          </View>
        </Surface>
      ) : (
        <Surface style={styles.emptyState}>
          <IconButton
            icon="draw"
            size={48}
            iconColor="#6200ee"
            onPress={openSignatureModal}
            disabled={disabled}
          />
          <Text variant="bodyMedium" style={styles.emptyText}>
            Appuyez pour signer
          </Text>
        </Surface>
      )}

      {/* Modal de signature */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={handleCancel}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            {/* Header du modal */}
            <View style={styles.modalHeader}>
              <Text variant="titleLarge" style={styles.modalTitle}>
                Veuillez signer ci-dessous
              </Text>
              <IconButton
                icon="close"
                size={24}
                onPress={handleCancel}
              />
            </View>

            {/* Canvas de signature */}
            <View style={styles.canvasContainer}>
              <SignatureScreen
                ref={signatureRef}
                onOK={handleSignature}
                onEmpty={() => toast.warning('Veuillez signer avant de confirmer')}
                descriptionText=""
                clearText="Effacer"
                confirmText="Confirmer"
                webStyle={webStyle}
                autoClear={false}
                backgroundColor="#ffffff"
                penColor="#000000"
              />
            </View>

            {/* Actions du modal */}
            <View style={styles.modalActions}>
              <Button
                mode="outlined"
                onPress={handleClear}
                style={styles.modalButton}
              >
                Effacer
              </Button>
              <Button
                mode="contained"
                onPress={handleConfirm}
                style={styles.modalButton}
              >
                Confirmer
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
  },
  required: {
    color: '#F44336',
  },
  signatureSurface: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },
  signatureContainer: {
    gap: 12,
  },
  signaturePreview: {
    width: '100%',
    height: 150,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#fafafa',
    overflow: 'hidden',
  },
  signatureInfo: {
    alignItems: 'center',
  },
  signatureTimestamp: {
    color: '#757575',
  },
  signatureActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
  },
  emptyState: {
    padding: 32,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    elevation: 1,
  },
  emptyText: {
    color: '#757575',
    marginTop: 8,
  },
  modalContainer: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    maxHeight: height * 0.8,
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontWeight: 'bold',
  },
  canvasContainer: {
    flex: 1,
    minHeight: 300,
    backgroundColor: '#ffffff',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
});

export default SignatureCanvas;
