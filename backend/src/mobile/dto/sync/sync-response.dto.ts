import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate, IsOptional, IsBoolean } from 'class-validator';

/**
 * DTO pour le résultat de synchronisation d'une entité
 */
export class SyncEntityResultDto {
  @ApiProperty({ description: 'Type d\'entité synchronisée', example: 'interventions' })
  @IsString()
  entity: string;

  @ApiProperty({ description: 'Nombre d\'enregistrements synchronisés', example: 145 })
  @IsNumber()
  syncedCount: number;

  @ApiProperty({ description: 'Durée de la synchronisation (ms)', example: 2340 })
  @IsNumber()
  durationMs: number;
}

/**
 * DTO pour le résultat complet de synchronisation
 */
export class SyncResultDto {
  @ApiProperty({ description: 'Succès de la synchronisation' })
  @IsBoolean()
  success: boolean;

  @ApiProperty({ description: 'Message de statut' })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Résultats par entité',
    type: [SyncEntityResultDto],
  })
  results: SyncEntityResultDto[];

  @ApiProperty({ description: 'Durée totale (ms)' })
  @IsNumber()
  totalDurationMs: number;

  @ApiProperty({ description: 'Nombre total d\'enregistrements synchronisés' })
  @IsNumber()
  totalRecords: number;

  @ApiProperty({ description: 'Date/heure de la synchronisation' })
  @IsDate()
  syncedAt: Date;
}

/**
 * DTO pour les statistiques de synchronisation par table
 */
export class SyncStatsDto {
  @ApiProperty({ description: 'Nom de la table' })
  @IsString()
  tableName: string;

  @ApiProperty({ description: 'Nombre total d\'enregistrements' })
  @IsNumber()
  totalRecords: number;

  @ApiProperty({ description: 'Date de dernière synchronisation' })
  @IsDate()
  @IsOptional()
  lastSync?: Date;

  @ApiProperty({ description: 'Nombre d\'enregistrements à synchroniser' })
  @IsNumber()
  needsSync: number;
}

/**
 * DTO pour l'état global de synchronisation
 */
export class SyncStatusDto {
  @ApiProperty({ description: 'Synchronisation initiale effectuée' })
  @IsBoolean()
  initialSyncCompleted: boolean;

  @ApiProperty({ description: 'Date de la synchronisation initiale' })
  @IsDate()
  @IsOptional()
  initialSyncDate?: Date;

  @ApiProperty({ description: 'Date de dernière synchronisation' })
  @IsDate()
  @IsOptional()
  lastSyncDate?: Date;

  @ApiProperty({ description: 'Synchronisation en cours' })
  @IsBoolean()
  syncInProgress: boolean;

  @ApiProperty({
    description: 'Statistiques par table',
    type: [SyncStatsDto],
  })
  stats: SyncStatsDto[];

  @ApiProperty({ description: 'Nombre total d\'enregistrements synchronisés' })
  @IsNumber()
  totalSyncedRecords: number;

  @ApiProperty({ description: 'Nombre d\'enregistrements en attente' })
  @IsNumber()
  totalPendingRecords: number;
}

/**
 * DTO pour une entité en attente de synchronisation
 */
export class PendingSyncEntityDto {
  @ApiProperty({ description: 'Type d\'entité', example: 'intervention' })
  @IsString()
  entityType: string;

  @ApiProperty({ description: 'ID de l\'entité' })
  @IsString()
  entityId: string;

  @ApiProperty({ description: 'Date de dernière tentative de sync' })
  @IsDate()
  @IsOptional()
  lastSyncDate?: Date;

  @ApiProperty({ description: 'Statut de synchronisation', example: 'pending' })
  @IsString()
  syncStatus: string;

  @ApiProperty({ description: 'Nombre de tentatives' })
  @IsNumber()
  retryCount: number;

  @ApiProperty({ description: 'Message d\'erreur éventuel' })
  @IsString()
  @IsOptional()
  errorMessage?: string;
}
