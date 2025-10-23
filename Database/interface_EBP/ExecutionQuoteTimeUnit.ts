/**
 * Interface pour la table: ExecutionQuoteTimeUnit
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface ExecutionQuoteTimeUnit {
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: uuid */
  ExecutionQuoteId: string;
  /** Type PG: character varying | Max length: 4 */
  UnitId: string;
  /** Type PG: numeric */
  ConversionRate: number;
}
