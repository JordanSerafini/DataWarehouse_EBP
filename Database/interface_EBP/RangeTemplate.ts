/**
 * Interface pour la table: RangeTemplate
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface RangeTemplate {
  /** Type PG: character varying | Max length: 10 */
  Id: string;
  /** Type PG: character varying | Max length: 40 */
  Caption: string;
  /** Type PG: character varying | Max length: 10 */
  RangeTypeId0: string;
  /** Type PG: character varying | Max length: 10 */
  RangeTypeId1?: string;
  /** Type PG: character varying | Max length: 10 */
  RangeTypeId2?: string;
  /** Type PG: character varying | Max length: 10 */
  RangeTypeId3?: string;
  /** Type PG: character varying | Max length: 10 */
  RangeTypeId4?: string;
  /** Type PG: text */
  RangeTypeElementSelections0?: string;
  /** Type PG: text */
  RangeTypeElementSelections1?: string;
  /** Type PG: text */
  RangeTypeElementSelections2?: string;
  /** Type PG: text */
  RangeTypeElementSelections3?: string;
  /** Type PG: text */
  RangeTypeElementSelections4?: string;
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
