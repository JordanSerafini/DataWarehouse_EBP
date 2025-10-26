import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { DatabaseService } from './database.service';
import {
  InterventionDto,
  InterventionStatusDto,
  InterventionTypeDto,
  InterventionPriorityDto,
  InterventionWithDistanceDto,
  TechnicianStatsDto,
} from '../dto/interventions/intervention.dto';
import {
  UpdateInterventionDto,
  StartInterventionDto,
  CompleteInterventionDto,
  CreateTimesheetDto,
  InterventionStatus,
} from '../dto/interventions/update-intervention.dto';
import {
  QueryInterventionsDto,
  QueryNearbyInterventionsDto,
} from '../dto/interventions/query-interventions.dto';

@Injectable()
export class InterventionsService {
  private readonly logger = new Logger(InterventionsService.name);

  private static readonly INTERVENTION_BASE_QUERY = `
    SELECT
      se."Id"::text as id,
      se."ScheduleEventNumber" as reference,
      COALESCE(se."Caption", '') as title,
      COALESCE(
        NULLIF(se."Maintenance_InterventionDescriptionClear", ''),
        NULLIF(se."Maintenance_InterventionDescription", ''),
        NULLIF(se."Maintenance_InterventionReport", ''),
        NULLIF(se."NotesClear", '')
      ) as description,
      se."Maintenance_InterventionReport" as report,
      se."NotesClear" as notes,
      se."StartDateTime" as "scheduledDate",
      se."EndDateTime" as "scheduledEndDate",
      se."EventState" as "eventState",
      se."EventType" as "eventType",
      se."ExpectedDuration_DurationInHours" as "estimatedDurationHours",
      se."AchievedDuration_DurationInHours" as "achievedDurationHours",
      se."CustomerId" as "customerId",
      c."Name" as "customerName",
      COALESCE(cnt."ContactFields_CellPhone", cnt."ContactFields_Phone") as "contactPhone",
      se."ColleagueId" as "technicianId",
      col."Contact_Name" as "technicianName",
      CONCAT_WS(', ',
        NULLIF(se."Address_Address1", ''),
        NULLIF(se."Address_Address2", ''),
        NULLIF(se."Address_ZipCode", ''),
        NULLIF(se."Address_City", '')
      ) as address,
      se."Address_City" as city,
      se."Address_ZipCode" as "postalCode",
      se."Address_Latitude" as latitude,
      se."Address_Longitude" as longitude,
      se."sysCreatedDate" as "createdAt",
      se."sysModifiedDate" as "updatedAt",
      'schedule_event' as source_type
    FROM public."ScheduleEvent" se
    LEFT JOIN public."Customer" c ON c."Id" = se."CustomerId"
    LEFT JOIN public."Contact" cnt ON cnt."Id" = se."ContactId"
    LEFT JOIN public."Colleague" col ON col."Id" = se."ColleagueId"

    UNION ALL

    SELECT
      i."Id"::text as id,
      i."Id" as reference,
      COALESCE(i."Caption", '') as title,
      COALESCE(
        NULLIF(i."DescriptionClear", ''),
        NULLIF(i."Description", '')
      ) as description,
      NULL as report,
      i."DescriptionClear" as notes,
      i."StartDate" as "scheduledDate",
      i."EndDate" as "scheduledEndDate",
      i."Status" as "eventState",
      NULL as "eventType",
      i."PredictedDuration" as "estimatedDurationHours",
      i."AccomplishedDuration" as "achievedDurationHours",
      i."CustomerId" as "customerId",
      i."CustomerName" as "customerName",
      NULL as "contactPhone",
      i."CreatorColleagueId" as "technicianId",
      col2."Contact_Name" as "technicianName",
      NULL as address,
      NULL as city,
      NULL as "postalCode",
      NULL as latitude,
      NULL as longitude,
      i."sysCreatedDate" as "createdAt",
      i."sysModifiedDate" as "updatedAt",
      'incident' as source_type
    FROM public."Incident" i
    LEFT JOIN public."Colleague" col2 ON col2."Id" = i."CreatorColleagueId"
  `;

  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Récupère les interventions d'un technicien
   * Wrapper pour mobile.get_technician_interventions()
   */
  async getInterventionsForTechnician(
    technicianId: string,
    query: QueryInterventionsDto,
  ): Promise<InterventionDto[]> {
    this.logger.log(`Fetching interventions for technician: ${technicianId}`);

    if (!technicianId) {
      this.logger.warn('No colleagueId found on user payload, returning empty interventions list');
      return [];
    }

    const dateFrom = this.resolveDateRangeStart(query.dateFrom);
    const dateTo = this.resolveDateRangeEnd(query.dateTo);

    try {
      const sql = `
        SELECT * FROM (
          ${InterventionsService.INTERVENTION_BASE_QUERY}
        ) AS interventions
        WHERE "technicianId" = $1
          AND "scheduledDate" >= $2
          AND "scheduledDate" <= $3
        ORDER BY "scheduledDate" ASC
      `;

      const result = await this.databaseService.query(sql, [technicianId, dateFrom, dateTo]);
      const mapped = result.rows.map(row => this.buildInterventionDto(row));

      let filtered = mapped;
      if (query.status !== undefined) {
        filtered = filtered.filter(intervention => intervention.status === query.status);
      }

      const offset = query.offset ?? 0;
      const limit = query.limit ?? 50;
      const paginated = filtered.slice(offset, offset + limit);

      this.logger.log(
        `Found ${paginated.length} interventions for technician ${technicianId} (fetched ${mapped.length})`,
      );

      return paginated;
    } catch (error) {
      this.logger.error(`Error fetching interventions for technician ${technicianId}:`, error);
      throw new BadRequestException('Erreur lors de la récupération des interventions');
    }
  }

