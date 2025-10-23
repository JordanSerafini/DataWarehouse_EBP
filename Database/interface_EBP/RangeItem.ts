/**
 * Interface pour la table: RangeItem
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface RangeItem {
  /** Type PG: character varying | Max length: 40 */
  Id: string;
  /** Type PG: character varying | Max length: 80 */
  Caption: string;
  /** Type PG: numeric */
  DefaultQuantity: number;
  /** Type PG: smallint */
  ItemType: number;
  /** Type PG: numeric */
  PurchasePrice: number;
  /** Type PG: numeric */
  ChargeRate: number;
  /** Type PG: numeric */
  ChargeAmount: number;
  /** Type PG: numeric */
  CostPrice: number;
  /** Type PG: numeric */
  InterestRate: number;
  /** Type PG: numeric */
  InterestAmount: number;
  /** Type PG: numeric */
  SalePriceVatExcluded: number;
  /** Type PG: numeric */
  BrandRate: number;
  /** Type PG: numeric */
  VatAmount: number;
  /** Type PG: numeric */
  SalePriceVatIncluded: number;
  /** Type PG: boolean */
  ManageStock: boolean;
  /** Type PG: numeric */
  Weight: number;
  /** Type PG: numeric */
  NetWeight: number;
  /** Type PG: numeric */
  ComponentsPurchasePrice: number;
  /** Type PG: numeric */
  ComponentsCostPrice: number;
  /** Type PG: numeric */
  ComponentsSalePriceVatExcluded: number;
  /** Type PG: numeric */
  ComponentsSalePriceVatIncluded: number;
  /** Type PG: smallint */
  PrintComponentDetail: number;
  /** Type PG: boolean */
  AllowNegativeStock: boolean;
  /** Type PG: smallint */
  ActiveState: number;
  /** Type PG: numeric */
  Volume: number;
  /** Type PG: boolean */
  UseComponentVat: boolean;
  /** Type PG: boolean */
  ApplyPriceListOnComponents: boolean;
  /** Type PG: numeric */
  AdvisedSalePriceVATExcluded: number;
  /** Type PG: boolean */
  SetItemSalePriceWithAdvisedSalePrice: boolean;
  /** Type PG: smallint */
  TrackingMode: number;
  /** Type PG: boolean */
  AllowComponentsModification: boolean;
  /** Type PG: boolean */
  AllowPublishOnWeb: boolean;
  /** Type PG: integer */
  ImageVersion: number;
  /** Type PG: smallint */
  PriceDecimalNumber: number;
  /** Type PG: boolean */
  IntrastatExcluded: boolean;
  /** Type PG: boolean */
  IsHumanServicesIncludedInAttestation: boolean;
  /** Type PG: boolean */
  Oxatis_ShowInStockNote: boolean;
  /** Type PG: boolean */
  Oxatis_ShowStockLevel: boolean;
  /** Type PG: boolean */
  Oxatis_ShowIfOutOfStock: boolean;
  /** Type PG: boolean */
  Oxatis_SaleIfOutOfStock: boolean;
  /** Type PG: integer */
  Oxatis_SaleIfOutOfStockScenario: number;
  /** Type PG: boolean */
  Oxatis_ShowDaysToship: boolean;
  /** Type PG: numeric */
  Oxatis_ShipPrice: number;
  /** Type PG: integer */
  Oxatis_DaysToship: number;
  /** Type PG: boolean */
  Oxatis_UserMainSupplierDaysToship: boolean;
  /** Type PG: boolean */
  InterventionDurationEqualsQuantity: boolean;
  /** Type PG: numeric */
  Height: number;
  /** Type PG: numeric */
  Width: number;
  /** Type PG: numeric */
  Length: number;
  /** Type PG: boolean */
  Oxatis_UseSubFamilyAsBrand: boolean;
  /** Type PG: boolean */
  IsManagedByCounterMark: boolean;
  /** Type PG: boolean */
  IsCounterMarkForced: boolean;
  /** Type PG: numeric */
  SalePurchaseConversionRate: number;
  /** Type PG: smallint */
  LimitDateMode: number;
  /** Type PG: smallint */
  LimitDateSafetyDelay: number;
  /** Type PG: numeric */
  Oxatis_HandlingSurcharge1ST: number;
  /** Type PG: numeric */
  Oxatis_HandlingSurchargeOthers: number;
  /** Type PG: boolean */
  BillOfQuantitiesProgram_KeepActiveFromQuoteToOrder: boolean;
  /** Type PG: boolean */
  SaleUnitPriceProgram_KeepActiveFromQuoteToOrder: boolean;
  /** Type PG: boolean */
  PurchaseBillOfQuantitiesProgram_KeepActiveFromQuoteToOrder: boolean;
  /** Type PG: smallint */
  BarCodeCalculationMode: number;
  /** Type PG: boolean */
  PurchaseUnitPriceProgram_KeepActiveFromQuoteToOrder: boolean;
  /** Type PG: boolean */
  UpdateComponentsStockInFabrication: boolean;
  /** Type PG: boolean */
  CanBePartiallyDelivered: boolean;
  /** Type PG: boolean */
  NotOnMarket: boolean;
  /** Type PG: boolean */
  CreateCustomerProductInCustomerPark: boolean;
  /** Type PG: boolean */
  IsMaintenanceContract: boolean;
  /** Type PG: boolean */
  IncludeToRecursiveReplenishment: boolean;
  /** Type PG: boolean */
  IncludeToFabricationReplenishment: boolean;
  /** Type PG: boolean */
  IncludeToSupplierReplenishment: boolean;
  /** Type PG: integer */
  CadenceQuantity: number;
  /** Type PG: integer */
  CadenceNumberOfDays: number;
  /** Type PG: boolean */
  DoNotAssortAssemblyRequestsWithDifferentDates: boolean;
  /** Type PG: integer */
  MaximumGapDayToAssort: number;
  /** Type PG: smallint */
  NomenclatureAccountingTransferTypeForSale: number;
  /** Type PG: smallint */
  NomenclatureAccountingTransferTypeForPurchase: number;
  /** Type PG: character varying | Max length: 10 */
  RangeTypeId0: string;
  /** Type PG: boolean */
  IsGuaranteeExtension: boolean;
  /** Type PG: smallint */
  CustomerParkCreation: number;
  /** Type PG: boolean */
  StockBookingAllowed: boolean;
  /** Type PG: boolean */
  AutomaticStockBooking: boolean;
  /** Type PG: boolean */
  StockBillOfQuantitiesProgram_KeepActiveFromQuoteToOrder: boolean;
  /** Type PG: numeric */
  PurchaseChargesRate: number;
  /** Type PG: smallint */
  BarCodePrice: number;
  /** Type PG: smallint */
  BarCodeWeight: number;
  /** Type PG: boolean */
  PosAddItem: boolean;
  /** Type PG: numeric */
  LoyaltyPoints: number;
  /** Type PG: smallint */
  CalculateLoyaltyFrom: number;
  /** Type PG: boolean */
  AllowCalculateRangeNomenclatures: boolean;
  /** Type PG: uuid */
  DefaultAllowedStorehouseId?: string;
  /** Type PG: character varying | Max length: 10 */
  RangeTypeId1?: string;
  /** Type PG: character varying | Max length: 10 */
  RangeTypeId2?: string;
  /** Type PG: character varying | Max length: 10 */
  RangeTypeId3?: string;
  /** Type PG: character varying | Max length: 10 */
  RangeTypeId4?: string;
  /** Type PG: text */
  RangeTypeElementSelections0?: string;
  /** Type PG: text */
  RangeTypeElementSelections1?: string;
  /** Type PG: text */
  RangeTypeElementSelections2?: string;
  /** Type PG: text */
  RangeTypeElementSelections3?: string;
  /** Type PG: text */
  RangeTypeElementSelections4?: string;
  /** Type PG: character varying | Max length: 10 */
  RangeTemplateId?: string;
  /** Type PG: character varying | Max length: 8 */
  MaintenanceContractTemplateId?: string;
  /** Type PG: character varying | Max length: 8 */
  GuaranteeTypeId?: string;
  /** Type PG: smallint */
  ReplenishmentDeliveryAddressType?: number;
  /** Type PG: character varying | Max length: 11 */
  EcotaxFurnitureId?: string;
  /** Type PG: integer */
  sysEditCounter?: number;
  /** Type PG: text */
  PurchaseUnitPriceProgram_Program?: string;
  /** Type PG: text */
  PurchaseBillOfQuantitiesProgram_Program?: string;
  /** Type PG: text */
  SaleUnitPriceProgram_Program?: string;
  /** Type PG: bytea */
  Oxatis_SmallImage?: Buffer;
  /** Type PG: smallint */
  LimitDateSafetyDelayMode?: number;
  /** Type PG: smallint */
  DefaultLifeTime?: number;
  /** Type PG: smallint */
  PurchasePriceUpdateType?: number;
  /** Type PG: character varying | Max length: 40 */
  AnalyticAccounting_GridId?: string;
  /** Type PG: text */
  BillOfQuantitiesProgram_Program?: string;
  /** Type PG: character varying | Max length: 4 */
  PurchaseUnitId?: string;
  /** Type PG: character varying | Max length: 4 */
  DimensionUnitId?: string;
  /** Type PG: text */
  Oxatis_LongDescription?: string;
  /** Type PG: text */
  Oxatis_LongDescriptionClear?: string;
  /** Type PG: smallint */
  Oxatis_CategoryType1?: number;
  /** Type PG: smallint */
  Oxatis_CategoryType2?: number;
  /** Type PG: smallint */
  Oxatis_CategoryType3?: number;
  /** Type PG: uuid */
  Oxatis_CategoryId1?: string;
  /** Type PG: uuid */
  Oxatis_CategoryId2?: string;
  /** Type PG: uuid */
  Oxatis_CategoryId3?: string;
  /** Type PG: character varying | Max length: 100 */
  Oxatis_MetaTitle?: string;
  /** Type PG: character varying | Max length: 200 */
  Oxatis_MetaDescription?: string;
  /** Type PG: character varying | Max length: 200 */
  Oxatis_MetaKeywords?: string;
  /** Type PG: character varying | Max length: 50 */
  Oxatis_Brand?: string;
  /** Type PG: character varying | Max length: 20 */
  MainIntervener?: string;
  /** Type PG: character varying | Max length: 9 */
  IntrastatNc8NomenclatureId?: string;
  /** Type PG: character varying | Max length: 3 */
  IntrastatOriginCountryId?: string;
  /** Type PG: uuid */
  Group1?: string;
  /** Type PG: uuid */
  Group2?: string;
  /** Type PG: smallint */
  NotPrintable?: number;
  /** Type PG: smallint */
  NotIncluded?: number;
  /** Type PG: smallint */
  IsFixedPrice?: number;
  /** Type PG: smallint */
  ComponentCalculationType?: number;
  /** Type PG: character varying | Max length: 4 */
  VolumeUnitId?: string;
  /** Type PG: smallint */
  NonInvoiceableType?: number;
  /** Type PG: character varying | Max length: 4 */
  WeightUnitId?: string;
  /** Type PG: integer */
  NumberOfItemByPackage?: number;
  /** Type PG: character varying | Max length: 8 */
  EcotaxId?: string;
  /** Type PG: smallint */
  StockDestination?: number;
  /** Type PG: character varying | Max length: 20 */
  StockVarianceAccount?: string;
  /** Type PG: character varying | Max length: 20 */
  CurrentStockAccount?: string;
  /** Type PG: uuid */
  VatId?: string;
  /** Type PG: text */
  DesCom?: string;
  /** Type PG: text */
  DesComClear?: string;
  /** Type PG: text */
  LocalizableDesCom_2?: string;
  /** Type PG: text */
  LocalizableDesCom_Clear_2?: string;
  /** Type PG: text */
  LocalizableDesCom_3?: string;
  /** Type PG: text */
  LocalizableDesCom_Clear_3?: string;
  /** Type PG: text */
  LocalizableDesCom_4?: string;
  /** Type PG: text */
  LocalizableDesCom_Clear_4?: string;
  /** Type PG: text */
  LocalizableDesCom_5?: string;
  /** Type PG: text */
  LocalizableDesCom_Clear_5?: string;
  /** Type PG: bytea */
  ItemImage?: Buffer;
  /** Type PG: character varying | Max length: 40 */
  BarCode?: string;
  /** Type PG: character varying | Max length: 4 */
  UnitId?: string;
  /** Type PG: character varying | Max length: 20 */
  SupplierId?: string;
  /** Type PG: character varying | Max length: 80 */
  LocalizableCaption_2?: string;
  /** Type PG: character varying | Max length: 80 */
  LocalizableCaption_3?: string;
  /** Type PG: character varying | Max length: 80 */
  LocalizableCaption_4?: string;
  /** Type PG: character varying | Max length: 80 */
  LocalizableCaption_5?: string;
  /** Type PG: character varying | Max length: 10 */
  FamilyId?: string;
  /** Type PG: character varying | Max length: 10 */
  SubFamilyId?: string;
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
  /** Type PG: text */
  StockBillOfQuantitiesProgram_Program?: string;
  /** Type PG: bytea */
  PosThumbnail?: Buffer;
  /** Type PG: boolean */
  CanBePartiallyInvoiced: boolean;
  /** Type PG: boolean */
  PickMovementDisallowedOnTotallyBookedItem: boolean;
  /** Type PG: boolean */
  IsExtraFee: boolean;
  /** Type PG: timestamp without time zone */
  SalePriceModifiedDate?: Date;
  /** Type PG: character varying | Max length: 20 */
  SalePriceModifiedUserId?: string;
  /** Type PG: boolean */
  SubjectToIRPF: boolean;
  /** Type PG: smallint */
  VatType: number;
  /** Type PG: numeric */
  VatOnMarginBase: number;
  /** Type PG: numeric */
  VatOnMarginRate: number;
  /** Type PG: smallint */
  Oxatis_CategoryType4?: number;
  /** Type PG: smallint */
  Oxatis_CategoryType5?: number;
  /** Type PG: smallint */
  Oxatis_CategoryType6?: number;
  /** Type PG: smallint */
  Oxatis_CategoryType7?: number;
  /** Type PG: smallint */
  Oxatis_CategoryType8?: number;
  /** Type PG: smallint */
  Oxatis_CategoryType9?: number;
  /** Type PG: smallint */
  Oxatis_CategoryType10?: number;
  /** Type PG: uuid */
  Oxatis_CategoryId4?: string;
  /** Type PG: uuid */
  Oxatis_CategoryId5?: string;
  /** Type PG: uuid */
  Oxatis_CategoryId6?: string;
  /** Type PG: uuid */
  Oxatis_CategoryId7?: string;
  /** Type PG: uuid */
  Oxatis_CategoryId8?: string;
  /** Type PG: uuid */
  Oxatis_CategoryId9?: string;
  /** Type PG: uuid */
  Oxatis_CategoryId10?: string;
  /** Type PG: smallint */
  ExcludedFromFooterDiscount?: number;
  /** Type PG: smallint */
  ExcludedFromFinancialDiscount?: number;
  /** Type PG: character varying | Max length: 3 */
  ServiceType?: string;
  /** Type PG: boolean */
  HasAssociatedFiles: boolean;
}
