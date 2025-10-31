import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsEnum,
  IsOptional,
  IsUUID,
  IsString,
  IsBoolean,
  IsDateString,
  IsNumber,
  MaxLength,
} from 'class-validator';

/**
 * Type de cible pour la conversion
 */
export enum TargetType {
  SCHEDULE_EVENT = 'schedule_event', // Intervention planifiée
  INCIDENT = 'incident', // Ticket maintenance
}

/**
 * DTO pour convertir un ticket NinjaOne en intervention ou incident
 * PERMET DE PRÉ-REMPLIR ET MODIFIER LES DONNÉES AVANT CONVERSION
 */
export class ConvertTicketDto {
  @ApiProperty({
    description: 'ID du ticket NinjaOne source',
    example: 42,
  })
  @IsInt()
  ticketId: number;

  @ApiProperty({
    description: 'Type de cible: schedule_event (intervention) ou incident',
    enum: TargetType,
    example: TargetType.SCHEDULE_EVENT,
  })
  @IsEnum(TargetType)
  targetType: TargetType;

  // ============================================
  // INFORMATIONS DE BASE (modifiables)
  // ============================================

  @ApiProperty({
    description: 'Titre de l\'intervention (pré-rempli depuis le ticket)',
    example: '[NinjaOne #123456] Maintenance climatisation',
    maxLength: 80,
  })
  @IsString()
  @MaxLength(80)
  caption: string;

