/**
 * Interface pour la table: GiftVoucher
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface GiftVoucher {
  /** Type PG: smallint */
  Status: number;
  /** Type PG: character varying | Max length: 8 */
  Id: string;
  /** Type PG: character varying | Max length: 40 */
  ItemId: string;
  /** Type PG: numeric */
  CashValue: number;
  /** Type PG: boolean */
  Activated: boolean;
  /** Type PG: timestamp without time zone */
  ActivationDate?: Date;
  /** Type PG: timestamp without time zone */
  ExpiryDate?: Date;
  /** Type PG: uuid */
  SaleDocumentLineId?: string;
  /** Type PG: uuid */
  SettlementDocumentId?: string;
  /** Type PG: uuid */
  GiveChangeDocumentId?: string;
  /** Type PG: numeric */
  ReturningChangeAmount?: number;
  /** Type PG: numeric */
  GiftVoucherReturningChangeAmount?: number;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: boolean */
  IsSoldWithoutDocument: boolean;
}
