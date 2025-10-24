import { Controller, Post } from '@nestjs/common';
import { LocationsSyncService } from '../services/locations-sync.service';

/**
 * Contrôleur pour les endpoints liés aux locations NinjaOne
 * Préfixe de route: /locations
 */
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsSyncService: LocationsSyncService) {}

  /**
   * POST /locations/sync
   * Synchronise toutes les locations depuis l'API vers la base de données locale
   */
  @Post('sync')
  async syncLocations() {
    return this.locationsSyncService.syncLocations();
  }
}
