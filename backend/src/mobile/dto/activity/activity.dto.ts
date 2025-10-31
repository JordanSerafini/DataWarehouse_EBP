import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDate, IsNumber, IsInt, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Catégories d'activité EBP
 */
export enum ActivityCategory {
  TASK = 0,
  APPOINTMENT = 1,
  PHONE_CALL = 2,
  EMAIL = 3,
  MEETING = 4,
  NOTE = 5,
  DOCUMENT = 8,
  OTHER = 99,
}

/**
 * États d'activité
 */
export enum ActivityState {
  TODO = 0,
  IN_PROGRESS = 1,
  COMPLETED = 2,
  CANCELLED = 3,
}

/**
 * Labels français pour catégories
 */
export const ACTIVITY_CATEGORY_LABELS: Record<number, string> = {
  0: 'Tâche',
  1: 'Rendez-vous',
  2: 'Appel téléphonique',
  3: 'Email',
  4: 'Réunion',
  5: 'Note',
  8: 'Document',
  99: 'Autre',
};

/**
 * Labels français pour états
 */
export const ACTIVITY_STATE_LABELS: Record<number, string> = {
  0: 'À faire',
  1: 'En cours',
  2: 'Terminé',
  3: 'Annulé',
};

/**
 * DTO pour une activité
 */
export class ActivityDto {
  @ApiProperty({
    description: 'ID de l\'activité',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Titre/Caption de l\'activité',
    example: 'Appel client pour devis',
  })
  @IsString()
  caption: string;

  @ApiProperty({
    description: 'Catégorie d\'activité',
    example: 2,
    enum: ActivityCategory,
  })
  @IsNumber()
  activityCategory: number;

  @ApiProperty({
    description: 'Label catégorie',
    example: 'Appel téléphonique',
  })
  @IsString()
  categoryLabel: string;

  @ApiProperty({
    description: 'État de l\'activité',
    example: 2,
    enum: ActivityState,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  eventState?: number;

  @ApiProperty({
    description: 'Label état',
    example: 'Terminé',
    required: false,
  })
  @IsString()
  @IsOptional()
  stateLabel?: string;

  @ApiProperty({
    description: 'Date de début',
    example: '2025-10-24T09:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  startDateTime: Date;

  @ApiProperty({
    description: 'Date de fin',
    example: '2025-10-24T10:00:00Z',
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDateTime?: Date;

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
    description: 'ID du contact',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsString()
  @IsOptional()
  contactId?: string;

  @ApiProperty({
    description: 'Nom du contact',
    example: 'Jean Dupont',
    required: false,
  })
  @IsString()
  @IsOptional()
  contactName?: string;

  @ApiProperty({
    description: 'Email du contact',
    example: 'jean.dupont@example.com',
    required: false,
  })
  @IsString()
  @IsOptional()
  contactEmail?: string;

  @ApiProperty({
    description: 'Téléphone du contact',
    example: '0612345678',
    required: false,
  })
  @IsString()
  @IsOptional()
  contactPhone?: string;

  @ApiProperty({
    description: 'ID du collaborateur assigné',
    example: 'TECH001',
    required: false,
  })
  @IsString()
  @IsOptional()
  colleagueId?: string;

  @ApiProperty({
    description: 'ID du créateur',
    example: 'ADMIN01',
    required: false,
  })
  @IsString()
  @IsOptional()
  creatorColleagueId?: string;

  @ApiProperty({
    description: 'Nom complet du créateur',
    example: 'Jean Dupont',
    required: false,
  })
  @IsString()
  @IsOptional()
  creatorName?: string;

  @ApiProperty({
    description: 'ID du document lié',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsString()
  @IsOptional()
  saleDocumentId?: string;

  @ApiProperty({
    description: 'ID de l\'événement lié',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsString()
  @IsOptional()
  scheduleEventId?: string;

  @ApiProperty({
    description: 'ID de l\'affaire liée',
    example: 'DEAL001',
    required: false,
  })
  @IsString()
  @IsOptional()
  dealId?: string;

  @ApiProperty({
    description: 'Notes (texte clair)',
    example: 'Client intéressé par notre offre premium',
    required: false,
  })
  @IsString()
  @IsOptional()
  notesClear?: string;

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
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  updatedAt?: Date;
}

/**
 * DTO pour récupérer l'historique d'activités
 */
export class QueryActivityHistoryDto {
  @ApiProperty({
    description: 'ID de l\'entité (client, projet, etc.)',
    example: 'C001234',
    required: true,
  })
  @IsString()
  entityId: string;

  @ApiProperty({
    description: 'Type d\'entité',
    example: 'customer',
    enum: ['customer', 'project', 'deal', 'supplier'],
    required: false,
    default: 'customer',
  })
  @IsString()
  @IsOptional()
  entityType?: string;

  @ApiProperty({
    description: 'Filtre par catégorie',
    enum: ActivityCategory,
    required: false,
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  category?: number;

  @ApiProperty({
    description: 'Limite de résultats',
    example: 50,
    required: false,
    default: 50,
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    description: 'Offset pour pagination',
    example: 0,
    required: false,
    default: 0,
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  offset?: number;
}

/**
 * DTO pour les statistiques d'activités
 */
export class ActivityStatsDto {
  @ApiProperty({
    description: 'Nombre total d\'activités',
    example: 156,
  })
  totalActivities: number;

  @ApiProperty({
    description: 'Activités par catégorie',
    example: { phone_call: 45, email: 32, meeting: 15 },
  })
  byCategory: Record<string, number>;

  @ApiProperty({
    description: 'Dernière activité',
    example: '2025-10-24T10:15:00Z',
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  lastActivityDate?: Date;

  @ApiProperty({
    description: 'Activité la plus fréquente',
    example: 'Appel téléphonique',
  })
  mostFrequentType: string;
}

/**
 * DTO pour créer une note/activité
 */
export class CreateActivityDto {
  @ApiProperty({
    description: 'Titre/Caption de l\'activité',
    example: 'Note intervention du 31/10/2025',
  })
  @IsString()
  caption: string;

  @ApiProperty({
    description: 'Catégorie d\'activité',
    example: 5,
    enum: ActivityCategory,
    default: ActivityCategory.NOTE,
  })
  @IsEnum(ActivityCategory)
  activityCategory: ActivityCategory;

  @ApiProperty({
    description: 'Notes (texte clair)',
    example: 'Client satisfait de l\'intervention. RAS.',
  })
  @IsString()
  notesClear: string;

  @ApiProperty({
    description: 'ID de l\'intervention liée (ScheduleEventId)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsString()
  @IsOptional()
  scheduleEventId?: string;

  @ApiProperty({
    description: 'ID du client',
    example: 'C001234',
    required: false,
  })
  @IsString()
  @IsOptional()
  customerId?: string;

  @ApiProperty({
    description: 'ID du collaborateur assigné',
    example: 'TECH001',
    required: false,
  })
  @IsString()
  @IsOptional()
  colleagueId?: string;

  @ApiProperty({
    description: 'ID de l\'affaire liée',
    example: 'DEAL001',
    required: false,
  })
  @IsString()
  @IsOptional()
  dealId?: string;

  @ApiProperty({
    description: 'Date de début (défaut: maintenant)',
    example: '2025-10-31T14:30:00Z',
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDateTime?: Date;

  @ApiProperty({
    description: 'Date de fin',
    example: '2025-10-31T15:00:00Z',
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDateTime?: Date;
}
