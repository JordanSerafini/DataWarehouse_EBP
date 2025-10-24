import {
  Controller,
  Get,
  Put,
  Post,
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
import { InterventionsService } from '../services/interventions.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../enums/user-role.enum';
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
} from '../dto/interventions/update-intervention.dto';
import {
  QueryInterventionsDto,
  QueryNearbyInterventionsDto,
} from '../dto/interventions/query-interventions.dto';

@ApiTags('Interventions')
@Controller('api/v1/interventions')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class InterventionsController {
  constructor(private readonly interventionsService: InterventionsService) {}

  /**
   * Récupère les interventions du technicien connecté
   */
  @Get('my-interventions')
  @Roles(UserRole.TECHNICIEN, UserRole.CHEF_CHANTIER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Mes interventions',
    description: 'Récupère la liste des interventions du technicien connecté',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des interventions',
    type: [InterventionDto],
  })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 403, description: 'Accès refusé' })
  async getMyInterventions(
    @Request() req,
    @Query() query: QueryInterventionsDto,
  ): Promise<InterventionDto[]> {
    const technicianId = req.user.colleagueId;

    if (!technicianId) {
      throw new Error('Utilisateur sans colleagueId - impossible de récupérer les interventions');
    }

    return this.interventionsService.getInterventionsForTechnician(technicianId, query);
  }

  /**
   * Récupère les statistiques du technicien connecté
   */
  @Get('my-stats')
  @Roles(UserRole.TECHNICIEN, UserRole.CHEF_CHANTIER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Mes statistiques',
    description: 'Statistiques d\'interventions du technicien connecté',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistiques',
    type: TechnicianStatsDto,
  })
  async getMyStats(@Request() req): Promise<TechnicianStatsDto> {
    const technicianId = req.user.colleagueId;

    if (!technicianId) {
      throw new Error('Utilisateur sans colleagueId');
    }

    return this.interventionsService.getTechnicianStats(technicianId);
  }

  /**
   * Récupère une intervention par ID
   */
  @Get(':id')
  @Roles(
    UserRole.TECHNICIEN,
    UserRole.CHEF_CHANTIER,
    UserRole.COMMERCIAL,
    UserRole.PATRON,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({
    summary: 'Détail intervention',
    description: 'Récupère les détails d\'une intervention',
  })
  @ApiParam({ name: 'id', description: 'ID de l\'intervention (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Détail de l\'intervention',
    type: InterventionDto,
  })
  @ApiResponse({ status: 404, description: 'Intervention non trouvée' })
  async getInterventionById(@Param('id') id: string): Promise<InterventionDto> {
    return this.interventionsService.getInterventionById(id);
  }

  /**
   * Récupère les interventions à proximité
   */
  @Get('nearby')
  @Roles(UserRole.TECHNICIEN, UserRole.CHEF_CHANTIER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Interventions à proximité',
    description: 'Recherche les interventions dans un rayon donné',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des interventions à proximité avec distance',
    type: [InterventionWithDistanceDto],
  })
  async getNearbyInterventions(
    @Query() query: QueryNearbyInterventionsDto,
    @Request() req,
  ): Promise<InterventionWithDistanceDto[]> {
    // Si technicien, filtrer par son ID
    if (req.user.role === UserRole.TECHNICIEN && !query.technicianId) {
      query.technicianId = req.user.colleagueId;
    }

    return this.interventionsService.getNearbyInterventions(query);
  }

  /**
   * Démarre une intervention
   */
  @Put(':id/start')
  @Roles(UserRole.TECHNICIEN, UserRole.CHEF_CHANTIER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Démarrer intervention',
    description: 'Marque une intervention comme démarrée (statut = EN_COURS)',
  })
  @ApiParam({ name: 'id', description: 'ID de l\'intervention' })
  @ApiResponse({
    status: 200,
    description: 'Intervention démarrée',
    type: InterventionDto,
  })
  @ApiResponse({ status: 404, description: 'Intervention non trouvée' })
  async startIntervention(
    @Param('id') id: string,
    @Body() dto: StartInterventionDto,
    @Request() req,
  ): Promise<InterventionDto> {
    const technicianId = req.user.colleagueId;
    return this.interventionsService.startIntervention(id, technicianId, dto);
  }

  /**
   * Clôture une intervention
   */
  @Put(':id/complete')
  @Roles(UserRole.TECHNICIEN, UserRole.CHEF_CHANTIER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Clôturer intervention',
    description: 'Marque une intervention comme terminée avec rapport',
  })
  @ApiParam({ name: 'id', description: 'ID de l\'intervention' })
  @ApiResponse({
    status: 200,
    description: 'Intervention clôturée',
    type: InterventionDto,
  })
  @ApiResponse({ status: 404, description: 'Intervention non trouvée' })
  async completeIntervention(
    @Param('id') id: string,
    @Body() dto: CompleteInterventionDto,
    @Request() req,
  ): Promise<InterventionDto> {
    const technicianId = req.user.colleagueId;
    return this.interventionsService.completeIntervention(id, technicianId, dto);
  }

  /**
   * Met à jour une intervention
   */
  @Put(':id')
  @Roles(UserRole.TECHNICIEN, UserRole.CHEF_CHANTIER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Mettre à jour intervention',
    description: 'Met à jour les informations d\'une intervention',
  })
  @ApiParam({ name: 'id', description: 'ID de l\'intervention' })
  @ApiResponse({
    status: 200,
    description: 'Intervention mise à jour',
    type: InterventionDto,
  })
  @ApiResponse({ status: 404, description: 'Intervention non trouvée' })
  async updateIntervention(
    @Param('id') id: string,
    @Body() dto: UpdateInterventionDto,
  ): Promise<InterventionDto> {
    return this.interventionsService.updateIntervention(id, dto);
  }

  /**
   * Enregistre le temps passé (timesheet)
   */
  @Post('timesheet')
  @Roles(UserRole.TECHNICIEN, UserRole.CHEF_CHANTIER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Enregistrer temps passé',
    description: 'Crée un timesheet pour une intervention',
  })
  @ApiResponse({
    status: 201,
    description: 'Timesheet créé',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Temps enregistré avec succès' },
      },
    },
  })
  async createTimesheet(
    @Body() dto: CreateTimesheetDto,
    @Request() req,
  ): Promise<{ success: boolean; message: string }> {
    const technicianId = req.user.colleagueId;
    return this.interventionsService.createTimesheet(technicianId, dto);
  }

  /**
   * Récupère les interventions d'un technicien spécifique (admin uniquement)
   */
  @Get('technician/:technicianId')
  @Roles(UserRole.CHEF_CHANTIER, UserRole.PATRON, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Interventions d\'un technicien (admin)',
    description: 'Récupère les interventions d\'un technicien spécifique',
  })
  @ApiParam({ name: 'technicianId', description: 'ID du technicien EBP' })
  @ApiResponse({
    status: 200,
    description: 'Liste des interventions',
    type: [InterventionDto],
  })
  async getTechnicianInterventions(
    @Param('technicianId') technicianId: string,
    @Query() query: QueryInterventionsDto,
  ): Promise<InterventionDto[]> {
    return this.interventionsService.getInterventionsForTechnician(technicianId, query);
  }

  /**
   * Récupère les statistiques d'un technicien spécifique (admin uniquement)
   */
  @Get('technician/:technicianId/stats')
  @Roles(UserRole.CHEF_CHANTIER, UserRole.PATRON, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Statistiques technicien (admin)',
    description: 'Statistiques d\'un technicien spécifique',
  })
  @ApiParam({ name: 'technicianId', description: 'ID du technicien EBP' })
  @ApiResponse({
    status: 200,
    description: 'Statistiques',
    type: TechnicianStatsDto,
  })
  async getTechnicianStatsById(
    @Param('technicianId') technicianId: string,
  ): Promise<TechnicianStatsDto> {
    return this.interventionsService.getTechnicianStats(technicianId);
  }
}
