import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  Request,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ActivityService } from '../services/activity.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../enums/user-role.enum';
import {
  ActivityDto,
  QueryActivityHistoryDto,
  ActivityStatsDto,
} from '../dto/activity/activity.dto';

/**
 * Contrôleur pour l'historique d'activités
 * Gère les activités liées aux clients, projets, deals, fournisseurs
 */
@ApiTags('Activity')
@Controller('api/v1/activity')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ActivityController {
  private readonly logger = new Logger(ActivityController.name);

  constructor(private readonly activityService: ActivityService) {}

  /**
   * Récupère l'historique d'activités pour une entité
   * GET /api/v1/activity/history?entityId=xxx&entityType=customer&limit=50&offset=0
   */
  @Get('history')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.PATRON,
    UserRole.COMMERCIAL,
    UserRole.CHEF_CHANTIER,
    UserRole.TECHNICIEN,
  )
  @ApiOperation({
    summary: 'Récupère l\'historique d\'activités pour une entité',
    description: 'Retourne les activités (tâches, rendez-vous, appels, emails, etc.) pour un client, projet, deal ou fournisseur',
  })
  @ApiQuery({
    name: 'entityId',
    description: 'ID de l\'entité (client, projet, deal, fournisseur)',
    required: true,
    type: String,
  })
  @ApiQuery({
    name: 'entityType',
    description: 'Type d\'entité',
    required: false,
    enum: ['customer', 'project', 'deal', 'supplier'],
    example: 'customer',
  })
  @ApiQuery({
    name: 'category',
    description: 'Filtre par catégorie d\'activité',
    required: false,
    type: Number,
    example: 0,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Nombre maximum de résultats',
    required: false,
    type: Number,
    example: 50,
  })
  @ApiQuery({
    name: 'offset',
    description: 'Offset pour la pagination',
    required: false,
    type: Number,
    example: 0,
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des activités récupérée avec succès',
    type: [ActivityDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Paramètres de requête invalides',
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  async getActivityHistory(
    @Query() query: QueryActivityHistoryDto,
  ): Promise<ActivityDto[]> {
    this.logger.log(
      `Getting activity history for ${query.entityType || 'customer'}: ${query.entityId}`,
    );

    if (!query.entityId) {
      throw new BadRequestException('entityId est requis');
    }

    return this.activityService.getActivityHistory(query);
  }

  /**
   * Récupère une activité par ID
   * GET /api/v1/activity/:id
   */
  @Get(':id')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.PATRON,
    UserRole.COMMERCIAL,
    UserRole.CHEF_CHANTIER,
    UserRole.TECHNICIEN,
  )
  @ApiOperation({
    summary: 'Récupère les détails d\'une activité',
    description: 'Retourne toutes les informations d\'une activité spécifique',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de l\'activité (UUID)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Activité récupérée avec succès',
    type: ActivityDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Activité non trouvée',
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  async getActivityById(@Param('id') id: string): Promise<ActivityDto> {
    this.logger.log(`Getting activity: ${id}`);
    return this.activityService.getActivityById(id);
  }

  /**
   * Récupère les statistiques d'activités pour une entité
   * GET /api/v1/activity/stats/:entityType/:entityId
   */
  @Get('stats/:entityType/:entityId')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.PATRON,
    UserRole.COMMERCIAL,
    UserRole.CHEF_CHANTIER,
  )
  @ApiOperation({
    summary: 'Récupère les statistiques d\'activités pour une entité',
    description: 'Retourne le nombre total, la répartition par catégorie, et le type le plus fréquent',
  })
  @ApiParam({
    name: 'entityType',
    description: 'Type d\'entité',
    enum: ['customer', 'project', 'deal', 'supplier'],
    example: 'customer',
  })
  @ApiParam({
    name: 'entityId',
    description: 'ID de l\'entité',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Statistiques récupérées avec succès',
    type: ActivityStatsDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Type d\'entité non supporté',
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  async getActivityStats(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ): Promise<ActivityStatsDto> {
    this.logger.log(`Getting activity stats for ${entityType}: ${entityId}`);
    return this.activityService.getActivityStats(entityId, entityType);
  }

  /**
   * Récupère les activités récentes (toutes entités confondues)
   * GET /api/v1/activity/recent?limit=20
   */
  @Get('recent')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.PATRON,
    UserRole.COMMERCIAL,
  )
  @ApiOperation({
    summary: 'Récupère les activités récentes',
    description: 'Retourne les dernières activités toutes entités confondues (pour tableau de bord)',
  })
  @ApiQuery({
    name: 'limit',
    description: 'Nombre maximum de résultats',
    required: false,
    type: Number,
    example: 20,
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des activités récentes récupérée avec succès',
    type: [ActivityDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  async getRecentActivities(
    @Query('limit') limit?: number,
  ): Promise<ActivityDto[]> {
    this.logger.log(`Getting ${limit || 20} recent activities`);
    return this.activityService.getRecentActivities(limit);
  }
}
