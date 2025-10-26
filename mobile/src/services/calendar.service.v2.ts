/**
 * CalendarService v2 - API First
 *
 * Service pour gérer les événements du calendrier (interventions planifiées)
 * Version API-first compatible Expo Go (sans WatermelonDB)
 * Endpoints backend: /api/v1/calendar/*
 */

import { apiService} from './api.service';

export interface CalendarEvent {
  id: string;
  reference: string;
  title: string;
  description?: string;
  scheduledDate: string;
  scheduledEndDate?: string;
  status: number;
  statusLabel: string;
  type: number;
  typeLabel: string;
  priority: number;
  customerId?: string;
  customerName?: string;
  technicianId?: string;
  technicianName?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  estimatedDuration?: number;
  actualDuration?: number;
  timeSpentSeconds?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

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
      // Ignorer les événements sans date planifiée
      if (!event.scheduledDate) {
        return acc;
      }

      const date = event.scheduledDate.split('T')[0]; // YYYY-MM-DD
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
        .filter(event => event.scheduledDate) // Filtrer les événements sans date
        .map(event => event.scheduledDate.split('T')[0])
    );
  }
}
