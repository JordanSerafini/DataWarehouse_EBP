/**
 * Modèle WatermelonDB - Intervention
 */

import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class Intervention extends Model {
  static table = 'interventions';

  // Identifiants
  @field('server_id') serverId!: string;
  @field('reference') reference!: string;
  @field('title') title!: string;
  @field('description') description?: string;

  // Dates
  @date('scheduled_date') scheduledDate!: Date;
  @date('scheduled_end_date') scheduledEndDate?: Date;
  @date('actual_start_date') actualStartDate?: Date;
  @date('actual_end_date') actualEndDate?: Date;

  // Statut et type
  @field('status') status!: number;
  @field('status_label') statusLabel!: string;
  @field('type') type!: number;
  @field('type_label') typeLabel!: string;
  @field('priority') priority!: number;

  // Relations
  @field('customer_id') customerId?: string;
  @field('customer_name') customerName?: string;
  @field('project_id') projectId?: number;
  @field('project_name') projectName?: string;
  @field('technician_id') technicianId?: string;
  @field('technician_name') technicianName?: string;

  // Localisation
  @field('address') address?: string;
  @field('city') city?: string;
  @field('postal_code') postalCode?: string;
  @field('latitude') latitude?: number;
  @field('longitude') longitude?: number;

  // Informations additionnelles
  @field('estimated_duration') estimatedDuration?: number;
  @field('actual_duration') actualDuration?: number;
  @field('notes') notes?: string;

  // Synchronisation
  @field('is_synced') isSynced!: boolean;
  @date('last_synced_at') lastSyncedAt?: Date;

  // Timestamps
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
}
