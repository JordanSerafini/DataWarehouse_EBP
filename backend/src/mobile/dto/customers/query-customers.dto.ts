import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO pour rechercher des clients à proximité GPS
 */
export class QueryNearbyCustomersDto {
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

/**
 * DTO pour rechercher des clients par nom/ville
 */
export class SearchCustomersDto {
  @ApiProperty({
    description: 'Texte de recherche (nom, ville, adresse)',
    example: 'Dupont',
    required: false,
  })
  @IsString()
  @IsOptional()
  query?: string;

  @ApiProperty({
    description: 'Filtrer par ville',
    example: 'Paris',
    required: false,
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({
    description: 'Filtrer par code postal',
    example: '75001',
    required: false,
  })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiProperty({
    description: 'Nombre maximum de résultats',
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
 * DTO pour les paramètres d'historique client
 */
export class QueryCustomerHistoryDto {
  @ApiProperty({
    description: 'Nombre maximum de résultats',
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
}
