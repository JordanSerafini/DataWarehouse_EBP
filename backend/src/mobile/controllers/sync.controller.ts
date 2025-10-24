import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SyncService } from '../services/sync.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../enums/user-role.enum';
import {
  SyncResultDto,
  SyncStatsDto,
  SyncStatusDto,
  PendingSyncEntityDto,
} from '../dto/sync/sync-response.dto';
import {
  MarkEntitySyncedDto,
  MarkSyncFailedDto,
  GetPendingSyncDto,
  SyncOptionsDto,
} from '../dto/sync/sync-request.dto';

@ApiTags('Synchronisation')
@Controller('api/v1/sync')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  /**
   * Effectue la synchronisation initiale complète
   * À appeler lors de la première installation de l'app mobile
   */
  @Post('initial')
  @Roles(
    UserRole.TECHNICIEN,
    UserRole.CHEF_CHANTIER,
    UserRole.COMMERCIAL,
    UserRole.PATRON,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Synchronisation initiale',
    description:
      'Effectue la synchronisation initiale complète (première installation). Réduit 670K lignes EBP à ~50K lignes optimisées pour mobile.',
  })
  @ApiResponse({
    status: 200,
    description: 'Synchronisation réussie',
    type: SyncResultDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Synchronisation déjà en cours',
  })
  async initialSync(@Body() options?: SyncOptionsDto): Promise<SyncResultDto> {
    return this.syncService.initialSync(options);
  }

  /**
   * Effectue une synchronisation complète (rafraîchissement)
   */
  @Post('full')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Synchronisation complète (admin)',
    description:
      'Force la synchronisation complète de toutes les données (admin uniquement)',
  })
  @ApiResponse({
    status: 200,
    description: 'Synchronisation réussie',
    type: SyncResultDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Synchronisation déjà en cours',
  })
  async fullSync(@Body() options?: SyncOptionsDto): Promise<SyncResultDto> {
    return this.syncService.fullSync(options);
  }

  /**
   * Récupère l'état global de la synchronisation
   */
  @Get('status')
  @Roles(
    UserRole.TECHNICIEN,
    UserRole.CHEF_CHANTIER,
    UserRole.COMMERCIAL,
    UserRole.PATRON,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({
    summary: 'État de la synchronisation',
    description:
      'Récupère l\'état global : sync initiale effectuée, dernière sync, enregistrements en attente, etc.',
  })
  @ApiResponse({
    status: 200,
    description: 'État de la synchronisation',
    type: SyncStatusDto,
  })
  async getSyncStatus(): Promise<SyncStatusDto> {
    return this.syncService.getSyncStatus();
  }

  /**
   * Récupère les statistiques de synchronisation par table
   */
  @Get('stats')
  @Roles(
    UserRole.TECHNICIEN,
    UserRole.CHEF_CHANTIER,
    UserRole.COMMERCIAL,
    UserRole.PATRON,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({
    summary: 'Statistiques de synchronisation',
    description:
      'Détails par table : nombre d\'enregistrements, dernière sync, enregistrements en attente',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistiques par table',
    type: [SyncStatsDto],
  })
  async getSyncStats(): Promise<SyncStatsDto[]> {
    return this.syncService.getSyncStats();
  }

  /**
   * Récupère les entités en attente de synchronisation pour un appareil
   */
  @Post('pending')
  @Roles(
    UserRole.TECHNICIEN,
    UserRole.CHEF_CHANTIER,
    UserRole.COMMERCIAL,
    UserRole.PATRON,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Entités en attente',
    description:
      'Récupère les entités modifiées en attente de synchronisation pour un appareil donné',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des entités en attente',
    type: [PendingSyncEntityDto],
  })
  async getPendingEntities(
    @Body() dto: GetPendingSyncDto,
  ): Promise<PendingSyncEntityDto[]> {
    return this.syncService.getPendingEntities(dto);
  }

  /**
   * Marque une entité comme synchronisée
   */
  @Post('mark-synced')
  @Roles(
    UserRole.TECHNICIEN,
    UserRole.CHEF_CHANTIER,
    UserRole.COMMERCIAL,
    UserRole.PATRON,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Marquer entité synchronisée',
    description:
      'Marque une entité comme synchronisée avec succès (tracking par appareil)',
  })
  @ApiResponse({
    status: 200,
    description: 'Entité marquée comme synchronisée',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
      },
    },
  })
  async markEntitySynced(
    @Body() dto: MarkEntitySyncedDto,
  ): Promise<{ success: boolean }> {
    return this.syncService.markEntitySynced(dto);
  }

  /**
   * Marque un échec de synchronisation
   */
  @Post('mark-failed')
  @Roles(
    UserRole.TECHNICIEN,
    UserRole.CHEF_CHANTIER,
    UserRole.COMMERCIAL,
    UserRole.PATRON,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Marquer échec de synchronisation',
    description:
      'Enregistre un échec de synchronisation avec message d\'erreur pour retry ultérieur',
  })
  @ApiResponse({
    status: 200,
    description: 'Échec enregistré',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
      },
    },
  })
  async markSyncFailed(
    @Body() dto: MarkSyncFailedDto,
  ): Promise<{ success: boolean }> {
    return this.syncService.markSyncFailed(dto);
  }
}
