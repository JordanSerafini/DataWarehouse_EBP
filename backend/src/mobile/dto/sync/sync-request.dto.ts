import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

/**
 * DTO pour marquer une entité comme synchronisée
 */
export class MarkEntitySyncedDto {
  @ApiProperty({
    description: 'Type d\'entité',
    example: 'intervention',
  })
  @IsString()
  entityType: string;

  @ApiProperty({
    description: 'ID de l\'entité',
    example: 'abc123',
  })
  @IsString()
  entityId: string;

  @ApiProperty({
    description: 'ID de l\'appareil mobile',
    example: 'device-uuid-1234',
  })
  @IsString()
  deviceId: string;

  @ApiProperty({
    description: 'Direction de la synchronisation (up/down)',
    example: 'down',
    default: 'down',
  })
  @IsString()
  @IsOptional()
  syncDirection?: string;
}

/**
 * DTO pour marquer un échec de synchronisation
 */
export class MarkSyncFailedDto extends MarkEntitySyncedDto {
  @ApiProperty({
    description: 'Message d\'erreur',
    example: 'Erreur réseau: timeout',
  })
  @IsString()
  errorMessage: string;
}

/**
 * DTO pour récupérer les entités en attente de sync
 */
export class GetPendingSyncDto {
  @ApiProperty({
    description: 'ID de l\'appareil mobile',
    example: 'device-uuid-1234',
  })
  @IsString()
  deviceId: string;

  @ApiProperty({
    description: 'Type d\'entité (optionnel, null = tous)',
    example: 'intervention',
    required: false,
  })
  @IsString()
  @IsOptional()
  entityType?: string;
}

/**
 * DTO pour les options de synchronisation initiale/complète
 */
export class SyncOptionsDto {
  @ApiProperty({
    description: 'Forcer la synchronisation complète',
    example: false,
    default: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  force?: boolean;

  @ApiProperty({
    description: 'ID de l\'appareil mobile (pour tracking)',
    example: 'device-uuid-1234',
    required: false,
  })
  @IsString()
  @IsOptional()
  deviceId?: string;
}
