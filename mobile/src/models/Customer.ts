/**
 * Modèle WatermelonDB - Client
 */

import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class Customer extends Model {
  static table = 'customers';

  // Identifiants
  @field('server_id') serverId!: string;
  @field('name') name!: string;
  @field('type') type!: number;
  @field('type_label') typeLabel!: string;

  // Coordonnées
  @field('email') email?: string;
  @field('phone') phone?: string;
  @field('mobile') mobile?: string;
  @field('fax') fax?: string;

  // Adresse
  @field('address') address?: string;
  @field('address_complement') addressComplement?: string;
  @field('city') city?: string;
  @field('postal_code') postalCode?: string;
  @field('country') country?: string;
  @field('latitude') latitude?: number;
  @field('longitude') longitude?: number;

  // Informations commerciales
  @field('siret') siret?: string;
  @field('vat_number') vatNumber?: string;
  @field('accounting_code') accountingCode?: string;

  // Métadonnées
  @field('is_active') isActive!: boolean;

  // Synchronisation
  @field('is_synced') isSynced!: boolean;
  @date('last_synced_at') lastSyncedAt?: Date;

  // Timestamps
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
}
