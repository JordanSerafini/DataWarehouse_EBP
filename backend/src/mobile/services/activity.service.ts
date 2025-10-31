import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from './database.service';
import {
  ActivityDto,
  CreateActivityDto,
  QueryActivityHistoryDto,
  ActivityStatsDto,
  ACTIVITY_CATEGORY_LABELS,
  ACTIVITY_STATE_LABELS,
} from '../dto/activity/activity.dto';

/**
 * Interface pour les lignes d'activités depuis la base de données
 */
interface ActivityRow {
  id: string;
  caption: string;
  activityCategory: number;
  eventState: number | null;
  startDateTime: Date;
  endDateTime: Date | null;
  customerId: string | null;
  customerName: string | null;
  contactId: string | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  colleagueId: string | null;
  creatorColleagueId: string | null;
  saleDocumentId: string | null;
  scheduleEventId: string | null;
  dealId: string | null;
  notesClear: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

/**
 * Interface pour les statistiques brutes
 */
interface ActivityStatsRow {
  totalActivities: string;
  byCategory: Record<string, number> | null;
  lastActivityDate: Date | null;
}

@Injectable()
export class ActivityService {
  private readonly logger = new Logger(ActivityService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Récupère l'historique d'activités pour une entité (client, projet, etc.)
   */
  async getActivityHistory(query: QueryActivityHistoryDto): Promise<ActivityDto[]> {
    this.logger.log(`Fetching activity history for ${query.entityType}: ${query.entityId}`);

    try {
      const limit = query.limit || 50;
      const offset = query.offset || 0;
      const entityType = query.entityType || 'customer';

      let whereClause = '';
      const params: (string | number)[] = [];
      let paramIndex = 1;

      // Filtrage par type d'entité
      switch (entityType.toLowerCase()) {
        case 'customer':
          whereClause = `WHERE a."CustomerId" = $${paramIndex}`;
          params.push(query.entityId);
          paramIndex++;
          break;
        case 'project':
          whereClause = `WHERE a."ConstructionSiteId" = $${paramIndex}`;
          params.push(query.entityId);
          paramIndex++;
          break;
        case 'deal':
          whereClause = `WHERE a."DealId" = $${paramIndex}`;
          params.push(query.entityId);
          paramIndex++;
          break;
        case 'supplier':
          whereClause = `WHERE a."SupplierId" = $${paramIndex}`;
          params.push(query.entityId);
          paramIndex++;
          break;
        default:
          throw new BadRequestException(`Entity type ${entityType} not supported`);
      }

      // Filtre optionnel par catégorie
      if (query.category !== undefined) {
        whereClause += ` AND a."ActivityCategory" = $${paramIndex}`;
        params.push(query.category);
        paramIndex++;
      }

      const sqlQuery = `
        SELECT
          a."Id"::text as id,
          a."Caption" as caption,
          a."ActivityCategory" as "activityCategory",
          a."EventState" as "eventState",
          a."StartDateTime" as "startDateTime",
          a."EndDateTime" as "endDateTime",
          a."CustomerId" as "customerId",
          a."CustomerName" as "customerName",
          a."ContactId"::text as "contactId",
          CONCAT(a."Contact_FirstName", ' ', a."Contact_Name") as "contactName",
          a."Contact_Email" as "contactEmail",
          a."Contact_Phone" as "contactPhone",
          a."ColleagueId" as "colleagueId",
          a."CreatorColleagueId" as "creatorColleagueId",
          a."SaleDocumentId"::text as "saleDocumentId",
          a."ScheduleEventId"::text as "scheduleEventId",
          a."DealId" as "dealId",
          a."NotesClear" as "notesClear",
          a."sysCreatedDate" as "createdAt",
          a."sysModifiedDate" as "updatedAt"
        FROM public."Activity" a
        ${whereClause}
        ORDER BY a."StartDateTime" DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      params.push(limit, offset);

      const result = await this.databaseService.query<ActivityRow>(sqlQuery, params);

      // Enrichir avec les labels
      const activities: ActivityDto[] = result.rows.map((row) => ({
        ...row,
        categoryLabel: ACTIVITY_CATEGORY_LABELS[row.activityCategory] || 'Autre',
        stateLabel: row.eventState !== null ? ACTIVITY_STATE_LABELS[row.eventState] : undefined,
      }));

      this.logger.log(`Found ${activities.length} activities for ${entityType} ${query.entityId}`);
      return activities;
    } catch (error) {
      this.logger.error(`Error fetching activity history for ${query.entityId}:`, error);
      throw new BadRequestException('Erreur lors de la récupération de l\'historique d\'activités');
    }
  }

  /**
   * Récupère une activité par ID
   */
  async getActivityById(activityId: string): Promise<ActivityDto> {
    this.logger.log(`Fetching activity: ${activityId}`);

    try {
      const sqlQuery = `
        SELECT
          a."Id"::text as id,
          a."Caption" as caption,
          a."ActivityCategory" as "activityCategory",
          a."EventState" as "eventState",
          a."StartDateTime" as "startDateTime",
          a."EndDateTime" as "endDateTime",
          a."CustomerId" as "customerId",
          a."CustomerName" as "customerName",
          a."ContactId"::text as "contactId",
          CONCAT(a."Contact_FirstName", ' ', a."Contact_Name") as "contactName",
          a."Contact_Email" as "contactEmail",
          a."Contact_Phone" as "contactPhone",
          a."ColleagueId" as "colleagueId",
          a."CreatorColleagueId" as "creatorColleagueId",
          a."SaleDocumentId"::text as "saleDocumentId",
          a."ScheduleEventId"::text as "scheduleEventId",
          a."DealId" as "dealId",
          a."NotesClear" as "notesClear",
          a."sysCreatedDate" as "createdAt",
          a."sysModifiedDate" as "updatedAt"
        FROM public."Activity" a
        WHERE a."Id" = $1
      `;

      const result = await this.databaseService.query<ActivityRow>(sqlQuery, [activityId]);

      if (result.rows.length === 0) {
        throw new NotFoundException(`Activité ${activityId} introuvable`);
      }

      const row = result.rows[0];
      return {
        ...row,
        categoryLabel: ACTIVITY_CATEGORY_LABELS[row.activityCategory] || 'Autre',
        stateLabel: row.eventState !== null ? ACTIVITY_STATE_LABELS[row.eventState] : undefined,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching activity ${activityId}:`, error);
      throw new BadRequestException('Erreur lors de la récupération de l\'activité');
    }
  }

