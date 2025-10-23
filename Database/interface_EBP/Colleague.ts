/**
 * Interface pour la table: Colleague
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface Colleague {
  /** Type PG: character varying | Max length: 20 */
  Id: string;
  /** Type PG: character varying | Max length: 60 */
  Contact_Name: string;
  /** Type PG: boolean */
  IsSalesperson: boolean;
  /** Type PG: smallint */
  ActiveState: number;
  /** Type PG: uuid */
  UniqueId: string;
  /** Type PG: numeric */
  IRPFRate: number;
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
  DaySchedule5_StartTime: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule5_EndTime: Date;
  /** Type PG: double precision */
  DaySchedule5_Duration: number;
  /** Type PG: boolean */
  DaySchedule5_Active: boolean;
  /** Type PG: timestamp without time zone */
  DaySchedule6_StartTime: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule6_EndTime: Date;
  /** Type PG: double precision */
  DaySchedule6_Duration: number;
  /** Type PG: boolean */
  DaySchedule6_Active: boolean;
  /** Type PG: boolean */
  EventAutomaticAssign: boolean;
  /** Type PG: numeric */
  HourlyCostPrice: number;
  /** Type PG: character varying | Max length: 40 */
  ReferenceItemId?: string;
  /** Type PG: integer */
  EmployeePayrollId?: number;
  /** Type PG: text */
  EmailSignatureClear?: string;
  /** Type PG: text */
  EmailSignature?: string;
  /** Type PG: timestamp without time zone */
  DaySchedule0_LunchStartTime?: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule0_LunchEndTime?: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule1_LunchStartTime?: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule1_LunchEndTime?: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule2_LunchStartTime?: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule2_LunchEndTime?: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule3_LunchStartTime?: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule3_LunchEndTime?: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule4_LunchStartTime?: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule4_LunchEndTime?: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule5_LunchStartTime?: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule5_LunchEndTime?: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule6_LunchStartTime?: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule6_LunchEndTime?: Date;
  /** Type PG: character varying | Max length: 2 */
  DocumentSerialId?: string;
  /** Type PG: character varying | Max length: 10 */
  EmployeeRegistrationNumber?: string;
  /** Type PG: numeric */
  SalePriceVatExcluded?: number;
  /** Type PG: character varying | Max length: 40 */
  AnalyticAccounting_GridId?: string;
  /** Type PG: integer */
  sysRecordVersion?: number;
  /** Type PG: uuid */
  sysRecordVersionId?: string;
  /** Type PG: integer */
  sysEditCounter?: number;
  /** Type PG: character varying | Max length: 20 */
  CifNif?: string;
  /** Type PG: character varying | Max length: 20 */
  UserId?: string;
  /** Type PG: character varying | Max length: 10 */
  GeographicSector?: string;
  /** Type PG: character varying | Max length: 10 */
  ColleagueFamilyId?: string;
  /** Type PG: uuid */
  Group1?: string;
  /** Type PG: uuid */
  Group2?: string;
  /** Type PG: character varying | Max length: 60 */
  Contact_FirstName?: string;
  /** Type PG: character varying | Max length: 20 */
  Contact_Phone?: string;
  /** Type PG: character varying | Max length: 20 */
  Contact_CellPhone?: string;
  /** Type PG: character varying | Max length: 20 */
  Contact_Fax?: string;
  /** Type PG: character varying | Max length: 100 */
  Contact_Email?: string;
  /** Type PG: character varying | Max length: 60 */
  Contact_ColleagueFunction?: string;
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
  /** Type PG: character varying | Max length: 40 */
  Address_Address1?: string;
  /** Type PG: character varying | Max length: 40 */
  Address_Address2?: string;
  /** Type PG: character varying | Max length: 40 */
  Address_Address3?: string;
  /** Type PG: character varying | Max length: 40 */
  Address_Address4?: string;
  /** Type PG: character varying | Max length: 10 */
  Address_ZipCode?: string;
  /** Type PG: character varying | Max length: 35 */
  Address_City?: string;
  /** Type PG: character varying | Max length: 50 */
  Address_State?: string;
  /** Type PG: character varying | Max length: 3 */
  Address_CountryIsoCode?: string;
  /** Type PG: numeric */
  Address_Longitude?: number;
  /** Type PG: numeric */
  Address_Latitude?: number;
  /** Type PG: character varying | Max length: 25 */
  Contact_Civility?: string;
  /** Type PG: numeric */
  MaximumDiscountRateAllowed?: number;
  /** Type PG: uuid */
  StorehouseId?: string;
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
  /** Type PG: character varying | Max length: 10 */
  Address_CodeINSEE?: string;
  /** Type PG: character varying | Max length: 50 */
  Address_CityINSEE?: string;
  /** Type PG: boolean */
  HasAssociatedFiles: boolean;
}
