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

/**
 * Interface pour les lignes d'interventions depuis la requête UNION (ScheduleEvent + Incident)
 */
interface InterventionRow {
  id: string;
  reference: string;
  title: string;
  description: string | null;
  report: string | null;
  notes: string | null;
  scheduledDate: Date;
  scheduledEndDate: Date | null;
  eventState: number;
  eventType: number | null;
  estimatedDurationHours: number | null;
  achievedDurationHours: number | null;
  customerId: string | null;
  customerName: string | null;
  contactPhone: string | null;
  technicianId: string | null;
  technicianName: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  latitude: string | null;
  longitude: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Coûts & Facturation
  salePriceVatExcluded: number | null;
  netAmountVatExcluded: number | null;
  hourlyCostPrice: number | null;
  costAmount: number | null;
  predictedCostAmount: number | null;
  toInvoice: boolean | null;
  invoiceCustomerId: string | null;
  invoiceColleagueId: string | null;
  invoiceId: string | null;
  // Maintenance
  maintenanceReference: string | null;
  maintenanceContractId: string | null;
  maintenanceIncidentId: string | null;
  maintenanceCustomerProductId: string | null;
  maintenanceTravelDuration: number | null;
  maintenanceContractHoursDecremented: number | null;
  maintenanceNextEventDate: Date | null;
  // Projet/Chantier/Affaire
  constructionSiteId: string | null;
  constructionSiteName: string | null;
  dealId: string | null;
  dealName: string | null;
  isProject: boolean | null;
  globalPercentComplete: number | null;
  // Équipements & Articles
  equipmentId: string | null;
  equipmentName: string | null;
  itemId: string | null;
  itemName: string | null;
  quantity: number | null;
  // Documents
  saleDocumentId: string | null;
  saleDocumentLineId: string | null;
  purchaseDocumentId: string | null;
  stockDocumentId: string | null;
  hasAssociatedFiles: boolean | null;
  // Champs personnalisés métier
  customTaskType: string | null;
  customTheme: string | null;
  customServices: string | null;
  customActivity: string | null;
  customSoftware: string | null;
  customSupplier: string | null;
  customCommercialTheme: string | null;
  isUrgent: boolean | null;
  customPlannedDuration: number | null;
  customTimeClient: number | null;
  customTimeInternal: number | null;
  customTimeTravel: number | null;
  customTimeRelational: number | null;
  // Sous-traitant et créateur
  subContractorId: string | null;
  subContractorName: string | null;
  creatorColleagueId: string | null;
  creatorName: string | null;
  source_type: 'schedule_event' | 'incident';
}

/**
 * Interface pour vérifier si une intervention est en cours
 */
