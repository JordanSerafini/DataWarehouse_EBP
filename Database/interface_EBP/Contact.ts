/**
 * Interface pour la table: Contact
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface Contact {
  /** Type PG: character varying | Max length: 60 */
  ContactFields_Name: string;
  /** Type PG: boolean */
  ContactFields_NaturalPerson: boolean;
  /** Type PG: boolean */
  ContactFields_OptIn: boolean;
  /** Type PG: boolean */
  AddressFields_Npai: boolean;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: boolean */
  OtherAddressFields_Npai: boolean;
  /** Type PG: boolean */
  IsWebContact: boolean;
  /** Type PG: boolean */
  IsMainInvoicing: boolean;
  /** Type PG: boolean */
  IsMainDelivery: boolean;
  /** Type PG: character varying | Max length: 20 */
  AssociatedCustomerId?: string;
  /** Type PG: character varying | Max length: 20 */
  AssociatedSupplierId?: string;
  /** Type PG: integer */
  sysEditCounter?: number;
  /** Type PG: integer */
  sysRecordVersion?: number;
  /** Type PG: uuid */
  sysRecordVersionId?: string;
  /** Type PG: character varying | Max length: 100 */
  OtherAddressFields_WebSite?: string;
  /** Type PG: numeric */
  OtherAddressFields_Longitude?: number;
  /** Type PG: numeric */
  OtherAddressFields_Latitude?: number;
  /** Type PG: character varying | Max length: 25 */
  ContactFields_Civility?: string;
  /** Type PG: character varying | Max length: 100 */
  AddressFields_WebSite?: string;
  /** Type PG: numeric */
  AddressFields_Longitude?: number;
  /** Type PG: numeric */
  AddressFields_Latitude?: number;
  /** Type PG: character varying | Max length: 40 */
  OtherAddressFields_Address1?: string;
  /** Type PG: character varying | Max length: 40 */
  OtherAddressFields_Address2?: string;
  /** Type PG: character varying | Max length: 40 */
  OtherAddressFields_Address3?: string;
  /** Type PG: character varying | Max length: 40 */
  OtherAddressFields_Address4?: string;
  /** Type PG: character varying | Max length: 10 */
  OtherAddressFields_ZipCode?: string;
  /** Type PG: character varying | Max length: 35 */
  OtherAddressFields_City?: string;
  /** Type PG: character varying | Max length: 50 */
  OtherAddressFields_State?: string;
  /** Type PG: character varying | Max length: 3 */
  OtherAddressFields_CountryIsoCode?: string;
  /** Type PG: character varying | Max length: 50 */
  OtherAddressFields_Description?: string;
  /** Type PG: character varying | Max length: 25 */
  OtherAddressFields_Civility?: string;
  /** Type PG: character varying | Max length: 60 */
  OtherAddressFields_ThirdName?: string;
  /** Type PG: character varying | Max length: 255 */
  ContactFields_ExternalId_GoogleId?: string;
  /** Type PG: character varying | Max length: 255 */
  ContactFields_ExternalId_OutlookId?: string;
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
  /** Type PG: character varying | Max length: 60 */
  ContactFields_FirstName?: string;
  /** Type PG: character varying | Max length: 20 */
  ContactFields_Phone?: string;
  /** Type PG: character varying | Max length: 20 */
  ContactFields_CellPhone?: string;
  /** Type PG: character varying | Max length: 20 */
  ContactFields_Fax?: string;
  /** Type PG: character varying | Max length: 100 */
  ContactFields_Email?: string;
  /** Type PG: character varying | Max length: 40 */
  ContactFields_Function?: string;
  /** Type PG: character varying | Max length: 40 */
  ContactFields_Department?: string;
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
  /** Type PG: boolean */
  ContactFields_AllowUsePersonnalDatas: boolean;
  /** Type PG: smallint */
  PrintSendOptions_Quote: number;
  /** Type PG: smallint */
  PrintSendOptions_ExecutionQuote: number;
  /** Type PG: smallint */
  PrintSendOptions_Order: number;
  /** Type PG: smallint */
  PrintSendOptions_DeliveryOrder: number;
  /** Type PG: smallint */
  PrintSendOptions_Invoice: number;
  /** Type PG: smallint */
  PrintSendOptions_CreditMemo: number;
  /** Type PG: smallint */
  PrintSendOptions_DepositInvoice: number;
  /** Type PG: smallint */
  PrintSendOptions_DepositCreditMemo: number;
  /** Type PG: smallint */
  PrintSendOptions_ProgressStateDocument: number;
  /** Type PG: smallint */
  PrintSendOptions_PurchaseQuote: number;
  /** Type PG: smallint */
  PrintSendOptions_PurchaseOrder: number;
  /** Type PG: smallint */
  PrintSendOptions_ReceiptOrder: number;
  /** Type PG: smallint */
  PrintSendOptions_ReturnOrder: number;
  /** Type PG: smallint */
  PrintSendOptions_PurchaseInvoice: number;
  /** Type PG: smallint */
  PrintSendOptions_PurchaseCreditMemo: number;
  /** Type PG: smallint */
  PrintSendOptions_PurchaseDepositInvoice: number;
  /** Type PG: smallint */
  PrintSendOptions_PurchaseDepositCreditMemo: number;
  /** Type PG: smallint */
  PrintSendOptions_PurchaseProgressStateDocument: number;
  /** Type PG: character varying | Max length: 10 */
  AddressFields_CodeINSEE?: string;
  /** Type PG: character varying | Max length: 50 */
  AddressFields_CityINSEE?: string;
  /** Type PG: character varying | Max length: 10 */
  OtherAddressFields_CodeINSEE?: string;
  /** Type PG: character varying | Max length: 50 */
  OtherAddressFields_CityINSEE?: string;
  /** Type PG: boolean */
  IsMainReminder: boolean;
  /** Type PG: character varying | Max length: 40 */
  ContactFields_Profession?: string;
  /** Type PG: boolean */
  HasAssociatedFiles: boolean;
}
