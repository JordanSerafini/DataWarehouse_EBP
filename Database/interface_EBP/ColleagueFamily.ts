/**
 * Interface pour la table: ColleagueFamily
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface ColleagueFamily {
  /** Type PG: timestamp without time zone */
  DaySchedule6_StartTime: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule6_EndTime: Date;
  /** Type PG: double precision */
  DaySchedule6_Duration: number;
  /** Type PG: boolean */
  DaySchedule6_Active: boolean;
  /** Type PG: timestamp without time zone */
  DaySchedule5_StartTime: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule5_EndTime: Date;
  /** Type PG: double precision */
  DaySchedule5_Duration: number;
  /** Type PG: boolean */
  DaySchedule5_Active: boolean;
  /** Type PG: uuid */
  UniqueId: string;
  /** Type PG: character varying | Max length: 10 */
  Id: string;
  /** Type PG: character varying | Max length: 40 */
  Caption: string;
  /** Type PG: timestamp without time zone */
  DaySchedule0_StartTime: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule0_EndTime: Date;
  /** Type PG: double precision */
  DaySchedule0_Duration: number;
  /** Type PG: boolean */
  DaySchedule0_Active: boolean;
  /** Type PG: timestamp without time zone */
  DaySchedule1_StartTime: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule1_EndTime: Date;
  /** Type PG: double precision */
  DaySchedule1_Duration: number;
  /** Type PG: boolean */
  DaySchedule1_Active: boolean;
  /** Type PG: timestamp without time zone */
  DaySchedule2_StartTime: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule2_EndTime: Date;
  /** Type PG: double precision */
  DaySchedule2_Duration: number;
  /** Type PG: boolean */
  DaySchedule2_Active: boolean;
  /** Type PG: timestamp without time zone */
  DaySchedule3_StartTime: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule3_EndTime: Date;
  /** Type PG: double precision */
  DaySchedule3_Duration: number;
  /** Type PG: boolean */
  DaySchedule3_Active: boolean;
  /** Type PG: timestamp without time zone */
  DaySchedule4_StartTime: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule4_EndTime: Date;
  /** Type PG: double precision */
  DaySchedule4_Duration: number;
  /** Type PG: boolean */
  DaySchedule4_Active: boolean;
  /** Type PG: timestamp without time zone */
  DaySchedule4_LunchStartTime?: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule4_LunchEndTime?: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule3_LunchStartTime?: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule3_LunchEndTime?: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule2_LunchStartTime?: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule2_LunchEndTime?: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule1_LunchStartTime?: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule1_LunchEndTime?: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule0_LunchStartTime?: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule0_LunchEndTime?: Date;
  /** Type PG: character varying | Max length: 40 */
  AnalyticAccounting_GridId?: string;
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
  sysRecordVersion?: number;
  /** Type PG: uuid */
  sysRecordVersionId?: string;
  /** Type PG: integer */
  sysEditCounter?: number;
  /** Type PG: character varying | Max length: 2 */
  DocumentSerialId?: string;
  /** Type PG: timestamp without time zone */
  DaySchedule5_LunchStartTime?: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule5_LunchEndTime?: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule6_LunchStartTime?: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule6_LunchEndTime?: Date;
  /** Type PG: boolean */
  DaySchedule0_Customize: boolean;
  /** Type PG: boolean */
  DaySchedule1_Customize: boolean;
  /** Type PG: boolean */
  DaySchedule2_Customize: boolean;
  /** Type PG: boolean */
  DaySchedule3_Customize: boolean;
  /** Type PG: boolean */
  DaySchedule4_Customize: boolean;
  /** Type PG: boolean */
  DaySchedule5_Customize: boolean;
  /** Type PG: boolean */
  DaySchedule6_Customize: boolean;
}
