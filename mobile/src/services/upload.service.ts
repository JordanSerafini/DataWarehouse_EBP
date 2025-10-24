/**
 * Service d'upload pour photos et signatures
 * Gestion multipart/form-data pour React Native
 */

import * as FileSystem from 'expo-file-system';
import { API_CONFIG } from '../config/api.config';
import { useAuthStore } from '../stores/authStore';
import { logger } from '../utils/logger';
import { CapturedPhoto } from '../components/PhotoCapture';
import { SignatureData } from '../components/SignatureCanvas';

export interface UploadPhotoResponse {
  fileId: string;
  url: string;
  fileName: string;
  mimeType: string;
  size: number;
}

export interface UploadSignatureResponse {
  fileId: string;
  url: string;
  fileName: string;
}

class UploadService {
  /**
   * Upload une photo d'intervention
   */
  async uploadInterventionPhoto(
    interventionId: string,
    photo: CapturedPhoto,
    latitude?: number,
    longitude?: number
  ): Promise<UploadPhotoResponse> {
    try {
      const { tokens } = useAuthStore.getState();
      if (!tokens?.accessToken) {
        throw new Error('Non authentifié');
      }

      logger.info('UPLOAD', 'Début upload photo', {
        interventionId,
        fileName: photo.fileName,
        size: photo.fileSize,
      });

      // Préparer la requête multipart/form-data
      const uploadResult = await FileSystem.uploadAsync(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.INTERVENTIONS.UPLOAD_PHOTO(interventionId)}`,
        photo.uri,
        {
          httpMethod: 'POST',
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: 'file',
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
          parameters: {
            ...(latitude && { latitude: latitude.toString() }),
            ...(longitude && { longitude: longitude.toString() }),
          },
        }
      );

      if (uploadResult.status !== 200 && uploadResult.status !== 201) {
        throw new Error(`Erreur upload: ${uploadResult.status}`);
      }

      const response: UploadPhotoResponse = JSON.parse(uploadResult.body);

      logger.info('UPLOAD', 'Photo uploadée avec succès', {
        fileId: response.fileId,
        url: response.url,
      });

      return response;
    } catch (error) {
      logger.error('UPLOAD', 'Erreur upload photo', { error });
      throw error;
    }
  }

  /**
   * Upload une signature d'intervention
   */
  async uploadInterventionSignature(
    interventionId: string,
    signature: SignatureData
  ): Promise<UploadSignatureResponse> {
    try {
      const { tokens } = useAuthStore.getState();
      if (!tokens?.accessToken) {
        throw new Error('Non authentifié');
      }

      logger.info('UPLOAD', 'Début upload signature', {
        interventionId,
        fileName: signature.fileName,
      });

      // Convertir base64 en fichier temporaire
      const fileUri = `${FileSystem.cacheDirectory}${signature.fileName}`;

      // Extraire le contenu base64 (supprimer le préfixe data:image/png;base64,)
      const base64Data = signature.base64.split(',')[1] || signature.base64;

      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Upload le fichier
      const uploadResult = await FileSystem.uploadAsync(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.INTERVENTIONS.UPLOAD_SIGNATURE(interventionId)}`,
        fileUri,
        {
          httpMethod: 'POST',
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: 'file',
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
          parameters: {
            signerName: 'Client', // Nom par défaut
          },
        }
      );

      // Nettoyer le fichier temporaire
      await FileSystem.deleteAsync(fileUri, { idempotent: true });

      if (uploadResult.status !== 200 && uploadResult.status !== 201) {
        throw new Error(`Erreur upload: ${uploadResult.status}`);
      }

      const response: UploadSignatureResponse = JSON.parse(uploadResult.body);

      logger.info('UPLOAD', 'Signature uploadée avec succès', {
        fileId: response.fileId,
        url: response.url,
      });

      return response;
    } catch (error) {
      logger.error('UPLOAD', 'Erreur upload signature', { error });
      throw error;
    }
  }

  /**
   * Upload multiple photos en batch
   */
  async uploadMultiplePhotos(
    interventionId: string,
    photos: CapturedPhoto[],
    onProgress?: (current: number, total: number) => void
  ): Promise<UploadPhotoResponse[]> {
    const results: UploadPhotoResponse[] = [];
    const total = photos.length;

    logger.info('UPLOAD', 'Début batch upload photos', {
      interventionId,
      total,
    });

    for (let i = 0; i < photos.length; i++) {
      try {
        const result = await this.uploadInterventionPhoto(
          interventionId,
          photos[i]
        );
        results.push(result);
        onProgress?.(i + 1, total);
      } catch (error) {
        logger.error('UPLOAD', 'Erreur upload photo batch', {
          index: i,
          error,
        });
        // Continuer malgré l'erreur
      }
    }

    logger.info('UPLOAD', 'Batch upload terminé', {
      total,
      success: results.length,
      failed: total - results.length,
    });

    return results;
  }

  /**
   * Supprimer une photo
   */
  async deleteInterventionPhoto(
    interventionId: string,
    photoId: string
  ): Promise<void> {
    try {
      const { tokens } = useAuthStore.getState();
      if (!tokens?.accessToken) {
        throw new Error('Non authentifié');
      }

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/v1/interventions/files/${photoId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur suppression: ${response.status}`);
      }

      logger.info('UPLOAD', 'Photo supprimée', {
        interventionId,
        photoId,
      });
    } catch (error) {
      logger.error('UPLOAD', 'Erreur suppression photo', { error });
      throw error;
    }
  }

  /**
   * Supprimer une signature
   */
  async deleteInterventionSignature(interventionId: string): Promise<void> {
    try {
      const { tokens } = useAuthStore.getState();
      if (!tokens?.accessToken) {
        throw new Error('Non authentifié');
      }

      // Note: La signature utilise le même endpoint de suppression que les photos
      // Il faudra récupérer l'ID de la signature d'abord
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/v1/interventions/files/${interventionId}_signature`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur suppression: ${response.status}`);
      }

      logger.info('UPLOAD', 'Signature supprimée', {
        interventionId,
      });
    } catch (error) {
      logger.error('UPLOAD', 'Erreur suppression signature', { error });
      throw error;
    }
  }

  /**
   * Récupérer les photos d'une intervention
   */
  async getInterventionPhotos(interventionId: string): Promise<UploadPhotoResponse[]> {
    try {
      const { tokens } = useAuthStore.getState();
      if (!tokens?.accessToken) {
        throw new Error('Non authentifié');
      }

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.INTERVENTIONS.BY_ID(interventionId)}/files`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur récupération: ${response.status}`);
      }

      const filesData: any = await response.json();
      const photos: UploadPhotoResponse[] = filesData.photos.map((p: any) => ({
        fileId: p.id,
        url: p.url,
        fileName: p.filename,
        mimeType: p.mimeType,
        size: p.size,
      }));

      logger.info('UPLOAD', 'Photos récupérées', {
        interventionId,
        count: photos.length,
      });

      return photos;
    } catch (error) {
      logger.error('UPLOAD', 'Erreur récupération photos', { error });
      throw error;
    }
  }

  /**
   * Récupérer la signature d'une intervention
   */
  async getInterventionSignature(
    interventionId: string
  ): Promise<UploadSignatureResponse | null> {
    try {
      const { tokens } = useAuthStore.getState();
      if (!tokens?.accessToken) {
        throw new Error('Non authentifié');
      }

      // Récupérer tous les fichiers et extraire la signature
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.INTERVENTIONS.BY_ID(interventionId)}/files`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        }
      );

      if (response.status === 404) {
        return null; // Pas de signature
      }

      if (!response.ok) {
        throw new Error(`Erreur récupération: ${response.status}`);
      }

      const filesData: any = await response.json();
      const signature = filesData.signature;

      if (!signature) {
        return null;
      }

      logger.info('UPLOAD', 'Signature récupérée', {
        interventionId,
        fileId: signature.id,
      });

      return {
        fileId: signature.id,
        url: signature.url,
        fileName: signature.filename,
      };
    } catch (error) {
      logger.error('UPLOAD', 'Erreur récupération signature', { error });
      throw error;
    }
  }
}

// Export instance singleton
export const uploadService = new UploadService();
export default uploadService;