interface InProgressCheckRow {
  id: string;
  reference: string;
}

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
      -- Coûts & Facturation
      se."SalePriceVatExcluded" as "salePriceVatExcluded",
      se."NetAmountVatExcluded" as "netAmountVatExcluded",
      se."HourlyCostPrice" as "hourlyCostPrice",
      se."CostAmount" as "costAmount",
      se."PredictedCostAmount" as "predictedCostAmount",
      se."ToInvoice" as "toInvoice",
      se."InvoiceCustomerId" as "invoiceCustomerId",
      se."InvoiceColleagueId" as "invoiceColleagueId",
      se."InvoiceId"::text as "invoiceId",
      -- Maintenance
      se."Maintenance_Reference" as "maintenanceReference",
      se."Maintenance_ContractId" as "maintenanceContractId",
      se."Maintenance_IncidentId" as "maintenanceIncidentId",
      se."Maintenance_CustomerProductId" as "maintenanceCustomerProductId",
      se."Maintenance_TravelDuration" as "maintenanceTravelDuration",
      se."Maintenance_ContractHoursNumberDecremented" as "maintenanceContractHoursDecremented",
      se."Maintenance_NextEventDate" as "maintenanceNextEventDate",
      -- Projet/Chantier/Affaire
      se."ConstructionSiteId" as "constructionSiteId",
      cs."Caption" as "constructionSiteName",
      se."DealId" as "dealId",
      d."Caption" as "dealName",
      se."xx_Projet" as "isProject",
      se."GlobalPercentComplete" as "globalPercentComplete",
      -- Équipements & Articles
      se."EquipmentId" as "equipmentId",
      eq."Caption" as "equipmentName",
      se."ItemId" as "itemId",
      itm."Caption" as "itemName",
      se."Quantity" as "quantity",
      -- Documents
      se."SaleDocumentId"::text as "saleDocumentId",
      se."SaleDocumentLineid"::text as "saleDocumentLineId",
      se."PurchaseDocumentId"::text as "purchaseDocumentId",
      se."StockDocumentId"::text as "stockDocumentId",
      se."HasAssociatedFiles" as "hasAssociatedFiles",
      -- Champs personnalisés métier
      se."xx_Type_Tache" as "customTaskType",
      se."xx_Theme" as "customTheme",
      se."xx_Services" as "customServices",
      se."xx_Activite" as "customActivity",
      se."xx_Logiciel" as "customSoftware",
      se."xx_Fournisseur" as "customSupplier",
      se."xx_Theme_Commercial" as "customCommercialTheme",
      se."xx_URGENT" as "isUrgent",
      se."xx_Duree_Pevue" as "customPlannedDuration",
      se."xx_Total_Temps_Realise_Client" as "customTimeClient",
      se."xx_Total_Temps_Realise_Interne" as "customTimeInternal",
      se."xx_Total_Temps_Realise_Trajet" as "customTimeTravel",
      se."xx_Total_Temps_Realise_Relationnel" as "customTimeRelational",
      -- Sous-traitant et créateur
      se."SubContractorId" as "subContractorId",
      supp."Name" as "subContractorName",
      se."CreatorColleagueId" as "creatorColleagueId",
      creator."Contact_Name" as "creatorName",
      'schedule_event' as source_type
    FROM public."ScheduleEvent" se
    LEFT JOIN public."Customer" c ON c."Id" = se."CustomerId"
    LEFT JOIN public."Contact" cnt ON cnt."Id" = se."ContactId"
    LEFT JOIN public."Colleague" col ON col."Id" = se."ColleagueId"
    LEFT JOIN public."ConstructionSite" cs ON cs."Id" = se."ConstructionSiteId"
    LEFT JOIN public."Deal" d ON d."Id" = se."DealId"
    LEFT JOIN public."Equipment" eq ON eq."Id" = se."EquipmentId"
    LEFT JOIN public."Item" itm ON itm."Id" = se."ItemId"
    LEFT JOIN public."Supplier" supp ON supp."Id" = se."SubContractorId"
    LEFT JOIN public."Colleague" creator ON creator."Id" = se."CreatorColleagueId"

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
      -- Coûts & Facturation (NULL pour Incident)
      NULL as "salePriceVatExcluded",
      NULL as "netAmountVatExcluded",
      NULL as "hourlyCostPrice",
      NULL as "costAmount",
      NULL as "predictedCostAmount",
      NULL as "toInvoice",
      NULL as "invoiceCustomerId",
      NULL as "invoiceColleagueId",
      NULL as "invoiceId",
      -- Maintenance (NULL pour Incident)
      NULL as "maintenanceReference",
      NULL as "maintenanceContractId",
      NULL as "maintenanceIncidentId",
      NULL as "maintenanceCustomerProductId",
      NULL as "maintenanceTravelDuration",
      NULL as "maintenanceContractHoursDecremented",
      NULL as "maintenanceNextEventDate",
      -- Projet/Chantier/Affaire (NULL pour Incident)
      NULL as "constructionSiteId",
      NULL as "constructionSiteName",
      NULL as "dealId",
      NULL as "dealName",
      NULL as "isProject",
      NULL as "globalPercentComplete",
      -- Équipements & Articles (NULL pour Incident)
      NULL as "equipmentId",
      NULL as "equipmentName",
      NULL as "itemId",
      NULL as "itemName",
      NULL as "quantity",
      -- Documents (NULL pour Incident)
      NULL as "saleDocumentId",
      NULL as "saleDocumentLineId",
      NULL as "purchaseDocumentId",
      NULL as "stockDocumentId",
      NULL as "hasAssociatedFiles",
      -- Champs personnalisés métier (NULL pour Incident)
      NULL as "customTaskType",
      NULL as "customTheme",
      NULL as "customServices",
      NULL as "customActivity",
      NULL as "customSoftware",
      NULL as "customSupplier",
      NULL as "customCommercialTheme",
      NULL as "isUrgent",
      NULL as "customPlannedDuration",
      NULL as "customTimeClient",
      NULL as "customTimeInternal",
      NULL as "customTimeTravel",
      NULL as "customTimeRelational",
      -- Sous-traitant et créateur (NULL pour Incident)
      NULL as "subContractorId",
      NULL as "subContractorName",
      i."CreatorColleagueId" as "creatorColleagueId",
      col2."Contact_Name" as "creatorName",
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

      const result = await this.databaseService.query<InterventionRow>(sql, [technicianId, dateFrom, dateTo]);
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
      // Chercher par UUID (id) OU par ScheduleEventNumber (reference)
      const sql = `
        SELECT * FROM (
          ${InterventionsService.INTERVENTION_BASE_QUERY}
        ) AS interventions
        WHERE id = $1 OR reference = $1
        LIMIT 1
      `;

      const result = await this.databaseService.query<InterventionRow>(sql, [interventionId]);

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
      // Vérifier que l'intervention existe et récupérer son UUID réel
      const intervention = await this.getInterventionById(interventionId);
      const actualInterventionId = intervention.id; // UUID réel ou code pour Incident
      const sourceType = intervention.sourceType;

      // Vérifier qu'aucune intervention n'est déjà en cours pour ce technicien
      // EventState = 1 dans EBP signifie IN_PROGRESS
      const inProgressCheck = await this.databaseService.query<InProgressCheckRow>(
        `
        SELECT "Id"::text as id, "ScheduleEventNumber" as reference
        FROM public."ScheduleEvent"
        WHERE "ColleagueId" = $1
          AND "EventState" = 1
          AND "Id" != $2
        LIMIT 1
        `,
        [technicianId, actualInterventionId],
      );

      if (inProgressCheck.rows.length > 0) {
        const ongoing = inProgressCheck.rows[0];
        throw new BadRequestException(
          `Vous avez déjà une intervention en cours : ${ongoing.reference}. ` +
          `Veuillez la clôturer avant d'en démarrer une nouvelle.`,
        );
      }

      if (sourceType === 'incident') {
        // Démarrer un Incident
        // Status = 1 pour IN_PROGRESS (à vérifier selon la convention EBP)
        await this.databaseService.query(
          `
          UPDATE public."Incident"
          SET
            "Status" = 1,
            "StartDate" = $1,
            "sysModifiedDate" = NOW()
          WHERE "Id" = $2
          `,
          [new Date(), actualInterventionId],
        );

        // Ajouter notes de démarrage si fournies
        if (dto.notes) {
          await this.databaseService.query(
            `
            UPDATE public."Incident"
            SET "DescriptionClear" = COALESCE("DescriptionClear", '') || $1
            WHERE "Id" = $2
            `,
            [`\n[${new Date().toISOString()}] Démarrage: ${dto.notes}`, actualInterventionId],
          );
        }
      } else {
        // Démarrer un ScheduleEvent
        // EventState = 1 dans EBP signifie IN_PROGRESS
        await this.databaseService.query(
          `
          UPDATE public."ScheduleEvent"
          SET
            "EventState" = 1,
            "ActualStartDate" = $1,
            "sysModifiedDate" = NOW()
          WHERE "Id" = $2
          `,
          [new Date(), actualInterventionId],
        );

        // Ajouter notes de démarrage si fournies
        if (dto.notes) {
          await this.databaseService.query(
            `
            UPDATE public."ScheduleEvent"
            SET "NotesClear" = COALESCE("NotesClear", '') || $1
            WHERE "Id" = $2
            `,
            [`\n[${new Date().toISOString()}] Démarrage: ${dto.notes}`, actualInterventionId],
          );
        }
      }

      this.logger.log(`Intervention ${actualInterventionId} started successfully`);
      return this.getInterventionById(actualInterventionId);
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
      // Vérifier que l'intervention existe et récupérer son UUID réel
      const intervention = await this.getInterventionById(interventionId);
      const actualInterventionId = intervention.id; // UUID réel ou code pour Incident
      const sourceType = intervention.sourceType;

      if (sourceType === 'incident') {
        // Clôturer un Incident
        // Status = 2 pour COMPLETED (à vérifier selon la convention EBP)
        await this.databaseService.query(
          `
          UPDATE public."Incident"
          SET
            "Status" = 2,
            "EndDate" = $1,
            "AccomplishedDuration" = $2,
            "DescriptionClear" = COALESCE("DescriptionClear", '') || $3,
            "sysModifiedDate" = NOW()
          WHERE "Id" = $4
          `,
          [
            new Date(),
            dto.timeSpentHours,
            `\n[${new Date().toISOString()}] Rapport: ${dto.report}`,
            actualInterventionId,
          ],
        );
      } else {
        // Clôturer un ScheduleEvent
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
            actualInterventionId,
          ],
        );
      }

      this.logger.log(`Intervention ${actualInterventionId} completed successfully`);
      return this.getInterventionById(actualInterventionId);
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
    this.logger.log(`Updating intervention ${interventionId}`, dto);

    try {
      // Vérifier que l'intervention existe et récupérer son UUID réel
      const intervention = await this.getInterventionById(interventionId);
      const actualInterventionId = intervention.id; // UUID réel ou code pour Incident
      const sourceType = intervention.sourceType;

      // Construire la requête UPDATE dynamiquement selon le type d'intervention
      const updates: string[] = [];
      const values: (number | string | Date)[] = [];
      let paramIndex = 1;
      let tableName: string;

      if (sourceType === 'incident') {
        // Mise à jour d'un Incident
        tableName = 'public."Incident"';

        if (dto.status !== undefined) {
          updates.push(`"Status" = $${paramIndex++}`);
          values.push(dto.status);
        }

        if (dto.notes !== undefined) {
          updates.push(`"DescriptionClear" = $${paramIndex++}`);
          values.push(dto.notes);
        }

        if (dto.achievedDuration !== undefined) {
          updates.push(`"AccomplishedDuration" = $${paramIndex++}`);
          values.push(dto.achievedDuration);
        }

        if (dto.scheduledDate !== undefined) {
          updates.push(`"StartDate" = $${paramIndex++}`);
          values.push(dto.scheduledDate);
        }

        if (dto.actualEndDate !== undefined) {
          updates.push(`"EndDate" = $${paramIndex++}`);
          values.push(dto.actualEndDate);
        }

        // Les Incidents n'ont pas de technicianId assignable directement
        // Ils ont CreatorColleagueId, mais on ne le modifie pas

      } else {
        // Mise à jour d'un ScheduleEvent
        tableName = 'public."ScheduleEvent"';

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

        if (dto.scheduledDate !== undefined) {
          updates.push(`"StartDateTime" = $${paramIndex++}`);
          values.push(dto.scheduledDate);
        }

        if (dto.technicianId !== undefined) {
          updates.push(`"ColleagueId" = $${paramIndex++}`);
          values.push(dto.technicianId);
        }
      }

      if (updates.length === 0) {
        this.logger.log(`No updates to perform for intervention ${interventionId}`);
        return intervention;
      }

      updates.push(`"sysModifiedDate" = NOW()`);
      values.push(actualInterventionId); // Utiliser l'ID réel (UUID ou code)

      const updateQuery = `UPDATE ${tableName} SET ${updates.join(', ')} WHERE "Id" = $${paramIndex}`;
      this.logger.log(`Executing update query: ${updateQuery}`, values);

      await this.databaseService.query(updateQuery, values);

      this.logger.log(`Intervention ${actualInterventionId} updated successfully`);
      return this.getInterventionById(actualInterventionId);
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
      // Vérifier que l'intervention existe et récupérer son UUID réel
      const intervention = await this.getInterventionById(interventionId);
      const actualInterventionId = intervention.id; // UUID réel ou code pour Incident
      const sourceType = intervention.sourceType;

      // Convertir les secondes en heures (format EBP)
      const timeSpentHours = timeSpentSeconds / 3600;

      if (sourceType === 'incident') {
        // Mettre à jour le champ AccomplishedDuration pour Incident
        await this.databaseService.query(
          `
          UPDATE public."Incident"
          SET "AccomplishedDuration" = $1,
              "sysModifiedDate" = NOW()
          WHERE "Id" = $2
          `,
          [timeSpentHours, actualInterventionId],
        );
      } else {
        // Mettre à jour le champ AchievedDuration_DurationInHours pour ScheduleEvent
        await this.databaseService.query(
          `
          UPDATE public."ScheduleEvent"
          SET "AchievedDuration_DurationInHours" = $1,
              "sysModifiedDate" = NOW()
          WHERE "Id" = $2
          `,
          [timeSpentHours, actualInterventionId],
        );
      }

      this.logger.log(`Time spent updated successfully for intervention ${actualInterventionId}`);
      return this.getInterventionById(actualInterventionId);
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
  private buildInterventionDto(row: InterventionRow): InterventionDto {
    const status = this.mapEventStateToStatusDto(row.eventState);
    const estimatedMinutes = row.estimatedDurationHours ? row.estimatedDurationHours * 60 : undefined;
    const actualMinutes = row.achievedDurationHours ? row.achievedDurationHours * 60 : undefined;
    const timeSpentSeconds = row.achievedDurationHours ? row.achievedDurationHours * 3600 : undefined;

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
      latitude: row.latitude ? Number(row.latitude) : undefined,
      longitude: row.longitude ? Number(row.longitude) : undefined,
      estimatedDuration: estimatedMinutes,
      actualDuration: actualMinutes,
      timeSpentSeconds: timeSpentSeconds,
      notes: row.notes || undefined,
      createdAt: row.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: row.updatedAt?.toISOString() || undefined,
      // Coûts & Facturation (traiter 0 comme undefined pour ne pas afficher des valeurs vides)
      salePriceVatExcluded: (row.salePriceVatExcluded !== null && Number(row.salePriceVatExcluded) !== 0) ? Number(row.salePriceVatExcluded) : undefined,
      netAmountVatExcluded: (row.netAmountVatExcluded !== null && Number(row.netAmountVatExcluded) !== 0) ? Number(row.netAmountVatExcluded) : undefined,
      hourlyCostPrice: (row.hourlyCostPrice !== null && Number(row.hourlyCostPrice) !== 0) ? Number(row.hourlyCostPrice) : undefined,
      costAmount: (row.costAmount !== null && Number(row.costAmount) !== 0) ? Number(row.costAmount) : undefined,
      predictedCostAmount: (row.predictedCostAmount !== null && Number(row.predictedCostAmount) !== 0) ? Number(row.predictedCostAmount) : undefined,
      toInvoice: row.toInvoice || undefined,
      invoiceCustomerId: row.invoiceCustomerId || undefined,
      invoiceColleagueId: row.invoiceColleagueId || undefined,
      invoiceId: row.invoiceId || undefined,
      // Maintenance
      maintenanceReference: row.maintenanceReference?.trim() || undefined,
      maintenanceContractId: row.maintenanceContractId?.trim() || undefined,
      maintenanceIncidentId: row.maintenanceIncidentId?.trim() || undefined,
      maintenanceCustomerProductId: row.maintenanceCustomerProductId?.trim() || undefined,
      maintenanceInterventionReport: row.report?.trim() || undefined,
      maintenanceTravelDuration: (row.maintenanceTravelDuration !== null && Number(row.maintenanceTravelDuration) !== 0) ? Number(row.maintenanceTravelDuration) : undefined,
      maintenanceContractHoursDecremented: (row.maintenanceContractHoursDecremented !== null && Number(row.maintenanceContractHoursDecremented) !== 0) ? Number(row.maintenanceContractHoursDecremented) : undefined,
      maintenanceNextEventDate: row.maintenanceNextEventDate?.toISOString() || undefined,
      // Projet/Chantier/Affaire
      constructionSiteId: row.constructionSiteId?.trim() || undefined,
      constructionSiteName: row.constructionSiteName?.trim() || undefined,
      dealId: row.dealId?.trim() || undefined,
      dealName: row.dealName?.trim() || undefined,
      isProject: row.isProject || undefined,
      globalPercentComplete: (row.globalPercentComplete !== null && Number(row.globalPercentComplete) !== 0) ? Number(row.globalPercentComplete) : undefined,
      // Équipements & Articles
      equipmentId: row.equipmentId?.trim() || undefined,
      equipmentName: row.equipmentName?.trim() || undefined,
      itemId: row.itemId?.trim() || undefined,
      itemName: row.itemName?.trim() || undefined,
      quantity: (row.quantity !== null && Number(row.quantity) !== 0) ? Number(row.quantity) : undefined,
      // Documents
      saleDocumentId: row.saleDocumentId?.trim() || undefined,
      saleDocumentLineId: row.saleDocumentLineId?.trim() || undefined,
      purchaseDocumentId: row.purchaseDocumentId?.trim() || undefined,
      stockDocumentId: row.stockDocumentId?.trim() || undefined,
      hasAssociatedFiles: row.hasAssociatedFiles || undefined,
      // Champs personnalisés métier
      customTaskType: row.customTaskType?.trim() || undefined,
      customTheme: row.customTheme?.trim() || undefined,
      customServices: row.customServices?.trim() || undefined,
      customActivity: row.customActivity?.trim() || undefined,
      customSoftware: row.customSoftware?.trim() || undefined,
      customSupplier: row.customSupplier?.trim() || undefined,
      customCommercialTheme: row.customCommercialTheme?.trim() || undefined,
      isUrgent: row.isUrgent || undefined,
      customPlannedDuration: (row.customPlannedDuration !== null && Number(row.customPlannedDuration) !== 0) ? Number(row.customPlannedDuration) : undefined,
      customTimeClient: (row.customTimeClient !== null && Number(row.customTimeClient) !== 0) ? Number(row.customTimeClient) : undefined,
      customTimeInternal: (row.customTimeInternal !== null && Number(row.customTimeInternal) !== 0) ? Number(row.customTimeInternal) : undefined,
      customTimeTravel: (row.customTimeTravel !== null && Number(row.customTimeTravel) !== 0) ? Number(row.customTimeTravel) : undefined,
      customTimeRelational: (row.customTimeRelational !== null && Number(row.customTimeRelational) !== 0) ? Number(row.customTimeRelational) : undefined,
      // Sous-traitant et créateur
      subContractorId: row.subContractorId?.trim() || undefined,
      subContractorName: row.subContractorName?.trim() || undefined,
      creatorColleagueId: row.creatorColleagueId?.trim() || undefined,
      creatorName: row.creatorName?.trim() || undefined,
      // Type de source
      sourceType: row.source_type,
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
