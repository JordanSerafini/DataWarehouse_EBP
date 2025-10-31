import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from './database.service';
import {
  CustomerDto,
  NearbyCustomerDto,
  CustomerHistoryItemDto,
  CustomerDocumentStatsDto,
  CustomerSummaryDto,
} from '../dto/customers/customer.dto';
import {
  QueryNearbyCustomersDto,
  SearchCustomersDto,
  QueryCustomerHistoryDto,
} from '../dto/customers/query-customers.dto';
import { UpdateCustomerGpsDto } from '../dto/customers/update-customer-gps.dto';

/**
 * Interface pour les lignes brutes de la base de données Customer
 */
interface CustomerRow {
  customerId: string;
  name: string;
  contactName: string;
  contactPhone: string | null;
  contactEmail: string | null;
  deliveryAddress: string | null;
  deliveryCity: string | null;
  deliveryPostalCode: string | null;
  latitude: string | null;
  longitude: string | null;
  gpsProvider: string | null;
  gpsQuality: number | null;
  createdAt: Date;
  modifiedAt: Date;
}

/**
 * Interface pour le nombre d'interventions
 */
interface InterventionCountRow {
  count: number;
}

/**
 * Interface pour le total des revenus
 */
interface TotalRevenueRow {
  total: number;
}

