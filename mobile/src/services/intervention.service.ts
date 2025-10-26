/**
 * InterventionService - Gestion des interventions terrain
 *
 * Encapsule tous les appels API backend pour les interventions :
 * - Lecture (liste, détail, stats)
 * - Workflow (start, complete, update)
 * - Fichiers (photos, signature)
 * - Timesheet
 */

import { apiService } from './api.service';

export interface Intervention {
  id: string;
  reference: string;
  customerName: string;
  customerId: string;
  technicianName?: string;
  technicianId?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  scheduledDate: string;
  startedAt?: string;
  completedAt?: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  distance?: number; // Pour les interventions nearby
}

export interface TechnicianStats {
  totalInterventions: number;
  completedInterventions: number;
  pendingInterventions: number;
  inProgressInterventions: number;
  completionRate: number;
  averageTimePerIntervention?: number;
}

export interface InterventionFile {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

export interface InterventionFiles {
  photos: InterventionFile[];
  signature?: InterventionFile;
  totalFiles: number;
  totalSize: number;
}

export interface QueryInterventionsParams {
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startDate?: string;
  endDate?: string;
  customerId?: string;
  limit?: number;
  offset?: number;
}

export interface QueryNearbyParams {
  latitude: number;
  longitude: number;
  radius?: number; // En kilomètres (défaut: 10km)
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface StartInterventionDto {
  startedAt?: string; // ISO date, par défaut: now
  notes?: string;
}

export interface CompleteInterventionDto {
  completedAt?: string; // ISO date, par défaut: now
  report: string; // Rapport d'intervention (requis)
  recommendations?: string;
  nextSteps?: string;
}

export interface CreateTimesheetDto {
  interventionId: string;
  startTime: string; // ISO date
  endTime: string; // ISO date
  breakDuration?: number; // En minutes
  description?: string;
  kilometrage?: number;
}

export interface UploadPhotoResult {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

export class InterventionService {
  /**
   * Récupère les interventions du technicien connecté
   */
  static async getMyInterventions(params?: QueryInterventionsParams): Promise<Intervention[]> {
    const response = await apiService.get('/api/v1/interventions/my-interventions', { params });
    return response.data;
  }

  /**
   * Récupère les statistiques du technicien connecté
   */
  static async getMyStats(): Promise<TechnicianStats> {
    const response = await apiService.get('/api/v1/interventions/my-stats');
    return response.data;
  }

  /**
   * Recherche d'interventions (avec filtres)
   */
  static async searchInterventions(params?: QueryInterventionsParams): Promise<Intervention[]> {
    const response = await apiService.get('/api/v1/interventions/search', { params });
    return response.data;
  }

  /**
   * Récupère les interventions à proximité GPS
   */
  static async getNearbyInterventions(params: QueryNearbyParams): Promise<Intervention[]> {
    const response = await apiService.get('/api/v1/interventions/nearby', { params });
    return response.data;
  }

  /**
   * Récupère une intervention par ID
   */
  static async getInterventionById(id: string): Promise<Intervention> {
    const response = await apiService.get(`/api/v1/interventions/${id}`);
    return response.data;
  }

  /**
   * Démarre une intervention (statut → EN_COURS)
   */
  static async startIntervention(id: string, dto?: StartInterventionDto): Promise<Intervention> {
    const response = await apiService.put(`/api/v1/interventions/${id}/start`, dto || {});
    return response.data;
  }

  /**
   * Clôture une intervention (statut → COMPLETE)
   */
  static async completeIntervention(id: string, dto: CompleteInterventionDto): Promise<Intervention> {
    const response = await apiService.put(`/api/v1/interventions/${id}/complete`, dto);
    return response.data;
  }

  /**
   * Met à jour une intervention
   */
  static async updateIntervention(id: string, updates: Partial<Intervention>): Promise<Intervention> {
    const response = await apiService.put(`/api/v1/interventions/${id}`, updates);
    return response.data;
  }

  /**
   * Enregistre le temps passé (timesheet)
   */
  static async createTimesheet(dto: CreateTimesheetDto): Promise<{ success: boolean; message: string }> {
    const response = await apiService.post('/api/v1/interventions/timesheet', dto);
    return response.data;
  }

  /**
   * Upload une photo d'intervention
   */
  static async uploadPhoto(
    interventionId: string,
    file: {
      uri: string;
      name: string;
      type: string;
    },
    latitude?: number,
    longitude?: number
  ): Promise<UploadPhotoResult> {
    const formData = new FormData();

    // Ajouter le fichier
    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as any);

    // Ajouter les coordonnées GPS si disponibles
    if (latitude !== undefined) {
      formData.append('latitude', latitude.toString());
    }
    if (longitude !== undefined) {
      formData.append('longitude', longitude.toString());
    }

    const response = await apiService.post(
      `/api/v1/interventions/${interventionId}/photos`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  }

  /**
   * Upload la signature client
   */
  static async uploadSignature(
    interventionId: string,
    file: {
      uri: string;
      name: string;
      type: string;
    },
    signerName: string
  ): Promise<UploadPhotoResult> {
    const formData = new FormData();

    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as any);

    formData.append('signerName', signerName);

    const response = await apiService.post(
      `/api/v1/interventions/${interventionId}/signature`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  }

  /**
   * Récupère tous les fichiers d'une intervention
   */
  static async getInterventionFiles(interventionId: string): Promise<InterventionFiles> {
    const response = await apiService.get(`/api/v1/interventions/${interventionId}/files`);
    return response.data;
  }

  /**
   * Supprime un fichier (photo ou signature)
   */
  static async deleteFile(fileId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiService.delete(`/api/v1/interventions/files/${fileId}`);
    return response.data;
  }

  /**
   * Récupère l'URL de téléchargement d'un fichier
   */
  static getFileDownloadUrl(fileId: string): string {
    return `/api/v1/interventions/files/${fileId}/download`;
  }
}
