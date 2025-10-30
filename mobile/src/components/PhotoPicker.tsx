/**
 * PhotoPicker - Composant pour sélectionner et uploader des photos
 *
 * Fonctionnalités :
 * - Prise de photo avec la caméra
 * - Sélection depuis la galerie
 * - Preview avant upload
 * - Géolocalisation automatique
 * - Upload vers backend
 */

import React, { useState } from 'react';
import { View, Image, StyleSheet, Alert, ScrollView } from 'react-native';
import { Button, Card, Text, IconButton, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { InterventionService } from '../services/intervention.service';
import { showToast } from '../utils/toast';
import { hapticService } from '../services/haptic.service';

interface Photo {
  uri: string;
  uploading: boolean;
  uploaded: boolean;
  id?: string;
}

interface PhotoPickerProps {
  interventionId: string;
  onPhotosChanged?: (count: number) => void;
}

export const PhotoPicker: React.FC<PhotoPickerProps> = ({
  interventionId,
  onPhotosChanged,
}) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  /**
   * Demander les permissions
   */
  const requestPermissions = async () => {
    // Permission caméra
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (!cameraPermission.granted) {
      Alert.alert('Permission refusée', 'L\'accès à la caméra est requis');
      return false;
    }

    // Permission galerie
    const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!galleryPermission.granted) {
      Alert.alert('Permission refusée', 'L\'accès à la galerie est requis');
      return false;
    }

    // Permission localisation (optionnelle)
    try {
      const locationPermission = await Location.requestForegroundPermissionsAsync();
      if (locationPermission.granted) {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      }
    } catch (error) {
      console.warn('Location permission denied or unavailable');
    }

    return true;
  };

  /**
   * Prendre une photo avec la caméra
   */
  const handleTakePhoto = async () => {
    // Haptic feedback léger à l'ouverture de la caméra
    await hapticService.light();

    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      await hapticService.error();
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      exif: true,
    });

    if (!result.canceled && result.assets[0]) {
      // Haptic feedback moyen lors de la sélection de la photo
      await hapticService.medium();

      const newPhoto: Photo = {
        uri: result.assets[0].uri,
        uploading: false,
        uploaded: false,
      };
      setPhotos((prev) => [...prev, newPhoto]);
      uploadPhoto(newPhoto);
    }
  };

  /**
   * Sélectionner une photo depuis la galerie
   */
  const handlePickImage = async () => {
    // Haptic feedback léger à l'ouverture de la galerie
    await hapticService.light();

    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      await hapticService.error();
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      exif: true,
    });

    if (!result.canceled && result.assets[0]) {
      // Haptic feedback moyen lors de la sélection de la photo
      await hapticService.medium();

      const newPhoto: Photo = {
        uri: result.assets[0].uri,
        uploading: false,
        uploaded: false,
      };
      setPhotos((prev) => [...prev, newPhoto]);
      uploadPhoto(newPhoto);
    }
  };

  /**
   * Uploader une photo vers le backend
   */
  const uploadPhoto = async (photo: Photo) => {
    try {
      // Marquer comme en cours d'upload
      setPhotos((prev) =>
        prev.map((p) => (p.uri === photo.uri ? { ...p, uploading: true } : p))
      );

      // Extraire le nom de fichier et le type MIME
      const uriParts = photo.uri.split('/');
      const fileName = uriParts[uriParts.length - 1];
      const fileType = fileName.split('.').pop();
      const mimeType = `image/${fileType}`;

      // Upload avec géolocalisation si disponible
      const result = await InterventionService.uploadPhoto(
        interventionId,
        {
          uri: photo.uri,
          name: fileName,
          type: mimeType,
        },
        location?.coords.latitude,
        location?.coords.longitude
      );

      // Marquer comme uploadée
      setPhotos((prev) =>
        prev.map((p) =>
          p.uri === photo.uri
            ? { ...p, uploading: false, uploaded: true, id: result.id }
            : p
        )
      );

      // Haptic feedback succès après upload réussi
      await hapticService.success();
      showToast('Photo uploadée avec succès', 'success');
      onPhotosChanged?.(photos.filter((p) => p.uploaded).length + 1);
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      // Haptic feedback erreur en cas d'échec
      await hapticService.error();
      showToast('Erreur lors de l\'upload de la photo', 'error');

      // Retirer la photo en cas d'erreur
      setPhotos((prev) => prev.filter((p) => p.uri !== photo.uri));
    }
  };

  /**
   * Supprimer une photo
   */
  const handleDeletePhoto = async (photo: Photo) => {
    if (!photo.id) {
      // Pas encore uploadée, simplement retirer localement
      await hapticService.light();
      setPhotos((prev) => prev.filter((p) => p.uri !== photo.uri));
      return;
    }

    // Haptic feedback warning pour action destructive
    await hapticService.warning();

    Alert.alert('Supprimer la photo', 'Voulez-vous vraiment supprimer cette photo ?', [
      {
        text: 'Annuler',
        style: 'cancel',
        onPress: () => hapticService.light()
      },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            // Haptic feedback moyen avant suppression
            await hapticService.medium();

            await InterventionService.deleteFile(photo.id!);
            setPhotos((prev) => prev.filter((p) => p.id !== photo.id));

            // Haptic feedback léger après suppression
            await hapticService.light();
            showToast('Photo supprimée', 'info');
            onPhotosChanged?.(photos.filter((p) => p.uploaded && p.id !== photo.id).length);
          } catch (error) {
            console.error('Error deleting photo:', error);
            // Haptic feedback erreur
            await hapticService.error();
            showToast('Erreur lors de la suppression', 'error');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Boutons d'action */}
      <View style={styles.actions}>
        <Button
          mode="contained"
          icon="camera"
          onPress={handleTakePhoto}
          style={styles.button}
        >
          Prendre une photo
        </Button>
        <Button
          mode="outlined"
          icon="image"
          onPress={handlePickImage}
          style={styles.button}
        >
          Galerie
        </Button>
      </View>

      {/* Liste des photos */}
      {photos.length > 0 && (
        <ScrollView horizontal style={styles.photoList} showsHorizontalScrollIndicator={false}>
          {photos.map((photo, index) => (
            <View key={photo.uri} style={styles.photoContainer}>
              <Image source={{ uri: photo.uri }} style={styles.photo} />

              {/* Loading overlay */}
              {photo.uploading && (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator size="small" color="#fff" />
                </View>
              )}

              {/* Uploaded badge */}
              {photo.uploaded && (
                <View style={styles.uploadedBadge}>
                  <Ionicons name="checkmark-circle" size={24} color="#4caf50" />
                </View>
              )}

              {/* Delete button */}
              <IconButton
                icon="close-circle"
                size={24}
                iconColor="#f44336"
                containerColor="#fff"
                style={styles.deleteButton}
                onPress={() => handleDeletePhoto(photo)}
              />
            </View>
          ))}
        </ScrollView>
      )}

      {/* Info GPS */}
      {location && (
        <View style={styles.gpsInfo}>
          <Ionicons name="location" size={16} color="#4caf50" />
          <Text variant="bodySmall" style={styles.gpsText}>
            Géolocalisation activée
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
  photoList: {
    marginTop: 16,
  },
  photoContainer: {
    marginRight: 12,
    position: 'relative',
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadedBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  deleteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  gpsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 4,
  },
  gpsText: {
    color: '#4caf50',
  },
});
