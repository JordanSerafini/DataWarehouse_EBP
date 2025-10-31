import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

/**
 * Statuts exposés à l'application mobile
 */
export enum InterventionStatusDto {
  SCHEDULED = 0,
  IN_PROGRESS = 1,
  COMPLETED = 2,
  CANCELLED = 3,
  PENDING = 4,
}

/**
 * Types d'intervention exposés à l'application mobile
 */
export enum InterventionTypeDto {
  INSTALLATION = 1,
  MAINTENANCE = 2,
  REPAIR = 3,
  INSPECTION = 4,
  TRAINING = 5,
  CONSULTATION = 6,
  OTHER = 99,
}

/**
 * Priorité des interventions exposée à l'application mobile
 */
export enum InterventionPriorityDto {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  URGENT = 3,
}

/**
 * DTO pour une intervention renvoyée au client mobile
 */
export class InterventionDto {
  @ApiProperty({
    description: "Identifiant unique de l'intervention",
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Référence métier ou numéro du rendez-vous',
    example: 'INT-2025-00123',
  })
  @IsString()
  reference: string;

  @ApiProperty({
    description: "Titre de l'intervention",
    example: 'Maintenance climatisation - Site Lyon',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Description courte / objet de la mission',
    required: false,
    example: 'Contrôle annuel et nettoyage filtres',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Date de début planifiée (ISO 8601)',
    example: '2025-10-24T09:00:00.000Z',
  })
  @IsISO8601()
  scheduledDate: string;

  @ApiProperty({
    description: 'Date de fin planifiée (ISO 8601)',
    required: false,
    example: '2025-10-24T12:00:00.000Z',
  })
  @IsISO8601()
  @IsOptional()
  scheduledEndDate?: string;

  @ApiProperty({
    description: 'Date réelle de début (ISO 8601)',
    required: false,
  })
  @IsISO8601()
  @IsOptional()
  actualStartDate?: string;

  @ApiProperty({
    description: 'Date réelle de fin (ISO 8601)',
    required: false,
  })
  @IsISO8601()
  @IsOptional()
  actualEndDate?: string;

  @ApiProperty({
    description: "Statut normalisé de l'intervention",
    enum: InterventionStatusDto,
    example: InterventionStatusDto.SCHEDULED,
  })
  @IsEnum(InterventionStatusDto)
  status: InterventionStatusDto;

  @ApiProperty({
    description: 'Libellé lisible du statut',
    example: 'Planifiée',
  })
  @IsString()
  statusLabel: string;

  @ApiProperty({
    description: "Type d'intervention",
    enum: InterventionTypeDto,
    example: InterventionTypeDto.MAINTENANCE,
  })
  @IsEnum(InterventionTypeDto)
  type: InterventionTypeDto;

  @ApiProperty({
    description: 'Libellé du type',
    example: 'Maintenance',
  })
  @IsString()
  typeLabel: string;

  @ApiProperty({
    description: 'Priorité de la tâche',
    enum: InterventionPriorityDto,
    example: InterventionPriorityDto.NORMAL,
  })
  @IsEnum(InterventionPriorityDto)
  priority: InterventionPriorityDto;

  @ApiProperty({
    description: 'Identifiant client',
    required: false,
    example: 'CUST-00123',
  })
  @IsString()
  @IsOptional()
  customerId?: string;

  @ApiProperty({
    description: 'Nom du client',
    required: false,
    example: 'ACME Corp',
  })
  @IsString()
  @IsOptional()
  customerName?: string;

  @ApiProperty({
    description: 'Téléphone du contact client',
    required: false,
    example: '+33 6 12 34 56 78',
  })
  @IsString()
  @IsOptional()
  contactPhone?: string;

  @ApiProperty({
    description: 'Identifiant projet lié',
    required: false,
  })
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiProperty({
    description: 'Nom du projet lié',
    required: false,
  })
  @IsString()
  @IsOptional()
  projectName?: string;

