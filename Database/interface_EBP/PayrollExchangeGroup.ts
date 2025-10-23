/**
 * Interface pour la table: PayrollExchangeGroup
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface PayrollExchangeGroup {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: integer */
  GroupNumber: number;
  /** Type PG: boolean */
  System: boolean;
  /** Type PG: boolean */
  TransferedPieces: boolean;
  /** Type PG: timestamp without time zone */
  ValidityDate: Date;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}
