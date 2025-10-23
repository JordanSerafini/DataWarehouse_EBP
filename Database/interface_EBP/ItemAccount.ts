/**
 * Interface pour la table: ItemAccount
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface ItemAccount {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: uuid */
  VatId: string;
  /** Type PG: character varying | Max length: 40 */
  ItemId?: string;
  /** Type PG: character varying | Max length: 20 */
  Account?: string;
  /** Type PG: character varying | Max length: 20 */
  PurchaseAccount?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: character varying | Max length: 40 */
  RangeItemId?: string;
  /** Type PG: character varying | Max length: 20 */
  SubContractorAccount?: string;
}
