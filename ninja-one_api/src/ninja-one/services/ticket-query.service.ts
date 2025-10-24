import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, Brackets } from 'typeorm';
import { Ticket } from '../entities/ticket.entity';
import { Organization } from '../entities/organization.entity';
import { Technician } from '../entities/technician.entity';
import { Device } from '../entities/device.entity';
import { TicketQueryDto } from '../dto/ticket-query.dto';

export interface TicketWithRelations {
  ticket: Ticket;
  organization?: Organization;
  assignedTechnician?: Technician;
  createdByTechnician?: Technician;
  device?: Device;
}

export interface PaginatedTicketsResponse {
  data: TicketWithRelations[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  filters: {
    applied: string[];
    available: Record<string, any>;
  };
}

export interface TicketStats {
  total: number;
  open: number;
  closed: number;
  resolved: number;
  unassigned: number;
  overdue: number;
  byStatus: Array<{ status: string; count: number; percentage: number }>;
  byPriority: Array<{ priority: string; count: number; percentage: number }>;
  byOrganization?: Array<{
    organizationId: number;
    organizationName: string;
    count: number;
  }>;
  byTechnician?: Array<{
    technicianId: number;
    technicianName: string;
    assigned: number;
    created: number;
  }>;
  timeMetrics: {
    avgTimeSpentHours: number;
    avgTimeToResolutionHours: number;
    totalTimeSpentHours: number;
  };
}

export interface TimePeriodStats {
  period: string; // Format: YYYY-MM-DD, YYYY-WW, YYYY-MM selon groupBy
  year: number;
  month?: number;
  week?: number;
  day?: number;
  created: number;
  resolved: number;
  closed: number;
  avgResolutionTimeHours: number;
}

@Injectable()
export class TicketQueryService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(Technician)
    private readonly technicianRepository: Repository<Technician>,
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {}

  /**
   * Recherche de tickets avec filtres avancés et pagination
   */
  async findTickets(
    queryDto: TicketQueryDto,
  ): Promise<PaginatedTicketsResponse> {
    const {
      page = 1,
      limit = 50,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      includeOrganization = true,
      includeTechnicians = true,
      includeDevice = false,
    } = queryDto;
    const skip = (page - 1) * limit;

    // Construire la requête avec filtres
    const queryBuilder = this.buildQuery(queryDto);

    // Ajouter tri
    const sortColumn = this.getSortColumn(sortBy);
    queryBuilder.orderBy(sortColumn, sortOrder);

    // Pagination
    queryBuilder.skip(skip).take(limit);

    // Exécuter la requête
    const [tickets, total] = await queryBuilder.getManyAndCount();

    // Enrichir avec les relations si demandé
    const ticketsWithRelations = await this.enrichWithRelations(
      tickets,
      includeOrganization,
      includeTechnicians,
      includeDevice,
    );

    // Identifier les filtres appliqués
    const appliedFilters = this.getAppliedFilters(queryDto);

    return {
      data: ticketsWithRelations,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      filters: {
        applied: appliedFilters,
        available: await this.getAvailableFilters(),
      },
    };
  }

  /**
   * Récupère un ticket par ID avec toutes ses relations
   */
  async findTicketById(ticketId: number): Promise<TicketWithRelations | null> {
    const ticket = await this.ticketRepository.findOne({
      where: { ticketId },
    });

    if (!ticket) {
      return null;
    }

    const enriched = await this.enrichWithRelations([ticket], true, true, true);
    return enriched[0];
  }

