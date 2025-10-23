/**
 * Interface pour la table: CalcultatedDataModel
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface CalcultatedDataModel {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 120 */
  Caption: string;
  /** Type PG: smallint */
  Purpose: number;
  /** Type PG: text */
  Program_Program?: string;
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
  /** Type PG: integer */
  sysEditCounter?: number;
}
