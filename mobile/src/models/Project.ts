/**
 * Modèle WatermelonDB - Projet
 */

import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class Project extends Model {
  static table = 'projects';

  // Identifiants
  @field('server_id') serverId!: number;
  @field('name') name!: string;
  @field('reference') reference?: string;

  // Relations
  @field('customer_id') customerId?: string;
  @field('customer_name') customerName?: string;
  @field('manager_id') managerId?: string;
  @field('manager_name') managerName?: string;

  // Statut
  @field('state') state!: number;
  @field('state_label') stateLabel!: string;

  // Dates
  @date('start_date') startDate?: Date;
  @date('end_date') endDate?: Date;
  @date('actual_end_date') actualEndDate?: Date;

  // Localisation
  @field('city') city?: string;
  @field('latitude') latitude?: number;
  @field('longitude') longitude?: number;

  // Synchronisation
  @field('is_synced') isSynced!: boolean;
  @date('last_synced_at') lastSyncedAt?: Date;

  // Timestamps
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
}
