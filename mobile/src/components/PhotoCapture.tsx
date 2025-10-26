/**
 * Composant de capture photo avec preview et compression
 * Utilise expo-image-picker pour camera/galerie
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Button,
  IconButton,
  Portal,
  Modal,
  Text,
  ActivityIndicator,
  Surface,
} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { logger } from '../utils/logger';
import toast from '../utils/toast';

export interface CapturedPhoto {
  uri: string;
  base64?: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  width: number;
  height: number;
}

interface PhotoCaptureProps {
  maxPhotos?: number;
  onPhotosChange?: (photos: CapturedPhoto[]) => void;
  existingPhotos?: CapturedPhoto[];
  disabled?: boolean;
}

const PhotoCapture: React.FC<PhotoCaptureProps> = ({
  maxPhotos = 10,
  onPhotosChange,
  existingPhotos = [],
  disabled = false,
}) => {
  const [photos, setPhotos] = useState<CapturedPhoto[]>(existingPhotos);
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<CapturedPhoto | null>(null);

  /**
   * Demander les permissions
   */
  const requestPermissions = async (type: 'camera' | 'gallery'): Promise<boolean> => {
    try {
      const permission =
        type === 'camera'
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permission.status !== 'granted') {
        Alert.alert(
          'Permission requise',
          `L'accès ${type === 'camera' ? 'à la caméra' : 'à la galerie'} est nécessaire pour ajouter des photos.`,
          [{ text: 'OK' }]
        );
        return false;
      }

      return true;
    } catch (error) {
      logger.error('PHOTO', 'Erreur permission', { error });
      return false;
    }
  };

  /**
   * Ouvrir la caméra
   */
  const openCamera = async () => {
    if (photos.length >= maxPhotos) {
      Alert.alert(
        'Limite atteinte',
        `Vous avez atteint la limite de ${maxPhotos} photos.`,
        [{ text: 'OK' }]
      );
      return;
    }

    const hasPermission = await requestPermissions('camera');
    if (!hasPermission) return;

    try {
      setLoading(true);

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7, // Compression 70%
        base64: false,
        exif: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const photo: CapturedPhoto = {
          uri: asset.uri,
          fileName: `photo_${Date.now()}.jpg`,
          mimeType: 'image/jpeg',
          fileSize: asset.fileSize || 0,
          width: asset.width,
          height: asset.height,
        };

        const newPhotos = [...photos, photo];
        setPhotos(newPhotos);
        onPhotosChange?.(newPhotos);

        logger.info('PHOTO', 'Photo capturée', {
          fileName: photo.fileName,
          size: photo.fileSize,
        });
        toast.success('Photo ajoutée !');
      }
    } catch (error) {
      logger.error('PHOTO', 'Erreur capture caméra', { error });
      toast.error('Erreur lors de la capture');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Ouvrir la galerie
   */
  const openGallery = async () => {
    if (photos.length >= maxPhotos) {
      Alert.alert(
        'Limite atteinte',
        `Vous avez atteint la limite de ${maxPhotos} photos.`,
        [{ text: 'OK' }]
      );
      return;
    }

    const hasPermission = await requestPermissions('gallery');
    if (!hasPermission) return;

    try {
      setLoading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7, // Compression 70%
        base64: false,
        exif: true,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const photo: CapturedPhoto = {
          uri: asset.uri,
          fileName: `photo_${Date.now()}.jpg`,
          mimeType: 'image/jpeg',
          fileSize: asset.fileSize || 0,
          width: asset.width,
          height: asset.height,
        };

        const newPhotos = [...photos, photo];
        setPhotos(newPhotos);
        onPhotosChange?.(newPhotos);

        logger.info('PHOTO', 'Photo sélectionnée', {
          fileName: photo.fileName,
          size: photo.fileSize,
        });
        toast.success('Photo ajoutée !');
      }
    } catch (error) {
      logger.error('PHOTO', 'Erreur sélection galerie', { error });
      toast.error('Erreur lors de la sélection');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Supprimer une photo
   */
  const deletePhoto = (index: number) => {
    Alert.alert(
      'Supprimer la photo',
      'Voulez-vous vraiment supprimer cette photo ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            const newPhotos = photos.filter((_, i) => i !== index);
            setPhotos(newPhotos);
            onPhotosChange?.(newPhotos);
            logger.info('PHOTO', 'Photo supprimée', { index });
            toast.success('Photo supprimée');
          },
        },
      ]
    );
  };

  /**
   * Prévisualiser une photo
   */
  const previewPhotoHandler = (photo: CapturedPhoto) => {
    setPreviewPhoto(photo);
    setPreviewVisible(true);
  };

  /**
   * Afficher les options d'ajout
   */
  const showAddOptions = () => {
    Alert.alert(
      'Ajouter une photo',
      'Choisissez une option',
      [
        {
          text: 'Prendre une photo',
          onPress: openCamera,
        },
        {
          text: 'Choisir dans la galerie',
          onPress: openGallery,
        },
        {
          text: 'Annuler',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      {/* Header avec compteur */}
      <View style={styles.header}>
        <Text variant="titleMedium" style={styles.title}>
          Photos ({photos.length}/{maxPhotos})
        </Text>
        <Button
          mode="contained"
          icon="camera"
          onPress={showAddOptions}
          disabled={disabled || loading || photos.length >= maxPhotos}
          compact
          style={styles.addButton}
        >
          Ajouter
        </Button>
      </View>

      {/* Liste des photos */}
      {photos.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.photosList}
        >
          {photos.map((photo, index) => (
            <View key={index} style={styles.photoContainer}>
              <TouchableOpacity onPress={() => previewPhotoHandler(photo)}>
                <Image source={{ uri: photo.uri }} style={styles.photoThumbnail} />
              </TouchableOpacity>
              <IconButton
                icon="close-circle"
                size={24}
                iconColor="#F44336"
                style={styles.deleteButton}
                onPress={() => deletePhoto(index)}
              />
            </View>
          ))}
        </ScrollView>
      ) : (
        <Surface style={styles.emptyState}>
          <Text variant="bodyMedium" style={styles.emptyText}>
            Aucune photo ajoutée
          </Text>
        </Surface>
      )}

      {/* Loading indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      )}

      {/* Modal de prévisualisation */}
      <Portal>
        <Modal
          visible={previewVisible}
          onDismiss={() => setPreviewVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          {previewPhoto && (
            <View style={styles.previewContainer}>
              <Image
                source={{ uri: previewPhoto.uri }}
                style={styles.previewImage}
                resizeMode="contain"
              />
              <View style={styles.previewInfo}>
                <Text variant="bodySmall" style={styles.previewText}>
                  {previewPhoto.width} x {previewPhoto.height}
                </Text>
                <Text variant="bodySmall" style={styles.previewText}>
                  {(previewPhoto.fileSize / 1024).toFixed(2)} KB
                </Text>
              </View>
              <Button
                mode="contained"
                onPress={() => setPreviewVisible(false)}
                style={styles.closeButton}
              >
                Fermer
              </Button>
            </View>
          )}
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontWeight: 'bold',
  },
  addButton: {
    marginLeft: 8,
  },
  photosList: {
    flexDirection: 'row',
  },
  photoContainer: {
    position: 'relative',
    marginRight: 12,
  },
  photoThumbnail: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  deleteButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  emptyState: {
    padding: 32,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  emptyText: {
    color: '#757575',
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 8,
    padding: 20,
  },
  previewContainer: {
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 400,
    borderRadius: 8,
  },
  previewInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 12,
    marginBottom: 16,
  },
  previewText: {
    color: '#757575',
  },
  closeButton: {
    width: '100%',
  },
});

export default PhotoCapture;
