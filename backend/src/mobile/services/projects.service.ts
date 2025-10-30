import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from './database.service';
import {
  ProjectDto,
  ProjectWithDistanceDto,
  ProjectStatsDto,
  ProjectState,
} from '../dto/projects/project.dto';
import {
  QueryProjectsDto,
  QueryNearbyProjectsDto,
} from '../dto/projects/query-projects.dto';

/**
 * Interface pour les lignes de projet depuis mobile.get_projects_for_manager
 */
interface ProjectManagerRow {
  id: number;
  name: string;
  reference: string;
  customerName: string;
  state: ProjectState;
  startDate: Date;
  endDate: Date;
  city: string;
  latitude: string | null;
  longitude: string | null;
}

/**
 * Interface pour les lignes de projet détaillées depuis Deal
 */
interface ProjectDetailRow {
  id: number;
  name: string;
  reference: string;
  customerId: string;
  customerName: string;
  state: ProjectState;
  startDate: Date;
  endDate: Date;
  actualEndDate: Date | null;
  city: string;
  latitude: string | null;
  longitude: string | null;
  managerId: string;
  managerName: string;
  createdAt: Date;
  modifiedAt: Date;
}

/**
 * Interface pour les lignes de projet de base
 */
interface ProjectBaseRow {
  id: number;
  name: string;
  reference: string;
  customerId: string;
  customerName: string;
  state: ProjectState;
  startDate: Date;
  endDate: Date;
  city: string;
  latitude: string | null;
  longitude: string | null;
}

/**
 * Interface pour les projets avec distance GPS
 */
interface ProjectWithDistanceRow extends ProjectBaseRow {
  distanceKm: number;
}

/**
 * Interface pour les statistiques de projets
 */
interface ProjectStatsRow {
  totalProjects: number;
  activeProjects: number;
  wonProjects: number;
  lostProjects: number;
}

