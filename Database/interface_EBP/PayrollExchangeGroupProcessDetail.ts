/**
 * Interface pour la table: PayrollExchangeGroupProcessDetail
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface PayrollExchangeGroupProcessDetail {
  /** Type PG: integer */
  Id: number;
  /** Type PG: uuid */
  PayrollExchangeGroupId: string;
  /** Type PG: smallint */
  ProcessType: number;
  /** Type PG: timestamp without time zone */
  ProcessDate: Date;
  /** Type PG: text */
  Errors?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}