  /**
   * Récupère une intervention par ID
   */
  async getInterventionById(interventionId: string): Promise<InterventionDto> {
    this.logger.log(`Fetching intervention: ${interventionId}`);

    try {
      const sql = `
        SELECT * FROM (
          ${InterventionsService.INTERVENTION_BASE_QUERY}
        ) AS interventions
        WHERE id = $1
        LIMIT 1
      `;

      const result = await this.databaseService.query(sql, [interventionId]);

      if (result.rows.length === 0) {
        throw new NotFoundException(`Intervention ${interventionId} non trouvée`);
      }

      return this.buildInterventionDto(result.rows[0]);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Error fetching intervention ${interventionId}:`, error);
      throw new BadRequestException('Erreur lors de la récupération de l\'intervention');
    }
  }

  /**
   * Récupère les interventions à proximité
   * Wrapper pour mobile.get_nearby_interventions()
   */
  async getNearbyInterventions(
    query: QueryNearbyInterventionsDto,
  ): Promise<InterventionWithDistanceDto[]> {
    this.logger.log(
      `Fetching interventions near (${query.latitude}, ${query.longitude}) within ${query.radiusKm}km`,
    );

    try {
      const result = await this.databaseService.query<InterventionWithDistanceDto>(
        `SELECT * FROM mobile.get_nearby_interventions($1, $2, $3, $4, $5)`,
        [
          query.latitude,
          query.longitude,
          query.radiusKm || 50,
          query.technicianId || null,
          query.limit || 20,
        ],
      );

      this.logger.log(`Found ${result.rows.length} nearby interventions`);
      return result.rows;
    } catch (error) {
      this.logger.error('Error fetching nearby interventions:', error);
      throw new BadRequestException('Erreur lors de la recherche d\'interventions à proximité');
    }
  }

  /**
   * Récupère les statistiques d'un technicien
   * Wrapper pour mobile.get_technician_stats()
   */
  async getTechnicianStats(
    technicianId: string,
    dateFrom?: Date,
    dateTo?: Date,
  ): Promise<TechnicianStatsDto> {
    this.logger.log(`Fetching stats for technician: ${technicianId}`);

    const from = dateFrom || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 jours par défaut
    const to = dateTo || new Date();

    try {
      const result = await this.databaseService.query<TechnicianStatsDto>(
        `SELECT * FROM mobile.get_technician_stats($1, $2, $3)`,
        [technicianId, from, to],
      );

      if (result.rows.length === 0) {
        // Retourner des stats à zéro si aucune intervention
        return {
          totalInterventions: 0,
          completedToday: 0,
          upcoming24h: 0,
          overdue: 0,
          avgInterventionsPerDay: 0,
        };
      }

      return result.rows[0];
    } catch (error) {
      this.logger.error(`Error fetching stats for technician ${technicianId}:`, error);
      throw new BadRequestException('Erreur lors de la récupération des statistiques');
    }
  }

  /**
   * Démarre une intervention
   */
  async startIntervention(
    interventionId: string,
    technicianId: string,
    dto: StartInterventionDto,
  ): Promise<InterventionDto> {
    this.logger.log(`Starting intervention ${interventionId} by technician ${technicianId}`);

    try {
      // Vérifier que l'intervention existe et appartient au technicien
      await this.getInterventionById(interventionId);

      // Vérifier qu'aucune intervention n'est déjà en cours pour ce technicien
      // EventState = 1 dans EBP signifie IN_PROGRESS
      const inProgressCheck = await this.databaseService.query(
        `
        SELECT "Id"::text as id, "ScheduleEventNumber" as reference
        FROM public."ScheduleEvent"
        WHERE "ColleagueId" = $1
          AND "EventState" = 1
          AND "Id" != $3
        LIMIT 1
        `,
        [technicianId, interventionId],
      );

      if (inProgressCheck.rows.length > 0) {
        const ongoing = inProgressCheck.rows[0];
        throw new BadRequestException(
          `Vous avez déjà une intervention en cours : ${ongoing.reference}. ` +
          `Veuillez la clôturer avant d'en démarrer une nouvelle.`,
        );
      }

