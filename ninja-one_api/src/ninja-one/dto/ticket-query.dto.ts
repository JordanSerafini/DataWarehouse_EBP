import { IsOptional, IsInt, IsString, IsDateString, IsIn, Min } from 'class-validator';
import { Type } from 'class-transformer';

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

  // Filtres par ID
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
  statusId?: number;

  // Filtres par texte
  @IsOptional()
  @IsString()
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
  search?: string; // Recherche dans title et description

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

  // Filtres booléens
  @IsOptional()
  @IsIn(['true', 'false'])
  isOverdue?: string;

  @IsOptional()
  @IsIn(['true', 'false'])
  isResolved?: string;

  @IsOptional()
  @IsIn(['true', 'false'])
  isClosed?: string;

  // Tri
  @IsOptional()
  @IsIn([
    'createdAt',
    'updatedAt',
    'priority',
    'status',
    'title',
    'ticketId',
  ])
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
