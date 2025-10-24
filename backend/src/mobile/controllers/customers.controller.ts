import {
  Controller,
  Get,
  Put,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CustomersService } from '../services/customers.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../enums/user-role.enum';
import {
  CustomerDto,
  NearbyCustomerDto,
  CustomerHistoryItemDto,
  CustomerDocumentStatsDto,
  CustomerSummaryDto,
} from '../dto/customers/customer.dto';
import {
  QueryNearbyCustomersDto,
  SearchCustomersDto,
  QueryCustomerHistoryDto,
} from '../dto/customers/query-customers.dto';
import { UpdateCustomerGpsDto } from '../dto/customers/update-customer-gps.dto';

@ApiTags('Clients')
@Controller('api/v1/customers')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  /**
   * Recherche des clients à proximité d'une position GPS
   */
  @Get('nearby')
  @Roles(
    UserRole.TECHNICIEN,
    UserRole.CHEF_CHANTIER,
    UserRole.COMMERCIAL,
    UserRole.PATRON,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({
    summary: 'Clients à proximité',
    description:
      'Recherche les clients dans un rayon donné autour d\'une position GPS',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des clients à proximité',
    type: [NearbyCustomerDto],
  })
  @ApiResponse({ status: 400, description: 'Paramètres invalides' })
  async getNearbyCustomers(
    @Query() query: QueryNearbyCustomersDto,
  ): Promise<NearbyCustomerDto[]> {
    return this.customersService.getNearbyCustomers(query);
  }

  /**
   * Recherche des clients par nom, ville ou code postal
   */
  @Get('search')
  @Roles(
    UserRole.TECHNICIEN,
    UserRole.CHEF_CHANTIER,
    UserRole.COMMERCIAL,
    UserRole.PATRON,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({
    summary: 'Rechercher clients',
    description:
      'Recherche des clients par nom, ville ou code postal (pagination)',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des clients trouvés',
    type: [CustomerDto],
  })
  async searchCustomers(
    @Query() query: SearchCustomersDto,
  ): Promise<CustomerDto[]> {
    return this.customersService.searchCustomers(query);
  }

  /**
   * Récupère le détail complet d'un client (infos + historique + stats)
   */
  @Get(':id')
  @Roles(
    UserRole.TECHNICIEN,
    UserRole.CHEF_CHANTIER,
    UserRole.COMMERCIAL,
    UserRole.PATRON,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({
    summary: 'Détail client complet',
    description:
      'Récupère les informations client, historique interventions et statistiques',
  })
  @ApiParam({ name: 'id', description: 'ID du client EBP' })
  @ApiResponse({
    status: 200,
    description: 'Résumé complet du client',
    type: CustomerSummaryDto,
  })
  @ApiResponse({ status: 404, description: 'Client non trouvé' })
  async getCustomerSummary(
    @Param('id') customerId: string,
  ): Promise<CustomerSummaryDto> {
    return this.customersService.getCustomerSummary(customerId);
  }

  /**
   * Récupère l'historique des interventions d'un client
   */
  @Get(':id/history')
  @Roles(
    UserRole.TECHNICIEN,
    UserRole.CHEF_CHANTIER,
    UserRole.COMMERCIAL,
    UserRole.PATRON,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({
    summary: 'Historique interventions client',
    description: 'Liste des interventions effectuées chez ce client',
  })
  @ApiParam({ name: 'id', description: 'ID du client EBP' })
  @ApiResponse({
    status: 200,
    description: 'Liste des interventions',
    type: [CustomerHistoryItemDto],
  })
  @ApiResponse({ status: 404, description: 'Client non trouvé' })
  async getCustomerHistory(
    @Param('id') customerId: string,
    @Query() query: QueryCustomerHistoryDto,
  ): Promise<CustomerHistoryItemDto[]> {
    return this.customersService.getCustomerHistory(customerId, query);
  }

  /**
   * Récupère les statistiques de documents d'un client
   */
  @Get(':id/documents-stats')
  @Roles(
    UserRole.COMMERCIAL,
    UserRole.PATRON,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({
    summary: 'Statistiques documents client',
    description:
      'Statistiques des devis, factures, etc. par type (commercial uniquement)',
  })
  @ApiParam({ name: 'id', description: 'ID du client EBP' })
  @ApiResponse({
    status: 200,
    description: 'Statistiques par type de document',
    type: [CustomerDocumentStatsDto],
  })
  @ApiResponse({ status: 404, description: 'Client non trouvé' })
  async getCustomerDocumentStats(
    @Param('id') customerId: string,
  ): Promise<CustomerDocumentStatsDto[]> {
    return this.customersService.getCustomerDocumentStats(customerId);
  }

  /**
   * Met à jour les coordonnées GPS d'un client
   */
  @Put(':id/gps')
  @Roles(
    UserRole.TECHNICIEN,
    UserRole.CHEF_CHANTIER,
    UserRole.COMMERCIAL,
    UserRole.PATRON,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({
    summary: 'Mettre à jour GPS client',
    description:
      'Met à jour les coordonnées GPS d\'un client (mobile, manuel ou EBP)',
  })
  @ApiParam({ name: 'id', description: 'ID du client EBP' })
  @ApiResponse({
    status: 200,
    description: 'GPS mis à jour avec succès',
    type: CustomerDto,
  })
  @ApiResponse({ status: 400, description: 'Coordonnées invalides' })
  @ApiResponse({ status: 404, description: 'Client non trouvé' })
  async updateCustomerGps(
    @Param('id') customerId: string,
    @Body() dto: UpdateCustomerGpsDto,
  ): Promise<CustomerDto> {
    return this.customersService.updateCustomerGps(customerId, dto);
  }
}
