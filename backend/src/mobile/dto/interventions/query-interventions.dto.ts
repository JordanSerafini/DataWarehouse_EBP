import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsDate, IsString, IsEnum, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO pour query parameters des interventions
 */
export class QueryInterventionsDto {
  @ApiProperty({ description: 'Date de début (format ISO)', example: '2025-10-01T00:00:00Z', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateFrom?: Date;

  @ApiProperty({ description: 'Date de fin (format ISO)', example: '2025-10-31T23:59:59Z', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateTo?: Date;

  @ApiProperty({ description: 'Filtrer par statut', example: 1, enum: [0, 1, 2, 3, 4, 9], required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  status?: number;

  @ApiProperty({ description: 'ID du technicien (si admin)', example: 'TECH01', required: false })
  @IsOptional()
  @IsString()
  technicianId?: string;

  @ApiProperty({ description: 'Limite résultats', example: 50, default: 50, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(200)
  limit?: number = 50;

  @ApiProperty({ description: 'Offset pour pagination', example: 0, default: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  offset?: number = 0;
}

/**
 * DTO pour query interventions à proximité
 */
export class QueryNearbyInterventionsDto {
  @ApiProperty({ description: 'Latitude position actuelle', example: 48.8566, required: true })
  @IsNumber()
  @Type(() => Number)
  latitude: number;

  @ApiProperty({ description: 'Longitude position actuelle', example: 2.3522, required: true })
  @IsNumber()
  @Type(() => Number)
  longitude: number;

  @ApiProperty({ description: 'Rayon de recherche en km', example: 50, default: 50, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(200)
  radiusKm?: number = 50;

  @ApiProperty({ description: 'Limite résultats', example: 20, default: 20, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiProperty({ description: 'Filtrer par technicien', required: false })
  @IsOptional()
  @IsString()
  technicianId?: string;
}