@Injectable()
export class ProjectsService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Récupère les projets d'un responsable
   */
  async getProjectsForManager(managerId: string): Promise<ProjectDto[]> {
    const result = await this.databaseService.query<ProjectManagerRow>(
      `SELECT
        id,
        name,
        reference,
        customer_name AS "customerName",
        state,
        start_date AS "startDate",
        end_date AS "endDate",
        city,
        latitude,
        longitude
       FROM mobile.get_projects_for_manager($1)`,
      [managerId],
    );

    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      reference: row.reference,
      customerName: row.customerName,
      state: row.state,
      stateLabel: this.getStateLabel(row.state),
      startDate: row.startDate,
      endDate: row.endDate,
      city: row.city,
      latitude: row.latitude ? Number(row.latitude) : undefined,
      longitude: row.longitude ? Number(row.longitude) : undefined,
    }));
  }

  /**
   * Récupère un projet par son ID
   */
  async getProjectById(projectId: number): Promise<ProjectDto> {
    const result = await this.databaseService.query<ProjectDetailRow>(
      `SELECT
        d."Id" AS "id",
        d."caption" AS "name",
        d."number" AS "reference",
        d."customer" AS "customerId",
        c."caption" AS "customerName",
        d."DealState" AS "state",
        d."xx_DateDebut" AS "startDate",
        d."xx_DateFin" AS "endDate",
        d."xx_Date_Fin_Reelle" AS "actualEndDate",
        d."xx_Ville" AS "city",
        d."xx_Latitude" AS "latitude",
        d."xx_Longitude" AS "longitude",
        d."manager" AS "managerId",
        col."caption" AS "managerName",
        d."sysCreatedDate" AS "createdAt",
        d."sysModifiedDate" AS "modifiedAt"
       FROM public."Deal" d
       LEFT JOIN public."Customer" c ON c."Id" = d."customer"
       LEFT JOIN public."Colleague" col ON col."Id" = d."manager"
       WHERE d."Id" = $1`,
      [projectId],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Projet ${projectId} non trouvé`);
    }

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      reference: row.reference,
      customerId: row.customerId,
      customerName: row.customerName,
      state: row.state,
      stateLabel: this.getStateLabel(row.state),
      startDate: row.startDate,
      endDate: row.endDate,
      actualEndDate: row.actualEndDate,
      city: row.city,
      latitude: row.latitude ? Number(row.latitude) : undefined,
      longitude: row.longitude ? Number(row.longitude) : undefined,
      managerId: row.managerId,
      managerName: row.managerName,
      createdAt: row.createdAt,
      modifiedAt: row.modifiedAt,
    };
  }

  /**
   * Recherche de projets par critères
   */
  async searchProjects(query: QueryProjectsDto): Promise<ProjectDto[]> {
    const limit = query.limit || 50;
    const offset = query.offset || 0;

    // Construction de la clause WHERE dynamique
    const conditions: string[] = [];
    const params: (string | number | Date | number[])[] = [];
    let paramIndex = 1;

    if (query.managerId) {
      conditions.push(`d."manager" = $${paramIndex}`);
      params.push(query.managerId);
      paramIndex++;
    }

    if (query.states && query.states.length > 0) {
      conditions.push(`d."DealState" = ANY($${paramIndex}::int[])`);
      params.push(query.states);
      paramIndex++;
    }

    if (query.customerId) {
      conditions.push(`d."customer" = $${paramIndex}`);
      params.push(query.customerId);
      paramIndex++;
    }

    if (query.dateFrom) {
      conditions.push(`d."xx_DateDebut" >= $${paramIndex}`);
      params.push(query.dateFrom);
      paramIndex++;
    }

    if (query.dateTo) {
      conditions.push(`d."xx_DateFin" <= $${paramIndex}`);
      params.push(query.dateTo);
      paramIndex++;
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    params.push(limit, offset);

    const result = await this.databaseService.query<ProjectBaseRow>(
      `SELECT
        d."Id" AS "id",
        d."caption" AS "name",
        d."number" AS "reference",
        d."customer" AS "customerId",
        c."caption" AS "customerName",
        d."DealState" AS "state",
        d."xx_DateDebut" AS "startDate",
        d."xx_DateFin" AS "endDate",
        d."xx_Ville" AS "city",
        d."xx_Latitude" AS "latitude",
        d."xx_Longitude" AS "longitude"
       FROM public."Deal" d
       LEFT JOIN public."Customer" c ON c."Id" = d."customer"
       ${whereClause}
       ORDER BY d."xx_DateDebut" DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      params,
    );

    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      reference: row.reference,
      customerId: row.customerId,
      customerName: row.customerName,
      state: row.state,
      stateLabel: this.getStateLabel(row.state),
      startDate: row.startDate,
      endDate: row.endDate,
      city: row.city,
      latitude: row.latitude ? Number(row.latitude) : undefined,
      longitude: row.longitude ? Number(row.longitude) : undefined,
    }));
  }

  /**
   * Recherche des projets à proximité GPS
   */
  async getNearbyProjects(
    query: QueryNearbyProjectsDto,
  ): Promise<ProjectWithDistanceDto[]> {
    const radiusKm = query.radiusKm || 50;
    const limit = query.limit || 20;
    const states = query.states && query.states.length > 0 ? query.states : null;

    // Construction de la clause de filtre par état
    const stateFilter = states
      ? `AND d."DealState" = ANY($4::int[])`
      : '';

    const params = states
      ? [query.latitude, query.longitude, radiusKm, states, limit]
      : [query.latitude, query.longitude, radiusKm, limit];

    const paramLimit = states ? '$5' : '$4';

    const result = await this.databaseService.query<ProjectWithDistanceRow>(
      `SELECT
        d."Id" AS "id",
        d."caption" AS "name",
        d."number" AS "reference",
        c."caption" AS "customerName",
        d."DealState" AS "state",
        d."xx_DateDebut" AS "startDate",
        d."xx_DateFin" AS "endDate",
        d."xx_Ville" AS "city",
        d."xx_Latitude" AS "latitude",
        d."xx_Longitude" AS "longitude",
        (
          6371 * acos(
            cos(radians($1)) *
            cos(radians(d."xx_Latitude")) *
            cos(radians(d."xx_Longitude") - radians($2)) +
            sin(radians($1)) *
            sin(radians(d."xx_Latitude"))
          )
        ) AS "distanceKm"
       FROM public."Deal" d
       LEFT JOIN public."Customer" c ON c."Id" = d."customer"
       WHERE d."xx_Latitude" IS NOT NULL
         AND d."xx_Longitude" IS NOT NULL
         AND (
           6371 * acos(
             cos(radians($1)) *
             cos(radians(d."xx_Latitude")) *
             cos(radians(d."xx_Longitude") - radians($2)) +
             sin(radians($1)) *
             sin(radians(d."xx_Latitude"))
           )
         ) <= $3
         ${stateFilter}
       ORDER BY "distanceKm"
       LIMIT ${paramLimit}`,
      params,
    );

    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      reference: row.reference,
      customerName: row.customerName,
      state: row.state,
      stateLabel: this.getStateLabel(row.state),
      startDate: row.startDate,
      endDate: row.endDate,
      city: row.city,
      latitude: Number(row.latitude),
      longitude: Number(row.longitude),
      distanceKm: Number(row.distanceKm),
    }));
  }

  /**
   * Récupère les statistiques globales des projets
   */
  async getProjectsStats(): Promise<ProjectStatsDto> {
    const result = await this.databaseService.query<ProjectStatsRow>(
      `SELECT
        COUNT(*)::int AS "totalProjects",
        COUNT(*) FILTER (WHERE "DealState" = 1)::int AS "activeProjects",
        COUNT(*) FILTER (WHERE "DealState" = 2)::int AS "wonProjects",
        COUNT(*) FILTER (WHERE "DealState" = 3)::int AS "lostProjects"
       FROM public."Deal"`,
    );

    const stats = result.rows[0];
    const totalDecided = stats.wonProjects + stats.lostProjects;
    const winRate =
      totalDecided > 0 ? (stats.wonProjects / totalDecided) * 100 : 0;

    return {
      totalProjects: stats.totalProjects,
      activeProjects: stats.activeProjects,
      wonProjects: stats.wonProjects,
      lostProjects: stats.lostProjects,
      totalEstimatedAmount: 0, // TODO: Calculer depuis les documents
      totalActualAmount: 0, // TODO: Calculer depuis les documents
      winRate: Number(winRate.toFixed(2)),
    };
  }

  /**
   * Helper: Convertit l'état en label
   */
  private getStateLabel(state: ProjectState): string {
    const labels: Record<ProjectState, string> = {
      [ProjectState.PROSPECTION]: 'Prospection',
      [ProjectState.EN_COURS]: 'En cours',
      [ProjectState.GAGNE]: 'Gagné',
      [ProjectState.PERDU]: 'Perdu',
      [ProjectState.SUSPENDU]: 'Suspendu',
      [ProjectState.ANNULE]: 'Annulé',
    };
    return labels[state] || 'Inconnu';
  }
}