@Injectable()
export class CustomersService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Récupère les clients à proximité d'une position GPS
   */
  async getNearbyCustomers(
    query: QueryNearbyCustomersDto,
  ): Promise<NearbyCustomerDto[]> {
    const radiusKm = query.radiusKm || 50;
    const limit = query.limit || 20;

    const result = await this.databaseService.query<NearbyCustomerDto>(
      `SELECT
        customer_id AS "customerId",
        name,
        contact_name AS "contactName",
        contact_phone AS "contactPhone",
        delivery_address AS "deliveryAddress",
        delivery_city AS "deliveryCity",
        latitude,
        longitude,
        distance_km AS "distanceKm"
       FROM mobile.get_nearby_customers($1, $2, $3, $4)`,
      [query.latitude, query.longitude, radiusKm, limit],
    );

    return result.rows;
  }

  /**
   * Récupère le détail complet d'un client par son ID
   */
  async getCustomerById(customerId: string): Promise<CustomerDto> {
    const result = await this.databaseService.query<CustomerRow>(
      `SELECT
        c."Id" AS "customerId",
        c."Name" AS "name",
        CONCAT(c."MainDeliveryContact_FirstName", ' ', c."MainDeliveryContact_Name") AS "contactName",
        c."MainDeliveryContact_Phone" AS "contactPhone",
        c."MainDeliveryContact_Email" AS "contactEmail",
        c."MainDeliveryAddress_Address1" AS "deliveryAddress",
        c."MainDeliveryAddress_City" AS "deliveryCity",
        c."MainDeliveryAddress_ZipCode" AS "deliveryPostalCode",
        c."MainDeliveryAddress_Latitude" AS "latitude",
        c."MainDeliveryAddress_Longitude" AS "longitude",
        mg."gps_provider" AS "gpsProvider",
        mg."gps_quality" AS "gpsQuality",
        c."sysCreatedDate" AS "createdAt",
        c."sysModifiedDate" AS "modifiedAt",
        -- Données financières
        c."AllowedAmount" AS "allowedAmount",
        c."CurrentAmount" AS "currentAmount",
        c."ExceedAmount" AS "exceedAmount",
        c."ActiveState" AS "activeState",
        c."ColleagueId" AS "colleagueId"
       FROM public."Customer" c
       LEFT JOIN mobile.customer_gps mg ON mg.customer_id = c."Id"
       WHERE c."Id" = $1`,
      [customerId],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Client ${customerId} non trouvé`);
    }

    return result.rows[0];
  }

  /**
   * Récupère l'historique des interventions d'un client
   */
  async getCustomerHistory(
    customerId: string,
    query: QueryCustomerHistoryDto,
  ): Promise<CustomerHistoryItemDto[]> {
    const limit = query.limit || 50;

    const result = await this.databaseService.query<CustomerHistoryItemDto>(
      `SELECT
        intervention_id AS "interventionId",
        title,
        description,
        start_date AS "startDate",
        end_date AS "endDate",
        technician_name AS "technicianName",
        product_description AS "productDescription",
        created_at AS "createdAt"
       FROM mobile.get_customer_history($1, $2)`,
      [customerId, limit],
    );

    return result.rows;
  }

  /**
   * Récupère les statistiques de documents d'un client
   */
  async getCustomerDocumentStats(
    customerId: string,
  ): Promise<CustomerDocumentStatsDto[]> {
    const result = await this.databaseService.query<CustomerDocumentStatsDto>(
      `SELECT
        document_type_label AS "documentTypeLabel",
        document_count AS "documentCount",
        total_amount AS "totalAmount"
       FROM mobile.get_customer_documents_stats($1)`,
      [customerId],
    );

    return result.rows;
  }

  /**
   * Récupère le résumé complet d'un client (infos + historique + stats)
   */
  async getCustomerSummary(customerId: string): Promise<CustomerSummaryDto> {
    // Récupère les informations client
    const customer = await this.getCustomerById(customerId);

    // Récupère les 5 dernières interventions
    const recentInterventions = await this.getCustomerHistory(customerId, {
      limit: 5,
    });

    // Récupère les statistiques de documents
    const documentStats = await this.getCustomerDocumentStats(customerId);

    // Calcule le total des interventions
    const totalInterventionsResult = await this.databaseService.query<InterventionCountRow>(
      `SELECT COUNT(*)::int AS count
       FROM public."ScheduleEvent"
       WHERE "CustomerId" = $1`,
      [customerId],
    );

    // Calcule le montant total facturé
    const totalRevenueResult = await this.databaseService.query<TotalRevenueRow>(
      `SELECT COALESCE(SUM("TotalDueAmount"), 0)::numeric AS total
       FROM public."SaleDocument"
       WHERE "CustomerId" = $1
       AND "DocumentType" = 6`, // 6 = Facture
      [customerId],
    );

    // Calcule la date de dernière intervention et jours écoulés
    let lastInterventionDate: Date | undefined;
    let daysSinceLastIntervention: number | undefined;

    if (recentInterventions.length > 0) {
      lastInterventionDate = new Date(recentInterventions[0].startDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - lastInterventionDate.getTime());
      daysSinceLastIntervention = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // Calcule le score de santé client (0-100)
    const customerHealthScore = this.calculateCustomerHealthScore({
      totalInterventions: totalInterventionsResult.rows[0]?.count || 0,
      daysSinceLastIntervention,
      currentAmount: Number(customer.currentAmount || 0),
      allowedAmount: Number(customer.allowedAmount || 0),
      activeState: customer.activeState || 0,
    });

    return {
      customer,
      recentInterventions,
      documentStats,
      totalInterventions: totalInterventionsResult.rows[0]?.count || 0,
      totalRevenue: Number(totalRevenueResult.rows[0]?.total || 0),
      lastInterventionDate,
      daysSinceLastIntervention,
      customerHealthScore,
    };
  }

  /**
   * Calcule un score de santé client (0-100) basé sur plusieurs critères
   */
  private calculateCustomerHealthScore(params: {
    totalInterventions: number;
    daysSinceLastIntervention?: number;
    currentAmount: number;
    allowedAmount: number;
    activeState: number;
  }): number {
    let score = 100;

    // Pénalité si client inactif
    if (params.activeState !== 0) {
      score -= 30;
    }

    // Pénalité si dépassement d'encours
    if (params.allowedAmount > 0 && params.currentAmount > params.allowedAmount) {
      score -= 25;
    }

    // Pénalité si encours > 80% de la limite
    if (params.allowedAmount > 0 && params.currentAmount > params.allowedAmount * 0.8) {
      score -= 15;
    }

    // Pénalité si pas d'intervention depuis longtemps
    if (params.daysSinceLastIntervention) {
      if (params.daysSinceLastIntervention > 180) {
        score -= 20; // > 6 mois
      } else if (params.daysSinceLastIntervention > 90) {
        score -= 10; // > 3 mois
      }
    } else if (params.totalInterventions === 0) {
      score -= 10; // Nouveau client sans interventions
    }

    // Bonus si client actif régulier
    if (params.totalInterventions > 10) {
      score += 10;
    }

    // Assurer que le score reste entre 0 et 100
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Recherche des clients par nom, ville ou code postal
   */
  async searchCustomers(query: SearchCustomersDto): Promise<CustomerDto[]> {
    const limit = query.limit || 50;
    const offset = query.offset || 0;

    // Construction de la clause WHERE dynamique
    const conditions: string[] = [];
    const params: (string | number)[] = [];
    let paramIndex = 1;

    if (query.query) {
      conditions.push(
        `(c."Name" ILIKE $${paramIndex} OR c."MainDeliveryAddress_Address1" ILIKE $${paramIndex})`,
      );
      params.push(`%${query.query}%`);
      paramIndex++;
    }

    if (query.city) {
      conditions.push(`c."MainDeliveryAddress_City" ILIKE $${paramIndex}`);
      params.push(`%${query.city}%`);
      paramIndex++;
    }

    if (query.postalCode) {
      conditions.push(`c."MainDeliveryAddress_ZipCode" ILIKE $${paramIndex}`);
      params.push(`%${query.postalCode}%`);
      paramIndex++;
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    params.push(limit, offset);

    const result = await this.databaseService.query<CustomerDto>(
      `SELECT
        c."Id" AS "customerId",
        c."Name" AS "name",
        CONCAT(c."MainDeliveryContact_FirstName", ' ', c."MainDeliveryContact_Name") AS "contactName",
        c."MainDeliveryContact_Phone" AS "contactPhone",
        c."MainDeliveryContact_Email" AS "contactEmail",
        c."MainDeliveryAddress_Address1" AS "deliveryAddress",
        c."MainDeliveryAddress_City" AS "deliveryCity",
        c."MainDeliveryAddress_ZipCode" AS "deliveryPostalCode",
        c."MainDeliveryAddress_Latitude" AS "latitude",
        c."MainDeliveryAddress_Longitude" AS "longitude",
        mg."gps_provider" AS "gpsProvider",
        mg."gps_quality" AS "gpsQuality",
        c."sysCreatedDate" AS "createdAt",
        c."sysModifiedDate" AS "modifiedAt"
       FROM public."Customer" c
       LEFT JOIN mobile.customer_gps mg ON mg.customer_id = c."Id"
       ${whereClause}
       ORDER BY c."Name"
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      params,
    );

    return result.rows;
  }

  /**
   * Met à jour les coordonnées GPS d'un client
   */
  async updateCustomerGps(
    customerId: string,
    dto: UpdateCustomerGpsDto,
  ): Promise<CustomerDto> {
    // Vérifie que le client existe
    await this.getCustomerById(customerId);

    // Met à jour les coordonnées GPS via la procédure PL/pgSQL
    await this.databaseService.query(
      `CALL mobile.update_customer_gps($1, $2, $3, $4, $5)`,
      [
        customerId,
        dto.latitude,
        dto.longitude,
        dto.provider || 'manual',
        dto.quality || 1.0,
      ],
    );

    // Retourne le client mis à jour
    return this.getCustomerById(customerId);
  }
}
