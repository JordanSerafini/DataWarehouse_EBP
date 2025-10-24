import { Controller, Get, Post, Param, ParseIntPipe } from '@nestjs/common';
import { OrganizationsService } from '../services/organizations.service';
import { OrganizationsSyncService } from '../services/organizations-sync.service';

/**
 * Contrôleur pour les endpoints liés aux organisations NinjaOne
 * Préfixe de route: /organizations
 */
@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly organizationsSyncService: OrganizationsSyncService,
  ) {}

  /**
   * GET /organizations
   * Récupère toutes les organisations depuis l'API NinjaOne (temps réel)
   */
  @Get()
  async getOrganizations() {
    return this.organizationsService.getOrganizations();
  }

  /**
   * GET /organizations/:id
   * Récupère une organisation spécifique par son ID
   */
  @Get(':id')
  async getOrganizationById(@Param('id', ParseIntPipe) id: number) {
    return this.organizationsService.getOrganizationById(id);
  }

  /**
   * GET /organizations/:id/locations
   * Récupère les locations d'une organisation
   */
  @Get(':id/locations')
  async getOrganizationLocations(@Param('id', ParseIntPipe) id: number) {
    return this.organizationsService.getOrganizationLocations(id);
  }

  /**
   * GET /organizations/:id/devices
   * Récupère les devices d'une organisation
   */
  @Get(':id/devices')
  async getOrganizationDevices(@Param('id', ParseIntPipe) id: number) {
    return this.organizationsService.getOrganizationDevices(id);
  }

  /**
   * GET /organizations/:id/documents
   * Récupère les documents d'une organisation
   */
  @Get(':id/documents')
  async getOrganizationDocuments(@Param('id', ParseIntPipe) id: number) {
    return this.organizationsService.getOrganizationDocuments(id);
  }

  /**
   * GET /organizations/:id/end-users
   * Récupère les end users d'une organisation
   */
  @Get(':id/end-users')
  async getOrganizationEndUsers(@Param('id', ParseIntPipe) id: number) {
    return this.organizationsService.getOrganizationEndUsers(id);
  }

  /**
   * POST /organizations/sync
   * Synchronise toutes les organisations depuis l'API vers la base de données locale
   */
  @Post('sync')
  async syncOrganizations() {
    return this.organizationsSyncService.syncOrganizations();
  }
}
