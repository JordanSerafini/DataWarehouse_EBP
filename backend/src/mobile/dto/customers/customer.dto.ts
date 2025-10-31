import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsDate } from 'class-validator';

/**
 * DTO pour un client EBP
 */
export class CustomerDto {
  @ApiProperty({ description: 'ID du client (EBP)' })
  @IsString()
  customerId: string;

  @ApiProperty({ description: 'Nom du client' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Nom du contact' })
  @IsString()
  @IsOptional()
  contactName?: string;

  @ApiProperty({ description: 'Téléphone du contact' })
  @IsString()
  @IsOptional()
  contactPhone?: string;

  @ApiProperty({ description: 'Email du contact' })
  @IsString()
  @IsOptional()
  contactEmail?: string;

  @ApiProperty({ description: 'Adresse de livraison' })
  @IsString()
  @IsOptional()
  deliveryAddress?: string;

  @ApiProperty({ description: 'Ville de livraison' })
  @IsString()
  @IsOptional()
  deliveryCity?: string;

  @ApiProperty({ description: 'Code postal de livraison' })
  @IsString()
  @IsOptional()
  deliveryPostalCode?: string;

  @ApiProperty({ description: 'Latitude GPS' })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ description: 'Longitude GPS' })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({ description: 'Source GPS (manual, ebp, mobile)' })
  @IsString()
  @IsOptional()
  gpsProvider?: string;

  @ApiProperty({ description: 'Qualité GPS (0-1)' })
  @IsNumber()
  @IsOptional()
  gpsQuality?: number;

  @ApiProperty({ description: 'Date de création' })
  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @ApiProperty({ description: 'Date de modification' })
  @IsDate()
  @IsOptional()
  modifiedAt?: Date;

  // ============================================================================
  // DONNÉES FINANCIÈRES (visibles uniquement pour bureau/commerciaux/admin)
  // ============================================================================

  @ApiProperty({
    description: 'Encours autorisé (limite crédit)',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  allowedAmount?: number;

  @ApiProperty({
    description: 'Encours actuel (montant dû)',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  currentAmount?: number;

  @ApiProperty({
    description: 'Montant de dépassement',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  exceedAmount?: number;

  @ApiProperty({
    description: 'Statut actif (0=actif, 1=inactif)',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  activeState?: number;

  @ApiProperty({
    description: 'ID du commercial assigné',
    required: false,
  })
  @IsString()
  @IsOptional()
  colleagueId?: string;
}

/**
 * DTO pour un client à proximité (avec distance)
 */
export class NearbyCustomerDto extends CustomerDto {
  @ApiProperty({ description: 'Distance en km', example: 2.5 })
  @IsNumber()
  distanceKm: number;
}

/**
 * DTO pour l'historique d'un client
 */
export class CustomerHistoryItemDto {
  @ApiProperty({ description: 'ID de l\'intervention' })
  @IsString()
  interventionId: string;

  @ApiProperty({ description: 'Titre de l\'intervention' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Date de début' })
  @IsDate()
  startDate: Date;

  @ApiProperty({ description: 'Date de fin' })
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @ApiProperty({ description: 'Nom du technicien' })
  @IsString()
  @IsOptional()
  technicianName?: string;

  @ApiProperty({ description: 'Description du produit/service' })
  @IsString()
  @IsOptional()
  productDescription?: string;

  @ApiProperty({ description: 'Date de création' })
  @IsDate()
  createdAt: Date;
}

/**
 * DTO pour les statistiques de documents d'un client
 */
export class CustomerDocumentStatsDto {
  @ApiProperty({ description: 'Type de document (Devis, Facture, etc.)' })
  @IsString()
  documentTypeLabel: string;

  @ApiProperty({ description: 'Nombre de documents' })
  @IsNumber()
  documentCount: number;

  @ApiProperty({ description: 'Montant total' })
  @IsNumber()
  totalAmount: number;
}

/**
 * DTO pour un résumé client (historique + stats)
 */
export class CustomerSummaryDto {
  @ApiProperty({ description: 'Informations client', type: CustomerDto })
  customer: CustomerDto;

  @ApiProperty({
    description: 'Historique interventions (5 dernières)',
    type: [CustomerHistoryItemDto],
  })
  recentInterventions: CustomerHistoryItemDto[];

  @ApiProperty({
    description: 'Statistiques documents',
    type: [CustomerDocumentStatsDto],
  })
  documentStats: CustomerDocumentStatsDto[];

  @ApiProperty({ description: 'Nombre total d\'interventions' })
  @IsNumber()
  totalInterventions: number;

  @ApiProperty({ description: 'Montant total facturé' })
  @IsNumber()
  totalRevenue: number;

  // ============================================================================
  // DONNÉES D'ACTIVITÉ & INSIGHTS
  // ============================================================================

  @ApiProperty({
    description: 'Date de la dernière intervention',
    required: false,
  })
  @IsDate()
  @IsOptional()
  lastInterventionDate?: Date;

  @ApiProperty({
    description: 'Nombre de jours depuis la dernière intervention',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  daysSinceLastIntervention?: number;

  @ApiProperty({
    description: 'Score de santé client (0-100)',
    example: 85,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  customerHealthScore?: number;
}
