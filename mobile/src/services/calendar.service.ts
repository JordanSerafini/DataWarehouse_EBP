/**
 * Service de gestion du calendrier
 * Synchronisation des événements depuis l'API backend
 */

import { database } from '../config/database';
import CalendarEvent from '../models/CalendarEvent';
import { API_CONFIG } from '../config/api';
import logger from '../utils/logger';

/**
 * Interface API pour les événements calendrier
 */
export interface ApiCalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDateTime: string;
  endDateTime?: string;
  eventType: string;
  status: string;
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
  createdAt: string;
  updatedAt: string;
}

/**
 * Service CalendarService
 */
class CalendarService {
  /**
   * Récupère les événements depuis l'API pour une période donnée
   */
  async fetchEventsFromAPI(
    startDate: Date,
    endDate: Date,
    accessToken: string,
  ): Promise<ApiCalendarEvent[]> {
    try {
      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        limit: '100',
      });

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CALENDAR.MY_EVENTS}?${params}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const events: ApiCalendarEvent[] = await response.json();
      logger.info('CALENDAR_SERVICE', `Récupéré ${events.length} événements depuis l'API`);
      return events;
    } catch (error) {
      logger.error('CALENDAR_SERVICE', 'Erreur récupération événements API', error);
      throw error;
    }
  }

  /**
   * Récupère les événements d'aujourd'hui depuis l'API
   */
  async fetchTodayEventsFromAPI(accessToken: string): Promise<ApiCalendarEvent[]> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CALENDAR.TODAY}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const events: ApiCalendarEvent[] = await response.json();
      logger.info('CALENDAR_SERVICE', `Récupéré ${events.length} événements aujourd'hui`);
      return events;
    } catch (error) {
      logger.error('CALENDAR_SERVICE', 'Erreur récupération événements aujourd\'hui', error);
      throw error;
    }
  }

  /**
   * Récupère les événements de la semaine depuis l'API
   */
  async fetchWeekEventsFromAPI(accessToken: string): Promise<ApiCalendarEvent[]> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CALENDAR.WEEK}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const events: ApiCalendarEvent[] = await response.json();
      logger.info('CALENDAR_SERVICE', `Récupéré ${events.length} événements cette semaine`);
      return events;
    } catch (error) {
      logger.error('CALENDAR_SERVICE', 'Erreur récupération événements semaine', error);
      throw error;
    }
  }

  /**
   * Récupère les événements d'un mois depuis l'API
   */
  async fetchMonthEventsFromAPI(
    year: number,
    month: number,
    accessToken: string,
  ): Promise<ApiCalendarEvent[]> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CALENDAR.MONTH(year, month)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const events: ApiCalendarEvent[] = await response.json();
      logger.info('CALENDAR_SERVICE', `Récupéré ${events.length} événements pour ${month}/${year}`);
      return events;
    } catch (error) {
      logger.error('CALENDAR_SERVICE', 'Erreur récupération événements mois', error);
      throw error;
    }
  }

  /**
   * Synchronise les événements depuis l'API vers la base locale
   */
  async syncEvents(apiEvents: ApiCalendarEvent[]): Promise<void> {
    try {
      await database.write(async () => {
        const eventsCollection = database.get<CalendarEvent>('calendar_events');

        for (const apiEvent of apiEvents) {
          try {
            // Chercher si l'événement existe déjà
            const existingEvents = await eventsCollection
              .query()
              .where('server_id', apiEvent.id)
              .fetch();

            if (existingEvents.length > 0) {
              // Mettre à jour l'événement existant
              const existingEvent = existingEvents[0];
              await existingEvent.update((record) => {
                record.title = apiEvent.title;
                record.description = apiEvent.description;
                record.startDateTime = new Date(apiEvent.startDateTime);
                record.endDateTime = apiEvent.endDateTime
                  ? new Date(apiEvent.endDateTime)
                  : undefined;
                record.eventType = apiEvent.eventType;
                record.status = apiEvent.status;
                record.colleagueId = apiEvent.colleagueId;
                record.colleagueName = apiEvent.colleagueName;
                record.customerId = apiEvent.customerId;
                record.customerName = apiEvent.customerName;
                record.address = apiEvent.address;
                record.city = apiEvent.city;
                record.zipcode = apiEvent.zipcode;
                record.latitude = apiEvent.latitude;
                record.longitude = apiEvent.longitude;
                record.creatorId = apiEvent.creatorId;
                record.isSynced = true;
                record.lastSyncedAt = new Date();
              });
            } else {
              // Créer un nouvel événement
              await eventsCollection.create((record) => {
                record.serverId = apiEvent.id;
                record.title = apiEvent.title;
                record.description = apiEvent.description;
                record.startDateTime = new Date(apiEvent.startDateTime);
                record.endDateTime = apiEvent.endDateTime
                  ? new Date(apiEvent.endDateTime)
                  : undefined;
                record.eventType = apiEvent.eventType;
                record.status = apiEvent.status;
                record.colleagueId = apiEvent.colleagueId;
                record.colleagueName = apiEvent.colleagueName;
                record.customerId = apiEvent.customerId;
                record.customerName = apiEvent.customerName;
                record.address = apiEvent.address;
                record.city = apiEvent.city;
                record.zipcode = apiEvent.zipcode;
                record.latitude = apiEvent.latitude;
                record.longitude = apiEvent.longitude;
                record.creatorId = apiEvent.creatorId;
                record.isSynced = true;
                record.lastSyncedAt = new Date();
              });
            }
          } catch (error) {
            logger.error('CALENDAR_SERVICE', `Erreur sync événement ${apiEvent.id}`, error);
          }
        }
      });

      logger.info('CALENDAR_SERVICE', `Synchronisé ${apiEvents.length} événements avec succès`);
    } catch (error) {
      logger.error('CALENDAR_SERVICE', 'Erreur synchronisation événements', error);
      throw error;
    }
  }

  /**
   * Synchronisation complète d'un mois
   */
  async syncMonth(year: number, month: number, accessToken: string): Promise<number> {
    try {
      logger.info('CALENDAR_SERVICE', `Début sync mois ${month}/${year}`);

      // Récupérer les événements depuis l'API
      const apiEvents = await this.fetchMonthEventsFromAPI(year, month, accessToken);

      // Synchroniser avec la base locale
      await this.syncEvents(apiEvents);

      logger.info('CALENDAR_SERVICE', `Sync mois ${month}/${year} terminée: ${apiEvents.length} événements`);
      return apiEvents.length;
    } catch (error) {
      logger.error('CALENDAR_SERVICE', `Erreur sync mois ${month}/${year}`, error);
      throw error;
    }
  }

  /**
   * Synchronisation complète de la semaine
   */
  async syncWeek(accessToken: string): Promise<number> {
    try {
      logger.info('CALENDAR_SERVICE', 'Début sync semaine');

      // Récupérer les événements depuis l'API
      const apiEvents = await this.fetchWeekEventsFromAPI(accessToken);

      // Synchroniser avec la base locale
      await this.syncEvents(apiEvents);

      logger.info('CALENDAR_SERVICE', `Sync semaine terminée: ${apiEvents.length} événements`);
      return apiEvents.length;
    } catch (error) {
      logger.error('CALENDAR_SERVICE', 'Erreur sync semaine', error);
      throw error;
    }
  }

  /**
   * Synchronisation des événements d'aujourd'hui
   */
  async syncToday(accessToken: string): Promise<number> {
    try {
      logger.info('CALENDAR_SERVICE', 'Début sync aujourd\'hui');

      // Récupérer les événements depuis l'API
      const apiEvents = await this.fetchTodayEventsFromAPI(accessToken);

      // Synchroniser avec la base locale
      await this.syncEvents(apiEvents);

      logger.info('CALENDAR_SERVICE', `Sync aujourd'hui terminée: ${apiEvents.length} événements`);
      return apiEvents.length;
    } catch (error) {
      logger.error('CALENDAR_SERVICE', 'Erreur sync aujourd\'hui', error);
      throw error;
    }
  }

  /**
   * Récupère un événement depuis la base locale
   */
  async getLocalEvent(eventId: string): Promise<CalendarEvent | null> {
    try {
      const event = await database.get<CalendarEvent>('calendar_events').find(eventId);
      return event;
    } catch (error) {
      logger.error('CALENDAR_SERVICE', `Événement ${eventId} introuvable`, error);
      return null;
    }
  }

  /**
   * Compte le nombre d'événements en base locale
   */
  async getLocalEventsCount(): Promise<number> {
    try {
      const count = await database.get<CalendarEvent>('calendar_events').query().fetchCount();
      return count;
    } catch (error) {
      logger.error('CALENDAR_SERVICE', 'Erreur comptage événements', error);
      return 0;
    }
  }
}

// Export singleton
export default new CalendarService();
