/**
 * Interface pour la table: IntrastatRegime
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface IntrastatRegime {
  /** Type PG: character varying | Max length: 2 */
  Id: string;
  /** Type PG: character varying | Max length: 255 */
  Caption: string;
  /** Type PG: smallint */
  RegimeType: number;
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
