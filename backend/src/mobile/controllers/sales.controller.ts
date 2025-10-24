import { Controller, Get, Param, Query, UseGuards, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SalesService } from '../services/sales.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../enums/user-role.enum';
import {
  SaleDocumentDto,
  QuoteDto,
  QuoteLinesStatsDto,
  SaleDocumentWithLinesDto,
} from '../dto/sales/document.dto';
import {
  QueryRecentDocumentsDto,
  QueryQuotesForSalespersonDto,
  SearchDocumentsDto,
} from '../dto/sales/query-documents.dto';

@ApiTags('Ventes')
@Controller('api/v1/sales')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  /**
   * Récupère les documents récents (tous types)
   */
  @Get('documents/recent')
  @Roles(
    UserRole.COMMERCIAL,
    UserRole.CHEF_CHANTIER,
    UserRole.PATRON,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({
    summary: 'Documents récents',
    description: 'Récupère les documents de vente récents (tous types ou filtrés)',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des documents',
    type: [SaleDocumentDto],
  })
  async getRecentDocuments(
    @Query() query: QueryRecentDocumentsDto,
  ): Promise<SaleDocumentDto[]> {
    return this.salesService.getRecentDocuments(query);
  }

  /**
   * Recherche de documents par critères
   */
  @Get('documents/search')
  @Roles(
    UserRole.COMMERCIAL,
    UserRole.CHEF_CHANTIER,
    UserRole.PATRON,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({
    summary: 'Rechercher documents',
    description:
      'Recherche de documents par type, client, commercial, dates (avec pagination)',
  })
  @ApiResponse({
    status: 200,
    description: 'Documents trouvés',
    type: [SaleDocumentDto],
  })
  async searchDocuments(
    @Query() query: SearchDocumentsDto,
  ): Promise<SaleDocumentDto[]> {
    return this.salesService.searchDocuments(query);
  }

  /**
   * Récupère un document par son ID
   */
  @Get('documents/:id')
  @Roles(
    UserRole.COMMERCIAL,
    UserRole.CHEF_CHANTIER,
    UserRole.PATRON,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({
    summary: 'Détail document',
    description: 'Récupère les informations d\'un document de vente',
  })
  @ApiParam({ name: 'id', description: 'ID du document (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Document trouvé',
    type: SaleDocumentDto,
  })
  @ApiResponse({ status: 404, description: 'Document non trouvé' })
  async getDocumentById(@Param('id') id: string): Promise<SaleDocumentDto> {
    return this.salesService.getDocumentById(id);
  }

  /**
   * Récupère un document avec ses lignes
   */
  @Get('documents/:id/with-lines')
  @Roles(
    UserRole.COMMERCIAL,
    UserRole.CHEF_CHANTIER,
    UserRole.PATRON,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({
    summary: 'Document avec lignes',
    description: 'Récupère un document complet avec toutes ses lignes',
  })
  @ApiParam({ name: 'id', description: 'ID du document (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Document avec lignes',
    type: SaleDocumentWithLinesDto,
  })
  @ApiResponse({ status: 404, description: 'Document non trouvé' })
  async getDocumentWithLines(
    @Param('id') id: string,
  ): Promise<SaleDocumentWithLinesDto> {
    return this.salesService.getDocumentWithLines(id);
  }

  /**
   * Récupère les devis du commercial connecté
   */
  @Get('quotes/my-quotes')
  @Roles(UserRole.COMMERCIAL, UserRole.PATRON, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Mes devis',
    description: 'Récupère les devis du commercial connecté',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des devis',
    type: [QuoteDto],
  })
  async getMyQuotes(
    @Request() req,
    @Query() query: QueryQuotesForSalespersonDto,
  ): Promise<QuoteDto[]> {
    const salespersonId = req.user.colleagueId;
    return this.salesService.getQuotesForSalesperson(salespersonId, query);
  }

  /**
   * Récupère les devis d'un commercial spécifique (admin/patron)
   */
  @Get('quotes/salesperson/:salespersonId')
  @Roles(UserRole.PATRON, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Devis commercial (admin)',
    description: 'Récupère les devis d\'un commercial spécifique (admin/patron uniquement)',
  })
  @ApiParam({ name: 'salespersonId', description: 'ID du commercial' })
  @ApiResponse({
    status: 200,
    description: 'Liste des devis',
    type: [QuoteDto],
  })
  async getQuotesForSalesperson(
    @Param('salespersonId') salespersonId: string,
    @Query() query: QueryQuotesForSalespersonDto,
  ): Promise<QuoteDto[]> {
    return this.salesService.getQuotesForSalesperson(salespersonId, query);
  }

  /**
   * Récupère les statistiques des lignes de devis
   */
  @Get('quotes/lines-stats')
  @Roles(UserRole.COMMERCIAL, UserRole.PATRON, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Statistiques lignes devis',
    description:
      'Récupère les statistiques sur les lignes de devis (nombre, total)',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistiques des lignes',
    type: [QuoteLinesStatsDto],
  })
  async getQuoteLinesStats(): Promise<QuoteLinesStatsDto[]> {
    return this.salesService.getQuoteLinesStats();
  }
}
