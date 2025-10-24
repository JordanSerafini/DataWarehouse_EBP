import { IsOptional, IsInt, IsString, IsDateString, IsIn, Min, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class TicketQueryDto {
  // Pagination
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 50;

  // Filtres par ID (relations)
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  organizationId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  assignedTechnicianId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  createdByTechnicianId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  deviceId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  locationId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  statusId?: number;

  // Filtres par nom de statut (via JSONB)
  @IsOptional()
  @IsString()
  statusName?: string; // Ex: "Nouveau", "Fermé", "Ouvert"

  // Filtres par texte
  @IsOptional()
  @IsIn(['NONE', 'LOW', 'MEDIUM', 'HIGH', 'URGENT', 'CRITICAL'])
  priority?: string;

  @IsOptional()
  @IsString()
  severity?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  channel?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  ticketType?: string;

  @IsOptional()
  @IsString()
  search?: string; // Recherche full-text dans title et description

  @IsOptional()
  @IsString()
  requesterName?: string; // Filtrer par nom du demandeur

  // Filtres par date
  @IsOptional()
  @IsDateString()
  createdAfter?: string;

  @IsOptional()
  @IsDateString()
  createdBefore?: string;

  @IsOptional()
  @IsDateString()
  updatedAfter?: string;

  @IsOptional()
  @IsDateString()
  updatedBefore?: string;

  @IsOptional()
  @IsDateString()
  resolvedAfter?: string;

  @IsOptional()
  @IsDateString()
  resolvedBefore?: string;

  @IsOptional()
  @IsDateString()
  closedAfter?: string;

  @IsOptional()
  @IsDateString()
  closedBefore?: string;

  @IsOptional()
  @IsDateString()
  dueAfter?: string;

  @IsOptional()
  @IsDateString()
  dueBefore?: string;

  // Filtres booléens
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isOverdue?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isResolved?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isClosed?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  hasComments?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  hasAttachments?: boolean;

  // Filtre spécial : tickets non assignés (cas d'usage important !)
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  unassigned?: boolean;

  // Filtre par tags (JSONB array)
  @IsOptional()
  @IsString()
  tag?: string; // Un tag spécifique à rechercher

  // Tri
  @IsOptional()
  @IsIn([
    'createdAt',
    'updatedAt',
    'resolvedAt',
    'closedAt',
    'dueDate',
    'priority',
    'title',
    'ticketId',
    'timeSpentSeconds',
    'timeToResolutionSeconds',
  ])
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  // Options d'inclusion des relations
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  includeOrganization?: boolean = true;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  includeTechnicians?: boolean = true;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  includeDevice?: boolean = false;
}
