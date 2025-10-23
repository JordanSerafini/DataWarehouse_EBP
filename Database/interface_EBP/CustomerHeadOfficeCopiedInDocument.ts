/**
 * Interface pour la table: CustomerHeadOfficeCopiedInDocument
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface CustomerHeadOfficeCopiedInDocument {
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
  /** Type PG: character varying | Max length: 20 */
  CustomerId: string;
  /** Type PG: character varying | Max length: 40 */
  HeadOfficeAddress_Address1?: string;
  /** Type PG: character varying | Max length: 40 */
  HeadOfficeAddress_Address2?: string;
  /** Type PG: character varying | Max length: 40 */
  HeadOfficeAddress_Address3?: string;
  /** Type PG: character varying | Max length: 40 */
  HeadOfficeAddress_Address4?: string;
  /** Type PG: character varying | Max length: 10 */
  HeadOfficeAddress_ZipCode?: string;
  /** Type PG: character varying | Max length: 35 */
  HeadOfficeAddress_City?: string;
  /** Type PG: character varying | Max length: 50 */
  HeadOfficeAddress_State?: string;
  /** Type PG: character varying | Max length: 3 */
  HeadOfficeAddress_CountryIsoCode?: string;
  /** Type PG: character varying | Max length: 10 */
  HeadOfficeAddress_CodeINSEE?: string;
  /** Type PG: character varying | Max length: 50 */
  HeadOfficeAddress_CityINSEE?: string;
  /** Type PG: character varying | Max length: 60 */
  HeadOfficeAddress_HeadOfficeName?: string;
  /** Type PG: boolean */
  HeadOfficeAddress_UseCompanyAddressAsHeadOfficeAddress: boolean;
}
