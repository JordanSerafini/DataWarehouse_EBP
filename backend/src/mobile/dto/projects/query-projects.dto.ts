import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProjectState } from './project.dto';

/**
 * DTO pour rechercher des projets
 */
export class QueryProjectsDto {
  @ApiProperty({
    description: 'ID du responsable',
    required: false,
  })
  @IsString()
  @IsOptional()
  managerId?: string;

  @ApiProperty({
    description: 'États de projets',
    enum: ProjectState,
    isArray: true,
    required: false,
  })
  @IsArray()
  @IsEnum(ProjectState, { each: true })
  @IsOptional()
  @Type(() => Number)
  states?: ProjectState[];

  @ApiProperty({
    description: 'ID du client',
    required: false,
  })
  @IsString()
  @IsOptional()
  customerId?: string;

  @ApiProperty({
    description: 'Date de début (YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  dateFrom?: string;

  @ApiProperty({
    description: 'Date de fin (YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  dateTo?: string;

  @ApiProperty({
    description: 'Nombre de résultats',
    example: 50,
    default: 50,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(200)
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    description: 'Décalage pour pagination',
    example: 0,
    default: 0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number;
}

/**
 * DTO pour rechercher des projets à proximité GPS
 */
export class QueryNearbyProjectsDto {
  @ApiProperty({
    description: 'Latitude GPS',
    example: 48.8566,
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  latitude: number;

  @ApiProperty({
    description: 'Longitude GPS',
    example: 2.3522,
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  longitude: number;

  @ApiProperty({
    description: 'Rayon de recherche en km',
    example: 50,
    default: 50,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(200)
  @Type(() => Number)
  radiusKm?: number;

  @ApiProperty({
    description: 'États de projets à inclure',
    enum: ProjectState,
    isArray: true,
    required: false,
  })
  @IsArray()
  @IsEnum(ProjectState, { each: true })
  @IsOptional()
  @Type(() => Number)
  states?: ProjectState[];

  @ApiProperty({
    description: 'Nombre maximum de résultats',
    example: 20,
    default: 20,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number;
}
