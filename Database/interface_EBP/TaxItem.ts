/**
 * Interface pour la table: TaxItem
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface TaxItem {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: uuid */
  TaxId: string;
  /** Type PG: integer */
  TaxOrder: number;
  /** Type PG: smallint */
  OwnerType: number;
  /** Type PG: character varying | Max length: 40 */
  ItemId?: string;
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
  /** Type PG: character varying | Max length: 40 */
  RangeItemId?: string;
  /** Type PG: uuid */
  SubTaxId?: string;
}
