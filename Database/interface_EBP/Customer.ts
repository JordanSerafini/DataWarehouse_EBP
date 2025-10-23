/**
 * Interface pour la table: Customer
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface Customer {
  /** Type PG: boolean */
  CheckExceedCommitmentDate: boolean;
  /** Type PG: integer */
  DueCommitmentsXDay: number;
  /** Type PG: numeric */
  EffectOfTradeAmount: number;
  /** Type PG: boolean */
  GenerateVCS: boolean;
  /** Type PG: character varying | Max length: 3 */
  ThirdLanguage: string;
  /** Type PG: numeric */
  InvoicingChargesAmount: number;
  /** Type PG: boolean */
  AutomaticStockBooking: boolean;
  /** Type PG: smallint */
  CustomerToUseInCustomerProducts: number;
  /** Type PG: numeric */
  ExtendedCurrentAmount: number;
  /** Type PG: numeric */
  ThresholdBeforeExceedAmount: number;
  /** Type PG: character varying | Max length: 60 */
  Name: string;
  /** Type PG: boolean */
  UseInvoicingAddressAsDeliveryAddress: boolean;
  /** Type PG: boolean */
  UseInvoicingContactAsDeliveryContact: boolean;
  /** Type PG: boolean */
  MainDeliveryAddress_Npai: boolean;
  /** Type PG: boolean */
  MainInvoicingAddress_Npai: boolean;
  /** Type PG: boolean */
  MainDeliveryContact_NaturalPerson: boolean;
  /** Type PG: boolean */
  MainDeliveryContact_OptIn: boolean;
  /** Type PG: character varying | Max length: 20 */
  Id: string;
  /** Type PG: boolean */
  MainInvoicingContact_NaturalPerson: boolean;
  /** Type PG: boolean */
  MainInvoicingContact_OptIn: boolean;
  /** Type PG: boolean */
  NaturalPerson: boolean;
  /** Type PG: uuid */
  TerritorialityId: string;
  /** Type PG: smallint */
  FinancialDiscountType: number;
  /** Type PG: numeric */
  FinancialDiscountRate: number;
  /** Type PG: smallint */
  FinancialDiscountPaymentDelay: number;
  /** Type PG: smallint */
  ActiveState: number;
  /** Type PG: numeric */
  DiscountRate: number;
  /** Type PG: numeric */
  SecondDiscountRate: number;
  /** Type PG: numeric */
  AllowedAmount: number;
  /** Type PG: numeric */
  CurrentAmount: number;
  /** Type PG: numeric */
  InitialAmount: number;
  /** Type PG: numeric */
  ExceedAmount: number;
  /** Type PG: boolean */
  MustRetrieveCommitmentsFromAccounting: boolean;
  /** Type PG: boolean */
  PriceWithTaxBased: boolean;
  /** Type PG: boolean */
  MustBeReminder: boolean;
  /** Type PG: integer */
  DayNumberToFirstReminder: number;
  /** Type PG: integer */
  DayNumberToSecondReminder: number;
  /** Type PG: integer */
  DayNumberToThirdReminder: number;
  /** Type PG: boolean */
  IsCustomerAccount: boolean;
  /** Type PG: smallint */
  WebContactSendKind: number;
  /** Type PG: boolean */
  SubjectToRE: boolean;
  /** Type PG: uuid */
  UniqueId: string;
  /** Type PG: boolean */
  DisallowOrderAssort: boolean;
  /** Type PG: boolean */
  DisallowDeliveryAssort: boolean;
  /** Type PG: boolean */
  SendReminderToPayerThird: boolean;
  /** Type PG: boolean */
  xx_Envoi_carte_voeux: boolean;
  /** Type PG: boolean */
  AssortDeliveryByOrder: boolean;
  /** Type PG: boolean */
  CreatePosDeliveryOrderByDefault: boolean;
  /** Type PG: smallint */
  LoyaltyOriginReportType: number;
  /** Type PG: numeric */
  LoyaltyOriginReportValue: number;
  /** Type PG: numeric */
  LoyaltyValue: number;
  /** Type PG: character varying | Max length: 10 */
  LoyaltyCardType?: string;
  /** Type PG: character varying | Max length: 20 */
  LoyaltyCardId?: string;
  /** Type PG: timestamp without time zone */
  LoyaltyCardCreationDate?: Date;
  /** Type PG: smallint */
  LoyaltyCardValidityDuration?: number;
  /** Type PG: timestamp without time zone */
  LoyaltyCardExpiryDate?: Date;
  /** Type PG: timestamp without time zone */
  LoyaltyCardRenewalDate?: Date;
  /** Type PG: integer */
  sysRecordVersion?: number;
  /** Type PG: uuid */
  sysRecordVersionId?: string;
  /** Type PG: integer */
  sysEditCounter?: number;
  /** Type PG: uuid */
  SelectedReminderReport?: string;
  /** Type PG: character varying | Max length: 8 */
  ShippingId?: string;
  /** Type PG: character varying | Max length: 2 */
  DocumentSerialId?: string;
  /** Type PG: smallint */
  IdentificationType?: number;
  /** Type PG: character varying | Max length: 40 */
  AnalyticAccounting_GridId?: string;
  /** Type PG: smallint */
  Type?: number;
  /** Type PG: character varying | Max length: 20 */
  Accounts_Account?: string;
  /** Type PG: character varying | Max length: 3 */
  CurrencyId?: string;
  /** Type PG: uuid */
  Group1?: string;
  /** Type PG: uuid */
  Group2?: string;
  /** Type PG: character varying | Max length: 20 */
  ColleagueId?: string;
  /** Type PG: timestamp without time zone */
  FirstInvoicingDate?: Date;
  /** Type PG: character varying | Max length: 6 */
  SettlementModeId?: string;
  /** Type PG: smallint */
  PaymentDate?: number;
  /** Type PG: character varying | Max length: 8 */
  PriceListCategoryId?: string;
  /** Type PG: character varying | Max length: 20 */
  Siren?: string;
  /** Type PG: character varying | Max length: 8 */
  NAF?: string;
  /** Type PG: character varying | Max length: 10 */
  FamilyId?: string;
  /** Type PG: character varying | Max length: 10 */
  SubFamilyId?: string;
  /** Type PG: character varying | Max length: 20 */
  IntracommunityVATNumber?: string;
  /** Type PG: character varying | Max length: 255 */
  MainInvoicingContact_ExternalId_GoogleId?: string;
  /** Type PG: character varying | Max length: 255 */
  MainInvoicingContact_ExternalId_OutlookId?: string;
  /** Type PG: character varying | Max length: 25 */
  Civility?: string;
  /** Type PG: character varying | Max length: 255 */
  MainDeliveryContact_ExternalId_GoogleId?: string;
  /** Type PG: character varying | Max length: 255 */
  MainDeliveryContact_ExternalId_OutlookId?: string;
  /** Type PG: character varying | Max length: 25 */
  MainInvoicingContact_Civility?: string;
  /** Type PG: character varying | Max length: 60 */
  MainInvoicingContact_Name?: string;
  /** Type PG: character varying | Max length: 60 */
  MainInvoicingContact_FirstName?: string;
  /** Type PG: character varying | Max length: 20 */
  MainInvoicingContact_Phone?: string;
  /** Type PG: character varying | Max length: 20 */
  MainInvoicingContact_CellPhone?: string;
  /** Type PG: character varying | Max length: 20 */
  MainInvoicingContact_Fax?: string;
  /** Type PG: character varying | Max length: 100 */
  MainInvoicingContact_Email?: string;
  /** Type PG: character varying | Max length: 40 */
  MainInvoicingContact_Function?: string;
  /** Type PG: character varying | Max length: 40 */
  MainInvoicingContact_Department?: string;
  /** Type PG: character varying | Max length: 100 */
  MainInvoicingAddress_WebSite?: string;
  /** Type PG: numeric */
  MainInvoicingAddress_Longitude?: number;
  /** Type PG: numeric */
  MainInvoicingAddress_Latitude?: number;
  /** Type PG: character varying | Max length: 25 */
  MainDeliveryContact_Civility?: string;
  /** Type PG: character varying | Max length: 60 */
  MainDeliveryContact_Name?: string;
  /** Type PG: character varying | Max length: 60 */
  MainDeliveryContact_FirstName?: string;
  /** Type PG: character varying | Max length: 20 */
  MainDeliveryContact_Phone?: string;
  /** Type PG: character varying | Max length: 20 */
  MainDeliveryContact_CellPhone?: string;
  /** Type PG: character varying | Max length: 20 */
  MainDeliveryContact_Fax?: string;
  /** Type PG: character varying | Max length: 100 */
  MainDeliveryContact_Email?: string;
  /** Type PG: character varying | Max length: 40 */
  MainDeliveryContact_Function?: string;
  /** Type PG: character varying | Max length: 40 */
  MainDeliveryContact_Department?: string;
  /** Type PG: character varying | Max length: 100 */
  MainDeliveryAddress_WebSite?: string;
  /** Type PG: numeric */
  MainDeliveryAddress_Longitude?: number;
  /** Type PG: numeric */
  MainDeliveryAddress_Latitude?: number;
  /** Type PG: character varying | Max length: 40 */
  MainInvoicingAddress_Address1?: string;
  /** Type PG: character varying | Max length: 40 */
  MainInvoicingAddress_Address2?: string;
  /** Type PG: character varying | Max length: 40 */
  MainInvoicingAddress_Address3?: string;
  /** Type PG: character varying | Max length: 40 */
  MainInvoicingAddress_Address4?: string;
  /** Type PG: character varying | Max length: 10 */
  MainInvoicingAddress_ZipCode?: string;
  /** Type PG: character varying | Max length: 35 */
  MainInvoicingAddress_City?: string;
  /** Type PG: character varying | Max length: 50 */
  MainInvoicingAddress_State?: string;
  /** Type PG: character varying | Max length: 3 */
  MainInvoicingAddress_CountryIsoCode?: string;
  /** Type PG: character varying | Max length: 50 */
  MainInvoicingAddress_Description?: string;
  /** Type PG: character varying | Max length: 25 */
  MainInvoicingAddress_Civility?: string;
  /** Type PG: character varying | Max length: 60 */
  MainInvoicingAddress_ThirdName?: string;
  /** Type PG: character varying | Max length: 40 */
  MainDeliveryAddress_Address1?: string;
  /** Type PG: character varying | Max length: 40 */
  MainDeliveryAddress_Address2?: string;
  /** Type PG: character varying | Max length: 40 */
  MainDeliveryAddress_Address3?: string;
  /** Type PG: character varying | Max length: 40 */
  MainDeliveryAddress_Address4?: string;
  /** Type PG: character varying | Max length: 10 */
  MainDeliveryAddress_ZipCode?: string;
  /** Type PG: character varying | Max length: 35 */
  MainDeliveryAddress_City?: string;
  /** Type PG: character varying | Max length: 50 */
  MainDeliveryAddress_State?: string;
  /** Type PG: character varying | Max length: 3 */
  MainDeliveryAddress_CountryIsoCode?: string;
  /** Type PG: character varying | Max length: 50 */
  MainDeliveryAddress_Description?: string;
  /** Type PG: character varying | Max length: 25 */
  MainDeliveryAddress_Civility?: string;
  /** Type PG: character varying | Max length: 60 */
  MainDeliveryAddress_ThirdName?: string;
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
  Accounts_BillOfExchangeAccountingAccount?: string;
  /** Type PG: uuid */
  TaxIds0?: string;
  /** Type PG: uuid */
  TaxIds1?: string;
  /** Type PG: uuid */
  TaxIds2?: string;
  /** Type PG: character varying | Max length: 20 */
  PaymentThirdId?: string;
  /** Type PG: character varying | Max length: 20 */
  InvoicingThirdId?: string;
  /** Type PG: uuid */
  InvoicingChargesVatId?: string;
  /** Type PG: timestamp without time zone */
  LastInvoicingDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  DocumentPrintMention?: string;
  /** Type PG: uuid */
  StorehouseId?: string;
  /** Type PG: character varying | Max length: 20 */
  Accounts_AuxiliaryAccount?: string;
  /** Type PG: character varying | Max length: 20 */
  Accounts_DoubtfulAccount?: string;
  /** Type PG: integer */
  SchedulerColor?: number;
  /** Type PG: character varying | Max length: 8 */
  TravelExpenseId?: string;
  /** Type PG: boolean */
  xx_Desabonne_Newsletter: boolean;
  /** Type PG: boolean */
  MainDeliveryContact_AllowUsePersonnalDatas?: boolean;
  /** Type PG: boolean */
  MainInvoicingContact_AllowUsePersonnalDatas?: boolean;
  /** Type PG: boolean */
  AllowUsePersonnalDatas: boolean;
  /** Type PG: character varying | Max length: 5 */
  Nic?: string;
  /** Type PG: numeric */
  LoyaltyCumulativeTurnoverReport: number;
  /** Type PG: numeric */
  LoyaltyCumulativeTurnover: number;
  /** Type PG: boolean */
  ShowTechnicalSheetOnFront: boolean;
  /** Type PG: text */
  TechnicalSheetClear?: string;
  /** Type PG: text */
  TechnicalSheet?: string;
  /** Type PG: numeric */
  DepositPercentage?: number;
  /** Type PG: character varying | Max length: 100 */
  BuyerReference?: string;
  /** Type PG: character varying | Max length: 30 */
  GoCardLessThirdId?: string;
  /** Type PG: uuid */
  DefaultBankAccountId?: string;
  /** Type PG: boolean */
  xx_Envoi_facture_par_mail: boolean;
  /** Type PG: boolean */
  xx_Contrat_maintenance_EBP: boolean;
  /** Type PG: character varying | Max length: 20 */
  xx_login_ticket?: string;
  /** Type PG: character varying | Max length: 20 */
  xx_mdp_ticket?: string;
  /** Type PG: character varying | Max length: 10 */
  MainDeliveryAddress_CodeINSEE?: string;
  /** Type PG: character varying | Max length: 50 */
  MainDeliveryAddress_CityINSEE?: string;
  /** Type PG: character varying | Max length: 10 */
  MainInvoicingAddress_CodeINSEE?: string;
  /** Type PG: character varying | Max length: 50 */
  MainInvoicingAddress_CityINSEE?: string;
  /** Type PG: character varying | Max length: 20 */
  CnssCode?: string;
  /** Type PG: character varying | Max length: 20 */
  BusinessTaxCode?: string;
  /** Type PG: character varying | Max length: 20 */
  CnieCode?: string;
  /** Type PG: boolean */
  ApplyItemOtherTax: boolean;
  /** Type PG: boolean */
  AssortMaintenanceContractInvoices: boolean;
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
  /** Type PG: smallint */
  NeotouchSendingType: number;
  /** Type PG: smallint */
  NeotouchDuplicateSendingType: number;
  /** Type PG: text */
  NeotouchContactsIdForDuplicate?: string;
  /** Type PG: smallint */
  SendReceiptByMail: number;
  /** Type PG: smallint */
  PrintReceiptChoice: number;
  /** Type PG: timestamp without time zone */
  BirthDate?: Date;
  /** Type PG: character varying | Max length: 14 */
  IduCode?: string;
  /** Type PG: character varying | Max length: 20 */
  CnpsCode?: string;
  /** Type PG: character varying | Max length: 40 */
  MainDeliveryContact_Profession?: string;
  /** Type PG: character varying | Max length: 40 */
  MainInvoicingContact_Profession?: string;
  /** Type PG: character varying | Max length: 40 */
  UrssafId?: string;
  /** Type PG: smallint */
  CustomerTypology?: number;
  /** Type PG: boolean */
  HasAssociatedFiles: boolean;
  /** Type PG: uuid */
  VatExemptionReasonId?: string;
}
