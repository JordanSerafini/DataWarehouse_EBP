/**
 * Interface pour la table: DiscountCouponItem
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface DiscountCouponItem {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 8 */
  ParentId: string;
  /** Type PG: smallint */
  InclusionType: number;
  /** Type PG: boolean */
  IsExcluded: boolean;
  /** Type PG: character varying | Max length: 10 */
  RangeTypeId?: string;
  /** Type PG: integer */
  sysEditCounter?: number;
  /** Type PG: character varying | Max length: 40 */
  StartElementId?: string;
  /** Type PG: character varying | Max length: 40 */
  EndElementId?: string;
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
