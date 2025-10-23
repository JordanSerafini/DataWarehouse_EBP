/**
 * Interface pour la table: Address
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface Address {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: boolean */
  IsInvoicingType: boolean;
  /** Type PG: boolean */
  IsDeliveryType: boolean;
  /** Type PG: boolean */
  IsMainInvoicing: boolean;
  /** Type PG: boolean */
  IsMainDelivery: boolean;
  /** Type PG: boolean */
  AddressFields_Npai: boolean;
  /** Type PG: boolean */
  IsMainReminder: boolean;
  /** Type PG: character varying | Max length: 100 */
  AddressFields_WebSite?: string;
  /** Type PG: numeric */
  AddressFields_Longitude?: number;
  /** Type PG: numeric */
  AddressFields_Latitude?: number;
  /** Type PG: character varying | Max length: 20 */
  AssociatedCustomerId?: string;
  /** Type PG: character varying | Max length: 20 */
  AssociatedSupplierId?: string;
  /** Type PG: integer */
  sysEditCounter?: number;
  /** Type PG: character varying | Max length: 40 */
  AddressFields_Address1?: string;
  /** Type PG: character varying | Max length: 40 */
  AddressFields_Address2?: string;
  /** Type PG: character varying | Max length: 40 */
  AddressFields_Address3?: string;
  /** Type PG: character varying | Max length: 40 */
  AddressFields_Address4?: string;
  /** Type PG: character varying | Max length: 10 */
  AddressFields_ZipCode?: string;
  /** Type PG: character varying | Max length: 35 */
  AddressFields_City?: string;
  /** Type PG: character varying | Max length: 50 */
  AddressFields_State?: string;
  /** Type PG: character varying | Max length: 3 */
  AddressFields_CountryIsoCode?: string;
  /** Type PG: character varying | Max length: 50 */
  AddressFields_Description?: string;
  /** Type PG: character varying | Max length: 25 */
  AddressFields_Civility?: string;
  /** Type PG: character varying | Max length: 60 */
  AddressFields_ThirdName?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: character varying | Max length: 10 */
  AddressFields_CodeINSEE?: string;
  /** Type PG: character varying | Max length: 50 */
  AddressFields_CityINSEE?: string;
}
