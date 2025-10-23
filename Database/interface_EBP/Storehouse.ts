/**
 * Interface pour la table: Storehouse
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface Storehouse {
  /** Type PG: boolean */
  MultiLocationEnabled: boolean;
  /** Type PG: smallint */
  MultiLocationDefaultMode: number;
  /** Type PG: boolean */
  Main: boolean;
  /** Type PG: boolean */
  Asleep: boolean;
  /** Type PG: smallint */
  Type: number;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 40 */
  Caption: string;
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
  /** Type PG: timestamp without time zone */
  LastInventoryDate?: Date;
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
  /** Type PG: character varying | Max length: 10 */
  Address_CodeINSEE?: string;
  /** Type PG: character varying | Max length: 50 */
  Address_CityINSEE?: string;
}
