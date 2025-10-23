/**
 * Interface pour la table: Activity
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface Activity {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: timestamp without time zone */
  StartDateTime: Date;
  /** Type PG: timestamp without time zone */
  EndDateTime: Date;
  /** Type PG: character varying | Max length: 160 */
  Caption: string;
  /** Type PG: smallint */
  ActivityCategory: number;
  /** Type PG: boolean */
  Contact_NaturalPerson: boolean;
  /** Type PG: boolean */
  Contact_OptIn: boolean;
  /** Type PG: character varying | Max length: 255 */
  Contact_ExternalId_GoogleId?: string;
  /** Type PG: character varying | Max length: 255 */
  Contact_ExternalId_OutlookId?: string;
  /** Type PG: character varying | Max length: 20 */
  CustomerId?: string;
  /** Type PG: character varying | Max length: 60 */
  CustomerName?: string;
  /** Type PG: character varying | Max length: 20 */
  SupplierId?: string;
  /** Type PG: character varying | Max length: 60 */
  SupplierName?: string;
  /** Type PG: uuid */
  ContactId?: string;
  /** Type PG: character varying | Max length: 8 */
  IncidentId?: string;
  /** Type PG: character varying | Max length: 8 */
  MaintenanceContractId?: string;
  /** Type PG: smallint */
  AutomaticCreation?: number;
  /** Type PG: uuid */
  ReminderLetterId?: string;
  /** Type PG: smallint */
  DocumentType?: number;
  /** Type PG: uuid */
  SaleDocumentId?: string;
  /** Type PG: uuid */
  PurchaseDocumentId?: string;
  /** Type PG: uuid */
  ScheduleEventId?: string;
  /** Type PG: character varying | Max length: 25 */
  Contact_Civility?: string;
  /** Type PG: character varying | Max length: 60 */
  Contact_Name?: string;
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
  /** Type PG: character varying | Max length: 40 */
  Contact_Function?: string;
  /** Type PG: character varying | Max length: 40 */
  Contact_Department?: string;
  /** Type PG: uuid */
  EventType?: string;
  /** Type PG: character varying | Max length: 20 */
  ColleagueId?: string;
  /** Type PG: character varying | Max length: 10 */
  DealId?: string;
  /** Type PG: smallint */
  EventState?: number;
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
  /** Type PG: character varying | Max length: 20 */
  CreatorColleagueId?: string;
  /** Type PG: boolean */
  Contact_AllowUsePersonnalDatas: boolean;
  /** Type PG: character varying | Max length: 10 */
  ConstructionSiteId?: string;
  /** Type PG: character varying | Max length: 40 */
  Contact_Profession?: string;
  /** Type PG: boolean */
  HasAssociatedFiles: boolean;
}
