import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CalendarService } from '../services/calendar.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../enums/user-role.enum';
import {
  CalendarEventDto,
  QueryCalendarEventsDto,
  RescheduleEventDto,
  CalendarStatsDto,
} from '../dto/calendar/calendar-event.dto';

/**
 * Contrôleur pour la gestion du calendrier et des événements
 */
@ApiTags('Calendar')
@Controller('api/v1/calendar')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  /**
   * Récupère les événements calendrier du technicien connecté
   */
  @Get('my-events')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.PATRON,
    UserRole.COMMERCIAL,
    UserRole.CHEF_CHANTIER,
    UserRole.TECHNICIEN,
  )
  @ApiOperation({
    summary: 'Récupérer mes événements calendrier',
    description: 'Retourne la liste des événements calendrier pour le technicien connecté sur une période donnée',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des événements récupérée avec succès',
    type: [CalendarEventDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Requête invalide',
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  async getMyEvents(
    @Request() req,
    @Query() query: QueryCalendarEventsDto,
  ): Promise<CalendarEventDto[]> {
    const technicianId = req.user.colleagueId; // Utiliser colleagueId pour ScheduleEvent
    return this.calendarService.getEventsForTechnician(technicianId, query);
  }

  /**
   * Récupère les événements d'aujourd'hui
   */
  @Get('today')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.PATRON,
    UserRole.COMMERCIAL,
    UserRole.CHEF_CHANTIER,
    UserRole.TECHNICIEN,
  )
  @ApiOperation({
    summary: 'Récupérer les événements d\'aujourd\'hui',
    description: 'Retourne tous les événements prévus aujourd\'hui pour le technicien connecté',
  })
  @ApiResponse({
    status: 200,
    description: 'Événements d\'aujourd\'hui récupérés avec succès',
    type: [CalendarEventDto],
  })
  async getTodayEvents(@Request() req): Promise<CalendarEventDto[]> {
    const technicianId = req.user.colleagueId;
    return this.calendarService.getTodayEvents(technicianId);
  }

  /**
   * Récupère les événements de la semaine
   */
  @Get('week')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.PATRON,
    UserRole.COMMERCIAL,
    UserRole.CHEF_CHANTIER,
    UserRole.TECHNICIEN,
  )
  @ApiOperation({
    summary: 'Récupérer les événements de la semaine',
    description: 'Retourne tous les événements de la semaine en cours (lundi à dimanche)',
  })
  @ApiResponse({
    status: 200,
    description: 'Événements de la semaine récupérés avec succès',
    type: [CalendarEventDto],
  })
  async getWeekEvents(@Request() req): Promise<CalendarEventDto[]> {
    const technicianId = req.user.colleagueId;
    return this.calendarService.getWeekEvents(technicianId);
  }

  /**
   * Récupère les événements d'un mois donné
   */
  @Get('month/:year/:month')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.PATRON,
    UserRole.COMMERCIAL,
    UserRole.CHEF_CHANTIER,
    UserRole.TECHNICIEN,
  )
  @ApiOperation({
    summary: 'Récupérer les événements d\'un mois',
    description: 'Retourne tous les événements d\'un mois donné',
  })
  @ApiParam({
    name: 'year',
    description: 'Année (YYYY)',
    example: 2025,
  })
  @ApiParam({
    name: 'month',
    description: 'Mois (1-12)',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Événements du mois récupérés avec succès',
    type: [CalendarEventDto],
  })
  async getMonthEvents(
    @Request() req,
    @Param('year') year: number,
    @Param('month') month: number,
  ): Promise<CalendarEventDto[]> {
    const technicianId = req.user.colleagueId;
    return this.calendarService.getMonthEvents(technicianId, +year, +month);
  }

  /**
   * Récupère un événement par ID
   */
  @Get('events/:id')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.PATRON,
    UserRole.COMMERCIAL,
    UserRole.CHEF_CHANTIER,
    UserRole.TECHNICIEN,
  )
  @ApiOperation({
    summary: 'Récupérer un événement par ID',
    description: 'Retourne les détails complets d\'un événement calendrier',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de l\'événement',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Événement récupéré avec succès',
    type: CalendarEventDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Événement non trouvé',
  })
  async getEventById(@Param('id') id: string): Promise<CalendarEventDto> {
    return this.calendarService.getEventById(id);
  }

  /**
   * Récupère les statistiques calendrier
   */
  @Get('stats')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.PATRON,
    UserRole.COMMERCIAL,
    UserRole.CHEF_CHANTIER,
    UserRole.TECHNICIEN,
  )
  @ApiOperation({
    summary: 'Récupérer statistiques calendrier',
    description: 'Retourne les statistiques des événements pour une période donnée',
  })
  @ApiQuery({
    name: 'startDate',
    description: 'Date de début (ISO 8601)',
    example: '2025-10-01T00:00:00Z',
  })
  @ApiQuery({
    name: 'endDate',
    description: 'Date de fin (ISO 8601)',
    example: '2025-10-31T23:59:59Z',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistiques récupérées avec succès',
    type: CalendarStatsDto,
  })
  async getCalendarStats(
    @Request() req,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<CalendarStatsDto> {
    const technicianId = req.user.colleagueId;
    return this.calendarService.getCalendarStats(
      technicianId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  /**
   * Reprogrammer un événement
   */
  @Put('events/:id/reschedule')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.PATRON,
    UserRole.COMMERCIAL,
    UserRole.CHEF_CHANTIER,
    UserRole.TECHNICIEN,
  )
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reprogrammer un événement',
    description: 'Propose une nouvelle date/heure pour un événement calendrier (synchronisation différée avec EBP)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de l\'événement à reprogrammer',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Demande de reprogrammation enregistrée',
  })
  @ApiResponse({
    status: 404,
    description: 'Événement non trouvé',
  })
  async rescheduleEvent(
    @Param('id') id: string,
    @Body() dto: RescheduleEventDto,
  ): Promise<{ success: boolean; message: string; event: CalendarEventDto }> {
    return this.calendarService.rescheduleEvent(id, dto);
  }
}
