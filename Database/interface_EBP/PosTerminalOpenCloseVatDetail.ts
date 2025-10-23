/**
 * Interface pour la table: PosTerminalOpenCloseVatDetail
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface PosTerminalOpenCloseVatDetail {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: uuid */
  ParentId: string;
  /** Type PG: uuid */
  VatId: string;
  /** Type PG: numeric */
  AmountVatExcluded: number;
  /** Type PG: numeric */
  VatAmount: number;
  /** Type PG: numeric */
  AmountVatIncluded: number;
  /** Type PG: boolean */
  Positive: boolean;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}
