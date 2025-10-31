import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from './database.service';
import {
  ConvertTicketDto,
  TicketPreviewDto,
  ConversionResultDto,
  TargetType,
  CreateOrganizationMappingDto,
  CreateTechnicianMappingDto,
} from '../dto/ninjaone/convert-ticket.dto';

@Injectable()
export class NinjaOneService {
  private readonly logger = new Logger(NinjaOneService.name);

  constructor(private readonly db: DatabaseService) {}

  /**
   * Obtenir la prévisualisation pré-remplie d'un ticket pour conversion
   * (utilisé pour pré-remplir le formulaire mobile)
   */
  async getTicketPreview(ticketId: number, targetType: TargetType): Promise<TicketPreviewDto> {
    this.logger.log(`Getting preview for ticket ${ticketId}, target: ${targetType}`);

    // Récupérer le ticket NinjaOne avec relations
    const query = `
      SELECT
        t.ticket_id,
        t.ticket_number,
        t.title,
        t.description,
        t.priority,
        t.severity,
        t.due_date,
        t.created_at,
        t.time_spent_hours,
        t.estimated_time_hours,

        -- Organisation
        o.organization_id,
        o.organization_name,
        o.address as org_address,
        o.city as org_city,
        o.postal_code as org_postal_code,
        o.phone as org_phone,

        -- Technicien assigné
        tech.technician_id,
        tech.full_name as tech_name,
        tech.email as tech_email,

        -- Mapping organisation → client EBP
        cm.ebp_customer_id,
        cm.ebp_customer_name,
        cm.validated as customer_mapped,

        -- Mapping technicien → collègue EBP
        tm.ebp_colleague_id,
        tm.ebp_colleague_name,
        tm.validated as technician_mapped

      FROM ninjaone.fact_tickets t
      LEFT JOIN ninjaone.dim_organizations o ON t.organization_id = o.organization_id
      LEFT JOIN ninjaone.dim_technicians tech ON t.assigned_technician_id = tech.technician_id
      LEFT JOIN mobile.ninjaone_customer_mapping cm ON o.organization_id = cm.ninjaone_organization_id AND cm.validated = TRUE
      LEFT JOIN mobile.ninjaone_technician_mapping tm ON tech.technician_id = tm.ninjaone_technician_id AND tm.validated = TRUE
      WHERE t.ticket_id = $1
    `;

    const result = await this.db.query(query, [ticketId]);

    if (result.rows.length === 0) {
      throw new NotFoundException(`Ticket NinjaOne ${ticketId} non trouvé`);
    }

    const ticket = result.rows[0];
    const warnings: string[] = [];

    // Vérifier le mapping client
    if (!ticket.ebp_customer_id) {
      warnings.push('Organisation non mappée à un client EBP. Vous devez sélectionner un client manuellement.');
    }

    // Vérifier le mapping technicien (optionnel)
    if (ticket.technician_id && !ticket.ebp_colleague_id) {
      warnings.push('Technicien non mappé à un collègue EBP. Vous pouvez en sélectionner un manuellement.');
    }

    // Calculer dates par défaut
    const now = new Date();
    const startDateTime = ticket.due_date ? new Date(ticket.due_date) : new Date(now.getTime() + 24 * 60 * 60 * 1000); // +1 jour
    const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000); // +2 heures

    // Mapper priorité NinjaOne → format lisible
    const priority = this.mapPriority(ticket.priority);
    const isUrgent = priority === 'URGENT' || ticket.priority === 'HIGH';

    // Construire le caption (max 80 caractères)
    const caption = `[NinjaOne #${ticket.ticket_number}] ${ticket.title}`.substring(0, 80);

    // Description enrichie
    const description = `Ticket NinjaOne #${ticket.ticket_number}\n\n` +
      `Priorité: ${ticket.priority || 'NONE'}\n` +
      (ticket.severity ? `Sévérité: ${ticket.severity}\n` : '') +
      `Créé le: ${new Date(ticket.created_at).toLocaleDateString('fr-FR')}\n\n` +
      `Description:\n${ticket.description || 'Aucune description'}`;

    // Référence maintenance
    const maintenanceReference = `NINJA-${ticket.ticket_number}`;

