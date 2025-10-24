import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Ticket } from '../entities/ticket.entity';
import { Organization } from '../entities/organization.entity';
import { Technician } from '../entities/technician.entity';
import { TicketQueryDto } from '../dto/ticket-query.dto';

export interface TicketWithRelations {
  ticket: Ticket;
  organization?: Organization;
  assignedTechnician?: Technician;
  createdByTechnician?: Technician;
}

export interface PaginatedTicketsResponse {
  data: TicketWithRelations[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
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
  ) {}

  async findTickets(
    queryDto: TicketQueryDto,
  ): Promise<PaginatedTicketsResponse> {
    const { page = 1, limit = 50, sortBy = 'createdAt', sortOrder = 'DESC' } = queryDto;
    const skip = (page - 1) * limit;

    // Construire la requête avec filtres
    const queryBuilder = this.buildQuery(queryDto);

    // Ajouter tri
    queryBuilder.orderBy(`ticket.${sortBy}`, sortOrder);

    // Pagination
    queryBuilder.skip(skip).take(limit);

    // Exécuter la requête
    const [tickets, total] = await queryBuilder.getManyAndCount();

    // Récupérer les relations (organizations et technicians)
    const ticketsWithRelations = await this.enrichWithRelations(tickets);

    return {
      data: ticketsWithRelations,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findTicketById(ticketId: number): Promise<TicketWithRelations | null> {
    const ticket = await this.ticketRepository.findOne({
      where: { ticketId },
    });

    if (!ticket) {
      return null;
    }

    const enriched = await this.enrichWithRelations([ticket]);
    return enriched[0];
  }

  async getTicketStats(organizationId?: number) {
    const queryBuilder = this.ticketRepository.createQueryBuilder('ticket');

    if (organizationId) {
      queryBuilder.where('ticket.organizationId = :organizationId', {
        organizationId,
      });
    }

    const total = await queryBuilder.getCount();

    const byStatus = await queryBuilder
      .select("ticket.status->>'displayName'", 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy("ticket.status->>'displayName'")
      .getRawMany();

    const byPriority = await this.ticketRepository
      .createQueryBuilder('ticket')
      .select('ticket.priority', 'priority')
      .addSelect('COUNT(*)', 'count')
      .where(organizationId ? 'ticket.organizationId = :organizationId' : '1=1', {
        organizationId,
      })
      .groupBy('ticket.priority')
      .getRawMany();

    const overdue = await this.ticketRepository
      .createQueryBuilder('ticket')
      .where('ticket.isOverdue = true')
      .andWhere(
        organizationId ? 'ticket.organizationId = :organizationId' : '1=1',
        { organizationId },
      )
      .getCount();

    const open = await this.ticketRepository
      .createQueryBuilder('ticket')
      .where('ticket.isClosed = false')
      .andWhere(
        organizationId ? 'ticket.organizationId = :organizationId' : '1=1',
        { organizationId },
      )
      .getCount();

    return {
      total,
      open,
      overdue,
      byStatus,
      byPriority,
    };
  }

  private buildQuery(
    queryDto: TicketQueryDto,
  ): SelectQueryBuilder<Ticket> {
    const queryBuilder = this.ticketRepository.createQueryBuilder('ticket');

    // Filtres par ID
    if (queryDto.organizationId) {
      queryBuilder.andWhere('ticket.organizationId = :organizationId', {
        organizationId: queryDto.organizationId,
      });
    }

    if (queryDto.assignedTechnicianId) {
      queryBuilder.andWhere(
        'ticket.assignedTechnicianId = :assignedTechnicianId',
        {
          assignedTechnicianId: queryDto.assignedTechnicianId,
        },
      );
    }

    if (queryDto.createdByTechnicianId) {
      queryBuilder.andWhere(
        'ticket.createdByTechnicianId = :createdByTechnicianId',
        {
          createdByTechnicianId: queryDto.createdByTechnicianId,
        },
      );
    }

    if (queryDto.deviceId) {
      queryBuilder.andWhere('ticket.deviceId = :deviceId', {
        deviceId: queryDto.deviceId,
      });
    }

    if (queryDto.statusId) {
      queryBuilder.andWhere('ticket.statusId = :statusId', {
        statusId: queryDto.statusId,
      });
    }

    // Filtres par texte
    if (queryDto.priority) {
      queryBuilder.andWhere('LOWER(ticket.priority) = LOWER(:priority)', {
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

    if (queryDto.search) {
      queryBuilder.andWhere(
        '(LOWER(ticket.title) LIKE LOWER(:search) OR LOWER(ticket.description) LIKE LOWER(:search))',
        {
          search: `%${queryDto.search}%`,
        },
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

    // Filtres booléens
    if (queryDto.isOverdue !== undefined) {
      queryBuilder.andWhere('ticket.isOverdue = :isOverdue', {
        isOverdue: queryDto.isOverdue === 'true',
      });
    }

    if (queryDto.isResolved !== undefined) {
      queryBuilder.andWhere('ticket.isResolved = :isResolved', {
        isResolved: queryDto.isResolved === 'true',
      });
    }

    if (queryDto.isClosed !== undefined) {
      queryBuilder.andWhere('ticket.isClosed = :isClosed', {
        isClosed: queryDto.isClosed === 'true',
      });
    }

    return queryBuilder;
  }

  private async enrichWithRelations(
    tickets: Ticket[],
  ): Promise<TicketWithRelations[]> {
    // Récupérer tous les IDs uniques
    const orgIds = [
      ...new Set(
        tickets
          .map((t) => t.organizationId)
          .filter((id) => id !== null && id !== undefined),
      ),
    ];
    const techIds = [
      ...new Set(
        [
          ...tickets.map((t) => t.assignedTechnicianId),
          ...tickets.map((t) => t.createdByTechnicianId),
        ].filter((id) => id !== null && id !== undefined),
      ),
    ];

    // Charger toutes les organisations et techniciens en une seule requête
    const organizations =
      orgIds.length > 0
        ? await this.organizationRepository.findByIds(orgIds)
        : [];
    const technicians =
      techIds.length > 0
        ? await this.technicianRepository.findByIds(techIds)
        : [];

    // Créer des maps pour un accès rapide
    const orgMap = new Map(
      organizations.map((org) => [org.organizationId, org]),
    );
    const techMap = new Map(
      technicians.map((tech) => [tech.technicianId, tech]),
    );

    // Enrichir les tickets avec les relations
    return tickets.map((ticket) => ({
      ticket,
      organization: ticket.organizationId
        ? orgMap.get(ticket.organizationId)
        : undefined,
      assignedTechnician: ticket.assignedTechnicianId
        ? techMap.get(ticket.assignedTechnicianId)
        : undefined,
      createdByTechnician: ticket.createdByTechnicianId
        ? techMap.get(ticket.createdByTechnicianId)
        : undefined,
    }));
  }
}
