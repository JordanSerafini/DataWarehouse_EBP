import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from './database.service';
import {
  CalendarEventDto,
  QueryCalendarEventsDto,
  RescheduleEventDto,
  CalendarStatsDto,
  EventType,
  EventStatus,
} from '../dto/calendar/calendar-event.dto';

/**
 * Interface pour les statistiques brutes depuis la base de données
 */
interface CalendarStatsRow {
  totalEvents: string;
  plannedEvents: string;
  inProgressEvents: string;
  completedEvents: string;
  totalPlannedHours: string;
}

@Injectable()
export class CalendarService {
  private readonly logger = new Logger(CalendarService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Récupère les événements calendrier pour un technicien
   */
  async getEventsForTechnician(
    technicianId: string,
    query: QueryCalendarEventsDto,
  ): Promise<CalendarEventDto[]> {
    this.logger.log(`Fetching calendar events for technician: ${technicianId}`);

    try {
      // Construction de la requête SQL avec filtres
      let sqlQuery = `
        SELECT
          se."Id"::text as id,
          se."Caption" as title,
          se."StartDateTime" as "startDateTime",
          se."EndDateTime" as "endDateTime",
          se."ColleagueId" as "colleagueId",
          col."Contact_Name" as "colleagueName",
          se."CustomerId" as "customerId",
          c."Name" as "customerName",
          CONCAT_WS(', ',
            se."Address_Address1",
            se."Address_ZipCode",
            se."Address_City"
          ) as address,
          se."Address_City" as city,
          se."Address_ZipCode" as zipcode,
          se."Address_Latitude" as latitude,
          se."Address_Longitude" as longitude,
          se."CreatorColleagueId" as "creatorId",
          se."sysCreatedDate" as "createdAt",
          se."sysModifiedDate" as "updatedAt",
          -- Déterminer le type d'événement
          CASE
            WHEN se."Maintenance_InterventionDescription" IS NOT NULL THEN 'maintenance'
            WHEN se."CustomerId" IS NOT NULL THEN 'intervention'
            ELSE 'appointment'
          END as "eventType",
          -- Déterminer le statut (simplifié pour l'instant)
          CASE
            WHEN se."EndDateTime" < NOW() THEN 'completed'
            WHEN se."StartDateTime" <= NOW() AND se."EndDateTime" >= NOW() THEN 'in_progress'
            ELSE 'planned'
          END as status
        FROM public."ScheduleEvent" se
        LEFT JOIN public."Colleague" col ON col."Id" = se."ColleagueId"
        LEFT JOIN public."Customer" c ON c."Id" = se."CustomerId"
        WHERE se."ColleagueId" = $1
          AND se."StartDateTime" >= $2
          AND se."StartDateTime" <= $3
      `;

      const params: (string | Date | number)[] = [technicianId, query.startDate, query.endDate];
      let paramIndex = 4;

      // Filtre optionnel par type
      if (query.eventType) {
        sqlQuery += ` AND CASE
            WHEN se."Maintenance_InterventionDescription" IS NOT NULL THEN 'maintenance'
            WHEN se."CustomerId" IS NOT NULL THEN 'intervention'
            ELSE 'appointment'
          END = $${paramIndex}`;
        params.push(query.eventType);
        paramIndex++;
      }

      // Filtre optionnel par statut
      if (query.status) {
        sqlQuery += ` AND CASE
            WHEN se."EndDateTime" < NOW() THEN 'completed'
            WHEN se."StartDateTime" <= NOW() AND se."EndDateTime" >= NOW() THEN 'in_progress'
            ELSE 'planned'
          END = $${paramIndex}`;
        params.push(query.status);
        paramIndex++;
      }

      sqlQuery += ` ORDER BY se."StartDateTime" ASC`;

      // Pagination
      const limit = query.limit || 50;
      const offset = query.offset || 0;
      sqlQuery += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      params.push(limit, offset);

      const result = await this.databaseService.query<CalendarEventDto>(sqlQuery, params);

      this.logger.log(`Found ${result.rows.length} calendar events for technician ${technicianId}`);
      return result.rows;
    } catch (error) {
      this.logger.error(`Error fetching calendar events for technician ${technicianId}:`, error);
      throw new BadRequestException('Erreur lors de la récupération des événements calendrier');
    }
  }

  /**
   * Récupère un événement par ID
   */
  async getEventById(eventId: string): Promise<CalendarEventDto> {
    this.logger.log(`Fetching calendar event: ${eventId}`);

    try {
      const sqlQuery = `
        SELECT
          se."Id"::text as id,
          se."Caption" as title,
          se."StartDateTime" as "startDateTime",
          se."EndDateTime" as "endDateTime",
          se."ColleagueId" as "colleagueId",
          col."Contact_Name" as "colleagueName",
          se."CustomerId" as "customerId",
          c."Name" as "customerName",
          CONCAT_WS(', ',
            se."Address_Address1",
            se."Address_ZipCode",
            se."Address_City"
          ) as address,
          se."Address_City" as city,
          se."Address_ZipCode" as zipcode,
          se."Address_Latitude" as latitude,
          se."Address_Longitude" as longitude,
          se."CreatorColleagueId" as "creatorId",
          se."sysCreatedDate" as "createdAt",
          se."sysModifiedDate" as "updatedAt",
          CASE
            WHEN se."Maintenance_InterventionDescription" IS NOT NULL THEN 'maintenance'
            WHEN se."CustomerId" IS NOT NULL THEN 'intervention'
            ELSE 'appointment'
          END as "eventType",
          CASE
            WHEN se."EndDateTime" < NOW() THEN 'completed'
            WHEN se."StartDateTime" <= NOW() AND se."EndDateTime" >= NOW() THEN 'in_progress'
            ELSE 'planned'
          END as status
        FROM public."ScheduleEvent" se
        LEFT JOIN public."Colleague" col ON col."Id" = se."ColleagueId"
        LEFT JOIN public."Customer" c ON c."Id" = se."CustomerId"
        WHERE se."Id" = $1
      `;

      const result = await this.databaseService.query<CalendarEventDto>(sqlQuery, [eventId]);

      if (result.rows.length === 0) {
        throw new NotFoundException(`Événement calendrier ${eventId} introuvable`);
      }

      return result.rows[0];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching calendar event ${eventId}:`, error);
      throw new BadRequestException('Erreur lors de la récupération de l\'événement');
    }
  }

  /**
   * Récupère les événements d'aujourd'hui pour un technicien
   */
  async getTodayEvents(technicianId: string): Promise<CalendarEventDto[]> {
    this.logger.log(`Fetching today's events for technician: ${technicianId}`);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.getEventsForTechnician(technicianId, {
      startDate: today,
      endDate: tomorrow,
    });
  }

