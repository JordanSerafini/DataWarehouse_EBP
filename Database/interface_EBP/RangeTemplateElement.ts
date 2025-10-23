/**
 * Interface pour la table: RangeTemplateElement
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface RangeTemplateElement {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 10 */
  RangeTemplateId: string;
  /** Type PG: uuid */
  RangeTypeElementId0: string;
  /** Type PG: uuid */
  RangeTypeElementId1?: string;
  /** Type PG: uuid */
  RangeTypeElementId2?: string;
  /** Type PG: uuid */
  RangeTypeElementId3?: string;
  /** Type PG: uuid */
  RangeTypeElementId4?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}
