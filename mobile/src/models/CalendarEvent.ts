/**
 * Modèle WatermelonDB - CalendarEvent (Événement Calendrier)
 */

import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class CalendarEvent extends Model {
  static table = 'calendar_events';

  // Identifiants
  @field('server_id') serverId!: string;
  @field('title') title!: string;
  @field('description') description?: string;

  // Dates
  @date('start_datetime') startDateTime!: Date;
  @date('end_datetime') endDateTime?: Date;

  // Type et statut
  @field('event_type') eventType!: string; // intervention, appointment, maintenance, meeting, other
  @field('status') status!: string; // planned, in_progress, completed, cancelled, rescheduled

  // Relations
  @field('colleague_id') colleagueId?: string;
  @field('colleague_name') colleagueName?: string;
  @field('customer_id') customerId?: string;
  @field('customer_name') customerName?: string;

  // Localisation
  @field('address') address?: string;
  @field('city') city?: string;
  @field('zipcode') zipcode?: string;
  @field('latitude') latitude?: number;
  @field('longitude') longitude?: number;

  // Métadonnées
  @field('creator_id') creatorId?: string;

  // Synchronisation
  @field('is_synced') isSynced!: boolean;
  @date('last_synced_at') lastSyncedAt?: Date;

  // Timestamps
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
}
