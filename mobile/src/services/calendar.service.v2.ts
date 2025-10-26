/**
 * CalendarService v2 - API First
 *
 * Service pour gérer les événements du calendrier (interventions planifiées)
 * Version API-first compatible Expo Go (sans WatermelonDB)
 * Endpoints backend: /api/v1/calendar/*
 */

import { apiService} from './api.service';

// Correspond au backend CalendarEventDto
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDateTime: string;
  endDateTime?: string;
  eventType: string; // 'intervention' | 'appointment' | 'maintenance'
  status: string; // 'planned' | 'in_progress' | 'completed' | 'cancelled'
  colleagueId?: string;
  colleagueName?: string;
  customerId?: string;
  customerName?: string;
  address?: string;
  city?: string;
  zipcode?: string;
  latitude?: number;
  longitude?: number;
  creatorId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Helper pour obtenir le label du statut
export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    'planned': 'Planifié',
    'in_progress': 'En cours',
    'completed': 'Terminé',
    'cancelled': 'Annulé',
  };
  return labels[status] || status;
};

// Helper pour obtenir la couleur du statut
export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'planned': '#2196F3',      // Bleu
    'in_progress': '#FF9800',  // Orange
    'completed': '#4CAF50',    // Vert
    'cancelled': '#F44336',    // Rouge
  };
  return colors[status] || '#9E9E9E';
};

// Helper pour obtenir le label du type
export const getEventTypeLabel = (eventType: string): string => {
  const labels: Record<string, string> = {
    'intervention': 'Intervention',
    'appointment': 'Rendez-vous',
    'maintenance': 'Maintenance',
  };
  return labels[eventType] || eventType;
};

export interface CalendarStats {
  totalEvents: number;
  pendingEvents: number;
  inProgressEvents: number;
  completedEvents: number;
  cancelledEvents: number;
  totalEstimatedHours: number;
  totalActualHours: number;
}

export interface RescheduleEventDto {
  newScheduledDate: string;
  newScheduledEndDate?: string;
  reason?: string;
}

export class CalendarService {
  /**
   * Récupérer tous les événements du calendrier de l'utilisateur connecté
   */
  static async getMyEvents(params?: {
    startDate?: string;
    endDate?: string;
    status?: number;
  }): Promise<CalendarEvent[]> {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.status !== undefined) queryParams.append('status', params.status.toString());

    const url = `/api/v1/calendar/my-events${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiService.get(url);
    return response.data;
  }

  /**
   * Récupérer les événements d'aujourd'hui
   */
  static async getTodayEvents(): Promise<CalendarEvent[]> {
    const response = await apiService.get('/api/v1/calendar/today');
    return response.data;
  }

  /**
   * Récupérer les événements de la semaine en cours
   */
  static async getWeekEvents(startDate?: string): Promise<CalendarEvent[]> {
    const url = startDate
      ? `/api/v1/calendar/week?startDate=${startDate}`
      : '/api/v1/calendar/week';
    const response = await apiService.get(url);
    return response.data;
  }

  /**
   * Récupérer les événements d'un mois spécifique
   */
  static async getMonthEvents(year: number, month: number): Promise<CalendarEvent[]> {
    const response = await apiService.get(`/api/v1/calendar/month/${year}/${month}`);
    return response.data;
  }

  /**
   * Récupérer les détails d'un événement
   */
  static async getEvent(eventId: string): Promise<CalendarEvent> {
    const response = await apiService.get(`/api/v1/calendar/events/${eventId}`);
    return response.data;
  }

  /**
   * Récupérer les statistiques du calendrier
   */
  static async getStats(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<CalendarStats> {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const url = `/api/v1/calendar/stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiService.get(url);
    return response.data;
  }

  /**
   * Reprogrammer un événement
   */
  static async rescheduleEvent(
    eventId: string,
    data: RescheduleEventDto
  ): Promise<CalendarEvent> {
    const response = await apiService.put(
      `/api/v1/calendar/events/${eventId}/reschedule`,
      data
    );
    return response.data;
  }

  /**
   * Grouper les événements par date (helper pour les vues)
   */
  static groupEventsByDate(events: CalendarEvent[]): Record<string, CalendarEvent[]> {
    return events.reduce((acc, event) => {
      // Ignorer les événements sans date de début
      if (!event.startDateTime) {
        return acc;
      }

      const date = event.startDateTime.split('T')[0]; // YYYY-MM-DD
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
      return acc;
    }, {} as Record<string, CalendarEvent[]>);
  }

  /**
   * Obtenir les jours du mois avec événements
   */
  static getDaysWithEvents(events: CalendarEvent[]): Set<string> {
    return new Set(
      events
        .filter(event => event.startDateTime) // Filtrer les événements sans date
        .map(event => event.startDateTime.split('T')[0])
    );
  }
}
