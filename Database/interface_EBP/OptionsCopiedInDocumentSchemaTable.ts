/**
 * Interface pour la table: OptionsCopiedInDocumentSchemaTable
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface OptionsCopiedInDocumentSchemaTable {
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
  /** Type PG: text */
  InvoiceObligatoryMentions?: string;
  /** Type PG: text */
  InvoiceObligatoryMentionsClear?: string;
  /** Type PG: text */
  LocalizableInvoiceObligatoryMentions_2?: string;
  /** Type PG: text */
  LocalizableInvoiceObligatoryMentions_Clear_2?: string;
  /** Type PG: text */
  LocalizableInvoiceObligatoryMentions_3?: string;
  /** Type PG: text */
  LocalizableInvoiceObligatoryMentions_Clear_3?: string;
  /** Type PG: text */
  LocalizableInvoiceObligatoryMentions_4?: string;
  /** Type PG: text */
  LocalizableInvoiceObligatoryMentions_Clear_4?: string;
  /** Type PG: text */
  LocalizableInvoiceObligatoryMentions_5?: string;
  /** Type PG: text */
  LocalizableInvoiceObligatoryMentions_Clear_5?: string;
  /** Type PG: character varying | Max length: 60 */
  CompanyName?: string;
  /** Type PG: character varying | Max length: 20 */
  CompanyIntraCommunityVatNumber?: string;
  /** Type PG: numeric */
  CompanyCapital: number;
  /** Type PG: character varying | Max length: 40 */
  CompanyAddress_Address1?: string;
  /** Type PG: character varying | Max length: 40 */
  CompanyAddress_Address2?: string;
  /** Type PG: character varying | Max length: 40 */
  CompanyAddress_Address3?: string;
  /** Type PG: character varying | Max length: 40 */
  CompanyAddress_Address4?: string;
  /** Type PG: character varying | Max length: 10 */
  CompanyAddress_ZipCode?: string;
  /** Type PG: character varying | Max length: 35 */
  CompanyAddress_City?: string;
  /** Type PG: character varying | Max length: 50 */
  CompanyAddress_State?: string;
  /** Type PG: character varying | Max length: 3 */
  CompanyAddress_CountryIsoCode?: string;
  /** Type PG: character varying | Max length: 25 */
  CompanyLegalForm?: string;
  /** Type PG: character varying | Max length: 20 */
  CompanySiret?: string;
  /** Type PG: uuid */
  Hash_Hash_ChainedId?: string;
  /** Type PG: bytea */
  Hash_Hash_Hash?: Buffer;
  /** Type PG: integer */
  OptionsCounter: number;
  /** Type PG: character varying | Max length: 10 */
  CompanyAddress_CodeINSEE?: string;
  /** Type PG: character varying | Max length: 50 */
  CompanyAddress_CityINSEE?: string;
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
  /** Type PG: text */
  VatOnMarginObligatoryMentions?: string;
  /** Type PG: text */
  VatOnMarginObligatoryMentionsClear?: string;
}
