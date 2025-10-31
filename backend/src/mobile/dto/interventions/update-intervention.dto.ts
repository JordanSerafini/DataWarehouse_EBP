import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsDate, IsEnum } from 'class-validator';

/**
 * Statuts possibles pour une intervention
 */
export enum InterventionStatus {
  PLANNED = 0,
  CONFIRMED = 1,
  IN_PROGRESS = 2,
  ON_HOLD = 3,
  COMPLETED = 4,
  CANCELLED = 9,
}

/**
 * DTO pour mettre à jour une intervention
 */
export class UpdateInterventionDto {
  @ApiProperty({ description: 'Nouveau statut', enum: InterventionStatus, required: false })
  @IsEnum(InterventionStatus)
  @IsOptional()
  status?: InterventionStatus;

  @ApiProperty({ description: 'Notes/Rapport d\'intervention', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ description: 'Date/heure de début effective', required: false })
  @IsDate()
  @IsOptional()
  actualStartDate?: Date;

  @ApiProperty({ description: 'Date/heure de fin effective', required: false })
  @IsDate()
  @IsOptional()
  actualEndDate?: Date;

  @ApiProperty({ description: 'Temps passé en heures', example: 2.5, required: false })
  @IsNumber()
  @IsOptional()
  achievedDuration?: number;

  @ApiProperty({ description: 'Date planifiée (ISO 8601)', required: false })
  @IsString()
  @IsOptional()
  scheduledDate?: string;

  @ApiProperty({ description: 'ID technicien assigné', required: false })
  @IsString()
  @IsOptional()
  technicianId?: string;

  @ApiProperty({ description: 'Nom technicien assigné', required: false })
  @IsString()
  @IsOptional()
  technicianName?: string;
}

/**
 * DTO pour démarrer une intervention
 */
export class StartInterventionDto {
  @ApiProperty({ description: 'Latitude GPS au démarrage', example: 48.8566, required: false })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ description: 'Longitude GPS au démarrage', example: 2.3522, required: false })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({ description: 'Notes de démarrage', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

/**
 * DTO pour clôturer une intervention
 */
export class CompleteInterventionDto {
  @ApiProperty({ description: 'Rapport d\'intervention final', required: true })
  @IsString()
  report: string;

  @ApiProperty({ description: 'Temps passé total en heures', example: 2.75, required: true })
  @IsNumber()
  timeSpentHours: number;

  @ApiProperty({ description: 'Temps de déplacement en heures', example: 0.5, required: false })
  @IsNumber()
  @IsOptional()
  travelDuration?: number;

  @ApiProperty({ description: 'Latitude GPS à la fin', required: false })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ description: 'Longitude GPS à la fin', required: false })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({ description: 'Intervention réussie', example: true })
  @IsOptional()
  success?: boolean;
}

/**
 * DTO pour créer un timesheet (temps passé)
 */
export class CreateTimesheetDto {
  @ApiProperty({ description: 'ID intervention', required: true })
  @IsString()
  interventionId: string;

  @ApiProperty({ description: 'Date', required: true })
  @IsDate()
  date: Date;

  @ApiProperty({ description: 'Heures travaillées', example: 2.5, required: true })
  @IsNumber()
  hoursWorked: number;

  @ApiProperty({ description: 'Description travail effectué', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Type de temps (normal, heures sup, etc.)', required: false })
  @IsString()
  @IsOptional()
  timeType?: string;
}
