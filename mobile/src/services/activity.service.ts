/**
 * ActivityService - API wrapper pour les notes/activités
 *
 * Fonctionnalités :
 * - Récupérer l'historique d'activités pour une intervention/client
 * - Créer une nouvelle note liée à une intervention
 * - Récupérer les statistiques d'activités
 */

import { apiService } from './api.service';

/**
 * Catégories d'activité
 */
export enum ActivityCategory {
  TASK = 0,
  APPOINTMENT = 1,
  PHONE_CALL = 2,
  EMAIL = 3,
  MEETING = 4,
  NOTE = 5,
  DOCUMENT = 8,
  OTHER = 99,
}

/**
 * États d'activité
 */
export enum ActivityState {
  TODO = 0,
  IN_PROGRESS = 1,
  COMPLETED = 2,
  CANCELLED = 3,
}

/**
 * Interface Activité
 */
export interface Activity {
  id: string;
  caption: string;
  activityCategory: number;
  categoryLabel: string;
  eventState?: number;
  stateLabel?: string;
  startDateTime: string;
  endDateTime?: string;
  customerId?: string;
  customerName?: string;
  contactId?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  colleagueId?: string;
  creatorColleagueId?: string;
  creatorName?: string;
  saleDocumentId?: string;
  scheduleEventId?: string;
  dealId?: string;
  notesClear?: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Paramètres de requête historique d'activités
 */
export interface QueryActivityHistoryParams {
  entityId: string;
  entityType?: 'customer' | 'project' | 'deal' | 'supplier';
  category?: ActivityCategory;
  limit?: number;
  offset?: number;
}

/**
 * Paramètres pour créer une note/activité
 */
export interface CreateActivityParams {
  caption: string;
  activityCategory: ActivityCategory;
  notesClear: string;
  scheduleEventId?: string;
  customerId?: string;
  colleagueId?: string;
  dealId?: string;
  startDateTime?: string;
  endDateTime?: string;
}

/**
 * Statistiques d'activités
 */
export interface ActivityStats {
  totalActivities: number;
  byCategory: Record<string, number>;
  lastActivityDate?: string;
  mostFrequentType: string;
}

/**
 * Service API pour les activités/notes
 */
export class ActivityService {
  /**
   * Récupérer l'historique d'activités pour une entité
   */
  static async getActivityHistory(
    params: QueryActivityHistoryParams
  ): Promise<Activity[]> {
    try {
      const queryParams = new URLSearchParams();

      queryParams.append('entityId', params.entityId);

      if (params.entityType) queryParams.append('entityType', params.entityType);
      if (params.category !== undefined) queryParams.append('category', params.category.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.offset) queryParams.append('offset', params.offset.toString());

      const response = await apiService.get<Activity[]>(
        `/api/v1/activity/history?${queryParams.toString()}`
      );

      return response.data;
    } catch (error: any) {
      console.error('Error fetching activity history:', error);
      throw error;
    }
  }

  /**
   * Récupérer une activité par ID
   */
  static async getActivityById(activityId: string): Promise<Activity> {
    try {
      const response = await apiService.get<Activity>(
        `/api/v1/activity/${activityId}`
      );

      return response.data;
    } catch (error: any) {
      console.error('Error fetching activity:', error);
      throw error;
    }
  }

  /**
   * Récupérer les activités récentes (toutes entités)
   */
  static async getRecentActivities(limit: number = 20): Promise<Activity[]> {
    try {
      const response = await apiService.get<Activity[]>(
        `/api/v1/activity/recent?limit=${limit}`
      );

      return response.data;
    } catch (error: any) {
      console.error('Error fetching recent activities:', error);
      throw error;
    }
  }

  /**
   * Récupérer les statistiques d'activités pour une entité
   */
  static async getActivityStats(
    entityId: string,
    entityType: 'customer' | 'project' | 'deal' | 'supplier' = 'customer'
  ): Promise<ActivityStats> {
    try {
      const response = await apiService.get<ActivityStats>(
        `/api/v1/activity/stats/${entityType}/${entityId}`
      );

      return response.data;
    } catch (error: any) {
      console.error('Error fetching activity stats:', error);
      throw error;
    }
  }

  /**
   * Créer une nouvelle note/activité
   */
  static async createActivity(params: CreateActivityParams): Promise<Activity> {
    try {
      const response = await apiService.post<Activity>('/api/v1/activity', params);

      return response.data;
    } catch (error: any) {
      console.error('Error creating activity:', error);
      throw error;
    }
  }

  /**
   * Créer une note rapide liée à une intervention
   * (helper pour simplifier la création de notes d'intervention)
   */
  static async createInterventionNote(
    interventionId: string,
    noteText: string,
    customerId?: string
  ): Promise<Activity> {
    const now = new Date();
    const caption = `Note intervention ${now.toLocaleDateString('fr-FR')}`;

    return this.createActivity({
      caption,
      activityCategory: ActivityCategory.NOTE,
      notesClear: noteText,
      scheduleEventId: interventionId,
      customerId,
      startDateTime: now.toISOString(),
      endDateTime: now.toISOString(),
    });
  }
}
