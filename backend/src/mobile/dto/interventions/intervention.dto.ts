import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsNumber, IsOptional, IsArray } from 'class-validator';

/**
 * DTO pour une intervention (lecture)
 * Correspond à la structure retournée par get_technician_interventions()
 */
export class InterventionDto {
  @ApiProperty({ description: 'ID de l\'intervention (UUID)', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsString()
  interventionId: string;

  @ApiProperty({ description: 'Titre de l\'intervention', example: 'Maintenance climatisation' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Description détaillée', example: 'Contrôle annuel climatisation + nettoyage filtres', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Nom du client', example: 'ACME Corp' })
  @IsString()
  customerName: string;

  @ApiProperty({ description: 'Téléphone contact', example: '+33 6 12 34 56 78', required: false })
  @IsString()
  @IsOptional()
  contactPhone?: string;

  @ApiProperty({ description: 'Adresse complète', example: '123 rue de la Paix, 75001 Paris', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ description: 'Ville', example: 'Paris', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ description: 'Latitude GPS', example: 48.8566, required: false })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ description: 'Longitude GPS', example: 2.3522, required: false })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({ description: 'Date/heure de début', example: '2025-10-24T09:00:00Z' })
  @IsDate()
  startDate: Date;

  @ApiProperty({ description: 'Date/heure de fin', example: '2025-10-24T12:00:00Z', required: false })
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @ApiProperty({ description: 'Description produit/équipement concerné', example: 'Climatisation Daikin 12000 BTU', required: false })
  @IsString()
  @IsOptional()
  productDescription?: string;

  @ApiProperty({ description: 'Statut de l\'intervention', example: 1, enum: [0, 1, 2, 3, 4, 9] })
  @IsNumber()
  @IsOptional()
  status?: number;

  @ApiProperty({ description: 'Temps estimé (heures)', example: 2.5, required: false })
  @IsNumber()
  @IsOptional()
  estimatedDuration?: number;

  @ApiProperty({ description: 'Temps réalisé (heures)', example: 2.75, required: false })
  @IsNumber()
  @IsOptional()
  achievedDuration?: number;

  @ApiProperty({ description: 'Notes/Rapport', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

/**
 * DTO pour une intervention avec distance (résultat de get_nearby_interventions)
 */
export class InterventionWithDistanceDto extends InterventionDto {
  @ApiProperty({ description: 'Distance en km depuis position actuelle', example: 3.5 })
  @IsNumber()
  distanceKm: number;
}

/**
 * DTO pour les statistiques technicien
 * Correspond à get_technician_stats()
 */
export class TechnicianStatsDto {
  @ApiProperty({ description: 'Total interventions sur la période', example: 42 })
  @IsNumber()
  totalInterventions: number;

  @ApiProperty({ description: 'Interventions complétées aujourd\'hui', example: 3 })
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
