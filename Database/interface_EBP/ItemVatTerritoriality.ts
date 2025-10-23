/**
 * Interface pour la table: ItemVatTerritoriality
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface ItemVatTerritoriality {
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
  TerritorialityId: string;
  /** Type PG: uuid */
  VatId: string;
  /** Type PG: smallint */
  DocumentType: number;
  /** Type PG: character varying | Max length: 40 */
  ParentId: string;
}