    const preview: TicketPreviewDto = {
      // Ticket source
      ticketId: ticket.ticket_id,
      ticketNumber: ticket.ticket_number,
      ticketTitle: ticket.title,
      ticketDescription: ticket.description,

      // Données pré-remplies
      caption,
      description,
      customerId: ticket.ebp_customer_id || undefined,
      customerName: ticket.ebp_customer_name || ticket.organization_name,
      colleagueId: ticket.ebp_colleague_id || undefined,
      colleagueName: ticket.ebp_colleague_name || ticket.tech_name,
      startDateTime: startDateTime.toISOString(),
      endDateTime: endDateTime.toISOString(),
      estimatedDurationHours: ticket.estimated_time_hours || 2.0,
      priority,
      isUrgent,
      addressLine1: ticket.org_address || undefined,
      city: ticket.org_city || undefined,
      zipcode: ticket.org_postal_code || undefined,
      contactPhone: ticket.org_phone || undefined,
      maintenanceReference,

      // Mapping info
      canConvert: !!ticket.ebp_customer_id, // Peut convertir si client mappé
      customerMapped: !!ticket.customer_mapped,
      technicianMapped: !!ticket.technician_mapped,
      warnings,
    };

    return preview;
  }

  /**
   * Convertir un ticket NinjaOne en intervention ou incident proposé
   * AVEC DONNÉES MODIFIABLES (depuis le formulaire)
   */
  async convertTicket(dto: ConvertTicketDto, userId: string): Promise<ConversionResultDto> {
    this.logger.log(`Converting ticket ${dto.ticketId} to ${dto.targetType}`);

    // Vérifier que le ticket existe
    const ticketCheck = await this.db.query(
      'SELECT ticket_id, ticket_number FROM ninjaone.fact_tickets WHERE ticket_id = $1',
      [dto.ticketId],
    );

    if (ticketCheck.rows.length === 0) {
      throw new NotFoundException(`Ticket NinjaOne ${dto.ticketId} non trouvé`);
    }

    const ticketNumber = ticketCheck.rows[0].ticket_number;

    // Vérifier si déjà converti
    const alreadyConverted = await this.db.query(
      `SELECT 1 FROM mobile.interventions_proposed WHERE ninjaone_ticket_id = $1
       UNION ALL
       SELECT 1 FROM mobile.incidents_proposed WHERE ninjaone_ticket_id = $1
       UNION ALL
       SELECT 1 FROM mobile.ninjaone_intervention_links WHERE ninjaone_ticket_id = $1
       LIMIT 1`,
      [dto.ticketId],
    );

    if (alreadyConverted.rows.length > 0) {
      throw new BadRequestException(`Ticket ${dto.ticketId} déjà converti`);
    }

    // Vérifier que le client existe
    const customerCheck = await this.db.query(
      'SELECT "Id", "Caption" FROM public."Customer" WHERE "Id" = $1',
      [dto.customerId],
    );

    if (customerCheck.rows.length === 0) {
      throw new BadRequestException(`Client EBP ${dto.customerId} non trouvé`);
    }

    // Vérifier le collègue si fourni
    if (dto.colleagueId) {
      const colleagueCheck = await this.db.query(
        'SELECT "Id", "Caption" FROM public."Colleague" WHERE "Id" = $1',
        [dto.colleagueId],
      );

      if (colleagueCheck.rows.length === 0) {
        throw new BadRequestException(`Collègue EBP ${dto.colleagueId} non trouvé`);
      }
    }

    let proposalId: string;
    let proposalType: string;

    // CONVERSION VERS SCHEDULE_EVENT (Intervention)
    if (dto.targetType === TargetType.SCHEDULE_EVENT) {
      const insertQuery = `
        INSERT INTO mobile.interventions_proposed (
          id,
          ninjaone_ticket_id,
          ninjaone_ticket_number,
          source_type,
          caption,
          notes_clear,
          start_date_time,
          end_date_time,
          expected_duration_hours,
          customer_id,
          customer_name,
          colleague_id,
          colleague_name,
          address_address1,
          address_city,
          address_zipcode,
          address_latitude,
          address_longitude,
          contact_name,
          contact_phone,
          contact_email,
          event_state,
          priority,
          is_urgent,
          maintenance_reference,
          maintenance_intervention_description,
          maintenance_travel_duration,
          xx_type_tache,
          xx_theme,
          xx_services,
          xx_activite,
          xx_duree_pevue,
          xx_urgent,
          created_by,
          proposal_status
        ) VALUES (
          gen_random_uuid(),
          $1, $2, 'ninjaone',
          $3, $4, $5, $6, $7,
          $8, $9, $10, $11,
          $12, $13, $14, $15, $16,
          $17, $18, $19,
          0, $20, $21,
          $22, $23, $24,
          $25, $26, $27, $28, $29, $30,
          $31::uuid, 'pending'
        ) RETURNING id, 'intervention_proposed' as type
      `;

      const result = await this.db.query(insertQuery, [
        dto.ticketId,
        ticketNumber,
        dto.caption,
        dto.description || null,
        dto.startDateTime,
        dto.endDateTime,
        dto.estimatedDurationHours || 2.0,
        dto.customerId,
        dto.customerName || customerCheck.rows[0].Caption,
        dto.colleagueId || null,
        dto.colleagueName || null,
        dto.addressLine1 || null,
        dto.city || null,
        dto.zipcode || null,
        dto.latitude || null,
        dto.longitude || null,
        dto.contactName || null,
        dto.contactPhone || null,
        dto.contactEmail || null,
        dto.priority || 'NORMAL',
        dto.isUrgent || false,
        dto.maintenanceReference || `NINJA-${ticketNumber}`,
        dto.maintenanceInterventionDescription || dto.description || null,
        dto.maintenanceTravelDuration || null,
        dto.customTaskType || null,
        dto.customTheme || null,
        dto.customServices || null,
        dto.customActivity || null,
        dto.estimatedDurationHours || 2.0,
        dto.isUrgent || false,
        userId,
      ]);

      proposalId = result.rows[0].id;
      proposalType = result.rows[0].type;
    }
    // CONVERSION VERS INCIDENT
    else if (dto.targetType === TargetType.INCIDENT) {
      const insertQuery = `
        INSERT INTO mobile.incidents_proposed (
          id,
          ninjaone_ticket_id,
          ninjaone_ticket_number,
          source_type,
          caption,
          description_clear,
          notes_clear,
          start_date,
          customer_id,
          customer_name,
          colleague_id,
          colleague_name,
          address_address1,
          address_city,
          address_zipcode,
          address_latitude,
          address_longitude,
          contact_name,
          contact_phone,
          contact_email,
          status,
          priority,
          predicted_duration,
          created_by,
          proposal_status
        ) VALUES (
          gen_random_uuid(),
          $1, $2, 'ninjaone',
          $3, $4, $5, $6,
          $7, $8,
          $9, $10,
          $11, $12, $13, $14, $15,
          $16, $17, $18,
          0, $19, $20,
          $21::uuid, 'pending'
        ) RETURNING id, 'incident_proposed' as type
      `;

      const result = await this.db.query(insertQuery, [
        dto.ticketId,
        ticketNumber,
        dto.caption,
        dto.description || null,
        dto.description || null,
        dto.startDateTime,
        dto.customerId,
        dto.customerName || customerCheck.rows[0].Caption,
        dto.colleagueId || null,
        dto.colleagueName || null,
        dto.addressLine1 || null,
        dto.city || null,
        dto.zipcode || null,
        dto.latitude || null,
        dto.longitude || null,
        dto.contactName || null,
        dto.contactPhone || null,
        dto.contactEmail || null,
        dto.priority || 'NORMAL',
        dto.estimatedDurationHours || 2.0,
        userId,
      ]);

      proposalId = result.rows[0].id;
      proposalType = result.rows[0].type;
    } else {
      throw new BadRequestException(`Type de cible invalide: ${dto.targetType}`);
    }

    return {
      success: true,
      proposalId,
      proposalType,
      message: `${proposalType === 'intervention_proposed' ? 'Intervention' : 'Incident'} proposé(e) créé(e) avec succès. Client: ${dto.customerName || customerCheck.rows[0].Caption}`,
    };
  }

  /**
   * Créer un mapping manuel organisation → client
   */
  async createOrganizationMapping(dto: CreateOrganizationMappingDto, userId: string): Promise<{ success: boolean; message: string }> {
    this.logger.log(`Creating organization mapping: ${dto.ninjaoneOrganizationId} → ${dto.ebpCustomerId}`);

    // Vérifier que l'organisation existe
    const orgCheck = await this.db.query(
      'SELECT organization_id, organization_name FROM ninjaone.dim_organizations WHERE organization_id = $1',
      [dto.ninjaoneOrganizationId],
    );

    if (orgCheck.rows.length === 0) {
      throw new NotFoundException(`Organisation NinjaOne ${dto.ninjaoneOrganizationId} non trouvée`);
    }

    // Vérifier que le client existe
    const customerCheck = await this.db.query(
      'SELECT "Id", "Caption" FROM public."Customer" WHERE "Id" = $1',
      [dto.ebpCustomerId],
    );

    if (customerCheck.rows.length === 0) {
      throw new NotFoundException(`Client EBP ${dto.ebpCustomerId} non trouvé`);
    }

    // Insérer le mapping
    await this.db.query(
      `INSERT INTO mobile.ninjaone_customer_mapping (
        ninjaone_organization_id,
        ninjaone_organization_name,
        ebp_customer_id,
        ebp_customer_name,
        mapping_confidence,
        confidence_score,
        validated,
        created_by,
        mapping_notes
      ) VALUES ($1, $2, $3, $4, 'manual', 1.00, TRUE, $5::uuid, $6)
      ON CONFLICT (ninjaone_organization_id)
      DO UPDATE SET
        ebp_customer_id = EXCLUDED.ebp_customer_id,
        ebp_customer_name = EXCLUDED.ebp_customer_name,
        validated = TRUE,
        mapping_notes = EXCLUDED.mapping_notes`,
      [
        dto.ninjaoneOrganizationId,
        orgCheck.rows[0].organization_name,
        dto.ebpCustomerId,
        customerCheck.rows[0].Caption,
        userId,
        dto.mappingNotes || null,
      ],
    );

    return {
      success: true,
      message: `Mapping créé: ${orgCheck.rows[0].organization_name} → ${customerCheck.rows[0].Caption}`,
    };
  }

  /**
   * Créer un mapping manuel technicien → collègue
   */
  async createTechnicianMapping(dto: CreateTechnicianMappingDto, userId: string): Promise<{ success: boolean; message: string }> {
    this.logger.log(`Creating technician mapping: ${dto.ninjaoneTechnicianId} → ${dto.ebpColleagueId}`);

    // Vérifier que le technicien existe
    const techCheck = await this.db.query(
      'SELECT technician_id, full_name FROM ninjaone.dim_technicians WHERE technician_id = $1',
      [dto.ninjaoneTechnicianId],
    );

    if (techCheck.rows.length === 0) {
      throw new NotFoundException(`Technicien NinjaOne ${dto.ninjaoneTechnicianId} non trouvé`);
    }

    // Vérifier que le collègue existe
    const colleagueCheck = await this.db.query(
      'SELECT "Id", "Caption" FROM public."Colleague" WHERE "Id" = $1',
      [dto.ebpColleagueId],
    );

    if (colleagueCheck.rows.length === 0) {
      throw new NotFoundException(`Collègue EBP ${dto.ebpColleagueId} non trouvé`);
    }

    // Insérer le mapping
    await this.db.query(
      `INSERT INTO mobile.ninjaone_technician_mapping (
        ninjaone_technician_id,
        ninjaone_technician_name,
        ebp_colleague_id,
        ebp_colleague_name,
        mapping_confidence,
        confidence_score,
        validated,
        created_by,
        mapping_notes
      ) VALUES ($1, $2, $3, $4, 'manual', 1.00, TRUE, $5::uuid, $6)
      ON CONFLICT (ninjaone_technician_id)
      DO UPDATE SET
        ebp_colleague_id = EXCLUDED.ebp_colleague_id,
        ebp_colleague_name = EXCLUDED.ebp_colleague_name,
        validated = TRUE,
        mapping_notes = EXCLUDED.mapping_notes`,
      [
        dto.ninjaoneTechnicianId,
        techCheck.rows[0].full_name,
        dto.ebpColleagueId,
        colleagueCheck.rows[0].Caption,
        userId,
        dto.mappingNotes || null,
      ],
    );

    return {
      success: true,
      message: `Mapping créé: ${techCheck.rows[0].full_name} → ${colleagueCheck.rows[0].Caption}`,
    };
  }

  /**
   * Helper: Mapper priorité NinjaOne → format lisible
   */
  private mapPriority(priority: string | null): string {
    if (!priority) return 'NORMAL';

    switch (priority.toUpperCase()) {
      case 'HIGH':
      case 'URGENT':
        return 'URGENT';
      case 'MEDIUM':
        return 'MEDIUM';
      case 'LOW':
        return 'LOW';
      default:
        return 'NORMAL';
    }
  }
}
