import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from './database.service';
import {
  SaleDocumentDto,
  QuoteDto,
  QuoteLinesStatsDto,
  SaleDocumentLineDto,
  SaleDocumentWithLinesDto,
  SaleDocumentType,
} from '../dto/sales/document.dto';
import {
  QueryRecentDocumentsDto,
  QueryQuotesForSalespersonDto,
  SearchDocumentsDto,
} from '../dto/sales/query-documents.dto';

/**
 * Interface pour les documents récents depuis mobile.get_recent_documents
 */
interface RecentDocumentRow {
  id: string;
  documentNumber: string;
  documentTypeLabel: string;
  documentDate: Date;
  customerName: string;
  amountExclTax: string;
  documentState: number;
}

/**
 * Interface pour les devis d'un commercial depuis mobile.get_quotes_for_salesperson
 */
interface QuoteForSalespersonRow {
  id: number;
  quoteNumber: string;
  quoteDate: Date;
  customerName: string;
  totalInclTax: string;
  state: number;
  wonProbability: number | null;
}

/**
 * Interface pour les stats des lignes de devis depuis mobile.get_quote_lines_stats
 */
interface QuoteLinesStatsRow {
  quoteId: string;
  quoteNumber: string;
  customerName: string;
  totalExclTax: string;
  linesCount: number;
  hasLines: boolean;
}

/**
 * Interface pour les documents depuis SaleDocument
 */
interface SaleDocumentRow {
  id: string;
  documentNumber: string;
  documentType: SaleDocumentType;
  documentDate: Date;
  customerId: string;
  customerName: string;
  amountExclTax: string;
  amountInclTax: string;
  documentState: number;
  createdAt: Date;
  modifiedAt?: Date;
}

/**
 * Interface pour les lignes de documents depuis SaleDocumentLine
 */
interface SaleDocumentLineRow {
  id: string;
  documentId: string;
  lineNumber: number;
  description: string;
  quantity: string;
  unitPriceExclTax: string;
  totalExclTax: string;
  vatRate: string | null;
  productId: string | null;
  productReference: string | null;
}

