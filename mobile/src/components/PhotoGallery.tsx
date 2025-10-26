/**
 * PhotoGallery - Affiche les photos déjà uploadées d'une intervention
 *
 * Fonctionnalités :
 * - Galerie horizontale avec preview
 * - Clic pour voir en plein écran
 * - Possibilité de supprimer
 * - Téléchargement
 */

import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, ScrollView, Modal, TouchableOpacity, Alert } from 'react-native';
import { Text, IconButton, ActivityIndicator, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { InterventionService, InterventionFile } from '../services/intervention.service';
import { showToast } from '../utils/toast';

interface PhotoGalleryProps {
  interventionId: string;
  onPhotoDeleted?: () => void;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  interventionId,
  onPhotoDeleted,
}) => {
  const [photos, setPhotos] = useState<InterventionFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<InterventionFile | null>(null);
  const [showModal, setShowModal] = useState(false);

  /**
   * Charger les photos depuis le backend
   */
  const loadPhotos = async () => {
    try {
      setLoading(true);
      const files = await InterventionService.getInterventionFiles(interventionId);
      setPhotos(files.photos || []);
    } catch (error: any) {
      console.error('Error loading photos:', error);
      showToast('Erreur lors du chargement des photos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, [interventionId]);

  /**
   * Ouvrir une photo en plein écran
   */
  const handleOpenPhoto = (photo: InterventionFile) => {
    setSelectedPhoto(photo);
    setShowModal(true);
  };

  /**
   * Fermer le modal
   */
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPhoto(null);
  };

  /**
   * Supprimer une photo
   */
  const handleDeletePhoto = (photo: InterventionFile) => {
    Alert.alert(
      'Supprimer la photo',
      'Voulez-vous vraiment supprimer cette photo ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await InterventionService.deleteFile(photo.id);
              setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
              showToast('Photo supprimée', 'info');
              onPhotoDeleted?.();

              // Fermer le modal si c'est la photo affichée
              if (selectedPhoto?.id === photo.id) {
                handleCloseModal();
              }
            } catch (error) {
              console.error('Error deleting photo:', error);
              showToast('Erreur lors de la suppression', 'error');
            }
          },
        },
      ]
    );
  };

  // Loading
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#6200ee" />
        <Text variant="bodySmall" style={styles.loadingText}>
          Chargement des photos...
        </Text>
      </View>
    );
  }

  // Aucune photo
  if (photos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="images-outline" size={48} color="#bdbdbd" />
        <Text variant="bodyMedium" style={styles.emptyText}>
          Aucune photo pour le moment
        </Text>
      </View>
    );
  }

  return (
    <>
      {/* Galerie horizontale */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gallery}>
        {photos.map((photo) => (
          <TouchableOpacity
            key={photo.id}
            onPress={() => handleOpenPhoto(photo)}
            style={styles.photoContainer}
          >
            <Image
              source={{ uri: photo.url }}
              style={styles.thumbnail}
              resizeMode="cover"
            />

            {/* Bouton supprimer */}
            <IconButton
              icon="close-circle"
              size={20}
              iconColor="#f44336"
              containerColor="#fff"
              style={styles.deleteButton}
              onPress={(e) => {
                e.stopPropagation();
                handleDeletePhoto(photo);
              }}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Info */}
      <View style={styles.infoContainer}>
        <Text variant="bodySmall" style={styles.infoText}>
          {photos.length} photo{photos.length > 1 ? 's' : ''} • Cliquez pour agrandir
        </Text>
      </View>

      {/* Modal plein écran */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          {/* Bouton fermer */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCloseModal}
          >
            <Ionicons name="close-circle" size={40} color="#fff" />
          </TouchableOpacity>

          {/* Image plein écran */}
          {selectedPhoto && (
            <View style={styles.modalContent}>
              <Image
                source={{ uri: selectedPhoto.url }}
                style={styles.fullImage}
                resizeMode="contain"
              />

              {/* Actions */}
              <View style={styles.modalActions}>
                <Button
                  mode="contained"
                  icon="trash-can"
                  buttonColor="#f44336"
                  onPress={() => handleDeletePhoto(selectedPhoto)}
                  style={styles.modalButton}
                >
                  Supprimer
                </Button>
              </View>

              {/* Métadonnées */}
              <View style={styles.metadata}>
                <Text variant="bodySmall" style={styles.metadataText}>
                  {selectedPhoto.filename}
                </Text>
                <Text variant="bodySmall" style={styles.metadataText}>
                  {(selectedPhoto.size / 1024).toFixed(1)} KB
                </Text>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  gallery: {
    marginVertical: 8,
  },
  photoContainer: {
    marginRight: 12,
    position: 'relative',
  },
  thumbnail: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  deleteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#757575',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    color: '#9e9e9e',
    textAlign: 'center',
  },
  infoContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  infoText: {
    color: '#757575',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  modalContent: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fullImage: {
    width: '100%',
    height: '70%',
  },
  modalActions: {
    marginTop: 20,
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    minWidth: 150,
  },
  metadata: {
    marginTop: 16,
    alignItems: 'center',
  },
  metadataText: {
    color: '#fff',
    opacity: 0.7,
  },
});
