import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsEnum, IsArray, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { SaleDocumentType } from './document.dto';

/**
 * DTO pour rechercher des documents récents
 */
export class QueryRecentDocumentsDto {
  @ApiProperty({
    description: 'Types de documents (1=Devis, 6=Facture, 7=Avoir, etc.)',
    example: [1, 6],
    required: false,
    type: [Number],
  })
  @IsArray()
  @IsOptional()
  @Type(() => Number)
  documentTypes?: number[];

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
}

/**
 * DTO pour récupérer les devis d'un commercial
 */
export class QueryQuotesForSalespersonDto {
  @ApiProperty({
    description: 'Nombre de jours en arrière',
    example: 180,
    default: 180,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(730)
  @Type(() => Number)
  daysBack?: number;
}

/**
 * DTO pour rechercher des documents par critères
 */
export class SearchDocumentsDto {
  @ApiProperty({
    description: 'Type de document',
    enum: SaleDocumentType,
    required: false,
  })
  @IsEnum(SaleDocumentType)
  @IsOptional()
  @Type(() => Number)
  documentType?: SaleDocumentType;

  @ApiProperty({
    description: 'ID du client',
    required: false,
  })
  @IsOptional()
  customerId?: string;

  @ApiProperty({
    description: 'ID du commercial',
    required: false,
  })
  @IsOptional()
  salespersonId?: string;

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