  /**
   * Récupère les statistiques d'activités pour une entité
   */
  async getActivityStats(
    entityId: string,
    entityType: string = 'customer',
  ): Promise<ActivityStatsDto> {
    this.logger.log(`Fetching activity stats for ${entityType}: ${entityId}`);

    try {
      let whereClause = '';
      switch (entityType.toLowerCase()) {
        case 'customer':
          whereClause = `WHERE "CustomerId" = $1`;
          break;
        case 'project':
          whereClause = `WHERE "ConstructionSiteId" = $1`;
          break;
        case 'deal':
          whereClause = `WHERE "DealId" = $1`;
          break;
        case 'supplier':
          whereClause = `WHERE "SupplierId" = $1`;
          break;
        default:
          throw new BadRequestException(`Entity type ${entityType} not supported`);
      }

      const sqlQuery = `
        SELECT
          COUNT(*) as "totalActivities",
          json_object_agg("ActivityCategory", category_count) as "byCategory",
          MAX("StartDateTime") as "lastActivityDate"
        FROM (
          SELECT
            "ActivityCategory",
            COUNT(*) as category_count,
            "StartDateTime"
          FROM public."Activity"
          ${whereClause}
          GROUP BY "ActivityCategory", "StartDateTime"
        ) sub
      `;

      const result = await this.databaseService.query<ActivityStatsRow>(sqlQuery, [entityId]);

      if (result.rows.length === 0) {
        return {
          totalActivities: 0,
          byCategory: {},
          mostFrequentType: 'Aucune',
        };
      }

      const row = result.rows[0];
      const byCategory: Record<string, number> = {};

      // Convertir les catégories numériques en labels
      if (row.byCategory) {
        Object.entries(row.byCategory).forEach(([cat, count]) => {
          const label = ACTIVITY_CATEGORY_LABELS[parseInt(cat, 10)] || 'Autre';
          byCategory[label] = count as number;
        });
      }

      // Trouver le type le plus fréquent
      let maxCount = 0;
      let mostFrequent = 'Aucune';
      Object.entries(byCategory).forEach(([type, count]) => {
        if (count > maxCount) {
          maxCount = count;
          mostFrequent = type;
        }
      });

      return {
        totalActivities: parseInt(row.totalActivities, 10) || 0,
        byCategory,
        lastActivityDate: row.lastActivityDate ? new Date(row.lastActivityDate) : undefined,
        mostFrequentType: mostFrequent,
      };
    } catch (error) {
      this.logger.error(`Error fetching activity stats for ${entityId}:`, error);
      throw new BadRequestException('Erreur lors du calcul des statistiques d\'activités');
    }
  }