      // Mettre à jour le statut et la date de début
      // EventState = 1 dans EBP signifie IN_PROGRESS
      await this.databaseService.query(
        `
        UPDATE public."ScheduleEvent"
        SET
          "EventState" = 1,
          "ActualStartDate" = $2,
          "sysModifiedDate" = NOW()
        WHERE "Id" = $3
        `,
        [new Date(), interventionId],
      );

      // Ajouter notes de démarrage si fournies
      if (dto.notes) {
        await this.databaseService.query(
          `
          UPDATE public."ScheduleEvent"
          SET "NotesClear" = COALESCE("NotesClear", '') || $1
          WHERE "Id" = $2
          `,
          [`\n[${new Date().toISOString()}] Démarrage: ${dto.notes}`, interventionId],
        );
      }

      this.logger.log(`Intervention ${interventionId} started successfully`);
      return this.getInterventionById(interventionId);
    } catch (error) {
      this.logger.error(`Error starting intervention ${interventionId}:`, error);
      throw new BadRequestException('Erreur lors du démarrage de l\'intervention');
    }
  }

  /**
   * Clôture une intervention
   */
  async completeIntervention(
    interventionId: string,
    technicianId: string,
    dto: CompleteInterventionDto,
  ): Promise<InterventionDto> {
    this.logger.log(`Completing intervention ${interventionId} by technician ${technicianId}`);

    try {
      // Vérifier que l'intervention existe
      await this.getInterventionById(interventionId);

      // Mettre à jour l'intervention
      // EventState = 2 dans EBP signifie COMPLETED
      await this.databaseService.query(
        `
        UPDATE public."ScheduleEvent"
        SET
          "EventState" = 2,
          "EndDate" = $1,
          "AchievedDuration_DurationInHours" = $2,
          "Maintenance_TravelDuration" = $3,
          "Maintenance_InterventionReport" = $4,
          "sysModifiedDate" = NOW()
        WHERE "Id" = $5
        `,
        [
          new Date(),
          dto.timeSpentHours,
          dto.travelDuration || 0,
          dto.report,
          interventionId,
        ],
      );

      this.logger.log(`Intervention ${interventionId} completed successfully`);
      return this.getInterventionById(interventionId);
    } catch (error) {
      this.logger.error(`Error completing intervention ${interventionId}:`, error);
      throw new BadRequestException('Erreur lors de la clôture de l\'intervention');
    }
  }

  /**
   * Met à jour une intervention
   */
  async updateIntervention(
    interventionId: string,
    dto: UpdateInterventionDto,
  ): Promise<InterventionDto> {
    this.logger.log(`Updating intervention ${interventionId}`);

    try {
      // Vérifier que l'intervention existe
      await this.getInterventionById(interventionId);

      // Construire la requête UPDATE dynamiquement
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (dto.status !== undefined) {
        updates.push(`"EventState" = $${paramIndex++}`);
        values.push(dto.status);
      }

      if (dto.notes !== undefined) {
        updates.push(`"NotesClear" = $${paramIndex++}`);
        values.push(dto.notes);
      }

      if (dto.achievedDuration !== undefined) {
        updates.push(`"AchievedDuration_DurationInHours" = $${paramIndex++}`);
        values.push(dto.achievedDuration);
      }

      if (dto.actualStartDate !== undefined) {
        updates.push(`"ActualStartDate" = $${paramIndex++}`);
        values.push(dto.actualStartDate);
      }

      if (dto.actualEndDate !== undefined) {
        updates.push(`"EndDate" = $${paramIndex++}`);
        values.push(dto.actualEndDate);
      }

      if (updates.length === 0) {
        return this.getInterventionById(interventionId);
      }

      updates.push(`"sysModifiedDate" = NOW()`);
      values.push(interventionId);

      await this.databaseService.query(
        `UPDATE public."ScheduleEvent" SET ${updates.join(', ')} WHERE "Id" = $${paramIndex}`,
        values,
      );

      this.logger.log(`Intervention ${interventionId} updated successfully`);
      return this.getInterventionById(interventionId);
    } catch (error) {
      this.logger.error(`Error updating intervention ${interventionId}:`, error);
      throw new BadRequestException('Erreur lors de la mise à jour de l\'intervention');
    }
  }

  /**
   * Met à jour le temps passé sur une intervention
   */
  async updateTimeSpent(
    interventionId: string,
    timeSpentSeconds: number,
  ): Promise<InterventionDto> {
    this.logger.log(`Updating time spent for intervention ${interventionId}: ${timeSpentSeconds}s`);

    try {
      // Vérifier que l'intervention existe
      await this.getInterventionById(interventionId);

      // Convertir les secondes en heures (format EBP)
      const timeSpentHours = timeSpentSeconds / 3600;

      // Mettre à jour le champ AchievedDuration_DurationInHours
      await this.databaseService.query(
        `
        UPDATE public."ScheduleEvent"
        SET "AchievedDuration_DurationInHours" = $1,
            "sysModifiedDate" = NOW()
        WHERE "Id" = $2
        `,
        [timeSpentHours, interventionId],
      );

      this.logger.log(`Time spent updated successfully for intervention ${interventionId}`);
      return this.getInterventionById(interventionId);
    } catch (error) {
      this.logger.error(`Error updating time spent for intervention ${interventionId}:`, error);
      throw new BadRequestException('Erreur lors de la mise à jour du temps passé');
    }
  }

  /**
   * Crée un timesheet (temps passé)
   */
  async createTimesheet(
    technicianId: string,
    dto: CreateTimesheetDto,
  ): Promise<{ success: boolean; message: string }> {
    this.logger.log(`Creating timesheet for intervention ${dto.interventionId}`);

    try {
      await this.databaseService.query(
        `
        INSERT INTO mobile.timesheets (
          intervention_id,
          technician_id,
          date,
          hours_worked,
          description,
          time_type
        ) VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [
          dto.interventionId,
          technicianId,
          dto.date,
          dto.hoursWorked,
          dto.description || null,
          dto.timeType || 'normal',
        ],
      );

      this.logger.log('Timesheet created successfully');
      return {
        success: true,
        message: 'Temps enregistré avec succès',
      };
    } catch (error) {
      this.logger.error('Error creating timesheet:', error);
      throw new BadRequestException('Erreur lors de l\'enregistrement du temps');
    }
  }

  /**
   * Résout la date de début pour une requête de plage de dates
   * Par défaut: début du jour actuel
   */
  private resolveDateRangeStart(dateFrom?: Date | string): Date {
    if (dateFrom) {
      return typeof dateFrom === 'string' ? new Date(dateFrom) : dateFrom;
    }
    // Par défaut: début d'aujourd'hui
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  /**
   * Résout la date de fin pour une requête de plage de dates
   * Par défaut: 30 jours à partir d'aujourd'hui
   */
  private resolveDateRangeEnd(dateTo?: Date | string): Date {
    if (dateTo) {
      return typeof dateTo === 'string' ? new Date(dateTo) : dateTo;
    }
    // Par défaut: 30 jours à partir d'aujourd'hui
    const future = new Date();
    future.setDate(future.getDate() + 30);
    future.setHours(23, 59, 59, 999);
    return future;
  }

  /**
   * Construit un DTO d'intervention à partir d'une ligne de base de données
   */
  private buildInterventionDto(row: any): InterventionDto {
    const status = this.mapEventStateToStatusDto(row.eventState);
    const estimatedMinutes = parseFloat(row.estimatedDurationHours) * 60 || undefined;
    const actualMinutes = parseFloat(row.achievedDurationHours) * 60 || undefined;
    const timeSpentSeconds = parseFloat(row.achievedDurationHours) * 3600 || undefined;

    return {
      id: row.id,
      reference: row.reference || '',
      title: row.title || '',
      description: row.description || undefined,
      scheduledDate: row.scheduledDate?.toISOString() || new Date().toISOString(),
      scheduledEndDate: row.scheduledEndDate?.toISOString() || undefined,
      actualStartDate: undefined,
      actualEndDate: undefined,
      status: status,
      statusLabel: this.getStatusLabel(status),
      type: InterventionTypeDto.MAINTENANCE, // Par défaut, pourrait être dérivé de EventType
      typeLabel: 'Maintenance',
      priority: InterventionPriorityDto.NORMAL, // Par défaut, EBP n'a pas de priorité
      customerId: row.customerId || undefined,
      customerName: row.customerName || undefined,
      contactPhone: row.contactPhone || undefined,
      projectId: undefined,
      projectName: undefined,
      technicianId: row.technicianId || undefined,
      technicianName: row.technicianName || undefined,
      address: row.address || undefined,
      city: row.city || undefined,
      postalCode: row.postalCode || undefined,
      latitude: row.latitude ? parseFloat(row.latitude) : undefined,
      longitude: row.longitude ? parseFloat(row.longitude) : undefined,
      estimatedDuration: estimatedMinutes,
      actualDuration: actualMinutes,
      timeSpentSeconds: timeSpentSeconds,
      notes: row.notes || undefined,
      createdAt: row.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: row.updatedAt?.toISOString() || undefined,
    };
  }

  /**
   * Mappe EventState de EBP vers InterventionStatusDto
   */
  private mapEventStateToStatusDto(eventState: number): InterventionStatusDto {
    // Mapping basé sur les valeurs EBP EventState:
    // 0 = Planned/Scheduled
    // 1 = In Progress (ou Confirmed)
    // 2 = Completed
    // 3 = Cancelled
    // 4 = Pending
    switch (eventState) {
      case 0:
        return InterventionStatusDto.SCHEDULED;
      case 1:
        return InterventionStatusDto.IN_PROGRESS;
      case 2:
        return InterventionStatusDto.COMPLETED;
      case 3:
        return InterventionStatusDto.CANCELLED;
      case 4:
        return InterventionStatusDto.PENDING;
      default:
        return InterventionStatusDto.SCHEDULED;
    }
  }

  /**
   * Retourne le libellé français d'un statut
   */
  private getStatusLabel(status: InterventionStatusDto): string {
    switch (status) {
      case InterventionStatusDto.SCHEDULED:
        return 'Planifiée';
      case InterventionStatusDto.IN_PROGRESS:
        return 'En cours';
      case InterventionStatusDto.COMPLETED:
        return 'Terminée';
      case InterventionStatusDto.CANCELLED:
        return 'Annulée';
      case InterventionStatusDto.PENDING:
        return 'En attente';
      default:
        return 'Planifiée';
    }
  }
}
