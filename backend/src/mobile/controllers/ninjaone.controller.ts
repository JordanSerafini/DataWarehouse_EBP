import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { NinjaOneService } from '../services/ninjaone.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../enums/user-role.enum';
import {
  ConvertTicketDto,
  TicketPreviewDto,
  ConversionResultDto,
  TargetType,
  CreateOrganizationMappingDto,
  CreateTechnicianMappingDto,
} from '../dto/ninjaone/convert-ticket.dto';

@ApiTags('NinjaOne Conversion')
@Controller('api/v1/ninjaone')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class NinjaOneController {
  constructor(private readonly ninjaoneService: NinjaOneService) {}

  /**
   * Obtenir la prévisualisation d'un ticket pour conversion
   * (pré-remplit le formulaire mobile)
   */
  @Get('tickets/:ticketId/preview')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.PATRON, UserRole.CHEF_CHANTIER)
  @ApiOperation({
    summary: 'Prévisualisation d\'un ticket pour conversion',
    description: 'Récupère les données pré-remplies d\'un ticket NinjaOne pour le formulaire de conversion',
  })
  @ApiParam({
    name: 'ticketId',
    description: 'ID du ticket NinjaOne',
    example: 42,
  })
  @ApiQuery({
    name: 'targetType',
    enum: TargetType,
    description: 'Type de cible (schedule_event ou incident)',
    example: TargetType.SCHEDULE_EVENT,
  })
  @ApiResponse({
    status: 200,
    description: 'Prévisualisation du ticket avec données pré-remplies',
    type: TicketPreviewDto,
  })
  @ApiResponse({ status: 404, description: 'Ticket non trouvé' })
  async getTicketPreview(
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @Query('targetType') targetType: TargetType,
  ): Promise<TicketPreviewDto> {
    return this.ninjaoneService.getTicketPreview(ticketId, targetType);
  }

  /**
   * Convertir un ticket NinjaOne en intervention ou incident proposé
   * AVEC DONNÉES MODIFIABLES depuis le formulaire
   */
  @Post('convert')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.PATRON, UserRole.CHEF_CHANTIER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Convertir un ticket NinjaOne',
    description: 'Crée une proposition d\'intervention ou d\'incident à partir d\'un ticket NinjaOne. Les données sont modifiables depuis le formulaire.',
  })
  @ApiResponse({
    status: 201,
    description: 'Proposition créée avec succès',
    type: ConversionResultDto,
  })
  @ApiResponse({ status: 400, description: 'Données invalides ou ticket déjà converti' })
  @ApiResponse({ status: 404, description: 'Ticket, client ou collègue non trouvé' })
  async convertTicket(
    @Request() req,
    @Body() dto: ConvertTicketDto,
  ): Promise<ConversionResultDto> {
    const userId = req.user.id; // ID utilisateur depuis JWT
    return this.ninjaoneService.convertTicket(dto, userId);
  }

  /**
   * Créer un mapping manuel organisation NinjaOne → client EBP
   */
  @Post('mappings/organizations')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Créer un mapping organisation → client',
    description: 'Associe manuellement une organisation NinjaOne à un client EBP (admin uniquement)',
  })
  @ApiResponse({
    status: 201,
    description: 'Mapping créé avec succès',
  })
  @ApiResponse({ status: 404, description: 'Organisation ou client non trouvé' })
  async createOrganizationMapping(
    @Request() req,
    @Body() dto: CreateOrganizationMappingDto,
  ): Promise<{ success: boolean; message: string }> {
    const userId = req.user.id;
    return this.ninjaoneService.createOrganizationMapping(dto, userId);
  }

  /**
   * Créer un mapping manuel technicien NinjaOne → collègue EBP
   */
  @Post('mappings/technicians')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Créer un mapping technicien → collègue',
    description: 'Associe manuellement un technicien NinjaOne à un collègue EBP (admin uniquement)',
  })
  @ApiResponse({
    status: 201,
    description: 'Mapping créé avec succès',
  })
  @ApiResponse({ status: 404, description: 'Technicien ou collègue non trouvé' })
  async createTechnicianMapping(
    @Request() req,
    @Body() dto: CreateTechnicianMappingDto,
  ): Promise<{ success: boolean; message: string }> {
    const userId = req.user.id;
    return this.ninjaoneService.createTechnicianMapping(dto, userId);
  }

  /**
   * Obtenir les statistiques de conversion NinjaOne
   */
  @Get('stats')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.PATRON)
  @ApiOperation({
    summary: 'Statistiques de conversion NinjaOne',
    description: 'Retourne les stats globales du système de conversion (tickets, propositions, mappings)',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistiques de conversion',
  })
  async getConversionStats(): Promise<any> {
    // Appeler la fonction SQL mobile.get_ninjaone_conversion_stats()
    const result = await this.ninjaoneService['db'].query(
      'SELECT * FROM mobile.get_ninjaone_conversion_stats()',
    );

    return result.rows[0];
  }

  /**
   * Lister toutes les propositions d'interventions en attente
   */
  @Get('proposals/interventions')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.PATRON)
  @ApiOperation({
    summary: 'Lister les interventions proposées',
    description: 'Retourne toutes les interventions proposées (non encore intégrées à EBP)',
  })
  @ApiQuery({
    name: 'status',
    enum: ['pending', 'approved', 'rejected', 'integrated'],
    required: false,
    description: 'Filtrer par statut',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des interventions proposées',
  })
  async listInterventionProposals(
    @Query('status') status?: 'pending' | 'approved' | 'rejected' | 'integrated',
  ): Promise<any[]> {
    const query = `
      SELECT
        ip.*,
        t.title as ticket_title,
        t.description as ticket_description,
        (t.status->>'displayName') as ticket_status,
        t.priority as ticket_priority,
        c."Caption" as customer_caption,
        col."Caption" as colleague_caption
      FROM mobile.interventions_proposed ip
      LEFT JOIN ninjaone.fact_tickets t ON ip.ninjaone_ticket_id = t.ticket_id
      LEFT JOIN public."Customer" c ON ip.customer_id = c."Id"
      LEFT JOIN public."Colleague" col ON ip.colleague_id = col."Id"
      WHERE ($1::text IS NULL OR ip.proposal_status = $1::text)
      ORDER BY ip.created_at DESC
    `;

    const result = await this.ninjaoneService['db'].query(query, [status || null]);
    return result.rows;
  }

  /**
   * Lister toutes les propositions d'incidents en attente
   */
  @Get('proposals/incidents')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.PATRON)
  @ApiOperation({
    summary: 'Lister les incidents proposés',
    description: 'Retourne tous les incidents proposés (non encore intégrés à EBP)',
  })
  @ApiQuery({
    name: 'status',
    enum: ['pending', 'approved', 'rejected', 'integrated'],
    required: false,
    description: 'Filtrer par statut',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des incidents proposés',
  })
  async listIncidentProposals(
    @Query('status') status?: 'pending' | 'approved' | 'rejected' | 'integrated',
  ): Promise<any[]> {
    const query = `
      SELECT
        inc.*,
        t.title as ticket_title,
        t.description as ticket_description,
        (t.status->>'displayName') as ticket_status,
        t.priority as ticket_priority,
        c."Caption" as customer_caption
      FROM mobile.incidents_proposed inc
      LEFT JOIN ninjaone.fact_tickets t ON inc.ninjaone_ticket_id = t.ticket_id
      LEFT JOIN public."Customer" c ON inc.customer_id = c."Id"
      WHERE ($1::text IS NULL OR inc.proposal_status = $1::text)
      ORDER BY inc.created_at DESC
    `;

    const result = await this.ninjaoneService['db'].query(query, [status || null]);
    return result.rows;
  }

  /**
   * Lister tous les mappings organisations
   */
  @Get('mappings/organizations')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Lister les mappings organisations',
    description: 'Retourne tous les mappings organisations NinjaOne → clients EBP',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des mappings organisations',
  })
  async listOrganizationMappings(): Promise<any[]> {
    const query = `
      SELECT
        m.*,
        o.organization_name,
        o.city as organization_city,
        c."Caption" as customer_caption,
        c."MainDeliveryAddress_City" as customer_city
      FROM mobile.ninjaone_customer_mapping m
      LEFT JOIN ninjaone.dim_organizations o ON m.ninjaone_organization_id = o.organization_id
      LEFT JOIN public."Customer" c ON m.ebp_customer_id = c."Id"
      ORDER BY m.created_at DESC
    `;

    const result = await this.ninjaoneService['db'].query(query);
    return result.rows;
  }

  /**
   * Lister tous les mappings techniciens
   */
  @Get('mappings/technicians')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Lister les mappings techniciens',
    description: 'Retourne tous les mappings techniciens NinjaOne → collègues EBP',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des mappings techniciens',
  })
  async listTechnicianMappings(): Promise<any[]> {
    const query = `
      SELECT
        m.*,
        tech.full_name as technician_name,
        tech.email as technician_email,
        col."Contact_Name" as colleague_name,
        col."Contact_Email" as colleague_email
      FROM mobile.ninjaone_technician_mapping m
      LEFT JOIN ninjaone.dim_technicians tech ON m.ninjaone_technician_id = tech.technician_id
      LEFT JOIN public."Colleague" col ON m.ebp_colleague_id = col."Id"
      ORDER BY m.created_at DESC
    `;

    const result = await this.ninjaoneService['db'].query(query);
    return result.rows;
  }

  /**
   * Lister tous les collègues EBP (pour sélection dans formulaire)
   */
  @Get('colleagues')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.PATRON, UserRole.CHEF_CHANTIER)
  @ApiOperation({
    summary: 'Lister tous les collègues',
    description: 'Retourne la liste de tous les collègues EBP pour sélection dans formulaire',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des collègues',
  })
  async listColleagues(): Promise<any[]> {
    const query = `
      SELECT
        "Id",
        "Contact_Name",
        "Contact_FirstName",
        "Contact_Email"
      FROM public."Colleague"
      ORDER BY "Contact_Name", "Contact_FirstName"
    `;

    const result = await this.ninjaoneService['db'].query(query);
    return result.rows;
  }
}
