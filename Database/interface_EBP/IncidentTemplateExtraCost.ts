/**
 * Interface pour la table: IncidentTemplateExtraCost
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface IncidentTemplateExtraCost {
  /** Type PG: numeric */
  NetAmountVatIncluded: number;
  /** Type PG: integer */
  LineOrder: number;
  /** Type PG: character varying | Max length: 8 */
  IncidentTemplateId: string;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 80 */
  Caption: string;
  /** Type PG: timestamp without time zone */
  ExtraCostDate: Date;
  /** Type PG: numeric */
  Quantity: number;
  /** Type PG: numeric */
  UnitPrice: number;
  /** Type PG: numeric */
  NetAmountVatExcluded: number;
  /** Type PG: uuid */
  VatId?: string;
  /** Type PG: character varying | Max length: 4 */
  UnitId?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: uuid */
  ExecutionQuoteLineId?: string;
}
