/**
 * Interface pour la table: ServiceIntrastat
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface ServiceIntrastat {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: smallint */
  IntrastatState: number;
  /** Type PG: character varying | Max length: 6 */
  IntrastatNumber: string;
  /** Type PG: timestamp without time zone */
  IntrastatDate: Date;
  /** Type PG: character varying | Max length: 6 */
  ReferencePeriod: string;
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