@Injectable()
export class SalesService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Récupère les documents récents (tous types ou filtrés)
   */
  async getRecentDocuments(
    query: QueryRecentDocumentsDto,
  ): Promise<SaleDocumentDto[]> {
    const limit = query.limit || 50;
    const documentTypes = query.documentTypes || null;

    const result = await this.databaseService.query<RecentDocumentRow>(
      `SELECT
        id,
        document_number AS "documentNumber",
        document_type_label AS "documentTypeLabel",
        document_date AS "documentDate",
        customer_name AS "customerName",
        amount_excl_tax AS "amountExclTax",
        document_state AS "documentState"
       FROM mobile.get_recent_documents($1::int[], $2)`,
      [documentTypes, limit],
    );

    return result.rows.map((row) => ({
      id: row.id,
      documentNumber: row.documentNumber,
      documentType: this.getDocumentTypeFromLabel(row.documentTypeLabel),
      documentTypeLabel: row.documentTypeLabel,
      documentDate: row.documentDate,
      customerName: row.customerName,
      amountExclTax: Number(row.amountExclTax),
      documentState: row.documentState,
    }));
  }

  /**
   * Récupère les devis d'un commercial
   */
  async getQuotesForSalesperson(
    salespersonId: string,
    query: QueryQuotesForSalespersonDto,
  ): Promise<QuoteDto[]> {
    const daysBack = query.daysBack || 180;

    const result = await this.databaseService.query<QuoteForSalespersonRow>(
      `SELECT
        id,
        quote_number AS "quoteNumber",
        quote_date AS "quoteDate",
        customer_name AS "customerName",
        total_incl_tax AS "totalInclTax",
        state,
        won_probability AS "wonProbability"
       FROM mobile.get_quotes_for_salesperson($1, $2)`,
      [salespersonId, daysBack],
    );

    return result.rows.map((row) => ({
      id: row.id.toString(),
      documentNumber: row.quoteNumber,
      documentType: SaleDocumentType.DEVIS,
      documentTypeLabel: 'Devis',
      documentDate: row.quoteDate,
      customerName: row.customerName,
      amountExclTax: 0, // Not provided in this function
      amountInclTax: Number(row.totalInclTax),
      documentState: row.state,
      wonProbability: row.wonProbability,
    }));
  }

  /**
   * Récupère les statistiques des lignes de devis
   */
  async getQuoteLinesStats(): Promise<QuoteLinesStatsDto[]> {
    const result = await this.databaseService.query<QuoteLinesStatsRow>(
      `SELECT
        quote_id AS "quoteId",
        quote_number AS "quoteNumber",
        customer_name AS "customerName",
        total_excl_tax AS "totalExclTax",
        lines_count AS "linesCount",
        has_lines AS "hasLines"
       FROM mobile.get_quote_lines_stats()`,
    );

    return result.rows.map((row) => ({
      quoteId: row.quoteId,
      quoteNumber: row.quoteNumber,
      customerName: row.customerName,
      totalExclTax: Number(row.totalExclTax),
      linesCount: row.linesCount,
      hasLines: row.hasLines,
    }));
  }

  /**
   * Récupère un document par son ID
   */
  async getDocumentById(documentId: string): Promise<SaleDocumentDto> {
    const result = await this.databaseService.query<SaleDocumentRow>(
      `SELECT
        sd."Id" AS "id",
        sd."DocumentNumber" AS "documentNumber",
        sd."DocumentType" AS "documentType",
        sd."DocumentDate" AS "documentDate",
        sd."CustomerId" AS "customerId",
        sd."CustomerName" AS "customerName",
        sd."AmountVatExcluded" AS "amountExclTax",
        sd."AmountVatIncluded" AS "amountInclTax",
        sd."DocumentState" AS "documentState",
        sd."sysCreatedDate" AS "createdAt",
        sd."sysModifiedDate" AS "modifiedAt"
       FROM public."SaleDocument" sd
       WHERE sd."Id" = $1`,
      [documentId],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Document ${documentId} non trouvé`);
    }

    const row = result.rows[0];
    return {
      id: row.id,
      documentNumber: row.documentNumber,
      documentType: row.documentType,
      documentTypeLabel: this.getDocumentTypeLabel(row.documentType),
      documentDate: row.documentDate,
      customerId: row.customerId,
      customerName: row.customerName,
      amountExclTax: Number(row.amountExclTax),
      amountInclTax: Number(row.amountInclTax),
      documentState: row.documentState,
      createdAt: row.createdAt,
      modifiedAt: row.modifiedAt,
    };
  }

  /**
   * Récupère un document avec ses lignes
   */
  async getDocumentWithLines(
    documentId: string,
  ): Promise<SaleDocumentWithLinesDto> {
    // Récupère le document
    const document = await this.getDocumentById(documentId);

    // Récupère les lignes
    const linesResult = await this.databaseService.query<SaleDocumentLineRow>(
      `SELECT
        "Id" AS "id",
        "DocumentId" AS "documentId",
        "LineNumber" AS "lineNumber",
        "Description" AS "description",
        "Quantity" AS "quantity",
        "UnitPrice" AS "unitPriceExclTax",
        "TotalAmountVatExcluded" AS "totalExclTax",
        "VatRate" AS "vatRate",
        "Item" AS "productId",
        "ItemReference" AS "productReference"
       FROM public."SaleDocumentLine"
       WHERE "DocumentId" = $1
       ORDER BY "LineNumber"`,
      [documentId],
    );

    const lines: SaleDocumentLineDto[] = linesResult.rows.map((row) => ({
      id: row.id,
      documentId: row.documentId,
      lineNumber: row.lineNumber,
      description: row.description,
      quantity: Number(row.quantity),
      unitPriceExclTax: Number(row.unitPriceExclTax),
      totalExclTax: Number(row.totalExclTax),
      vatRate: row.vatRate ? Number(row.vatRate) : undefined,
      productId: row.productId,
      productReference: row.productReference,
    }));

    return {
      ...document,
      lines,
      linesCount: lines.length,
    };
  }

  /**
   * Recherche de documents par critères
   */
  async searchDocuments(query: SearchDocumentsDto): Promise<SaleDocumentDto[]> {
    const limit = query.limit || 50;
    const offset = query.offset || 0;

    // Construction de la clause WHERE dynamique
    const conditions: string[] = [];
    const params: (string | number | Date)[] = [];
    let paramIndex = 1;

    if (query.documentType !== undefined) {
      conditions.push(`sd."DocumentType" = $${paramIndex}`);
      params.push(query.documentType);
      paramIndex++;
    }

    if (query.customerId) {
      conditions.push(`sd."CustomerId" = $${paramIndex}`);
      params.push(query.customerId);
      paramIndex++;
    }

    if (query.salespersonId) {
      conditions.push(`sd."SalespersonId" = $${paramIndex}`);
      params.push(query.salespersonId);
      paramIndex++;
    }

    if (query.dateFrom) {
      conditions.push(`sd."DocumentDate" >= $${paramIndex}`);
      params.push(query.dateFrom);
      paramIndex++;
    }

    if (query.dateTo) {
      conditions.push(`sd."DocumentDate" <= $${paramIndex}`);
      params.push(query.dateTo);
      paramIndex++;
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    params.push(limit, offset);

    const result = await this.databaseService.query<SaleDocumentRow>(
      `SELECT
        sd."Id" AS "id",
        sd."DocumentNumber" AS "documentNumber",
        sd."DocumentType" AS "documentType",
        sd."DocumentDate" AS "documentDate",
        sd."CustomerId" AS "customerId",
        sd."CustomerName" AS "customerName",
        sd."AmountVatExcluded" AS "amountExclTax",
        sd."AmountVatIncluded" AS "amountInclTax",
        sd."DocumentState" AS "documentState",
        sd."sysCreatedDate" AS "createdAt"
       FROM public."SaleDocument" sd
       ${whereClause}
       ORDER BY sd."DocumentDate" DESC, sd."DocumentNumber" DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      params,
    );

    return result.rows.map((row) => ({
      id: row.id,
      documentNumber: row.documentNumber,
      documentType: row.documentType,
      documentTypeLabel: this.getDocumentTypeLabel(row.documentType),
      documentDate: row.documentDate,
      customerId: row.customerId,
      customerName: row.customerName,
      amountExclTax: Number(row.amountExclTax),
      amountInclTax: Number(row.amountInclTax),
      documentState: row.documentState,
      createdAt: row.createdAt,
    }));
  }

  /**
   * Helper: Convertit le type de document en label
   */
  private getDocumentTypeLabel(type: SaleDocumentType): string {
    const labels: Record<SaleDocumentType, string> = {
      [SaleDocumentType.DEVIS]: 'Devis',
      [SaleDocumentType.COMMANDE]: 'Commande',
      [SaleDocumentType.PREPARATION]: 'Préparation',
      [SaleDocumentType.BON_LIVRAISON]: 'Bon de livraison',
      [SaleDocumentType.FACTURE]: 'Facture',
      [SaleDocumentType.AVOIR]: 'Avoir',
      [SaleDocumentType.FACTURE_ACOMPTE]: 'Facture d\'acompte',
      [SaleDocumentType.RETOUR]: 'Retour',
    };
    return labels[type] || 'Inconnu';
  }

  /**
   * Helper: Détermine le type depuis le label
   */
  private getDocumentTypeFromLabel(label: string): SaleDocumentType {
    const mapping: Record<string, SaleDocumentType> = {
      Devis: SaleDocumentType.DEVIS,
      Commande: SaleDocumentType.COMMANDE,
      Préparation: SaleDocumentType.PREPARATION,
      'Bon de livraison': SaleDocumentType.BON_LIVRAISON,
      Facture: SaleDocumentType.FACTURE,
      Avoir: SaleDocumentType.AVOIR,
      'Facture d\'acompte': SaleDocumentType.FACTURE_ACOMPTE,
      Retour: SaleDocumentType.RETOUR,
    };
    return mapping[label] || SaleDocumentType.DEVIS;
  }
}
