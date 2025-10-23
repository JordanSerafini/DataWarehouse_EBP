/**
 * Interface pour la table: FreeDiscountVoucherCampaign
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface FreeDiscountVoucherCampaign {
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: text */
  NotesClear?: string;
  /** Type PG: text */
  Notes?: string;
  /** Type PG: character varying | Max length: 8 */
  Id: string;
  /** Type PG: character varying | Max length: 150 */
  Caption: string;
  /** Type PG: numeric */
  VoucherQuantityToCreate: number;
  /** Type PG: numeric */
  CashValue: number;
  /** Type PG: timestamp without time zone */
  ValidityDateFrom: Date;
  /** Type PG: timestamp without time zone */
  ValidityDateTo: Date;
  /** Type PG: text */
  Commentary?: string;
}
