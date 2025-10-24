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
