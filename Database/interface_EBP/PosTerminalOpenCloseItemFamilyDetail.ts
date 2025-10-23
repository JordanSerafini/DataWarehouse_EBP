/**
 * Interface pour la table: PosTerminalOpenCloseItemFamilyDetail
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface PosTerminalOpenCloseItemFamilyDetail {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: uuid */
  ParentId: string;
  /** Type PG: numeric */
  AmountVatExcluded: number;
  /** Type PG: numeric */
  DiscountAmount: number;
  /** Type PG: numeric */
  DiscountAmountVatExcluded: number;
  /** Type PG: numeric */
  DiscountAmountVatIncluded: number;
  /** Type PG: boolean */
  Positive: boolean;
  /** Type PG: character varying | Max length: 10 */
  ItemFamilyId?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}