  /**
   * Récupère les activités récentes (toutes entités confondues)
   */
  async getRecentActivities(limit: number = 20): Promise<ActivityDto[]> {
    this.logger.log(`Fetching ${limit} recent activities`);

    try {
      const sqlQuery = `
        SELECT
          a."Id"::text as id,
          a."Caption" as caption,
          a."ActivityCategory" as "activityCategory",
          a."EventState" as "eventState",
          a."StartDateTime" as "startDateTime",
          a."EndDateTime" as "endDateTime",
          a."CustomerId" as "customerId",
          a."CustomerName" as "customerName",
          a."ContactId"::text as "contactId",
          CONCAT(a."Contact_FirstName", ' ', a."Contact_Name") as "contactName",
          a."Contact_Email" as "contactEmail",
          a."Contact_Phone" as "contactPhone",
          a."ColleagueId" as "colleagueId",
          a."CreatorColleagueId" as "creatorColleagueId",
          a."SaleDocumentId"::text as "saleDocumentId",
          a."ScheduleEventId"::text as "scheduleEventId",
          a."DealId" as "dealId",
          a."NotesClear" as "notesClear",
          a."sysCreatedDate" as "createdAt",
          a."sysModifiedDate" as "updatedAt"
        FROM public."Activity" a
        ORDER BY a."StartDateTime" DESC
        LIMIT $1
      `;

      const result = await this.databaseService.query<ActivityRow>(sqlQuery, [limit]);

      const activities: ActivityDto[] = result.rows.map((row) => ({
        ...row,
        categoryLabel: ACTIVITY_CATEGORY_LABELS[row.activityCategory] || 'Autre',
        stateLabel: row.eventState !== null ? ACTIVITY_STATE_LABELS[row.eventState] : undefined,
      }));

      this.logger.log(`Found ${activities.length} recent activities`);
      return activities;
    } catch (error) {
      this.logger.error('Error fetching recent activities:', error);
      throw new BadRequestException('Erreur lors de la récupération des activités récentes');
    }
  }

