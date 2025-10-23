/**
 * Interface pour la table: ScheduleEventOutlookSynchronization
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface ScheduleEventOutlookSynchronization {
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 255 */
  CalendarId: string;
  /** Type PG: smallint */
  IsColleagueChanged: number;
  /** Type PG: smallint */
  IsAppointmentDeleted: number;
  /** Type PG: character varying | Max length: 255 */
  OutlookEntryId?: string;
}
