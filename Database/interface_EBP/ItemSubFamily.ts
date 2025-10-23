/**
 * Interface pour la table: ItemSubFamily
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface ItemSubFamily {
  /** Type PG: character varying | Max length: 10 */
  Id: string;
  /** Type PG: character varying | Max length: 40 */
  Caption: string;
  /** Type PG: character varying | Max length: 10 */
  ItemFamilyId: string;
  /** Type PG: character varying | Max length: 40 */
  AnalyticAccounting_GridId?: string;
  /** Type PG: integer */
  sysEditCounter?: number;
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
}
