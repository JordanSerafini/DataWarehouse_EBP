/**
 * Interface pour la table: ThirdReference
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface ThirdReference {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: smallint */
  ReferenceThirdType: number;
  /** Type PG: smallint */
  ThirdSelectionType: number;
  /** Type PG: character varying | Max length: 20 */
  ThirdId: string;
  /** Type PG: character varying | Max length: 40 */
  ItemId: string;
  /** Type PG: character varying | Max length: 50 */
  Reference?: string;
  /** Type PG: character varying | Max length: 40 */
  BarCode?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: character varying | Max length: 80 */
  ThirdReferenceCaption?: string;
  /** Type PG: smallint */
  ThirdPriceType?: number;
}