  @ApiProperty({
    description: 'Description détaillée',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  // ============================================
  // CLIENT / DEMANDEUR (modifiable)
  // ============================================

  @ApiProperty({
    description: 'ID du client EBP (modifiable)',
    example: 'CUST001',
  })
  @IsString()
  customerId: string;

  @ApiProperty({
    description: 'Nom du client (lecture seule, déduit du customerId)',
    required: false,
  })
  @IsOptional()
  @IsString()
  customerName?: string;

  // ============================================
  // TECHNICIEN ASSIGNÉ (modifiable)
  // ============================================

  @ApiProperty({
    description: 'ID du collègue/technicien EBP assigné (optionnel)',
    example: 'TECH01',
    required: false,
  })
  @IsOptional()
  @IsString()
  colleagueId?: string;

  @ApiProperty({
    description: 'Nom du technicien (lecture seule)',
    required: false,
  })
  @IsOptional()
  @IsString()
  colleagueName?: string;

  // ============================================
  // DATES ET HORAIRES (modifiables)
  // ============================================

  @ApiProperty({
    description: 'Date et heure de début prévue (ISO 8601)',
    example: '2025-11-01T09:00:00.000Z',
  })
  @IsDateString()
  startDateTime: string;

  @ApiProperty({
    description: 'Date et heure de fin prévue (ISO 8601)',
    example: '2025-11-01T11:00:00.000Z',
  })
  @IsDateString()
  endDateTime: string;

  @ApiProperty({
    description: 'Durée estimée en heures',
    example: 2.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  estimatedDurationHours?: number;

  // ============================================
  // PRIORITÉ (modifiable)
  // ============================================

  @ApiProperty({
    description: 'Priorité (LOW, NORMAL, MEDIUM, HIGH, URGENT)',
    example: 'HIGH',
    required: false,
  })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiProperty({
    description: 'Marquer comme urgent',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isUrgent?: boolean;

  // ============================================
  // LOCALISATION (pré-remplie depuis organisation)
  // ============================================

  @ApiProperty({
    description: 'Adresse ligne 1',
    required: false,
  })
  @IsOptional()
  @IsString()
  addressLine1?: string;

  @ApiProperty({
    description: 'Ville',
    required: false,
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    description: 'Code postal',
    required: false,
  })
  @IsOptional()
  @IsString()
  zipcode?: string;

  @ApiProperty({
    description: 'Latitude GPS',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({
    description: 'Longitude GPS',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  // ============================================
  // CONTACT CLIENT (pré-rempli)
  // ============================================

  @ApiProperty({
    description: 'Nom du contact',
    required: false,
  })
  @IsOptional()
  @IsString()
  contactName?: string;

  @ApiProperty({
    description: 'Téléphone du contact',
    required: false,
  })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiProperty({
    description: 'Email du contact',
    required: false,
  })
  @IsOptional()
  @IsString()
  contactEmail?: string;

  // ============================================
  // CHAMPS MAINTENANCE (pour schedule_event)
  // ============================================

  @ApiProperty({
    description: 'Référence maintenance',
    required: false,
  })
  @IsOptional()
  @IsString()
  maintenanceReference?: string;

  @ApiProperty({
    description: 'Description intervention maintenance',
    required: false,
  })
  @IsOptional()
  @IsString()
  maintenanceInterventionDescription?: string;

  @ApiProperty({
    description: 'Durée trajet prévue (heures)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  maintenanceTravelDuration?: number;

  // ============================================
  // CHAMPS PERSONNALISÉS EBP (optionnels)
  // ============================================

  @ApiProperty({
    description: 'Type de tâche personnalisé',
    required: false,
  })
  @IsOptional()
  @IsString()
  customTaskType?: string;

  @ApiProperty({
    description: 'Thème',
    required: false,
  })
  @IsOptional()
  @IsString()
  customTheme?: string;

  @ApiProperty({
    description: 'Services',
    required: false,
  })
  @IsOptional()
  @IsString()
  customServices?: string;

  @ApiProperty({
    description: 'Activité',
    required: false,
  })
  @IsOptional()
  @IsString()
  customActivity?: string;

  // ============================================
  // MÉTADONNÉES
  // ============================================

  @ApiProperty({
    description: 'ID de l\'utilisateur effectuant la conversion (déduit du JWT si non fourni)',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  convertedBy?: string;
}

/**
 * DTO pour obtenir les données pré-remplies d'un ticket
 * (utilisé pour pré-remplir le formulaire de conversion)
 */
export class GetTicketPreviewDto {
  @ApiProperty({
    description: 'ID du ticket NinjaOne',
    example: 42,
  })
  @IsInt()
  ticketId: number;

  @ApiProperty({
    description: 'Type de cible pour ajuster le pré-remplissage',
    enum: TargetType,
    example: TargetType.SCHEDULE_EVENT,
  })
  @IsEnum(TargetType)
  targetType: TargetType;
}

/**
 * DTO de prévisualisation (données pré-remplies depuis le ticket)
 */
export class TicketPreviewDto {
  // Ticket source
  @ApiProperty()
  ticketId: number;

  @ApiProperty()
  ticketNumber: string;

  @ApiProperty()
  ticketTitle: string;

  @ApiProperty()
  ticketDescription?: string;

  // Données pré-remplies
  @ApiProperty()
  caption: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  customerId?: string;

  @ApiProperty()
  customerName?: string;

  @ApiProperty()
  colleagueId?: string;

  @ApiProperty()
  colleagueName?: string;

  @ApiProperty()
  startDateTime: string;

  @ApiProperty()
  endDateTime: string;

  @ApiProperty()
  estimatedDurationHours: number;

  @ApiProperty()
  priority: string;

  @ApiProperty()
  isUrgent: boolean;

  @ApiProperty()
  addressLine1?: string;

  @ApiProperty()
  city?: string;

  @ApiProperty()
  zipcode?: string;

  @ApiProperty()
  contactPhone?: string;

  @ApiProperty()
  maintenanceReference?: string;

  // Mapping info
  @ApiProperty()
  canConvert: boolean;

  @ApiProperty()
  customerMapped: boolean;

  @ApiProperty()
  technicianMapped: boolean;

  @ApiProperty()
  warnings: string[];
}

/**
 * DTO de réponse après conversion
 */
export class ConversionResultDto {
  @ApiProperty({
    description: 'Succès de la conversion',
    example: true,
  })
  @IsBoolean()
  success: boolean;

  @ApiProperty({
    description: 'ID de la proposition créée (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  proposalId?: string;

  @ApiProperty({
    description: 'Type de proposition créée',
    example: 'intervention_proposed',
    required: false,
  })
  @IsOptional()
  @IsString()
  proposalType?: string;

  @ApiProperty({
    description: 'Message de résultat',
    example: 'Intervention proposée créée avec succès',
  })
  @IsString()
  message: string;
}

/**
 * DTO pour créer un mapping manuel organisation → client
 */
export class CreateOrganizationMappingDto {
  @ApiProperty({
    description: 'ID de l\'organisation NinjaOne',
    example: 123,
  })
  @IsInt()
  ninjaoneOrganizationId: number;

  @ApiProperty({
    description: 'ID du client EBP',
    example: 'CUST001',
  })
  @IsString()
  ebpCustomerId: string;

  @ApiProperty({
    description: 'Notes sur le mapping',
    required: false,
  })
  @IsOptional()
  @IsString()
  mappingNotes?: string;
}

/**
 * DTO pour créer un mapping manuel technicien → collègue
 */
export class CreateTechnicianMappingDto {
  @ApiProperty({
    description: 'ID du technicien NinjaOne',
    example: 5,
  })
  @IsInt()
  ninjaoneTechnicianId: number;

  @ApiProperty({
    description: 'ID du collègue EBP',
    example: 'TECH01',
  })
  @IsString()
  ebpColleagueId: string;

  @ApiProperty({
    description: 'Notes sur le mapping',
    required: false,
  })
  @IsOptional()
  @IsString()
  mappingNotes?: string;
}

/**
 * DTO pour approuver/rejeter une proposition
 */
export class UpdateProposalStatusDto {
  @ApiProperty({
    description: 'Nouveau statut',
    enum: ['approved', 'rejected', 'cancelled'],
    example: 'approved',
  })
  @IsEnum(['approved', 'rejected', 'cancelled'])
  status: 'approved' | 'rejected' | 'cancelled';

  @ApiProperty({
    description: 'Raison du rejet (si status = rejected)',
    required: false,
  })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
