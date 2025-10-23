/**
 * Interface pour la table: ConstructionSiteReferenceDocument
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface ConstructionSiteReferenceDocument {
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
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 30 */
  DocumentNumber: string;
  /** Type PG: character varying | Max length: 14 */
  NumberPrefix: string;
  /** Type PG: numeric */
  NumberSuffix: number;
  /** Type PG: timestamp without time zone */
  DocumentDate: Date;
  /** Type PG: integer */
  GlobalDocumentOrder: number;
  /** Type PG: uuid */
  StorehouseId?: string;
  /** Type PG: boolean */
  DispatchedByStorehouse: boolean;
  /** Type PG: uuid */
  TransferedDocumentId?: string;
  /** Type PG: numeric */
  TotalVolume: number;
  /** Type PG: numeric */
  TotalWeight: number;
  /** Type PG: character varying | Max length: 70 */
  Reference?: string;
  /** Type PG: smallint */
  RecoveredFrom?: number;
  /** Type PG: boolean */
  ModifiedSinceRecovery?: boolean;
  /** Type PG: character varying | Max length: 10 */
  DealId?: string;
  /** Type PG: character varying | Max length: 2 */
  SerialId: string;
  /** Type PG: character varying | Max length: 8 */
  MaintenanceContractId?: string;
  /** Type PG: character varying | Max length: 8 */
  IncidentId?: string;
  /** Type PG: character varying | Max length: 10 */
  ConstructionSiteId?: string;
  /** Type PG: uuid */
  Hash_ChainedId?: string;
  /** Type PG: bytea */
  Hash_Hash?: Buffer;
  /** Type PG: uuid */
  AssociatedInvoiceId?: string;
  /** Type PG: uuid */
  AssociatedDeliveryOrderId?: string;
  /** Type PG: uuid */
  AssociatedOrderId?: string;
  /** Type PG: uuid */
  TerritorialityId: string;
  /** Type PG: uuid */
  VatId: string;
  /** Type PG: uuid */
  InvoicingAddressId?: string;
  /** Type PG: uuid */
  InvoicingContactId?: string;
  /** Type PG: uuid */
  DeliveryAddressId?: string;
  /** Type PG: uuid */
  DeliveryContactId?: string;
  /** Type PG: character varying | Max length: 40 */
  InvoicingAddress_Address1?: string;
  /** Type PG: character varying | Max length: 40 */
  InvoicingAddress_Address2?: string;
  /** Type PG: character varying | Max length: 40 */
  InvoicingAddress_Address3?: string;
  /** Type PG: character varying | Max length: 40 */
  InvoicingAddress_Address4?: string;
  /** Type PG: character varying | Max length: 10 */
  InvoicingAddress_ZipCode?: string;
  /** Type PG: character varying | Max length: 35 */
  InvoicingAddress_City?: string;
  /** Type PG: character varying | Max length: 50 */
  InvoicingAddress_State?: string;
  /** Type PG: character varying | Max length: 3 */
  InvoicingAddress_CountryIsoCode?: string;
  /** Type PG: character varying | Max length: 50 */
  InvoicingAddress_Description?: string;
  /** Type PG: character varying | Max length: 25 */
  InvoicingAddress_Civility?: string;
  /** Type PG: character varying | Max length: 60 */
  InvoicingAddress_ThirdName?: string;
  /** Type PG: boolean */
  InvoicingAddress_Npai: boolean;
  /** Type PG: character varying | Max length: 100 */
  InvoicingAddress_WebSite?: string;
  /** Type PG: numeric */
  InvoicingAddress_Longitude?: number;
  /** Type PG: numeric */
  InvoicingAddress_Latitude?: number;
  /** Type PG: character varying | Max length: 25 */
  InvoicingContact_Civility?: string;
  /** Type PG: character varying | Max length: 60 */
  InvoicingContact_Name?: string;
  /** Type PG: character varying | Max length: 60 */
  InvoicingContact_FirstName?: string;
  /** Type PG: character varying | Max length: 20 */
  InvoicingContact_Phone?: string;
  /** Type PG: character varying | Max length: 20 */
  InvoicingContact_CellPhone?: string;
  /** Type PG: character varying | Max length: 20 */
  InvoicingContact_Fax?: string;
  /** Type PG: character varying | Max length: 100 */
  InvoicingContact_Email?: string;
  /** Type PG: character varying | Max length: 40 */
  InvoicingContact_Function?: string;
  /** Type PG: character varying | Max length: 40 */
  InvoicingContact_Department?: string;
  /** Type PG: character varying | Max length: 40 */
  DeliveryAddress_Address1?: string;
  /** Type PG: character varying | Max length: 40 */
  DeliveryAddress_Address2?: string;
  /** Type PG: character varying | Max length: 40 */
  DeliveryAddress_Address3?: string;
  /** Type PG: character varying | Max length: 40 */
  DeliveryAddress_Address4?: string;
  /** Type PG: character varying | Max length: 10 */
  DeliveryAddress_ZipCode?: string;
  /** Type PG: character varying | Max length: 35 */
  DeliveryAddress_City?: string;
  /** Type PG: character varying | Max length: 50 */
  DeliveryAddress_State?: string;
  /** Type PG: character varying | Max length: 3 */
  DeliveryAddress_CountryIsoCode?: string;
  /** Type PG: character varying | Max length: 50 */
  DeliveryAddress_Description?: string;
  /** Type PG: character varying | Max length: 25 */
  DeliveryAddress_Civility?: string;
  /** Type PG: character varying | Max length: 60 */
  DeliveryAddress_ThirdName?: string;
  /** Type PG: boolean */
  DeliveryAddress_Npai: boolean;
  /** Type PG: character varying | Max length: 100 */
  DeliveryAddress_WebSite?: string;
  /** Type PG: numeric */
  DeliveryAddress_Longitude?: number;
  /** Type PG: numeric */
  DeliveryAddress_Latitude?: number;
  /** Type PG: character varying | Max length: 25 */
  DeliveryContact_Civility?: string;
  /** Type PG: character varying | Max length: 60 */
  DeliveryContact_Name?: string;
  /** Type PG: character varying | Max length: 60 */
  DeliveryContact_FirstName?: string;
  /** Type PG: character varying | Max length: 20 */
  DeliveryContact_Phone?: string;
  /** Type PG: character varying | Max length: 20 */
  DeliveryContact_CellPhone?: string;
  /** Type PG: character varying | Max length: 20 */
  DeliveryContact_Fax?: string;
  /** Type PG: character varying | Max length: 100 */
  DeliveryContact_Email?: string;
  /** Type PG: character varying | Max length: 40 */
  DeliveryContact_Function?: string;
  /** Type PG: character varying | Max length: 40 */
  DeliveryContact_Department?: string;
  /** Type PG: boolean */
  UseInvoicingAddressAsDeliveryAddress: boolean;
  /** Type PG: boolean */
  UseInvoicingContactAsDeliveryContact: boolean;
  /** Type PG: character varying | Max length: 6 */
  SettlementModeId?: string;
  /** Type PG: smallint */
  ValidationState?: number;
  /** Type PG: integer */
  DocumentState?: number;
  /** Type PG: timestamp without time zone */
  ValidityDate?: Date;
  /** Type PG: timestamp without time zone */
  DeliveryDate?: Date;
  /** Type PG: smallint */
  DeliveryState?: number;
  /** Type PG: smallint */
  ReturnState?: number;
  /** Type PG: numeric */
  CommitmentsBalanceDue: number;
  /** Type PG: numeric */
  CostPrice: number;
  /** Type PG: numeric */
  DiscountRate: number;
  /** Type PG: numeric */
  DiscountAmount: number;
  /** Type PG: numeric */
  AmountVatExcluded: number;
  /** Type PG: numeric */
  AmountVatExcludedWithDiscount: number;
  /** Type PG: character varying | Max length: 8 */
  ShippingId?: string;
  /** Type PG: boolean */
  ShippingNotSubjectToFinancialDiscount: boolean;
  /** Type PG: numeric */
  ShippingAmountVatExcluded: number;
  /** Type PG: uuid */
  ShippingVatId: string;
  /** Type PG: numeric */
  AmountVatExcludedWithDiscountAndShipping: number;
  /** Type PG: numeric */
  AmountVatExcludedWithDiscountAndShippingWithoutEcotax: number;
  /** Type PG: numeric */
  VatAmountWithoutEcotax: number;
  /** Type PG: numeric */
  VatAmount: number;
  /** Type PG: numeric */
  AmountVatIncluded: number;
  /** Type PG: numeric */
  PreviousDepositAmount: number;
  /** Type PG: numeric */
  DepositAmount: number;
  /** Type PG: numeric */
  DepositCurrencyAmount: number;
  /** Type PG: numeric */
  PreviousDepositCurrencyAmount: number;
  /** Type PG: numeric */
  TotalDueAmount: number;
  /** Type PG: boolean */
  IsEcotaxAmountIncludedToDueAmount: boolean;
  /** Type PG: numeric */
  EcotaxAmountVatExcluded: number;
  /** Type PG: numeric */
  EcotaxVatAmount: number;
  /** Type PG: numeric */
  EcotaxAmountVatIncluded: number;
  /** Type PG: uuid */
  DetailVatAmount0_DetailVatId?: string;
  /** Type PG: numeric */
  DetailVatAmount0_DetailVatRate?: number;
  /** Type PG: numeric */
  DetailVatAmount0_DetailAmountVatExcluded?: number;
  /** Type PG: numeric */
  DetailVatAmount0_DetailVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount0_DetailAmountVatIncluded?: number;
  /** Type PG: numeric */
  DetailVatAmount0_DetailDepositVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount0_DetailVatAmountWithoutDepositAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount0_EcotaxAmountVatExcluded?: number;
  /** Type PG: numeric */
  DetailVatAmount0_EcotaxAmountVatIncluded?: number;
  /** Type PG: numeric */
  DetailVatAmount0_EcotaxVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount0_VatAmountOnDebit?: number;
  /** Type PG: numeric */
  DetailVatAmount0_VatAmountOnCollection?: number;
  /** Type PG: numeric */
  DetailVatAmount0_VatAmountOnCollectionWithoutDeposit: number;
  /** Type PG: numeric */
  DetailVatAmount0_VatAmountOnDebitWithoutDeposit: number;
  /** Type PG: numeric */
  DetailVatAmount0_TaxAmount: number;
  /** Type PG: numeric */
  DetailVatAmount0_TaxVatAmount: number;
  /** Type PG: numeric */
  DetailVatAmount0_REAmount: number;
  /** Type PG: numeric */
  DetailVatAmount0_DetailDepositREAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount0_DetailREAmountWithoutDepositAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount0_CurrencyDetailAmountVatExcluded?: number;
  /** Type PG: numeric */
  DetailVatAmount0_CurrencyDetailVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount0_CurrencyDetailAmountVatIncluded?: number;
  /** Type PG: numeric */
  DetailVatAmount0_CurrencyDetailDepositVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount0_CurrencyDetailVatAmountWithoutDepositAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount0_CurrencyEcotaxAmountVatExcluded?: number;
  /** Type PG: numeric */
  DetailVatAmount0_CurrencyEcotaxAmountVatIncluded?: number;
  /** Type PG: numeric */
  DetailVatAmount0_CurrencyEcotaxVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount0_CurrencyVatAmountOnDebit?: number;
  /** Type PG: numeric */
  DetailVatAmount0_CurrencyVatAmountOnCollection?: number;
  /** Type PG: numeric */
  DetailVatAmount0_CurrencyVatAmountOnCollectionWithoutDeposit: number;
  /** Type PG: numeric */
  DetailVatAmount0_CurrencyVatAmountOnDebitWithoutDeposit: number;
  /** Type PG: numeric */
  DetailVatAmount0_CurrencyTaxAmount: number;
  /** Type PG: numeric */
  DetailVatAmount0_CurrencyTaxVatAmount: number;
  /** Type PG: numeric */
  DetailVatAmount0_CurrencyREAmount: number;
  /** Type PG: numeric */
  DetailVatAmount0_CurrencyDetailDepositREAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount0_CurrencyDetailREAmountWithoutDepositAmount?: number;
  /** Type PG: uuid */
  DetailVatAmount1_DetailVatId?: string;
  /** Type PG: numeric */
  DetailVatAmount1_DetailVatRate?: number;
  /** Type PG: numeric */
  DetailVatAmount1_DetailAmountVatExcluded?: number;
  /** Type PG: numeric */
  DetailVatAmount1_DetailVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount1_DetailAmountVatIncluded?: number;
  /** Type PG: numeric */
  DetailVatAmount1_DetailDepositVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount1_DetailVatAmountWithoutDepositAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount1_EcotaxAmountVatExcluded?: number;
  /** Type PG: numeric */
  DetailVatAmount1_EcotaxAmountVatIncluded?: number;
  /** Type PG: numeric */
  DetailVatAmount1_EcotaxVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount1_VatAmountOnDebit?: number;
  /** Type PG: numeric */
  DetailVatAmount1_VatAmountOnCollection?: number;
  /** Type PG: numeric */
  DetailVatAmount1_VatAmountOnCollectionWithoutDeposit: number;
  /** Type PG: numeric */
  DetailVatAmount1_VatAmountOnDebitWithoutDeposit: number;
  /** Type PG: numeric */
  DetailVatAmount1_TaxAmount: number;
  /** Type PG: numeric */
  DetailVatAmount1_TaxVatAmount: number;
  /** Type PG: numeric */
  DetailVatAmount1_REAmount: number;
  /** Type PG: numeric */
  DetailVatAmount1_DetailDepositREAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount1_DetailREAmountWithoutDepositAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount1_CurrencyDetailAmountVatExcluded?: number;
  /** Type PG: numeric */
  DetailVatAmount1_CurrencyDetailVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount1_CurrencyDetailAmountVatIncluded?: number;
  /** Type PG: numeric */
  DetailVatAmount1_CurrencyDetailDepositVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount1_CurrencyDetailVatAmountWithoutDepositAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount1_CurrencyEcotaxAmountVatExcluded?: number;
  /** Type PG: numeric */
  DetailVatAmount1_CurrencyEcotaxAmountVatIncluded?: number;
  /** Type PG: numeric */
  DetailVatAmount1_CurrencyEcotaxVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount1_CurrencyVatAmountOnDebit?: number;
  /** Type PG: numeric */
  DetailVatAmount1_CurrencyVatAmountOnCollection?: number;
  /** Type PG: numeric */
  DetailVatAmount1_CurrencyVatAmountOnCollectionWithoutDeposit: number;
  /** Type PG: numeric */
  DetailVatAmount1_CurrencyVatAmountOnDebitWithoutDeposit: number;
  /** Type PG: numeric */
  DetailVatAmount1_CurrencyTaxAmount: number;
  /** Type PG: numeric */
  DetailVatAmount1_CurrencyTaxVatAmount: number;
  /** Type PG: numeric */
  DetailVatAmount1_CurrencyREAmount: number;
  /** Type PG: numeric */
  DetailVatAmount1_CurrencyDetailDepositREAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount1_CurrencyDetailREAmountWithoutDepositAmount?: number;
  /** Type PG: uuid */
  DetailVatAmount2_DetailVatId?: string;
  /** Type PG: numeric */
  DetailVatAmount2_DetailVatRate?: number;
  /** Type PG: numeric */
  DetailVatAmount2_DetailAmountVatExcluded?: number;
  /** Type PG: numeric */
  DetailVatAmount2_DetailVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount2_DetailAmountVatIncluded?: number;
  /** Type PG: numeric */
  DetailVatAmount2_DetailDepositVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount2_DetailVatAmountWithoutDepositAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount2_EcotaxAmountVatExcluded?: number;
  /** Type PG: numeric */
  DetailVatAmount2_EcotaxAmountVatIncluded?: number;
  /** Type PG: numeric */
  DetailVatAmount2_EcotaxVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount2_VatAmountOnDebit?: number;
  /** Type PG: numeric */
  DetailVatAmount2_VatAmountOnCollection?: number;
  /** Type PG: numeric */
  DetailVatAmount2_VatAmountOnCollectionWithoutDeposit: number;
  /** Type PG: numeric */
  DetailVatAmount2_VatAmountOnDebitWithoutDeposit: number;
  /** Type PG: numeric */
  DetailVatAmount2_TaxAmount: number;
  /** Type PG: numeric */
  DetailVatAmount2_TaxVatAmount: number;
  /** Type PG: numeric */
  DetailVatAmount2_REAmount: number;
  /** Type PG: numeric */
  DetailVatAmount2_DetailDepositREAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount2_DetailREAmountWithoutDepositAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount2_CurrencyDetailAmountVatExcluded?: number;
  /** Type PG: numeric */
  DetailVatAmount2_CurrencyDetailVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount2_CurrencyDetailAmountVatIncluded?: number;
  /** Type PG: numeric */
  DetailVatAmount2_CurrencyDetailDepositVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount2_CurrencyDetailVatAmountWithoutDepositAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount2_CurrencyEcotaxAmountVatExcluded?: number;
  /** Type PG: numeric */
  DetailVatAmount2_CurrencyEcotaxAmountVatIncluded?: number;
  /** Type PG: numeric */
  DetailVatAmount2_CurrencyEcotaxVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount2_CurrencyVatAmountOnDebit?: number;
  /** Type PG: numeric */
  DetailVatAmount2_CurrencyVatAmountOnCollection?: number;
  /** Type PG: numeric */
  DetailVatAmount2_CurrencyVatAmountOnCollectionWithoutDeposit: number;
  /** Type PG: numeric */
  DetailVatAmount2_CurrencyVatAmountOnDebitWithoutDeposit: number;
  /** Type PG: numeric */
  DetailVatAmount2_CurrencyTaxAmount: number;
  /** Type PG: numeric */
  DetailVatAmount2_CurrencyTaxVatAmount: number;
  /** Type PG: numeric */
  DetailVatAmount2_CurrencyREAmount: number;
  /** Type PG: numeric */
  DetailVatAmount2_CurrencyDetailDepositREAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount2_CurrencyDetailREAmountWithoutDepositAmount?: number;
  /** Type PG: uuid */
  DetailVatAmount3_DetailVatId?: string;
  /** Type PG: numeric */
  DetailVatAmount3_DetailVatRate?: number;
  /** Type PG: numeric */
  DetailVatAmount3_DetailAmountVatExcluded?: number;
  /** Type PG: numeric */
  DetailVatAmount3_DetailVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount3_DetailAmountVatIncluded?: number;
  /** Type PG: numeric */
  DetailVatAmount3_DetailDepositVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount3_DetailVatAmountWithoutDepositAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount3_EcotaxAmountVatExcluded?: number;
  /** Type PG: numeric */
  DetailVatAmount3_EcotaxAmountVatIncluded?: number;
  /** Type PG: numeric */
  DetailVatAmount3_EcotaxVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount3_VatAmountOnDebit?: number;
  /** Type PG: numeric */
  DetailVatAmount3_VatAmountOnCollection?: number;
  /** Type PG: numeric */
  DetailVatAmount3_VatAmountOnCollectionWithoutDeposit: number;
  /** Type PG: numeric */
  DetailVatAmount3_VatAmountOnDebitWithoutDeposit: number;
  /** Type PG: numeric */
  DetailVatAmount3_TaxAmount: number;
  /** Type PG: numeric */
  DetailVatAmount3_TaxVatAmount: number;
  /** Type PG: numeric */
  DetailVatAmount3_REAmount: number;
  /** Type PG: numeric */
  DetailVatAmount3_DetailDepositREAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount3_DetailREAmountWithoutDepositAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount3_CurrencyDetailAmountVatExcluded?: number;
  /** Type PG: numeric */
  DetailVatAmount3_CurrencyDetailVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount3_CurrencyDetailAmountVatIncluded?: number;
  /** Type PG: numeric */
  DetailVatAmount3_CurrencyDetailDepositVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount3_CurrencyDetailVatAmountWithoutDepositAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount3_CurrencyEcotaxAmountVatExcluded?: number;
  /** Type PG: numeric */
  DetailVatAmount3_CurrencyEcotaxAmountVatIncluded?: number;
  /** Type PG: numeric */
  DetailVatAmount3_CurrencyEcotaxVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount3_CurrencyVatAmountOnDebit?: number;
  /** Type PG: numeric */
  DetailVatAmount3_CurrencyVatAmountOnCollection?: number;
  /** Type PG: numeric */
  DetailVatAmount3_CurrencyVatAmountOnCollectionWithoutDeposit: number;
  /** Type PG: numeric */
  DetailVatAmount3_CurrencyVatAmountOnDebitWithoutDeposit: number;
  /** Type PG: numeric */
  DetailVatAmount3_CurrencyTaxAmount: number;
  /** Type PG: numeric */
  DetailVatAmount3_CurrencyTaxVatAmount: number;
  /** Type PG: numeric */
  DetailVatAmount3_CurrencyREAmount: number;
  /** Type PG: numeric */
  DetailVatAmount3_CurrencyDetailDepositREAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount3_CurrencyDetailREAmountWithoutDepositAmount?: number;
  /** Type PG: uuid */
  DetailVatAmount4_DetailVatId?: string;
  /** Type PG: numeric */
  DetailVatAmount4_DetailVatRate?: number;
  /** Type PG: numeric */
  DetailVatAmount4_DetailAmountVatExcluded?: number;
  /** Type PG: numeric */
  DetailVatAmount4_DetailVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount4_DetailAmountVatIncluded?: number;
  /** Type PG: numeric */
  DetailVatAmount4_DetailDepositVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount4_DetailVatAmountWithoutDepositAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount4_EcotaxAmountVatExcluded?: number;
  /** Type PG: numeric */
  DetailVatAmount4_EcotaxAmountVatIncluded?: number;
  /** Type PG: numeric */
  DetailVatAmount4_EcotaxVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount4_VatAmountOnDebit?: number;
  /** Type PG: numeric */
  DetailVatAmount4_VatAmountOnCollection?: number;
  /** Type PG: numeric */
  DetailVatAmount4_VatAmountOnCollectionWithoutDeposit: number;
  /** Type PG: numeric */
  DetailVatAmount4_VatAmountOnDebitWithoutDeposit: number;
  /** Type PG: numeric */
  DetailVatAmount4_TaxAmount: number;
  /** Type PG: numeric */
  DetailVatAmount4_TaxVatAmount: number;
  /** Type PG: numeric */
  DetailVatAmount4_REAmount: number;
  /** Type PG: numeric */
  DetailVatAmount4_DetailDepositREAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount4_DetailREAmountWithoutDepositAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount4_CurrencyDetailAmountVatExcluded?: number;
  /** Type PG: numeric */
  DetailVatAmount4_CurrencyDetailVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount4_CurrencyDetailAmountVatIncluded?: number;
  /** Type PG: numeric */
  DetailVatAmount4_CurrencyDetailDepositVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount4_CurrencyDetailVatAmountWithoutDepositAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount4_CurrencyEcotaxAmountVatExcluded?: number;
  /** Type PG: numeric */
  DetailVatAmount4_CurrencyEcotaxAmountVatIncluded?: number;
  /** Type PG: numeric */
  DetailVatAmount4_CurrencyEcotaxVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount4_CurrencyVatAmountOnDebit?: number;
  /** Type PG: numeric */
  DetailVatAmount4_CurrencyVatAmountOnCollection?: number;
  /** Type PG: numeric */
  DetailVatAmount4_CurrencyVatAmountOnCollectionWithoutDeposit: number;
  /** Type PG: numeric */
  DetailVatAmount4_CurrencyVatAmountOnDebitWithoutDeposit: number;
  /** Type PG: numeric */
  DetailVatAmount4_CurrencyTaxAmount: number;
  /** Type PG: numeric */
  DetailVatAmount4_CurrencyTaxVatAmount: number;
  /** Type PG: numeric */
  DetailVatAmount4_CurrencyREAmount: number;
  /** Type PG: numeric */
  DetailVatAmount4_CurrencyDetailDepositREAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount4_CurrencyDetailREAmountWithoutDepositAmount?: number;
  /** Type PG: uuid */
  DetailVatAmount5_DetailVatId?: string;
  /** Type PG: numeric */
  DetailVatAmount5_DetailVatRate?: number;
  /** Type PG: numeric */
  DetailVatAmount5_DetailAmountVatExcluded?: number;
  /** Type PG: numeric */
  DetailVatAmount5_DetailVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount5_DetailAmountVatIncluded?: number;
  /** Type PG: numeric */
  DetailVatAmount5_DetailDepositVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount5_DetailVatAmountWithoutDepositAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount5_EcotaxAmountVatExcluded?: number;
  /** Type PG: numeric */
  DetailVatAmount5_EcotaxAmountVatIncluded?: number;
  /** Type PG: numeric */
  DetailVatAmount5_EcotaxVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount5_VatAmountOnDebit?: number;
  /** Type PG: numeric */
  DetailVatAmount5_VatAmountOnCollection?: number;
  /** Type PG: numeric */
  DetailVatAmount5_VatAmountOnCollectionWithoutDeposit: number;
  /** Type PG: numeric */
  DetailVatAmount5_VatAmountOnDebitWithoutDeposit: number;
  /** Type PG: numeric */
  DetailVatAmount5_TaxAmount: number;
  /** Type PG: numeric */
  DetailVatAmount5_TaxVatAmount: number;
  /** Type PG: numeric */
  DetailVatAmount5_REAmount: number;
  /** Type PG: numeric */
  DetailVatAmount5_DetailDepositREAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount5_DetailREAmountWithoutDepositAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount5_CurrencyDetailAmountVatExcluded?: number;
  /** Type PG: numeric */
  DetailVatAmount5_CurrencyDetailVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount5_CurrencyDetailAmountVatIncluded?: number;
  /** Type PG: numeric */
  DetailVatAmount5_CurrencyDetailDepositVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount5_CurrencyDetailVatAmountWithoutDepositAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount5_CurrencyEcotaxAmountVatExcluded?: number;
  /** Type PG: numeric */
  DetailVatAmount5_CurrencyEcotaxAmountVatIncluded?: number;
  /** Type PG: numeric */
  DetailVatAmount5_CurrencyEcotaxVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount5_CurrencyVatAmountOnDebit?: number;
  /** Type PG: numeric */
  DetailVatAmount5_CurrencyVatAmountOnCollection?: number;
  /** Type PG: numeric */
  DetailVatAmount5_CurrencyVatAmountOnCollectionWithoutDeposit: number;
  /** Type PG: numeric */
  DetailVatAmount5_CurrencyVatAmountOnDebitWithoutDeposit: number;
  /** Type PG: numeric */
  DetailVatAmount5_CurrencyTaxAmount: number;
  /** Type PG: numeric */
  DetailVatAmount5_CurrencyTaxVatAmount: number;
  /** Type PG: numeric */
  DetailVatAmount5_CurrencyREAmount: number;
  /** Type PG: numeric */
  DetailVatAmount5_CurrencyDetailDepositREAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount5_CurrencyDetailREAmountWithoutDepositAmount?: number;
  /** Type PG: character varying | Max length: 6 */
  PaymentTypeId?: string;
  /** Type PG: uuid */
  AccountingExchangeGroupId?: string;
  /** Type PG: boolean */
  PriceWithTaxBased: boolean;
  /** Type PG: character varying | Max length: 6 */
  BankId?: string;
  /** Type PG: smallint */
  VatMode: number;
  /** Type PG: integer */
  NumberOfPackage: number;
  /** Type PG: boolean */
  IsCustomNumberOfPackage: boolean;
  /** Type PG: numeric */
  OtherTaxAmount: number;
  /** Type PG: numeric */
  OtherTaxAmountNotSubjectToVat: number;
  /** Type PG: numeric */
  CurrencyOtherTaxAmount: number;
  /** Type PG: numeric */
  CurrencyOtherTaxAmountNotSubjectToVat: number;
  /** Type PG: smallint */
  FinancialDiscountType: number;
  /** Type PG: numeric */
  FinancialDiscountRate: number;
  /** Type PG: numeric */
  FinancialDiscountAmount: number;
  /** Type PG: numeric */
  AmountWithFinancialDiscount: number;
  /** Type PG: uuid */
  ReportId: string;
  /** Type PG: integer */
  NumberOfCopies: number;
  /** Type PG: uuid */
  ThirdBankAccountId?: string;
  /** Type PG: uuid */
  DetailTaxAmount0_TaxId?: string;
  /** Type PG: character varying | Max length: 100 */
  DetailTaxAmount0_TaxCaption?: string;
  /** Type PG: smallint */
  DetailTaxAmount0_TaxCalculationBase?: number;
  /** Type PG: numeric */
  DetailTaxAmount0_BaseAmount: number;
  /** Type PG: numeric */
  DetailTaxAmount0_TaxAmount: number;
  /** Type PG: numeric */
  DetailTaxAmount0_CurrencyBaseAmount: number;
  /** Type PG: numeric */
  DetailTaxAmount0_CurrencyTaxAmount: number;
  /** Type PG: uuid */
  DetailTaxAmount1_TaxId?: string;
  /** Type PG: character varying | Max length: 100 */
  DetailTaxAmount1_TaxCaption?: string;
  /** Type PG: smallint */
  DetailTaxAmount1_TaxCalculationBase?: number;
  /** Type PG: numeric */
  DetailTaxAmount1_BaseAmount: number;
  /** Type PG: numeric */
  DetailTaxAmount1_TaxAmount: number;
  /** Type PG: numeric */
  DetailTaxAmount1_CurrencyBaseAmount: number;
  /** Type PG: numeric */
  DetailTaxAmount1_CurrencyTaxAmount: number;
  /** Type PG: uuid */
  DetailTaxAmount2_TaxId?: string;
  /** Type PG: character varying | Max length: 100 */
  DetailTaxAmount2_TaxCaption?: string;
  /** Type PG: smallint */
  DetailTaxAmount2_TaxCalculationBase?: number;
  /** Type PG: numeric */
  DetailTaxAmount2_BaseAmount: number;
  /** Type PG: numeric */
  DetailTaxAmount2_TaxAmount: number;
  /** Type PG: numeric */
  DetailTaxAmount2_CurrencyBaseAmount: number;
  /** Type PG: numeric */
  DetailTaxAmount2_CurrencyTaxAmount: number;
  /** Type PG: uuid */
  DetailTaxAmount3_TaxId?: string;
  /** Type PG: character varying | Max length: 100 */
  DetailTaxAmount3_TaxCaption?: string;
  /** Type PG: smallint */
  DetailTaxAmount3_TaxCalculationBase?: number;
  /** Type PG: numeric */
  DetailTaxAmount3_BaseAmount: number;
  /** Type PG: numeric */
  DetailTaxAmount3_TaxAmount: number;
  /** Type PG: numeric */
  DetailTaxAmount3_CurrencyBaseAmount: number;
  /** Type PG: numeric */
  DetailTaxAmount3_CurrencyTaxAmount: number;
  /** Type PG: uuid */
  DetailTaxAmount4_TaxId?: string;
  /** Type PG: character varying | Max length: 100 */
  DetailTaxAmount4_TaxCaption?: string;
  /** Type PG: smallint */
  DetailTaxAmount4_TaxCalculationBase?: number;
  /** Type PG: numeric */
  DetailTaxAmount4_BaseAmount: number;
  /** Type PG: numeric */
  DetailTaxAmount4_TaxAmount: number;
  /** Type PG: numeric */
  DetailTaxAmount4_CurrencyBaseAmount: number;
  /** Type PG: numeric */
  DetailTaxAmount4_CurrencyTaxAmount: number;
  /** Type PG: uuid */
  DetailTaxAmount5_TaxId?: string;
  /** Type PG: character varying | Max length: 100 */
  DetailTaxAmount5_TaxCaption?: string;
  /** Type PG: smallint */
  DetailTaxAmount5_TaxCalculationBase?: number;
  /** Type PG: numeric */
  DetailTaxAmount5_BaseAmount: number;
  /** Type PG: numeric */
  DetailTaxAmount5_TaxAmount: number;
  /** Type PG: numeric */
  DetailTaxAmount5_CurrencyBaseAmount: number;
  /** Type PG: numeric */
  DetailTaxAmount5_CurrencyTaxAmount: number;
  /** Type PG: character varying | Max length: 6 */
  CompanyBankId?: string;
  /** Type PG: character varying | Max length: 3 */
  CurrencyId?: string;
  /** Type PG: numeric */
  CurrencyConversionRate: number;
  /** Type PG: numeric */
  CurrencyTotalDueAmount: number;
  /** Type PG: numeric */
  CommitmentsCurrencyBalanceDue: number;
  /** Type PG: numeric */
  CurrencyAmountVatIncluded: number;
  /** Type PG: smallint */
  CurrencyApplicationType: number;
  /** Type PG: numeric */
  CurrencyAmountVatExcluded: number;
  /** Type PG: numeric */
  CurrencyAmountVatExcludedWithDiscountAndShipping: number;
  /** Type PG: numeric */
  CurrencyAmountWithFinancialDiscount: number;
  /** Type PG: numeric */
  CurrencyShippingAmountVatExcluded: number;
  /** Type PG: numeric */
  CurrencyAmountVatExcludedWithDiscount: number;
  /** Type PG: numeric */
  CurrencyAmountVatExcludedWithDiscountAndShippingWithoutEcotax: number;
  /** Type PG: numeric */
  CurrencyEcotaxAmountVatIncluded: number;
  /** Type PG: numeric */
  CurrencyFinancialDiscountAmount: number;
  /** Type PG: numeric */
  CurrencyVatAmountWithoutEcotax: number;
  /** Type PG: numeric */
  CurrencyEcotaxVatAmount: number;
  /** Type PG: numeric */
  CurrencyEcotaxAmountVatExcluded: number;
  /** Type PG: numeric */
  CurrencyVatAmount: number;
  /** Type PG: numeric */
  CurrencyDiscountAmount: number;
  /** Type PG: smallint */
  ShippingAmountInclusionType: number;
  /** Type PG: boolean */
  Printed: boolean;
  /** Type PG: character varying | Max length: 1 */
  IntrastatTransportMode?: string;
  /** Type PG: character varying | Max length: 2 */
  IntrastatTransactionNature?: string;
  /** Type PG: character varying | Max length: 3 */
  IntrastatIncoterm?: string;
  /** Type PG: uuid */
  AppliedPriceListLineId?: string;
  /** Type PG: character varying | Max length: 8 */
  PriceListCategory?: string;
  /** Type PG: boolean */
  SubjectToRE: boolean;
  /** Type PG: numeric */
  REAmount: number;
  /** Type PG: numeric */
  TotalNetWeight: number;
  /** Type PG: character varying | Max length: 255 */
  CorrectionCause?: string;
  /** Type PG: character varying | Max length: 3 */
  CorrectionReasonId?: string;
  /** Type PG: smallint */
  CorrectionType: number;
  /** Type PG: numeric */
  IRPFAmount: number;
  /** Type PG: numeric */
  IRPFRate: number;
  /** Type PG: smallint */
  IdentificationType?: number;
  /** Type PG: boolean */
  AutomaticSettlementGeneration: boolean;
  /** Type PG: numeric */
  RemainingDepositAmount: number;
  /** Type PG: numeric */
  RemainingDepositCurrencyAmount: number;
  /** Type PG: smallint */
  DeliveryOrderPreparationState?: number;
  /** Type PG: smallint */
  ReturnOrderPreparationState?: number;
  /** Type PG: numeric */
  RemainingAmountToDeliver: number;
  /** Type PG: numeric */
  RemainingAmountToDeliverVatExcluded: number;
  /** Type PG: character varying | Max length: 20 */
  PaymentThirdId?: string;
  /** Type PG: character varying | Max length: 20 */
  InvoicingThirdId?: string;
  /** Type PG: uuid */
  TaxIds0?: string;
  /** Type PG: uuid */
  TaxIds1?: string;
  /** Type PG: uuid */
  TaxIds2?: string;
  /** Type PG: boolean */
  SendedByMail: boolean;
  /** Type PG: character varying | Max length: 20 */
  ColleagueId?: string;
  /** Type PG: character varying | Max length: 20 */
  OrderThirdId?: string;
  /** Type PG: boolean */
  KeepDepositVatAmount: boolean;
  /** Type PG: character varying | Max length: 3 */
  DocumentLanguage: string;
  /** Type PG: character varying | Max length: 140 */
  SepaCommunication?: string;
  /** Type PG: boolean */
  IsStructuredSepaCommunication: boolean;
  /** Type PG: character varying | Max length: 255 */
  ReverseChargeMention?: string;
  /** Type PG: boolean */
  InvoicingChargesNotSubjectToFinancialDiscount: boolean;
  /** Type PG: numeric */
  InvoicingChargesAmountVatExcluded: number;
  /** Type PG: uuid */
  InvoicingChargesVatId: string;
  /** Type PG: numeric */
  CurrencyInvoicingChargesAmountVatExcluded: number;
  /** Type PG: smallint */
  LoadFabricationComponentsMode: number;
  /** Type PG: boolean */
  FixedShippingAmount: boolean;
  /** Type PG: boolean */
  DoNotCreateMovement: boolean;
  /** Type PG: smallint */
  ExtraFeeDistributionMode: number;
  /** Type PG: smallint */
  ExtraFeeBase: number;
  /** Type PG: numeric */
  ExtraFeeTotalAmount: number;
  /** Type PG: numeric */
  ExtraFeeDistributedAmount: number;
  /** Type PG: numeric */
  ExtraFeeDistributionRates_GoodDistributeRate?: number;
  /** Type PG: numeric */
  ExtraFeeDistributionRates_ServiceDistributeRate?: number;
  /** Type PG: numeric */
  ExtraFeeDistributionRates_EquipmentDistributeRate?: number;
  /** Type PG: timestamp without time zone */
  LastRefreshPurchaseStateDate?: Date;
  /** Type PG: character varying | Max length: 4 */
  Revision: string;
  /** Type PG: smallint */
  DocumentType: number;
  /** Type PG: smallint */
  OriginDocumentType?: number;
  /** Type PG: character varying | Max length: 20 */
  CustomerId: string;
  /** Type PG: character varying | Max length: 60 */
  CustomerName: string;
  /** Type PG: character varying | Max length: 25 */
  CustomerCivility?: string;
  /** Type PG: character varying | Max length: 20 */
  CustomerIntracommunityVatNumber?: string;
  /** Type PG: numeric */
  InterestAmountVatExcluded: number;
  /** Type PG: numeric */
  InterestRate: number;
  /** Type PG: smallint */
  Priority?: number;
  /** Type PG: character varying | Max length: 20 */
  IntervenerId?: string;
  /** Type PG: numeric */
  HumanServiceTotalAmount: number;
  /** Type PG: numeric */
  HumanServiceAmountSettledByOther: number;
  /** Type PG: numeric */
  HumanServiceAmountSettledByCESU: number;
  /** Type PG: numeric */
  HumanServiceAmountSettledByCESUP: number;
  /** Type PG: numeric */
  HumanServiceDeductibleAmount: number;
  /** Type PG: numeric */
  GrossInterestBase: number;
  /** Type PG: numeric */
  GrossInterestRate: number;
  /** Type PG: numeric */
  GrossInterestAmount: number;
  /** Type PG: character varying | Max length: 110 */
  OriginDocumentNumber?: string;
  /** Type PG: numeric */
  BrandRate: number;
  /** Type PG: numeric */
  NetBrandRate: number;
  /** Type PG: character varying | Max length: 20 */
  ThirdIdToDeliver?: string;
  /** Type PG: smallint */
  DeliveryAddressType?: number;
  /** Type PG: boolean */
  CountermarForcedkOnLines: boolean;
  /** Type PG: uuid */
  DocumentOptionsId?: string;
  /** Type PG: integer */
  sysEditCounter?: number;
  /** Type PG: integer */
  sysRecordVersion?: number;
  /** Type PG: uuid */
  sysRecordVersionId?: string;
  /** Type PG: uuid */
  sysModuleId?: string;
  /** Type PG: uuid */
  sysDatabaseId?: string;
  /** Type PG: character varying | Max length: 10 */
  InvoicingAddress_CodeINSEE?: string;
  /** Type PG: character varying | Max length: 50 */
  InvoicingAddress_CityINSEE?: string;
  /** Type PG: character varying | Max length: 10 */
  DeliveryAddress_CodeINSEE?: string;
  /** Type PG: character varying | Max length: 50 */
  DeliveryAddress_CityINSEE?: string;
  /** Type PG: uuid */
  DetailTaxAmount0_VatId?: string;
  /** Type PG: numeric */
  DetailTaxAmount0_VatAmount: number;
  /** Type PG: uuid */
  DetailTaxAmount1_VatId?: string;
  /** Type PG: numeric */
  DetailTaxAmount1_VatAmount: number;
  /** Type PG: uuid */
  DetailTaxAmount2_VatId?: string;
  /** Type PG: numeric */
  DetailTaxAmount2_VatAmount: number;
  /** Type PG: uuid */
  DetailTaxAmount3_VatId?: string;
  /** Type PG: numeric */
  DetailTaxAmount3_VatAmount: number;
  /** Type PG: uuid */
  DetailTaxAmount4_VatId?: string;
  /** Type PG: numeric */
  DetailTaxAmount4_VatAmount: number;
  /** Type PG: uuid */
  DetailTaxAmount5_VatId?: string;
  /** Type PG: numeric */
  DetailTaxAmount5_VatAmount: number;
  /** Type PG: uuid */
  CustomerHeadOfficeAddressId?: string;
  /** Type PG: character varying | Max length: 40 */
  InvoicingContact_Profession?: string;
  /** Type PG: character varying | Max length: 40 */
  DeliveryContact_Profession?: string;
  /** Type PG: numeric */
  EligibleToMealVoucherAmount: number;
}
