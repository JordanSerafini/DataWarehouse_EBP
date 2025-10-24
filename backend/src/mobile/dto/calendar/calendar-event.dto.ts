import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDate, IsNumber, IsEnum, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Type d'événement calendrier
 */
export enum EventType {
  INTERVENTION = 'intervention',
  APPOINTMENT = 'appointment',
  MAINTENANCE = 'maintenance',
  MEETING = 'meeting',
  OTHER = 'other',
}

/**
 * Statut d'événement calendrier
 */
export enum EventStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled',
}

/**
 * DTO pour un événement calendrier
 */
export class CalendarEventDto {
  @ApiProperty({
    description: 'ID de l\'événement',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Titre de l\'événement',
    example: 'Intervention maintenance chaudière',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Description détaillée',
    example: 'Vérification annuelle chaudière gaz',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Date et heure de début',
    example: '2025-10-25T09:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  startDateTime: Date;

  @ApiProperty({
    description: 'Date et heure de fin',
    example: '2025-10-25T11:00:00Z',
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDateTime?: Date;

  @ApiProperty({
    description: 'Type d\'événement',
    enum: EventType,
    example: EventType.INTERVENTION,
  })
  @IsEnum(EventType)
  eventType: EventType;

  @ApiProperty({
    description: 'Statut de l\'événement',
    enum: EventStatus,
    example: EventStatus.PLANNED,
  })
  @IsEnum(EventStatus)
  status: EventStatus;

  @ApiProperty({
    description: 'ID du technicien assigné',
    example: 'TECH001',
    required: false,
  })
  @IsString()
  @IsOptional()
  colleagueId?: string;

  @ApiProperty({
    description: 'Nom du technicien assigné',
    example: 'Jean Dupont',
    required: false,
  })
  @IsString()
  @IsOptional()
  colleagueName?: string;

  @ApiProperty({
    description: 'ID du client',
    example: 'C001234',
    required: false,
  })
  @IsString()
  @IsOptional()
  customerId?: string;

  @ApiProperty({
    description: 'Nom du client',
    example: 'SARL Martin & Fils',
    required: false,
  })
  @IsString()
  @IsOptional()
  customerName?: string;

  @ApiProperty({
    description: 'Adresse complète formatée',
    example: '15 rue de la République, 75001 Paris',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'Ville',
    example: 'Paris',
    required: false,
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({
    description: 'Code postal',
    example: '75001',
    required: false,
  })
  @IsString()
  @IsOptional()
  zipcode?: string;

  @ApiProperty({
    description: 'Latitude GPS',
    example: 48.8566,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({
    description: 'Longitude GPS',
    example: 2.3522,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({
    description: 'ID du créateur de l\'événement',
    example: 'ADMIN01',
    required: false,
  })
  @IsString()
  @IsOptional()
  creatorId?: string;

  @ApiProperty({
    description: 'Date de création',
    example: '2025-10-20T14:30:00Z',
  })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    description: 'Date de dernière modification',
    example: '2025-10-24T10:15:00Z',
  })
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;
}

/**
 * DTO pour récupérer les événements avec filtres
 */
export class QueryCalendarEventsDto {
  @ApiProperty({
    description: 'Date de début de période (ISO 8601)',
    example: '2025-10-01T00:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({
    description: 'Date de fin de période (ISO 8601)',
    example: '2025-10-31T23:59:59Z',
  })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiProperty({
    description: 'Type d\'événement',
    enum: EventType,
    required: false,
  })
  @IsEnum(EventType)
  @IsOptional()
  eventType?: EventType;

  @ApiProperty({
    description: 'Statut',
    enum: EventStatus,
    required: false,
  })
  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;

  @ApiProperty({
    description: 'ID du technicien (filtre, optionnel)',
    example: 'TECH001',
    required: false,
  })
  @IsString()
  @IsOptional()
  colleagueId?: string;

  @ApiProperty({
    description: 'Limite de résultats',
    example: 50,
    required: false,
    default: 50,
  })
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiProperty({
    description: 'Offset pour pagination',
    example: 0,
    required: false,
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  offset?: number;
}

/**
 * DTO pour reprogrammer un événement
 */
export class RescheduleEventDto {
  @ApiProperty({
    description: 'Nouvelle date et heure de début',
    example: '2025-10-26T10:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  newStartDateTime: Date;

  @ApiProperty({
    description: 'Nouvelle date et heure de fin',
    example: '2025-10-26T12:00:00Z',
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  newEndDateTime?: Date;

  @ApiProperty({
    description: 'Raison de la reprogrammation',
    example: 'Client indisponible',
    required: false,
  })
  @IsString()
  @IsOptional()
  reason?: string;
}

/**
 * DTO pour statistiques calendrier
 */
export class CalendarStatsDto {
  @ApiProperty({
    description: 'Nombre total d\'événements',
    example: 25,
  })
  totalEvents: number;

  @ApiProperty({
    description: 'Événements planifiés',
    example: 15,
  })
  plannedEvents: number;

  @ApiProperty({
    description: 'Événements en cours',
    example: 3,
  })
  inProgressEvents: number;

  @ApiProperty({
    description: 'Événements complétés',
    example: 7,
  })
  completedEvents: number;

  @ApiProperty({
    description: 'Événements annulés',
    example: 0,
  })
  cancelledEvents: number;

  @ApiProperty({
    description: 'Temps total planifié (en heures)',
    example: 42.5,
  })
  totalPlannedHours: number;
}
