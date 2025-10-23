/**
 * Interface pour la table: CommissionScaleStageLine
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface CommissionScaleStageLine {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 10 */
  CommissionScaleId: string;
  /** Type PG: numeric */
  Threshold: number;
  /** Type PG: smallint */
  Formula: number;
  /** Type PG: numeric */
  Amount: number;
  /** Type PG: numeric */
  Percentage: number;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}
