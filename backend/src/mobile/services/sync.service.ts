import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { DatabaseService } from './database.service';
import {
  SyncResultDto,
  SyncEntityResultDto,
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

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);
  private syncInProgress = false;

  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Effectue la synchronisation initiale complète
   * Cette fonction synchronise tous les enregistrements nécessaires pour l'app mobile
   * Réduit 670K lignes EBP à ~50K lignes optimisées (92% de réduction)
   */
  async initialSync(options?: SyncOptionsDto): Promise<SyncResultDto> {
    if (this.syncInProgress && !options?.force) {
      throw new BadRequestException('Une synchronisation est déjà en cours');
    }

    this.syncInProgress = true;
    const startTime = Date.now();

    try {
      this.logger.log('Début de la synchronisation initiale...');

      // Appelle la fonction PL/pgSQL initial_sync_all()
      const result = await this.databaseService.query<SyncEntityResultDto>(
        `SELECT
          entity,
          synced_count AS "syncedCount",
          duration_ms AS "durationMs"
         FROM mobile.initial_sync_all()`,
      );

      const totalDurationMs = Date.now() - startTime;
      const totalRecords = result.rows.reduce((sum, r) => sum + r.syncedCount, 0);

      this.logger.log(
        `Synchronisation initiale terminée: ${totalRecords} enregistrements en ${totalDurationMs}ms`,
      );

      return {
        success: true,
        message: 'Synchronisation initiale réussie',
        results: result.rows,
        totalDurationMs,
        totalRecords,
        syncedAt: new Date(),
      };
    } catch (error) {
      this.logger.error(
        `Erreur lors de la synchronisation initiale: ${error.message}`,
        error.stack,
      );
      throw error;
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Effectue une synchronisation complète (rafraîchissement)
   * Similaire à initialSync mais force la mise à jour de tous les enregistrements
   */
  async fullSync(options?: SyncOptionsDto): Promise<SyncResultDto> {
    if (this.syncInProgress && !options?.force) {
      throw new BadRequestException('Une synchronisation est déjà en cours');
    }

    this.syncInProgress = true;
    const startTime = Date.now();

    try {
      this.logger.log('Début de la synchronisation complète...');

      // Appelle la fonction PL/pgSQL full_sync_all()
      const result = await this.databaseService.query<SyncEntityResultDto>(
        `SELECT
          entity,
          synced_count AS "syncedCount",
          duration_ms AS "durationMs"
         FROM mobile.full_sync_all()`,
      );

      const totalDurationMs = Date.now() - startTime;
      const totalRecords = result.rows.reduce((sum, r) => sum + r.syncedCount, 0);

      this.logger.log(
        `Synchronisation complète terminée: ${totalRecords} enregistrements en ${totalDurationMs}ms`,
      );

      return {
        success: true,
        message: 'Synchronisation complète réussie',
        results: result.rows,
        totalDurationMs,
        totalRecords,
        syncedAt: new Date(),
      };
    } catch (error) {
      this.logger.error(
        `Erreur lors de la synchronisation complète: ${error.message}`,
        error.stack,
      );
      throw error;
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Récupère les statistiques de synchronisation par table
   */
  async getSyncStats(): Promise<SyncStatsDto[]> {
    const result = await this.databaseService.query<any>(
      `SELECT
        table_name AS "tableName",
        total_records AS "totalRecords",
        last_sync AS "lastSync",
        needs_sync AS "needsSync"
       FROM mobile.get_sync_stats()`,
    );

    return result.rows;
  }

  /**
   * Récupère l'état global de la synchronisation
   */
  async getSyncStatus(): Promise<SyncStatusDto> {
    // Récupère les statistiques
    const stats = await this.getSyncStats();

    // Calcule le total synchronisé et en attente
    const totalSyncedRecords = stats.reduce((sum, s) => sum + s.totalRecords, 0);
    const totalPendingRecords = stats.reduce((sum, s) => sum + s.needsSync, 0);

    // Trouve la date de dernière synchronisation
    const lastSyncDates = stats
      .filter((s) => s.lastSync)
      .map((s) => new Date(s.lastSync!))
      .sort((a, b) => b.getTime() - a.getTime());

    const lastSyncDate = lastSyncDates.length > 0 ? lastSyncDates[0] : undefined;

    // Vérifie si la synchronisation initiale a été effectuée
    const initialSyncCompleted = stats.length > 0 && stats.every((s) => s.lastSync);

    // Détermine la date de sync initiale (la plus ancienne)
    const initialSyncDates = stats
      .filter((s) => s.lastSync)
      .map((s) => new Date(s.lastSync!))
      .sort((a, b) => a.getTime() - b.getTime());

    const initialSyncDate =
      initialSyncDates.length > 0 ? initialSyncDates[0] : undefined;

    return {
      initialSyncCompleted,
      initialSyncDate,
      lastSyncDate,
      syncInProgress: this.syncInProgress,
      stats,
      totalSyncedRecords,
      totalPendingRecords,
    };
  }

  /**
   * Récupère les entités en attente de synchronisation pour un appareil
   */
  async getPendingEntities(
    dto: GetPendingSyncDto,
  ): Promise<PendingSyncEntityDto[]> {
    const result = await this.databaseService.query<any>(
      `SELECT
        entity_type AS "entityType",
        entity_id AS "entityId",
        last_sync_date AS "lastSyncDate",
        sync_status AS "syncStatus",
        retry_count AS "retryCount",
        error_message AS "errorMessage"
       FROM mobile.get_pending_sync_entities($1, $2)`,
      [dto.deviceId, dto.entityType || null],
    );

    return result.rows;
  }

  /**
   * Marque une entité comme synchronisée
   */
  async markEntitySynced(dto: MarkEntitySyncedDto): Promise<{ success: boolean }> {
    const syncDirection = dto.syncDirection || 'down';

    const result = await this.databaseService.query<{ mark_entity_synced: boolean }>(
      `SELECT mobile.mark_entity_synced($1, $2, $3, $4) AS mark_entity_synced`,
      [dto.entityType, dto.entityId, dto.deviceId, syncDirection],
    );

    const success = result.rows[0]?.mark_entity_synced || false;

    this.logger.log(
      `Entité ${dto.entityType}:${dto.entityId} marquée comme synchronisée pour ${dto.deviceId}`,
    );

    return { success };
  }

  /**
   * Marque un échec de synchronisation
   */
  async markSyncFailed(dto: MarkSyncFailedDto): Promise<{ success: boolean }> {
    const syncDirection = dto.syncDirection || 'down';

    const result = await this.databaseService.query<{ mark_sync_failed: boolean }>(
      `SELECT mobile.mark_sync_failed($1, $2, $3, $4, $5) AS mark_sync_failed`,
      [
        dto.entityType,
        dto.entityId,
        dto.deviceId,
        syncDirection,
        dto.errorMessage,
      ],
    );

    const success = result.rows[0]?.mark_sync_failed || false;

    this.logger.warn(
      `Échec de sync ${dto.entityType}:${dto.entityId} pour ${dto.deviceId}: ${dto.errorMessage}`,
    );

    return { success };
  }

  /**
   * Nettoie les anciens statuts de synchronisation (>30 jours)
   */
  async cleanupOldSyncStatus(): Promise<{ deletedCount: number }> {
    const result = await this.databaseService.query<{ cleanup_old_sync_status: number }>(
      `SELECT mobile.cleanup_old_sync_status(30) AS cleanup_old_sync_status`,
    );

    const deletedCount = result.rows[0]?.cleanup_old_sync_status || 0;

    this.logger.log(`Nettoyage sync status: ${deletedCount} enregistrements supprimés`);

    return { deletedCount };
  }
}