  @ApiProperty({
    description: 'Identifiant du technicien assigné',
    required: false,
  })
  @IsString()
  @IsOptional()
  technicianId?: string;

  @ApiProperty({
    description: 'Nom du technicien assigné',
    required: false,
  })
  @IsString()
  @IsOptional()
  technicianName?: string;

  @ApiProperty({
    description: 'Adresse formatée',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'Ville',
    required: false,
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({
    description: 'Code postal',
    required: false,
  })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiProperty({
    description: 'Latitude GPS',
    required: false,
    example: 48.8566,
  })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({
    description: 'Longitude GPS',
    required: false,
    example: 2.3522,
  })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({
    description: 'Durée estimée (minutes)',
    required: false,
    example: 150,
  })
  @IsNumber()
  @IsOptional()
  estimatedDuration?: number;

  @ApiProperty({
    description: 'Durée réelle (minutes)',
    required: false,
    example: 180,
  })
  @IsNumber()
  @IsOptional()
  actualDuration?: number;

  @ApiProperty({
    description: 'Temps passé en secondes (pour TimeSheet)',
    required: false,
    example: 10800,
  })
  @IsNumber()
  @IsOptional()
  timeSpentSeconds?: number;

  @ApiProperty({
    description: 'Notes ou rapport saisi',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    description: 'Date de création (ISO 8601)',
    example: '2025-10-20T08:15:00.000Z',
  })
  @IsISO8601()
  createdAt: string;

  @ApiProperty({
    description: 'Date de dernière mise à jour (ISO 8601)',
    required: false,
  })
  @IsISO8601()
  @IsOptional()
  updatedAt?: string;

  // ============================================
  // SECTION COÛTS & FACTURATION
  // ============================================

  @ApiProperty({
    description: 'Prix de vente HT',
    required: false,
    example: 450.0,
  })
  @IsNumber()
  @IsOptional()
  salePriceVatExcluded?: number;

  @ApiProperty({
    description: 'Montant net HT',
    required: false,
    example: 420.0,
  })
  @IsNumber()
  @IsOptional()
  netAmountVatExcluded?: number;

  @ApiProperty({
    description: 'Coût horaire',
    required: false,
    example: 65.0,
  })
  @IsNumber()
  @IsOptional()
  hourlyCostPrice?: number;

  @ApiProperty({
    description: 'Montant du coût',
    required: false,
    example: 320.0,
  })
  @IsNumber()
  @IsOptional()
  costAmount?: number;

  @ApiProperty({
    description: 'Montant du coût prévu',
    required: false,
    example: 300.0,
  })
  @IsNumber()
  @IsOptional()
  predictedCostAmount?: number;

  @ApiProperty({
    description: 'À facturer',
    required: false,
    example: true,
  })
  @IsOptional()
  toInvoice?: boolean;

  @ApiProperty({
    description: 'ID client facturé',
    required: false,
  })
  @IsString()
  @IsOptional()
  invoiceCustomerId?: string;

  @ApiProperty({
    description: 'ID collaborateur facturé',
    required: false,
  })
  @IsString()
  @IsOptional()
  invoiceColleagueId?: string;

  @ApiProperty({
    description: 'ID facture',
    required: false,
  })
  @IsString()
  @IsOptional()
  invoiceId?: string;

  // ============================================
  // SECTION MAINTENANCE
  // ============================================

  @ApiProperty({
    description: 'Référence maintenance',
    required: false,
    example: 'MAINT-2025-001',
  })
  @IsString()
  @IsOptional()
  maintenanceReference?: string;

  @ApiProperty({
    description: 'ID contrat de maintenance',
    required: false,
  })
  @IsString()
  @IsOptional()
  maintenanceContractId?: string;

  @ApiProperty({
    description: 'ID incident',
    required: false,
  })
  @IsString()
  @IsOptional()
  maintenanceIncidentId?: string;

  @ApiProperty({
    description: 'ID produit client',
    required: false,
  })
  @IsString()
  @IsOptional()
  maintenanceCustomerProductId?: string;

  @ApiProperty({
    description: 'Rapport d\'intervention (texte enrichi)',
    required: false,
  })
  @IsString()
  @IsOptional()
  maintenanceInterventionReport?: string;

  @ApiProperty({
    description: 'Durée de trajet (minutes)',
    required: false,
    example: 30,
  })
  @IsNumber()
  @IsOptional()
  maintenanceTravelDuration?: number;

  @ApiProperty({
    description: 'Heures contrat décrémentées',
    required: false,
    example: 2.5,
  })
  @IsNumber()
  @IsOptional()
  maintenanceContractHoursDecremented?: number;

  @ApiProperty({
    description: 'Date prochaine intervention de maintenance',
    required: false,
  })
  @IsISO8601()
  @IsOptional()
  maintenanceNextEventDate?: string;

  // ============================================
  // SECTION PROJET/CHANTIER/AFFAIRE
  // ============================================

  @ApiProperty({
    description: 'ID chantier',
    required: false,
  })
  @IsString()
  @IsOptional()
  constructionSiteId?: string;

  @ApiProperty({
    description: 'Nom du chantier',
    required: false,
  })
  @IsString()
  @IsOptional()
  constructionSiteName?: string;

  @ApiProperty({
    description: 'ID affaire',
    required: false,
  })
  @IsString()
  @IsOptional()
  dealId?: string;

  @ApiProperty({
    description: 'Nom de l\'affaire',
    required: false,
  })
  @IsString()
  @IsOptional()
  dealName?: string;

  @ApiProperty({
    description: 'Est un projet',
    required: false,
    example: false,
  })
  @IsOptional()
  isProject?: boolean;

  @ApiProperty({
    description: 'Pourcentage d\'avancement global',
    required: false,
    example: 75,
  })
  @IsNumber()
  @IsOptional()
  globalPercentComplete?: number;

  // ============================================
  // SECTION ÉQUIPEMENTS & ARTICLES
  // ============================================

  @ApiProperty({
    description: 'ID équipement',
    required: false,
  })
  @IsString()
  @IsOptional()
  equipmentId?: string;

  @ApiProperty({
    description: 'Nom de l\'équipement',
    required: false,
  })
  @IsString()
  @IsOptional()
  equipmentName?: string;

  @ApiProperty({
    description: 'ID article/item',
    required: false,
  })
  @IsString()
  @IsOptional()
  itemId?: string;

  @ApiProperty({
    description: 'Nom de l\'article',
    required: false,
  })
  @IsString()
  @IsOptional()
  itemName?: string;

  @ApiProperty({
    description: 'Quantité',
    required: false,
    example: 2,
  })
  @IsNumber()
  @IsOptional()
  quantity?: number;

  // ============================================
  // SECTION DOCUMENTS
  // ============================================

  @ApiProperty({
    description: 'ID document de vente',
    required: false,
  })
  @IsString()
  @IsOptional()
  saleDocumentId?: string;

  @ApiProperty({
    description: 'ID ligne document de vente',
    required: false,
  })
  @IsString()
  @IsOptional()
  saleDocumentLineId?: string;

  @ApiProperty({
    description: 'ID document d\'achat',
    required: false,
  })
  @IsString()
  @IsOptional()
  purchaseDocumentId?: string;

  @ApiProperty({
    description: 'ID document de stock',
    required: false,
  })
  @IsString()
  @IsOptional()
  stockDocumentId?: string;

  @ApiProperty({
    description: 'Fichiers associés',
    required: false,
    example: false,
  })
  @IsOptional()
  hasAssociatedFiles?: boolean;

  // ============================================
  // SECTION CHAMPS PERSONNALISÉS MÉTIER
  // ============================================

  @ApiProperty({
    description: 'Type de tâche',
    required: false,
  })
  @IsString()
  @IsOptional()
  customTaskType?: string;

  @ApiProperty({
    description: 'Thème',
    required: false,
  })
  @IsString()
  @IsOptional()
  customTheme?: string;

  @ApiProperty({
    description: 'Services',
    required: false,
  })
  @IsString()
  @IsOptional()
  customServices?: string;

  @ApiProperty({
    description: 'Activité',
    required: false,
  })
  @IsString()
  @IsOptional()
  customActivity?: string;

  @ApiProperty({
    description: 'Logiciel concerné',
    required: false,
  })
  @IsString()
  @IsOptional()
  customSoftware?: string;

  @ApiProperty({
    description: 'Fournisseur',
    required: false,
  })
  @IsString()
  @IsOptional()
  customSupplier?: string;

  @ApiProperty({
    description: 'Thème commercial',
    required: false,
  })
  @IsString()
  @IsOptional()
  customCommercialTheme?: string;

  @ApiProperty({
    description: 'Urgent',
    required: false,
    example: false,
  })
  @IsOptional()
  isUrgent?: boolean;

  @ApiProperty({
    description: 'Durée prévue (heures)',
    required: false,
    example: 4.0,
  })
  @IsNumber()
  @IsOptional()
  customPlannedDuration?: number;

  @ApiProperty({
    description: 'Temps réalisé client (heures)',
    required: false,
    example: 3.5,
  })
  @IsNumber()
  @IsOptional()
  customTimeClient?: number;

  @ApiProperty({
    description: 'Temps réalisé interne (heures)',
    required: false,
    example: 0.5,
  })
  @IsNumber()
  @IsOptional()
  customTimeInternal?: number;

  @ApiProperty({
    description: 'Temps réalisé trajet (heures)',
    required: false,
    example: 0.5,
  })
  @IsNumber()
  @IsOptional()
  customTimeTravel?: number;

  @ApiProperty({
    description: 'Temps réalisé relationnel (heures)',
    required: false,
    example: 0.2,
  })
  @IsNumber()
  @IsOptional()
  customTimeRelational?: number;

  // ============================================
  // SECTION INFORMATIONS COMPLÉMENTAIRES
  // ============================================

  @ApiProperty({
    description: 'ID sous-traitant',
    required: false,
  })
  @IsString()
  @IsOptional()
  subContractorId?: string;

  @ApiProperty({
    description: 'Nom du sous-traitant',
    required: false,
  })
  @IsString()
  @IsOptional()
  subContractorName?: string;

  @ApiProperty({
    description: 'ID créateur',
    required: false,
  })
  @IsString()
  @IsOptional()
  creatorColleagueId?: string;

  @ApiProperty({
    description: 'Nom du créateur',
    required: false,
  })
  @IsString()
  @IsOptional()
  creatorName?: string;
}

/**
 * DTO pour une intervention accompagnée de la distance depuis un point donné
 */
export class InterventionWithDistanceDto extends InterventionDto {
  @ApiProperty({
    description: 'Distance en kilomètres depuis la position courante',
    example: 3.5,
  })
  @IsNumber()
  distanceKm: number;
}

/**
 * DTO pour les statistiques technicien renvoyées au mobile
 */
export class TechnicianStatsDto {
  @ApiProperty({ description: 'Total interventions sur la période', example: 42 })
  @IsNumber()
  totalInterventions: number;

  @ApiProperty({ description: "Interventions complétées aujourd'hui", example: 3 })
  @IsNumber()
  completedToday: number;

  @ApiProperty({ description: 'Interventions dans les 24h', example: 5 })
  @IsNumber()
  upcoming24h: number;

  @ApiProperty({ description: 'Interventions en retard', example: 1 })
  @IsNumber()
  overdue: number;

  @ApiProperty({ description: 'Moyenne interventions par jour', example: 2.5 })
  @IsNumber()
  avgInterventionsPerDay: number;
}
