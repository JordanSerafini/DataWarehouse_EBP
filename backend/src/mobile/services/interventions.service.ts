import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { DatabaseService } from './database.service';
import {
  InterventionDto,
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

    const dateFrom = query.dateFrom || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 jours par défaut
    const dateTo = query.dateTo || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // +30 jours par défaut

    try {
      const result = await this.databaseService.query<InterventionDto>(
        `SELECT * FROM mobile.get_technician_interventions($1, $2, $3)`,
        [technicianId, dateFrom, dateTo],
      );

      // Appliquer filtres additionnels si nécessaire
      let interventions = result.rows;

      if (query.status !== undefined) {
        interventions = interventions.filter(i => i.status === query.status);
      }

      // Pagination
      if (query.offset !== undefined && query.limit !== undefined) {
        interventions = interventions.slice(query.offset, query.offset + query.limit);
      }

      this.logger.log(`Found ${interventions.length} interventions for technician ${technicianId}`);
      return interventions;
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
      const result = await this.databaseService.query<InterventionDto>(
        `
        SELECT
          se."Id"::text as "interventionId",
          COALESCE(se."Maintenance_InterventionDescription", se."Caption") as title,
          se."Maintenance_InterventionReport" as description,
          c."Name" as "customerName",
          cnt."Contact_Phone" as "contactPhone",
          CONCAT_WS(', ',
            se."Address_Address1",
            se."Address_Address2",
            se."Address_ZipCode",
            se."Address_City"
          ) as address,
          se."Address_City" as city,
          se."Address_Latitude" as latitude,
          se."Address_Longitude" as longitude,
          se."StartDate" as "startDate",
          se."EndDate" as "endDate",
          se."EventState" as status,
          se."ExpectedDuration_DurationInHours" as "estimatedDuration",
          se."AchievedDuration_DurationInHours" as "achievedDuration",
          se."NotesClear" as notes
        FROM public."ScheduleEvent" se
        LEFT JOIN public."Customer" c ON c."Id" = se."CustomerId"
        LEFT JOIN public."Contact" cnt ON cnt."Id" = se."ContactId"
        WHERE se."Id" = $1
        `,
        [interventionId],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`Intervention ${interventionId} non trouvée`);
      }

      return result.rows[0];
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
      const intervention = await this.getInterventionById(interventionId);

      // Mettre à jour le statut et la date de début
      await this.databaseService.query(
        `
        UPDATE public."ScheduleEvent"
        SET
          "EventState" = $1,
          "ActualStartDate" = $2,
          "sysModifiedDate" = NOW()
        WHERE "Id" = $3
        `,
        [InterventionStatus.IN_PROGRESS, new Date(), interventionId],
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
      await this.databaseService.query(
        `
        UPDATE public."ScheduleEvent"
        SET
          "EventState" = $1,
          "EndDate" = $2,
          "AchievedDuration_DurationInHours" = $3,
          "Maintenance_TravelDuration" = $4,
          "Maintenance_InterventionReport" = $5,
          "sysModifiedDate" = NOW()
        WHERE "Id" = $6
        `,
        [
          InterventionStatus.COMPLETED,
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
}