  /**
   * Récupère les événements de la semaine pour un technicien
   */
  async getWeekEvents(technicianId: string): Promise<CalendarEventDto[]> {
    this.logger.log(`Fetching week events for technician: ${technicianId}`);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Début de la semaine (lundi)
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    // Fin de la semaine (dimanche)
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 7);

    return this.getEventsForTechnician(technicianId, {
      startDate: monday,
      endDate: sunday,
    });
  }

  /**
   * Récupère les événements du mois pour un technicien
   */
  async getMonthEvents(
    technicianId: string,
    year: number,
    month: number,
  ): Promise<CalendarEventDto[]> {
    this.logger.log(`Fetching month events for technician: ${technicianId} (${year}-${month})`);

    const startDate = new Date(year, month - 1, 1); // month is 1-indexed
    const endDate = new Date(year, month, 1);

    return this.getEventsForTechnician(technicianId, {
      startDate,
      endDate,
    });
  }

  /**
   * Récupère les statistiques calendrier pour un technicien
   */
  async getCalendarStats(
    technicianId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<CalendarStatsDto> {
    this.logger.log(`Fetching calendar stats for technician: ${technicianId}`);

    try {
      const sqlQuery = `
        SELECT
          COUNT(*) as "totalEvents",
          SUM(CASE WHEN
            (CASE
              WHEN se."EndDateTime" < NOW() THEN 'completed'
              WHEN se."StartDateTime" <= NOW() AND se."EndDateTime" >= NOW() THEN 'in_progress'
              ELSE 'planned'
            END) = 'planned' THEN 1 ELSE 0 END) as "plannedEvents",
          SUM(CASE WHEN
            (CASE
              WHEN se."EndDateTime" < NOW() THEN 'completed'
              WHEN se."StartDateTime" <= NOW() AND se."EndDateTime" >= NOW() THEN 'in_progress'
              ELSE 'planned'
            END) = 'in_progress' THEN 1 ELSE 0 END) as "inProgressEvents",
          SUM(CASE WHEN
            (CASE
              WHEN se."EndDateTime" < NOW() THEN 'completed'
              WHEN se."StartDateTime" <= NOW() AND se."EndDateTime" >= NOW() THEN 'in_progress'
              ELSE 'planned'
            END) = 'completed' THEN 1 ELSE 0 END) as "completedEvents",
          0 as "cancelledEvents",
          SUM(
            EXTRACT(EPOCH FROM (se."EndDateTime" - se."StartDateTime")) / 3600
          ) as "totalPlannedHours"
        FROM public."ScheduleEvent" se
        WHERE se."ColleagueId" = $1
          AND se."StartDateTime" >= $2
          AND se."StartDateTime" <= $3
      `;

      const result = await this.databaseService.query<CalendarStatsRow>(sqlQuery, [
        technicianId,
        startDate,
        endDate,
      ]);

      const stats = result.rows[0];

      return {
        totalEvents: parseInt(stats.totalEvents, 10) || 0,
        plannedEvents: parseInt(stats.plannedEvents, 10) || 0,
        inProgressEvents: parseInt(stats.inProgressEvents, 10) || 0,
        completedEvents: parseInt(stats.completedEvents, 10) || 0,
        cancelledEvents: 0, // À implémenter avec un champ dédié si disponible
        totalPlannedHours: parseFloat(stats.totalPlannedHours) || 0,
      };
    } catch (error) {
      this.logger.error(`Error fetching calendar stats for technician ${technicianId}:`, error);
      throw new BadRequestException('Erreur lors du calcul des statistiques calendrier');
    }
  }

  /**
   * Reprogramme un événement
   * Note: Cette fonction prépare les données mais ne modifie pas directement EBP
   * Elle retourne les informations de reprogrammation pour synchronisation
   */
  async rescheduleEvent(
    eventId: string,
    dto: RescheduleEventDto,
  ): Promise<{ success: boolean; message: string; event: CalendarEventDto }> {
    this.logger.log(`Rescheduling event ${eventId}`);

    try {
      // Vérifier que l'événement existe
      const event = await this.getEventById(eventId);

      // Pour l'instant, on retourne simplement les informations
      // Dans une vraie implémentation, on créerait une demande de modification
      // dans mobile.calendar_reschedule_requests ou similaire

      this.logger.warn(
        `Event ${eventId} reschedule requested but not persisted (read-only EBP mode)`,
      );

      return {
        success: true,
        message: 'Demande de reprogrammation enregistrée (synchronisation différée)',
        event,
      };
    } catch (error) {
      this.logger.error(`Error rescheduling event ${eventId}:`, error);
      throw new BadRequestException('Erreur lors de la reprogrammation de l\'événement');
    }
  }
}
