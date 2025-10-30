import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from './database.service';
import {
  ActivityDto,
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
}