  /**
   * Crée une nouvelle note/activité
   */
  async createActivity(dto: CreateActivityDto, creatorUserId?: string): Promise<ActivityDto> {
    this.logger.log(`Creating activity: ${dto.caption}`);

    try {
      // Génération d'un UUID pour la nouvelle activité
      const activityId = require('uuid').v4();
      const now = new Date();
      const startDateTime = dto.startDateTime || now;
      const endDateTime = dto.endDateTime || startDateTime;

      // Insertion dans la table Activity
      const insertQuery = `
        INSERT INTO public."Activity" (
          "Id",
          "Caption",
          "ActivityCategory",
          "StartDateTime",
          "EndDateTime",
          "CustomerId",
          "ScheduleEventId",
          "ColleagueId",
          "DealId",
          "NotesClear",
          "CreatorColleagueId",
          "EventState",
          "Contact_NaturalPerson",
          "Contact_OptIn",
          "Contact_AllowUsePersonnalDatas",
          "HasAssociatedFiles",
          "sysCreatedDate",
          "sysCreatedUser",
          "sysModifiedDate",
          "sysModifiedUser"
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
        )
        RETURNING
          "Id" as "id",
          "Caption" as "caption",
          "ActivityCategory" as "activityCategory",
          "EventState" as "eventState",
          "StartDateTime" as "startDateTime",
          "EndDateTime" as "endDateTime",
          "CustomerId" as "customerId",
          "ScheduleEventId" as "scheduleEventId",
          "ColleagueId" as "colleagueId",
          "CreatorColleagueId" as "creatorColleagueId",
          "DealId" as "dealId",
          "NotesClear" as "notesClear",
          "sysCreatedDate" as "createdAt",
          "sysModifiedDate" as "updatedAt"
      `;

      const params = [
        activityId,                     // $1 Id
        dto.caption,                    // $2 Caption
        dto.activityCategory,           // $3 ActivityCategory
        startDateTime,                  // $4 StartDateTime
        endDateTime,                    // $5 EndDateTime
        dto.customerId || null,         // $6 CustomerId
        dto.scheduleEventId || null,    // $7 ScheduleEventId
        dto.colleagueId || null,        // $8 ColleagueId
        dto.dealId || null,             // $9 DealId
        dto.notesClear,                 // $10 NotesClear
        creatorUserId || null,          // $11 CreatorColleagueId
        2,                              // $12 EventState (2 = COMPLETED pour une note)
        false,                          // $13 Contact_NaturalPerson
        false,                          // $14 Contact_OptIn
        false,                          // $15 Contact_AllowUsePersonnalDatas
        false,                          // $16 HasAssociatedFiles
        now,                            // $17 sysCreatedDate
        creatorUserId || 'mobile',      // $18 sysCreatedUser
        now,                            // $19 sysModifiedDate
        creatorUserId || 'mobile',      // $20 sysModifiedUser
      ];

      const result = await this.databaseService.query<ActivityRow>(insertQuery, params);

      if (result.rows.length === 0) {
        throw new BadRequestException('Échec de création de l\'activité');
      }

      const row = result.rows[0];

      // Récupérer les noms associés si nécessaire
      let customerName = null;
      if (dto.customerId) {
        const customerResult = await this.databaseService.query(
          `SELECT "Name" FROM public."Customer" WHERE "Id" = $1`,
          [dto.customerId]
        );
        if (customerResult.rows.length > 0) {
          customerName = customerResult.rows[0].Name;
        }
      }

      // Récupérer le nom complet du créateur
      let creatorName = null;
      if (creatorUserId) {
        // Essayer d'abord depuis la table mobile.users
        const userResult = await this.databaseService.query(
          `SELECT name FROM mobile.users WHERE colleague_id = $1`,
          [creatorUserId]
        );
        if (userResult.rows.length > 0) {
          creatorName = userResult.rows[0].name;
        } else {
          // Sinon essayer depuis la table Colleague
          const colleagueResult = await this.databaseService.query(
            `SELECT "Name" FROM public."Colleague" WHERE "Id" = $1`,
            [creatorUserId]
          );
          if (colleagueResult.rows.length > 0) {
            creatorName = colleagueResult.rows[0].Name;
          }
        }
      }

      const activity: ActivityDto = {
        id: row.id,
        caption: row.caption,
        activityCategory: row.activityCategory,
        categoryLabel: ACTIVITY_CATEGORY_LABELS[row.activityCategory] || 'Autre',
        eventState: row.eventState,
        stateLabel: row.eventState !== null ? ACTIVITY_STATE_LABELS[row.eventState] : undefined,
        startDateTime: row.startDateTime,
        endDateTime: row.endDateTime,
        customerId: row.customerId,
        customerName,
        scheduleEventId: row.scheduleEventId,
        colleagueId: row.colleagueId,
        creatorColleagueId: row.creatorColleagueId,
        creatorName,
        dealId: row.dealId,
        notesClear: row.notesClear,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      };

      this.logger.log(`Activity created successfully: ${activity.id}`);
      return activity;
    } catch (error) {
      this.logger.error('Error creating activity:', error);
      throw new BadRequestException('Erreur lors de la création de l\'activité');
    }
  }
}
