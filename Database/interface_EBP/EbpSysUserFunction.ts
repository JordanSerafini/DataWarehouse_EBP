/**
 * Interface pour la table: EbpSysUserFunction
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysUserFunction {
  /** Type PG: character varying | Max length: 40 */
  Id: string;
  /** Type PG: character varying | Max length: 120 */
  Description: string;
  /** Type PG: smallint */
  ReturnedDataType: number;
  /** Type PG: integer */
  Category: number;
  /** Type PG: text */
  Example?: string;
  /** Type PG: text */
  NotesClear?: string;
  /** Type PG: text */
  Notes?: string;
  /** Type PG: text */
  Signature?: string;
  /** Type PG: text */
  UserFunctionProgram_Program?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: integer */
  sysEditCounter?: number;
}
