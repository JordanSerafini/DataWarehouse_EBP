import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  ParseIntPipe,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TicketQueryService } from '../services/ticket-query.service';
import { TicketsSyncService } from '../services/tickets-sync.service';
import { TicketQueryDto } from '../dto/ticket-query.dto';

@Controller('api/tickets')
export class TicketsController {
  constructor(
    private readonly ticketQueryService: TicketQueryService,
    private readonly ticketsSyncService: TicketsSyncService,
  ) {}

  /**
   * GET /api/tickets
   * Liste de tickets avec filtres avancés et pagination
   *
   * Exemples:
   * - /api/tickets?page=1&limit=50
   * - /api/tickets?organizationId=123
   * - /api/tickets?assignedTechnicianId=5
   * - /api/tickets?unassigned=true
   * - /api/tickets?priority=HIGH&isClosed=false
   * - /api/tickets?statusName=Nouveau
   * - /api/tickets?search=wifi
   * - /api/tickets?createdAfter=2024-01-01&createdBefore=2024-12-31
   * - /api/tickets?sortBy=createdAt&sortOrder=DESC
   */
  @Get()
  async findAll(@Query() queryDto: TicketQueryDto) {
    return this.ticketQueryService.findTickets(queryDto);
  }

  /**
   * GET /api/tickets/stats
   * Statistiques globales ou filtrées
   *
   * Exemples:
   * - /api/tickets/stats
   * - /api/tickets/stats?organizationId=123
   * - /api/tickets/stats?assignedTechnicianId=5
   * - /api/tickets/stats?createdAfter=2024-01-01
   */
  @Get('stats')
  async getStats(@Query() queryDto: TicketQueryDto) {
    return this.ticketQueryService.getTicketStats(queryDto);
  }

  /**
   * GET /api/tickets/stats/by-organization
   * Statistiques groupées par organisation
   *
   * Exemples:
   * - /api/tickets/stats/by-organization
   * - /api/tickets/stats/by-organization?createdAfter=2024-01-01
   */
  @Get('stats/by-organization')
  async getStatsByOrganization(@Query() queryDto?: TicketQueryDto) {
    return this.ticketQueryService.getStatsByOrganization(queryDto);
  }

  /**
   * GET /api/tickets/stats/by-technician
   * Statistiques groupées par technicien
   *
   * Exemples:
   * - /api/tickets/stats/by-technician
   * - /api/tickets/stats/by-technician?organizationId=123
   */
  @Get('stats/by-technician')
  async getStatsByTechnician(@Query() queryDto?: TicketQueryDto) {
    return this.ticketQueryService.getStatsByTechnician(queryDto);
  }

  /**
   * GET /api/tickets/stats/by-period
   * Statistiques par période (jour/semaine/mois)
   *
   * Exemples:
   * - /api/tickets/stats/by-period?groupBy=day
   * - /api/tickets/stats/by-period?groupBy=week&organizationId=123
   * - /api/tickets/stats/by-period?groupBy=month&createdAfter=2024-01-01
   */
  @Get('stats/by-period')
  async getStatsByPeriod(
    @Query('groupBy') groupBy: 'day' | 'week' | 'month',
    @Query() queryDto?: TicketQueryDto,
  ) {
    if (!groupBy || !['day', 'week', 'month'].includes(groupBy)) {
      throw new BadRequestException(
        'groupBy parameter is required and must be one of: day, week, month',
      );
    }
    return this.ticketQueryService.getStatsByPeriod(groupBy, queryDto);
  }

  /**
   * POST /api/tickets/sync
   * Synchronise tous les tickets depuis l'API NinjaOne vers la base de données locale
   *
   * Exemples:
   * - POST /api/tickets/sync
   */
  @Post('sync')
  async syncTickets() {
    return this.ticketsSyncService.syncTickets();
  }

  /**
   * GET /api/tickets/:id
   * Détail d'un ticket avec toutes ses relations
   *
   * Exemples:
   * - /api/tickets/12345
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const ticket = await this.ticketQueryService.findTicketById(id);
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
    return ticket;
  }
}

/**
 * Contrôleur pour les tickets d'une organisation spécifique
 */
@Controller('api/organizations/:organizationId/tickets')
export class OrganizationTicketsController {
  constructor(private readonly ticketQueryService: TicketQueryService) {}

  /**
   * GET /api/organizations/:organizationId/tickets
   * Tous les tickets d'une organisation
   *
   * Exemples:
   * - /api/organizations/123/tickets
   * - /api/organizations/123/tickets?isClosed=false
   * - /api/organizations/123/tickets?priority=HIGH
   */
  @Get()
  async findAll(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Query() queryDto: TicketQueryDto,
  ) {
    queryDto.organizationId = organizationId;
    return this.ticketQueryService.findTickets(queryDto);
  }

  /**
   * GET /api/organizations/:organizationId/tickets/stats
   * Statistiques des tickets d'une organisation
   */
  @Get('stats')
  async getStats(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Query() queryDto: TicketQueryDto,
  ) {
    queryDto.organizationId = organizationId;
    return this.ticketQueryService.getTicketStats(queryDto);
  }
}

/**
 * Contrôleur pour les tickets d'un technicien spécifique
 */
@Controller('api/technicians/:technicianId/tickets')
export class TechnicianTicketsController {
  constructor(private readonly ticketQueryService: TicketQueryService) {}

  /**
   * GET /api/technicians/:technicianId/tickets
   * Tous les tickets assignés à un technicien
   *
   * Exemples:
   * - /api/technicians/5/tickets
   * - /api/technicians/5/tickets?isClosed=false
   */
  @Get()
  async findAll(
    @Param('technicianId', ParseIntPipe) technicianId: number,
    @Query() queryDto: TicketQueryDto,
  ) {
    queryDto.assignedTechnicianId = technicianId;
    return this.ticketQueryService.findTickets(queryDto);
  }

  /**
   * GET /api/technicians/:technicianId/tickets/stats
   * Statistiques des tickets d'un technicien
   */
  @Get('stats')
  async getStats(
    @Param('technicianId', ParseIntPipe) technicianId: number,
    @Query() queryDto: TicketQueryDto,
  ) {
    queryDto.assignedTechnicianId = technicianId;
    return this.ticketQueryService.getTicketStats(queryDto);
  }
}
