/**
 * Interface pour la table: ReminderLetter
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface ReminderLetter {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: integer */
  ReminderNumber: number;
  /** Type PG: timestamp without time zone */
  ReminderDate: Date;
  /** Type PG: boolean */
  MustBeSentByMail: boolean;
  /** Type PG: boolean */
  MustBeSentByFax: boolean;
  /** Type PG: integer */
  ReminderCriticalLevel: number;
  /** Type PG: boolean */
  NotIncrementReminderLevel: boolean;
  /** Type PG: boolean */
  IsPrinted: boolean;
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
