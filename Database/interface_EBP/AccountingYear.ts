/**
 * Interface pour la table: AccountingYear
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface AccountingYear {
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
  /** Type PG: uuid */
  Id: string;
  /** Type PG: boolean */
  IsCurrent: boolean;
  /** Type PG: timestamp without time zone */
  StartingDate: Date;
  /** Type PG: timestamp without time zone */
  EndingDate: Date;
  /** Type PG: smallint */
  Status: number;
  /** Type PG: timestamp without time zone */
  ClosingDate?: Date;
  /** Type PG: uuid */
  SynchronizationUniqueId?: string;
  /** Type PG: character varying | Max length: 80 */
  Caption: string;
}
