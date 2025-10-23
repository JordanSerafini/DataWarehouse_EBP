/**
 * Interface pour la table: Shipping
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface Shipping {
  /** Type PG: boolean */
  NotSubjectToFinancialDiscount: boolean;
  /** Type PG: smallint */
  ApplyOnType: number;
  /** Type PG: character varying | Max length: 32 */
  Caption: string;
  /** Type PG: uuid */
  VatId: string;
  /** Type PG: smallint */
  CalculationMode: number;
  /** Type PG: numeric */
  CalculationValue: number;
  /** Type PG: uuid */
  UniqueId: string;
  /** Type PG: character varying | Max length: 8 */
  Id: string;
  /** Type PG: character varying | Max length: 40 */
  CarrierAddress_Address1?: string;
  /** Type PG: character varying | Max length: 40 */
  CarrierAddress_Address2?: string;
  /** Type PG: character varying | Max length: 40 */
  CarrierAddress_Address3?: string;
  /** Type PG: character varying | Max length: 40 */
  CarrierAddress_Address4?: string;
  /** Type PG: character varying | Max length: 10 */
  CarrierAddress_ZipCode?: string;
  /** Type PG: character varying | Max length: 35 */
  CarrierAddress_City?: string;
  /** Type PG: character varying | Max length: 50 */
  CarrierAddress_State?: string;
  /** Type PG: character varying | Max length: 3 */
  CarrierAddress_CountryIsoCode?: string;
  /** Type PG: numeric */
  CarrierAddress_Longitude?: number;
  /** Type PG: numeric */
  CarrierAddress_Latitude?: number;
  /** Type PG: character varying | Max length: 100 */
  CarrierAddress_WebSite?: string;
  /** Type PG: character varying | Max length: 25 */
  CarrierContact_Civility?: string;
  /** Type PG: character varying | Max length: 60 */
  CarrierContact_Name?: string;
  /** Type PG: character varying | Max length: 60 */
  CarrierContact_FirstName?: string;
  /** Type PG: character varying | Max length: 20 */
  CarrierContact_Phone?: string;
  /** Type PG: character varying | Max length: 20 */
  CarrierContact_CellPhone?: string;
  /** Type PG: character varying | Max length: 20 */
  CarrierContact_Fax?: string;
  /** Type PG: character varying | Max length: 100 */
  CarrierContact_Email?: string;
  /** Type PG: character varying | Max length: 1 */
  IntrastatTransportMode?: string;
  /** Type PG: integer */
  sysRecordVersion?: number;
  /** Type PG: uuid */
  sysRecordVersionId?: string;
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
  /** Type PG: character varying | Max length: 10 */
  CarrierAddress_CodeINSEE?: string;
  /** Type PG: character varying | Max length: 50 */
  CarrierAddress_CityINSEE?: string;
}
