import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate, IsOptional, IsEnum } from 'class-validator';

/**
 * Types de documents de vente EBP
 */
export enum SaleDocumentType {
  DEVIS = 1,
  COMMANDE = 2,
  PREPARATION = 3,
  BON_LIVRAISON = 4,
  FACTURE = 6,
  AVOIR = 7,
  FACTURE_ACOMPTE = 8,
  RETOUR = 10,
}

/**
 * États de documents de vente
 */
export enum SaleDocumentState {
  BROUILLON = 0,
  VALIDE = 1,
  TRANSFERE = 2,
  ARCHIVE = 3,
}

/**
 * DTO pour un document de vente (devis, facture, etc.)
 */
export class SaleDocumentDto {
  @ApiProperty({ description: 'ID du document (UUID)' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Numéro du document', example: 'DEV20250123' })
  @IsString()
  documentNumber: string;

  @ApiProperty({
    description: 'Type de document',
    enum: SaleDocumentType,
    example: SaleDocumentType.DEVIS,
  })
  @IsEnum(SaleDocumentType)
  documentType: SaleDocumentType;

  @ApiProperty({ description: 'Libellé du type', example: 'Devis' })
  @IsString()
  documentTypeLabel: string;

  @ApiProperty({ description: 'Date du document' })
  @IsDate()
  documentDate: Date;

  @ApiProperty({ description: 'ID du client' })
  @IsString()
  @IsOptional()
  customerId?: string;

  @ApiProperty({ description: 'Nom du client' })
  @IsString()
  customerName: string;

  @ApiProperty({ description: 'Montant HT' })
  @IsNumber()
  amountExclTax: number;

  @ApiProperty({ description: 'Montant TTC' })
  @IsNumber()
  @IsOptional()
  amountInclTax?: number;

  @ApiProperty({
    description: 'État du document',
    enum: SaleDocumentState,
  })
  @IsEnum(SaleDocumentState)
  @IsOptional()
  documentState?: SaleDocumentState;

  @ApiProperty({ description: 'Commercial responsable (ID)' })
  @IsString()
  @IsOptional()
  salespersonId?: string;

  @ApiProperty({ description: 'Nom du commercial' })
  @IsString()
  @IsOptional()
  salespersonName?: string;

  @ApiProperty({ description: 'Date de création' })
  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @ApiProperty({ description: 'Date de modification' })
  @IsDate()
  @IsOptional()
  modifiedAt?: Date;
}

/**
 * DTO pour un devis avec informations étendues
 */
export class QuoteDto extends SaleDocumentDto {
  @ApiProperty({ description: 'Probabilité de gain (0-100%)' })
  @IsNumber()
  @IsOptional()
  wonProbability?: number;

  @ApiProperty({ description: 'État de validation' })
  @IsNumber()
  @IsOptional()
  validationState?: number;

  @ApiProperty({ description: 'Date de validité' })
  @IsDate()
  @IsOptional()
  validityDate?: Date;

  @ApiProperty({ description: 'Montant de remise' })
  @IsNumber()
  @IsOptional()
  discountAmount?: number;

  @ApiProperty({ description: 'Taux de remise (%)' })
  @IsNumber()
  @IsOptional()
  discountRate?: number;
}

/**
 * DTO pour statistiques de lignes de devis
 */
export class QuoteLinesStatsDto {
  @ApiProperty({ description: 'ID du devis' })
  @IsNumber()
  quoteId: number;

  @ApiProperty({ description: 'Numéro du devis' })
  @IsString()
  quoteNumber: string;

  @ApiProperty({ description: 'Nom du client' })
  @IsString()
  customerName: string;

  @ApiProperty({ description: 'Total HT' })
  @IsNumber()
  totalExclTax: number;

  @ApiProperty({ description: 'Nombre de lignes' })
  @IsNumber()
  linesCount: number;

  @ApiProperty({ description: 'A des lignes' })
  @IsString()
  hasLines: boolean;
}

/**
 * DTO pour une ligne de document
 */
export class SaleDocumentLineDto {
  @ApiProperty({ description: 'ID de la ligne' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'ID du document parent' })
  @IsString()
  documentId: string;

  @ApiProperty({ description: 'Numéro de ligne' })
  @IsNumber()
  lineNumber: number;

  @ApiProperty({ description: 'Description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Quantité' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: 'Prix unitaire HT' })
  @IsNumber()
  unitPriceExclTax: number;

  @ApiProperty({ description: 'Montant total HT' })
  @IsNumber()
  totalExclTax: number;

  @ApiProperty({ description: 'Taux de TVA (%)' })
  @IsNumber()
  @IsOptional()
  vatRate?: number;

  @ApiProperty({ description: 'ID du produit' })
  @IsString()
  @IsOptional()
  productId?: string;

  @ApiProperty({ description: 'Référence produit' })
  @IsString()
  @IsOptional()
  productReference?: string;
}

/**
 * DTO pour un document complet avec lignes
 */
export class SaleDocumentWithLinesDto extends SaleDocumentDto {
  @ApiProperty({
    description: 'Lignes du document',
    type: [SaleDocumentLineDto],
  })
  lines: SaleDocumentLineDto[];

  @ApiProperty({ description: 'Nombre de lignes' })
  @IsNumber()
  linesCount: number;
}
