/**
 * Interface pour la table: Bank
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface Bank {
  /** Type PG: boolean */
  FormatSepaFile: boolean;
  /** Type PG: boolean */
  SepaFileUtf8Encoded: boolean;
  /** Type PG: character varying | Max length: 6 */
  Id: string;
  /** Type PG: character varying | Max length: 40 */
  Caption: string;
  /** Type PG: character varying | Max length: 10 */
  BankBook: string;
  /** Type PG: character varying | Max length: 20 */
  AccountingAccount: string;
  /** Type PG: boolean */
  FormatCfonbFile: boolean;
  /** Type PG: uuid */
  UniqueId: string;
  /** Type PG: boolean */
  SepaForceChrgBr: boolean;
  /** Type PG: character varying | Max length: 10 */
  BillOfExchangeBook: string;
  /** Type PG: character varying | Max length: 10 */
  BillForCollectionBook: string;
  /** Type PG: character varying | Max length: 10 */
  BillForDiscountBook: string;
  /** Type PG: character varying | Max length: 10 */
  OtherPaymentBook: string;
  /** Type PG: character varying | Max length: 20 */
  BillForCollectionAccount: string;
  /** Type PG: character varying | Max length: 20 */
  BillForDiscountAccount: string;
  /** Type PG: character varying | Max length: 20 */
  OtherPaymentAccount: string;
  /** Type PG: numeric */
  BankRemittanceCharges0_Amount: number;
  /** Type PG: smallint */
  BankRemittanceCharges0_AmountType: number;
  /** Type PG: character varying | Max length: 20 */
  BankRemittanceCharges0_Account: string;
  /** Type PG: numeric */
  BankRemittanceCharges1_Amount: number;
  /** Type PG: smallint */
  BankRemittanceCharges1_AmountType: number;
  /** Type PG: character varying | Max length: 20 */
  BankRemittanceCharges1_Account: string;
  /** Type PG: numeric */
  BankRemittanceCharges2_Amount: number;
  /** Type PG: smallint */
  BankRemittanceCharges2_AmountType: number;
  /** Type PG: character varying | Max length: 20 */
  BankRemittanceCharges2_Account: string;
  /** Type PG: numeric */
  BankRemittanceCharges3_Amount: number;
  /** Type PG: smallint */
  BankRemittanceCharges3_AmountType: number;
  /** Type PG: character varying | Max length: 20 */
  BankRemittanceCharges3_Account: string;
  /** Type PG: numeric */
  BankRemittanceCharges4_Amount: number;
  /** Type PG: smallint */
  BankRemittanceCharges4_AmountType: number;
  /** Type PG: character varying | Max length: 20 */
  BankRemittanceCharges4_Account: string;
  /** Type PG: smallint */
  SepaBatchBooking: number;
  /** Type PG: boolean */
  SepaSerializeDateTimeToLocalZone: boolean;
  /** Type PG: text */
  BankRemittanceCharges4_PaymentTypes?: string;
  /** Type PG: text */
  BankRemittanceCharges3_PaymentTypes?: string;
  /** Type PG: character varying | Max length: 30 */
  BankRemittanceCharges4_Caption?: string;
  /** Type PG: text */
  BankRemittanceCharges2_PaymentTypes?: string;
  /** Type PG: character varying | Max length: 30 */
  BankRemittanceCharges3_Caption?: string;
  /** Type PG: text */
  BankRemittanceCharges1_PaymentTypes?: string;
  /** Type PG: character varying | Max length: 30 */
  BankRemittanceCharges2_Caption?: string;
  /** Type PG: text */
  BankRemittanceCharges0_PaymentTypes?: string;
  /** Type PG: character varying | Max length: 30 */
  BankRemittanceCharges1_Caption?: string;
  /** Type PG: character varying | Max length: 30 */
  BankRemittanceCharges0_Caption?: string;
  /** Type PG: uuid */
  sysModuleId?: string;
  /** Type PG: uuid */
  sysDatabaseId?: string;
  /** Type PG: integer */
  sysRecordVersion?: number;
  /** Type PG: uuid */
  sysRecordVersionId?: string;
  /** Type PG: character varying | Max length: 35 */
  SepaCreditorIdentifier?: string;
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
  /** Type PG: character varying | Max length: 60 */
  Address_BankName?: string;
  /** Type PG: character varying | Max length: 100 */
  Address_WebSite?: string;
  /** Type PG: numeric */
  Address_Longitude?: number;
  /** Type PG: numeric */
  Address_Latitude?: number;
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
  /** Type PG: character varying | Max length: 46 */
  AccountDetail_BasicBankAccountNumber?: string;
  /** Type PG: character varying | Max length: 50 */
  AccountDetail_InternationalBankAccountNumber?: string;
  /** Type PG: character varying | Max length: 11 */
  AccountDetail_BankIdentifierCode?: string;
  /** Type PG: character varying | Max length: 6 */
  NationalIssuerNumber?: string;
  /** Type PG: character varying | Max length: 3 */
  CurrencyId?: string;
  /** Type PG: character varying | Max length: 60 */
  BankCheckPrintingOrder?: string;
  /** Type PG: character varying | Max length: 2 */
  DocumentSerialId?: string;
  /** Type PG: character varying | Max length: 10 */
  Address_CodeINSEE?: string;
  /** Type PG: character varying | Max length: 50 */
  Address_CityINSEE?: string;
  /** Type PG: boolean */
  IsInactive: boolean;
}