  /**
   * Statistiques globales ou filtrées
   */
  async getTicketStats(queryDto?: TicketQueryDto): Promise<TicketStats> {
    const baseQuery = queryDto
      ? this.buildQuery(queryDto)
      : this.ticketRepository.createQueryBuilder('ticket');

    // Comptes de base
    const total = await baseQuery.getCount();

    const openQuery = this.cloneQuery(baseQuery);
    const open = await openQuery
      .andWhere('ticket.isClosed = false')
      .getCount();

    const closedQuery = this.cloneQuery(baseQuery);
    const closed = await closedQuery
      .andWhere('ticket.isClosed = true')
      .getCount();

    const resolvedQuery = this.cloneQuery(baseQuery);
    const resolved = await resolvedQuery
      .andWhere('ticket.isResolved = true')
      .getCount();

    const unassignedQuery = this.cloneQuery(baseQuery);
    const unassigned = await unassignedQuery
      .andWhere('ticket.assignedTechnicianId IS NULL')
      .getCount();

    const overdueQuery = this.cloneQuery(baseQuery);
    const overdue = await overdueQuery
      .andWhere('ticket.isOverdue = true')
      .getCount();

    // Distribution par statut
    const byStatusQuery = this.cloneQuery(baseQuery);
    const byStatusRaw = await byStatusQuery
      .select("ticket.status->>'displayName'", 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy("ticket.status->>'displayName'")
      .getRawMany();

    const byStatus = byStatusRaw.map((row) => ({
      status: row.status || 'Unknown',
      count: parseInt(row.count),
      percentage: (parseInt(row.count) / total) * 100,
    }));

    // Distribution par priorité
    const byPriorityQuery = this.cloneQuery(baseQuery);
    const byPriorityRaw = await byPriorityQuery
      .select('ticket.priority', 'priority')
      .addSelect('COUNT(*)', 'count')
      .groupBy('ticket.priority')
      .getRawMany();

    const byPriority = byPriorityRaw.map((row) => ({
      priority: row.priority || 'Unknown',
      count: parseInt(row.count),
      percentage: (parseInt(row.count) / total) * 100,
    }));

    // Métriques de temps
    const timeMetricsQuery = this.cloneQuery(baseQuery);
    const timeMetrics = await timeMetricsQuery
      .select('AVG(ticket.timeSpentSeconds)', 'avgTimeSpent')
      .addSelect('AVG(ticket.timeToResolutionSeconds)', 'avgTimeToResolution')
      .addSelect('SUM(ticket.timeSpentSeconds)', 'totalTimeSpent')
      .getRawOne();

    return {
      total,
      open,
      closed,
      resolved,
      unassigned,
      overdue,
      byStatus,
      byPriority,
      timeMetrics: {
        avgTimeSpentHours: timeMetrics.avgTimeSpent
          ? parseFloat(timeMetrics.avgTimeSpent) / 3600
          : 0,
        avgTimeToResolutionHours: timeMetrics.avgTimeToResolution
          ? parseFloat(timeMetrics.avgTimeToResolution) / 3600
          : 0,
        totalTimeSpentHours: timeMetrics.totalTimeSpent
          ? parseFloat(timeMetrics.totalTimeSpent) / 3600
          : 0,
      },
    };
  }

  /**
   * Statistiques groupées par organisation
   */
  async getStatsByOrganization(
    queryDto?: TicketQueryDto,
  ): Promise<
    Array<{ organization: Organization; stats: Partial<TicketStats> }>
  > {
    const baseQuery = queryDto
      ? this.buildQuery(queryDto)
      : this.ticketRepository.createQueryBuilder('ticket');

    const byOrgRaw = await baseQuery
      .select('ticket.organizationId', 'organizationId')
      .addSelect('COUNT(*)', 'total')
      .addSelect(
        'COUNT(*) FILTER (WHERE ticket.isClosed = false)',
        'open',
      )
      .addSelect(
        'COUNT(*) FILTER (WHERE ticket.isClosed = true)',
        'closed',
      )
      .addSelect(
        'COUNT(*) FILTER (WHERE ticket.assignedTechnicianId IS NULL)',
        'unassigned',
      )
      .addSelect('AVG(ticket.timeSpentSeconds)', 'avgTimeSpent')
      .groupBy('ticket.organizationId')
      .orderBy('total', 'DESC')
      .getRawMany();

    // Charger les organisations
    const orgIds = byOrgRaw
      .map((row) => row.organizationId)
      .filter((id) => id);
    const organizations = await this.organizationRepository.findByIds(orgIds);
    const orgMap = new Map(
      organizations.map((org) => [org.organizationId, org]),
    );

    return byOrgRaw.map((row) => ({
      organization: orgMap.get(row.organizationId),
      stats: {
        total: parseInt(row.total),
        open: parseInt(row.open),
        closed: parseInt(row.closed),
        unassigned: parseInt(row.unassigned),
        timeMetrics: {
          avgTimeSpentHours: row.avgTimeSpent
            ? parseFloat(row.avgTimeSpent) / 3600
            : 0,
          avgTimeToResolutionHours: 0,
          totalTimeSpentHours: 0,
        },
      },
    }));
  }

  /**
   * Statistiques groupées par technicien
   */
  async getStatsByTechnician(
    queryDto?: TicketQueryDto,
  ): Promise<
    Array<{ technician: Technician; stats: Partial<TicketStats> }>
  > {
    const baseQuery = queryDto
      ? this.buildQuery(queryDto)
      : this.ticketRepository.createQueryBuilder('ticket');

    const byTechRaw = await baseQuery
      .select('ticket.assignedTechnicianId', 'technicianId')
      .addSelect('COUNT(*)', 'total')
      .addSelect(
        'COUNT(*) FILTER (WHERE ticket.isClosed = false)',
        'open',
      )
      .addSelect(
        'COUNT(*) FILTER (WHERE ticket.isClosed = true)',
        'closed',
      )
      .addSelect('AVG(ticket.timeSpentSeconds)', 'avgTimeSpent')
      .addSelect(
        'AVG(ticket.timeToResolutionSeconds)',
        'avgTimeToResolution',
      )
      .where('ticket.assignedTechnicianId IS NOT NULL')
      .groupBy('ticket.assignedTechnicianId')
      .orderBy('total', 'DESC')
      .getRawMany();

    // Charger les techniciens
    const techIds = byTechRaw
      .map((row) => row.technicianId)
      .filter((id) => id);
    const technicians = await this.technicianRepository.findByIds(techIds);
    const techMap = new Map(
      technicians.map((tech) => [tech.technicianId, tech]),
    );

    return byTechRaw.map((row) => ({
      technician: techMap.get(row.technicianId),
      stats: {
        total: parseInt(row.total),
        open: parseInt(row.open),
        closed: parseInt(row.closed),
        timeMetrics: {
          avgTimeSpentHours: row.avgTimeSpent
            ? parseFloat(row.avgTimeSpent) / 3600
            : 0,
          avgTimeToResolutionHours: row.avgTimeToResolution
            ? parseFloat(row.avgTimeToResolution) / 3600
            : 0,
          totalTimeSpentHours: 0,
        },
      },
    }));
  }

  /**
   * Statistiques par période (jour/semaine/mois)
   */
  async getStatsByPeriod(
    groupBy: 'day' | 'week' | 'month',
    queryDto?: TicketQueryDto,
  ): Promise<TimePeriodStats[]> {
    const baseQuery = queryDto
      ? this.buildQuery(queryDto)
      : this.ticketRepository.createQueryBuilder('ticket');

    let dateFormat: string;
    let dateGrouping: string[];

    switch (groupBy) {
      case 'day':
        dateFormat = 'YYYY-MM-DD';
        dateGrouping = [
          "DATE_TRUNC('day', ticket.createdAt)",
          "EXTRACT(YEAR FROM ticket.createdAt)",
          "EXTRACT(MONTH FROM ticket.createdAt)",
          "EXTRACT(DAY FROM ticket.createdAt)",
        ];
        break;
      case 'week':
        dateFormat = 'IYYY-IW';
        dateGrouping = [
          "DATE_TRUNC('week', ticket.createdAt)",
          "EXTRACT(ISOYEAR FROM ticket.createdAt)",
          "EXTRACT(WEEK FROM ticket.createdAt)",
        ];
        break;
      case 'month':
        dateFormat = 'YYYY-MM';
        dateGrouping = [
          "DATE_TRUNC('month', ticket.createdAt)",
          "EXTRACT(YEAR FROM ticket.createdAt)",
          "EXTRACT(MONTH FROM ticket.createdAt)",
        ];
        break;
    }

    const rawStats = await baseQuery
      .select(`TO_CHAR(ticket.createdAt, '${dateFormat}')`, 'period')
      .addSelect("EXTRACT(YEAR FROM ticket.createdAt)::INTEGER", 'year')
      .addSelect("EXTRACT(MONTH FROM ticket.createdAt)::INTEGER", 'month')
      .addSelect("EXTRACT(WEEK FROM ticket.createdAt)::INTEGER", 'week')
      .addSelect("EXTRACT(DAY FROM ticket.createdAt)::INTEGER", 'day')
      .addSelect('COUNT(*)', 'created')
      .addSelect(
        'COUNT(*) FILTER (WHERE ticket.isResolved = true)',
        'resolved',
      )
      .addSelect(
        'COUNT(*) FILTER (WHERE ticket.isClosed = true)',
        'closed',
      )
      .addSelect(
        'AVG(ticket.timeToResolutionSeconds) FILTER (WHERE ticket.timeToResolutionSeconds IS NOT NULL)',
        'avgResolutionTime',
      )
      .groupBy(dateGrouping[0])
      .addGroupBy(dateGrouping[1])
      .orderBy('period', 'ASC')
      .getRawMany();

    return rawStats.map((row) => ({
      period: row.period,
      year: row.year,
      month: groupBy !== 'week' ? row.month : undefined,
      week: groupBy === 'week' ? row.week : undefined,
      day: groupBy === 'day' ? row.day : undefined,
      created: parseInt(row.created),
      resolved: parseInt(row.resolved),
      closed: parseInt(row.closed),
      avgResolutionTimeHours: row.avgResolutionTime
        ? parseFloat(row.avgResolutionTime) / 3600
        : 0,
    }));
  }

  /**
   * Construit la requête de base avec tous les filtres
   */
  private buildQuery(queryDto: TicketQueryDto): SelectQueryBuilder<Ticket> {
    const queryBuilder = this.ticketRepository.createQueryBuilder('ticket');

    // Filtres par ID (relations)
    if (queryDto.organizationId) {
      queryBuilder.andWhere('ticket.organizationId = :organizationId', {
        organizationId: queryDto.organizationId,
      });
    }

    if (queryDto.assignedTechnicianId) {
      queryBuilder.andWhere(
        'ticket.assignedTechnicianId = :assignedTechnicianId',
        { assignedTechnicianId: queryDto.assignedTechnicianId },
      );
    }

    if (queryDto.createdByTechnicianId) {
      queryBuilder.andWhere(
        'ticket.createdByTechnicianId = :createdByTechnicianId',
        { createdByTechnicianId: queryDto.createdByTechnicianId },
      );
    }

    if (queryDto.deviceId) {
      queryBuilder.andWhere('ticket.deviceId = :deviceId', {
        deviceId: queryDto.deviceId,
      });
    }

    if (queryDto.locationId) {
      queryBuilder.andWhere('ticket.locationId = :locationId', {
        locationId: queryDto.locationId,
      });
    }

    if (queryDto.statusId) {
      queryBuilder.andWhere('ticket.statusId = :statusId', {
        statusId: queryDto.statusId,
      });
    }

    // Filtre par nom de statut (JSONB)
    if (queryDto.statusName) {
      queryBuilder.andWhere(
        "LOWER(ticket.status->>'displayName') = LOWER(:statusName)",
        { statusName: queryDto.statusName },
      );
    }

    // Filtres par texte
    if (queryDto.priority) {
      queryBuilder.andWhere('ticket.priority = :priority', {
        priority: queryDto.priority,
      });
    }

    if (queryDto.severity) {
      queryBuilder.andWhere('LOWER(ticket.severity) = LOWER(:severity)', {
        severity: queryDto.severity,
      });
    }

    if (queryDto.source) {
      queryBuilder.andWhere('LOWER(ticket.source) = LOWER(:source)', {
        source: queryDto.source,
      });
    }

    if (queryDto.channel) {
      queryBuilder.andWhere('LOWER(ticket.channel) = LOWER(:channel)', {
        channel: queryDto.channel,
      });
    }

    if (queryDto.category) {
      queryBuilder.andWhere('LOWER(ticket.category) = LOWER(:category)', {
        category: queryDto.category,
      });
    }

    if (queryDto.ticketType) {
      queryBuilder.andWhere('LOWER(ticket.ticketType) = LOWER(:ticketType)', {
        ticketType: queryDto.ticketType,
      });
    }

    if (queryDto.requesterName) {
      queryBuilder.andWhere(
        'LOWER(ticket.requesterName) LIKE LOWER(:requesterName)',
        { requesterName: `%${queryDto.requesterName}%` },
      );
    }

    // Recherche full-text
    if (queryDto.search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(ticket.title) LIKE LOWER(:search)', {
            search: `%${queryDto.search}%`,
          }).orWhere('LOWER(ticket.description) LIKE LOWER(:search)', {
            search: `%${queryDto.search}%`,
          });
        }),
      );
    }

    // Filtres par date
    if (queryDto.createdAfter) {
      queryBuilder.andWhere('ticket.createdAt >= :createdAfter', {
        createdAfter: queryDto.createdAfter,
      });
    }

    if (queryDto.createdBefore) {
      queryBuilder.andWhere('ticket.createdAt <= :createdBefore', {
        createdBefore: queryDto.createdBefore,
      });
    }

    if (queryDto.updatedAfter) {
      queryBuilder.andWhere('ticket.updatedAt >= :updatedAfter', {
        updatedAfter: queryDto.updatedAfter,
      });
    }

    if (queryDto.updatedBefore) {
      queryBuilder.andWhere('ticket.updatedAt <= :updatedBefore', {
        updatedBefore: queryDto.updatedBefore,
      });
    }

    if (queryDto.resolvedAfter) {
      queryBuilder.andWhere('ticket.resolvedAt >= :resolvedAfter', {
        resolvedAfter: queryDto.resolvedAfter,
      });
    }

    if (queryDto.resolvedBefore) {
      queryBuilder.andWhere('ticket.resolvedAt <= :resolvedBefore', {
        resolvedBefore: queryDto.resolvedBefore,
      });
    }

    if (queryDto.closedAfter) {
      queryBuilder.andWhere('ticket.closedAt >= :closedAfter', {
        closedAfter: queryDto.closedAfter,
      });
    }

    if (queryDto.closedBefore) {
      queryBuilder.andWhere('ticket.closedAt <= :closedBefore', {
        closedBefore: queryDto.closedBefore,
      });
    }

    if (queryDto.dueAfter) {
      queryBuilder.andWhere('ticket.dueDate >= :dueAfter', {
        dueAfter: queryDto.dueAfter,
      });
    }

    if (queryDto.dueBefore) {
      queryBuilder.andWhere('ticket.dueDate <= :dueBefore', {
        dueBefore: queryDto.dueBefore,
      });
    }

    // Filtres booléens
    if (queryDto.isOverdue !== undefined) {
      queryBuilder.andWhere('ticket.isOverdue = :isOverdue', {
        isOverdue: queryDto.isOverdue,
      });
    }

    if (queryDto.isResolved !== undefined) {
      queryBuilder.andWhere('ticket.isResolved = :isResolved', {
        isResolved: queryDto.isResolved,
      });
    }

    if (queryDto.isClosed !== undefined) {
      queryBuilder.andWhere('ticket.isClosed = :isClosed', {
        isClosed: queryDto.isClosed,
      });
    }

    if (queryDto.hasComments !== undefined) {
      queryBuilder.andWhere('ticket.hasComments = :hasComments', {
        hasComments: queryDto.hasComments,
      });
    }

    if (queryDto.hasAttachments !== undefined) {
      queryBuilder.andWhere('ticket.hasAttachments = :hasAttachments', {
        hasAttachments: queryDto.hasAttachments,
      });
    }

    // Filtre spécial : tickets non assignés
    if (queryDto.unassigned === true) {
      queryBuilder.andWhere('ticket.assignedTechnicianId IS NULL');
    }

    // Filtre par tags (JSONB)
    if (queryDto.tag) {
      queryBuilder.andWhere('ticket.tags @> :tag::jsonb', {
        tag: JSON.stringify([queryDto.tag]),
      });
    }

    return queryBuilder;
  }

  /**
   * Enrichit les tickets avec leurs relations
   */
  private async enrichWithRelations(
    tickets: Ticket[],
    includeOrganization: boolean = true,
    includeTechnicians: boolean = true,
    includeDevice: boolean = false,
  ): Promise<TicketWithRelations[]> {
    const result: TicketWithRelations[] = tickets.map((ticket) => ({
      ticket,
    }));

    if (tickets.length === 0) {
      return result;
    }

    // Récupérer les IDs uniques
    const orgIds = includeOrganization
      ? [
          ...new Set(
            tickets
              .map((t) => t.organizationId)
              .filter((id) => id !== null && id !== undefined),
          ),
        ]
      : [];

    const techIds = includeTechnicians
      ? [
          ...new Set(
            [
              ...tickets.map((t) => t.assignedTechnicianId),
              ...tickets.map((t) => t.createdByTechnicianId),
            ].filter((id) => id !== null && id !== undefined),
          ),
        ]
      : [];

    const deviceIds = includeDevice
      ? [
          ...new Set(
            tickets
              .map((t) => t.deviceId)
              .filter((id) => id !== null && id !== undefined),
          ),
        ]
      : [];

    // Charger toutes les entités en parallèle
    const [organizations, technicians, devices] = await Promise.all([
      orgIds.length > 0
        ? this.organizationRepository.findByIds(orgIds)
        : Promise.resolve([]),
      techIds.length > 0
        ? this.technicianRepository.findByIds(techIds)
        : Promise.resolve([]),
      deviceIds.length > 0
        ? this.deviceRepository.findByIds(deviceIds)
        : Promise.resolve([]),
    ]);

    // Créer des maps pour un accès rapide
    const orgMap = new Map(
      organizations.map((org) => [org.organizationId, org]),
    );
    const techMap = new Map(
      technicians.map((tech) => [tech.technicianId, tech]),
    );
    const deviceMap = new Map(devices.map((dev) => [dev.deviceId, dev]));

    // Enrichir les résultats
    return result.map((item) => ({
      ...item,
      organization: item.ticket.organizationId
        ? orgMap.get(item.ticket.organizationId)
        : undefined,
      assignedTechnician: item.ticket.assignedTechnicianId
        ? techMap.get(item.ticket.assignedTechnicianId)
        : undefined,
      createdByTechnician: item.ticket.createdByTechnicianId
        ? techMap.get(item.ticket.createdByTechnicianId)
        : undefined,
      device: item.ticket.deviceId
        ? deviceMap.get(item.ticket.deviceId)
        : undefined,
    }));
  }

  /**
   * Clone une query builder pour éviter les mutations
   */
  private cloneQuery(
    query: SelectQueryBuilder<Ticket>,
  ): SelectQueryBuilder<Ticket> {
    return this.ticketRepository
      .createQueryBuilder('ticket')
      .where(query.getQuery())
      .setParameters(query.getParameters());
  }

  /**
   * Retourne la colonne de tri appropriée
   */
  private getSortColumn(sortBy: string): string {
    const sortMap: Record<string, string> = {
      createdAt: 'ticket.createdAt',
      updatedAt: 'ticket.updatedAt',
      resolvedAt: 'ticket.resolvedAt',
      closedAt: 'ticket.closedAt',
      dueDate: 'ticket.dueDate',
      priority: 'ticket.priority',
      title: 'ticket.title',
      ticketId: 'ticket.ticketId',
      timeSpentSeconds: 'ticket.timeSpentSeconds',
      timeToResolutionSeconds: 'ticket.timeToResolutionSeconds',
    };

    return sortMap[sortBy] || 'ticket.createdAt';
  }

  /**
   * Identifie les filtres appliqués
   */
  private getAppliedFilters(queryDto: TicketQueryDto): string[] {
    const filters: string[] = [];
    const dto = queryDto as any;

    Object.keys(dto).forEach((key) => {
      if (
        dto[key] !== undefined &&
        dto[key] !== null &&
        !['page', 'limit', 'sortBy', 'sortOrder'].includes(key)
      ) {
        filters.push(key);
      }
    });

    return filters;
  }

  /**
   * Retourne les valeurs disponibles pour les filtres
   */
  private async getAvailableFilters(): Promise<Record<string, any>> {
    const [priorities, statuses, sources, organizations, technicians] =
      await Promise.all([
        this.ticketRepository
          .createQueryBuilder('ticket')
          .select('DISTINCT ticket.priority', 'priority')
          .where('ticket.priority IS NOT NULL')
          .getRawMany(),
        this.ticketRepository
          .createQueryBuilder('ticket')
          .select("DISTINCT ticket.status->>'displayName'", 'status')
          .where('ticket.status IS NOT NULL')
          .getRawMany(),
        this.ticketRepository
          .createQueryBuilder('ticket')
          .select('DISTINCT ticket.source', 'source')
          .where('ticket.source IS NOT NULL')
          .getRawMany(),
        this.organizationRepository.count(),
        this.technicianRepository.count(),
      ]);

    return {
      priorities: priorities.map((p) => p.priority),
      statuses: statuses.map((s) => s.status),
      sources: sources.map((s) => s.source),
      totalOrganizations: organizations,
      totalTechnicians: technicians,
    };
  }
}
