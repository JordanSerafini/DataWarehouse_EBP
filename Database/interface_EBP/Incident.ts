/**
 * Interface pour la table: Incident
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface Incident {
  /** Type PG: numeric */
  PredictedDuration: number;
  /** Type PG: numeric */
  AccomplishedDuration: number;
  /** Type PG: numeric */
  ProfitsOnDuration: number;
  /** Type PG: boolean */
  Address_Npai: boolean;
  /** Type PG: character varying | Max length: 20 */
  CustomerId: string;
  /** Type PG: character varying | Max length: 150 */
  CustomerName: string;
  /** Type PG: boolean */
  Contact_NaturalPerson: boolean;
  /** Type PG: boolean */
  Contact_OptIn: boolean;
  /** Type PG: character varying | Max length: 8 */
  Id: string;
  /** Type PG: character varying | Max length: 80 */
  Caption: string;
  /** Type PG: timestamp without time zone */
  StartDate: Date;
  /** Type PG: smallint */
  Status: number;
  /** Type PG: numeric */
  PredictedCosts: number;
  /** Type PG: numeric */
  PredictedSales: number;
  /** Type PG: numeric */
  PredictedGrossMargin: number;
  /** Type PG: numeric */
  AccomplishedCosts: number;
  /** Type PG: numeric */
  AccomplishedSales: number;
  /** Type PG: numeric */
  AccomplishedGrossMargin: number;
  /** Type PG: numeric */
  ProfitsOnCosts: number;
  /** Type PG: numeric */
  ProfitsOnSales: number;
  /** Type PG: numeric */
  ProfitsOnGrossMargin: number;
  /** Type PG: boolean */
  NeedToUpdateAnalysis: boolean;
  /** Type PG: character varying | Max length: 8 */
  IncidentTemplateId?: string;
  /** Type PG: integer */
  sysEditCounter?: number;
  /** Type PG: character varying | Max length: 10 */
  DealId?: string;
  /** Type PG: uuid */
  AddressId?: string;
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
  /** Type PG: character varying | Max length: 50 */
  Address_Description?: string;
  /** Type PG: character varying | Max length: 25 */
  Address_Civility?: string;
  /** Type PG: character varying | Max length: 60 */
  Address_ThirdName?: string;
  /** Type PG: timestamp without time zone */
  EndDate?: Date;
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
  /** Type PG: character varying | Max length: 255 */
  Contact_ExternalId_GoogleId?: string;
  /** Type PG: character varying | Max length: 255 */
  Contact_ExternalId_OutlookId?: string;
  /** Type PG: character varying | Max length: 8 */
  ContractId?: string;
  /** Type PG: text */
  Description?: string;
  /** Type PG: text */
  DescriptionClear?: string;
  /** Type PG: character varying | Max length: 100 */
  Address_WebSite?: string;
  /** Type PG: numeric */
  Address_Longitude?: number;
  /** Type PG: numeric */
  Address_Latitude?: number;
  /** Type PG: uuid */
  ContactId?: string;
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
  /** Type PG: character varying | Max length: 20 */
  CreatorColleagueId?: string;
  /** Type PG: boolean */
  Contact_AllowUsePersonnalDatas: boolean;
  /** Type PG: character varying | Max length: 10 */
  ConstructionSiteId?: string;
  /** Type PG: character varying | Max length: 10 */
  Address_CodeINSEE?: string;
  /** Type PG: character varying | Max length: 50 */
  Address_CityINSEE?: string;
  /** Type PG: character varying | Max length: 40 */
  Contact_Profession?: string;
  /** Type PG: boolean */
  HasAssociatedFiles: boolean;
}
