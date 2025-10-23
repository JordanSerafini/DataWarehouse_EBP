/**
 * Interface pour la table: SaleDocumentLine
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface SaleDocumentLine {
  /** Type PG: boolean */
  PosScaleDeletedLine: boolean;
  /** Type PG: numeric */
  OrderedQuantity: number;
  /** Type PG: boolean */
  QuantityDecreaseByFreeQuantity: boolean;
  /** Type PG: numeric */
  PurchasePricePercentage: number;
  /** Type PG: boolean */
  IntrastatExcluded: boolean;
  /** Type PG: boolean */
  Booked: boolean;
  /** Type PG: boolean */
  StockBookingAllowed: boolean;
  /** Type PG: boolean */
  HasAnalyticAffectations: boolean;
  /** Type PG: boolean */
  CreateCustomerProductInCustomerPark: boolean;
  /** Type PG: boolean */
  CreateMaintenanceContract: boolean;
  /** Type PG: numeric */
  CostPricePercentage: number;
  /** Type PG: numeric */
  SalePriceVatExcludedPercentage: number;
  /** Type PG: numeric */
  SalePriceVatIncludedPercentage: number;
  /** Type PG: numeric */
  NetBrandRate: number;
  /** Type PG: boolean */
  FixedQuantity: boolean;
  /** Type PG: uuid */
  DocumentId: string;
  /** Type PG: smallint */
  LineType: number;
  /** Type PG: integer */
  LineOrder: number;
  /** Type PG: boolean */
  IsReferencedItem: boolean;
  /** Type PG: numeric */
  Quantity: number;
  /** Type PG: numeric */
  RealQuantity: number;
  /** Type PG: numeric */
  PurchasePrice: number;
  /** Type PG: numeric */
  ChargeRate: number;
  /** Type PG: numeric */
  ChargeAmount: number;
  /** Type PG: numeric */
  CostPrice: number;
  /** Type PG: numeric */
  UnitDiscountRate: number;
  /** Type PG: numeric */
  UnitDiscountAmountVatExcluded: number;
  /** Type PG: numeric */
  UnitDiscountAmountVatIncluded: number;
  /** Type PG: numeric */
  CurrencyTotalUnitDiscountAmountVatExcluded: number;
  /** Type PG: numeric */
  CurrencyTotalUnitDiscountAmountVatIncluded: number;
  /** Type PG: numeric */
  TotalDiscountRate: number;
  /** Type PG: boolean */
  IsNetPriceWithFullDecimals: boolean;
  /** Type PG: numeric */
  NetPriceVatExcluded: number;
  /** Type PG: numeric */
  NetPriceVatIncluded: number;
  /** Type PG: numeric */
  NetPriceVatExcludedWithDiscount: number;
  /** Type PG: numeric */
  NetPriceVatIncludedWithDiscount: number;
  /** Type PG: numeric */
  NetAmountVatExcluded: number;
  /** Type PG: numeric */
  NetAmountVatExcludedWithDiscount: number;
  /** Type PG: numeric */
  NetAmountVatIncluded: number;
  /** Type PG: numeric */
  NetAmountVatIncludedWithDiscount: number;
  /** Type PG: numeric */
  OtherTaxes2_TaxValue: number;
  /** Type PG: boolean */
  OtherTaxes2_SubjectToVat: boolean;
  /** Type PG: numeric */
  OtherTaxes2_TaxAmount: number;
  /** Type PG: numeric */
  OtherTaxes2_BaseAmount: number;
  /** Type PG: numeric */
  Weight: number;
  /** Type PG: numeric */
  TotalWeight: number;
  /** Type PG: boolean */
  UsePumpForReturn: boolean;
  /** Type PG: numeric */
  ReturnUnitCostPrice: number;
  /** Type PG: numeric */
  ReturnCostPrice: number;
  /** Type PG: boolean */
  IsHumanService: boolean;
  /** Type PG: boolean */
  InterventionDurationEqualQuantity: boolean;
  /** Type PG: smallint */
  GrossInterestRateCalculationType: number;
  /** Type PG: numeric */
  GrossInterestAmount: number;
  /** Type PG: numeric */
  GrossInterestRate: number;
  /** Type PG: numeric */
  GrossInterestBase: number;
  /** Type PG: numeric */
  CurrencySalePriceVatExcluded: number;
  /** Type PG: numeric */
  CurrencySalePriceVatIncluded: number;
  /** Type PG: boolean */
  IsPriceListApplied: boolean;
  /** Type PG: boolean */
  CanApplyPriceListOnComponent: boolean;
  /** Type PG: numeric */
  DispatchedAmountVatExcluded: number;
  /** Type PG: numeric */
  DispatchedAmountVatIncluded: number;
  /** Type PG: numeric */
  REAmount: number;
  /** Type PG: numeric */
  CurrencyNetPriceVatExcluded: number;
  /** Type PG: numeric */
  CurrencyNetPriceVatIncluded: number;
  /** Type PG: numeric */
  CurrencyNetPriceVatExcludedWithDiscount: number;
  /** Type PG: numeric */
  CurrencyNetPriceVatIncludedWithDiscount: number;
  /** Type PG: numeric */
  CurrencyNetAmountVatExcluded: number;
  /** Type PG: numeric */
  CurrencyNetAmountVatExcludedWithDiscount: number;
  /** Type PG: numeric */
  CurrencyNetAmountVatIncluded: number;
  /** Type PG: numeric */
  CurrencyNetAmountVatIncludedWithDiscount: number;
  /** Type PG: numeric */
  CurrencyRealNetAmountVatExcluded: number;
  /** Type PG: numeric */
  CurrencyRealNetAmountVatExcludedWithDiscount: number;
  /** Type PG: numeric */
  CurrencyRealNetAmountVatIncluded: number;
  /** Type PG: numeric */
  CurrencyRealNetAmountVatIncludedWithDiscount: number;
  /** Type PG: numeric */
  CurrencyRealNetAmountVatExcludedWithDiscountAndFinancialDiscoun: number;
  /** Type PG: numeric */
  CurrencyRealNetAmountVatIncludedWithDiscountAndFinancialDiscoun: number;
  /** Type PG: numeric */
  CurrencyRealNetAmountVatExcludedWithParentDiscount: number;
  /** Type PG: numeric */
  CurrencyRealNetAmountVatIncludedWithParentDiscount: number;
  /** Type PG: numeric */
  CurrencyNetPriceVatExcludedWithParentDiscount: number;
  /** Type PG: numeric */
  CurrencyNetPriceVatIncludedWithParentDiscount: number;
  /** Type PG: numeric */
  SalePriceVatExcluded: number;
  /** Type PG: numeric */
  SalePriceVatIncluded: number;
  /** Type PG: numeric */
  InterestRate: number;
  /** Type PG: numeric */
  InterestAmount: number;
  /** Type PG: numeric */
  NetInterestRate: number;
  /** Type PG: numeric */
  NetInterestAmount: number;
  /** Type PG: numeric */
  BrandRate: number;
  /** Type PG: numeric */
  TotalInterestAmount: number;
  /** Type PG: boolean */
  ManageStock: boolean;
  /** Type PG: integer */
  NomenclatureLevel: number;
  /** Type PG: smallint */
  IsPrintable: number;
  /** Type PG: smallint */
  QuantityDecimalNumber: number;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: boolean */
  HasTrackingDispatch: boolean;
  /** Type PG: numeric */
  UnitEcotaxAmountVatExcluded: number;
  /** Type PG: numeric */
  UnitEcotaxAmountVatIncluded: number;
  /** Type PG: numeric */
  EcotaxAmountVatExcluded: number;
  /** Type PG: numeric */
  EcotaxAmountVatIncluded: number;
  /** Type PG: smallint */
  PricesDecimalNumber: number;
  /** Type PG: boolean */
  IsManagedByCountermark: boolean;
  /** Type PG: boolean */
  IsCountermarkInitiated: boolean;
  /** Type PG: numeric */
  Volume: number;
  /** Type PG: numeric */
  TotalVolume: number;
  /** Type PG: integer */
  NumberOfItemByPackage: number;
  /** Type PG: numeric */
  NetWeight: number;
  /** Type PG: numeric */
  TotalNetWeight: number;
  /** Type PG: boolean */
  UseComponentVat: boolean;
  /** Type PG: numeric */
  RealNetAmountVatExcluded: number;
  /** Type PG: numeric */
  RealNetAmountVatExcludedWithDiscount: number;
  /** Type PG: numeric */
  RealNetAmountVatIncluded: number;
  /** Type PG: numeric */
  RealNetAmountVatIncludedWithDiscount: number;
  /** Type PG: numeric */
  RealNetAmountVatExcludedWithDiscountAndFinancialDiscount: number;
  /** Type PG: numeric */
  RealNetAmountVatIncludedWithDiscountAndFinancialDiscount: number;
  /** Type PG: numeric */
  Discounts0_UnitDiscountRate: number;
  /** Type PG: numeric */
  Discounts0_UnitDiscountAmountVatExcluded: number;
  /** Type PG: numeric */
  Discounts0_UnitDiscountAmountVatIncluded: number;
  /** Type PG: numeric */
  Discounts0_CurrencyUnitDiscountAmountVatExcluded: number;
  /** Type PG: numeric */
  Discounts0_CurrencyUnitDiscountAmountVatIncluded: number;
  /** Type PG: numeric */
  Discounts1_UnitDiscountRate: number;
  /** Type PG: numeric */
  Discounts1_UnitDiscountAmountVatExcluded: number;
  /** Type PG: numeric */
  Discounts1_UnitDiscountAmountVatIncluded: number;
  /** Type PG: numeric */
  Discounts1_CurrencyUnitDiscountAmountVatExcluded: number;
  /** Type PG: numeric */
  Discounts1_CurrencyUnitDiscountAmountVatIncluded: number;
  /** Type PG: numeric */
  Discounts2_UnitDiscountRate: number;
  /** Type PG: numeric */
  Discounts2_UnitDiscountAmountVatExcluded: number;
  /** Type PG: numeric */
  Discounts2_UnitDiscountAmountVatIncluded: number;
  /** Type PG: numeric */
  Discounts2_CurrencyUnitDiscountAmountVatExcluded: number;
  /** Type PG: numeric */
  Discounts2_CurrencyUnitDiscountAmountVatIncluded: number;
  /** Type PG: numeric */
  RealNetAmountVatExcludedWithParentDiscount: number;
  /** Type PG: numeric */
  RealNetAmountVatIncludedWithParentDiscount: number;
  /** Type PG: numeric */
  NetPriceVatExcludedWithParentDiscount: number;
  /** Type PG: numeric */
  NetPriceVatIncludedWithParentDiscount: number;
  /** Type PG: boolean */
  NotIncluded: boolean;
  /** Type PG: numeric */
  OtherTaxes0_TaxValue: number;
  /** Type PG: boolean */
  OtherTaxes0_SubjectToVat: boolean;
  /** Type PG: numeric */
  OtherTaxes0_TaxAmount: number;
  /** Type PG: numeric */
  OtherTaxes0_BaseAmount: number;
  /** Type PG: numeric */
  OtherTaxes1_TaxValue: number;
  /** Type PG: boolean */
  OtherTaxes1_SubjectToVat: boolean;
  /** Type PG: numeric */
  OtherTaxes1_TaxAmount: number;
  /** Type PG: numeric */
  OtherTaxes1_BaseAmount: number;
  /** Type PG: boolean */
  IsNumberSetManually: boolean;
  /** Type PG: numeric */
  OtherTaxes0_CurrencyBaseAmount: number;
  /** Type PG: numeric */
  OtherTaxes0_CurrencyTaxAmount: number;
  /** Type PG: numeric */
  OtherTaxes0_CurrencyTaxValue: number;
  /** Type PG: numeric */
  OtherTaxes1_CurrencyBaseAmount: number;
  /** Type PG: numeric */
  OtherTaxes1_CurrencyTaxAmount: number;
  /** Type PG: numeric */
  OtherTaxes1_CurrencyTaxValue: number;
  /** Type PG: numeric */
  OtherTaxes2_CurrencyBaseAmount: number;
  /** Type PG: numeric */
  OtherTaxes2_CurrencyTaxAmount: number;
  /** Type PG: numeric */
  OtherTaxes2_CurrencyTaxValue: number;
  /** Type PG: numeric */
  CurrencyVatAmount: number;
  /** Type PG: numeric */
  CurrencyUnitEcotaxAmountVatExcluded: number;
  /** Type PG: numeric */
  CurrencyUnitEcotaxAmountVatIncluded: number;
  /** Type PG: numeric */
  CurrencyEcotaxAmountVatExcluded: number;
  /** Type PG: numeric */
  CurrencyEcotaxAmountVatIncluded: number;
  /** Type PG: integer */
  PhaseLevel: number;
  /** Type PG: boolean */
  MustPartiallyDeliverCommercialNomenclature: boolean;
  /** Type PG: boolean */
  BillOfQuantitiesProgram_IsActive: boolean;
  /** Type PG: boolean */
  BillOfQuantitiesProgram_KeepActiveFromQuoteToOrder: boolean;
  /** Type PG: boolean */
  UnitPriceProgram_IsActive: boolean;
  /** Type PG: boolean */
  UnitPriceProgram_KeepActiveFromQuoteToOrder: boolean;
  /** Type PG: smallint */
  DoNotCreateMovement: number;
  /** Type PG: smallint */
  Location_MultiLocationMode: number;
  /** Type PG: numeric */
  RemainingQuantityToDeliver: number;
  /** Type PG: numeric */
  RemainingQuantityToInvoice: number;
  /** Type PG: numeric */
  ReturnedQuantity: number;
  /** Type PG: numeric */
  ReturnedQuantityByPreviousCreditMemo: number;
  /** Type PG: integer */
  NumberOfPackage: number;
  /** Type PG: boolean */
  IsCustomNumberOfPackage: boolean;
  /** Type PG: numeric */
  UnitEcotaxFurnitureAmountVatExcluded: number;
  /** Type PG: numeric */
  UnitEcotaxFurnitureAmountVatIncluded: number;
  /** Type PG: numeric */
  EcotaxFurnitureAmountVatExcluded: number;
  /** Type PG: numeric */
  EcotaxFurnitureAmountVatIncluded: number;
  /** Type PG: numeric */
  CurrencyUnitEcotaxFurnitureAmountVatExcluded: number;
  /** Type PG: numeric */
  CurrencyUnitEcotaxFurnitureAmountVatIncluded: number;
  /** Type PG: numeric */
  CurrencyEcotaxFurnitureAmountVatExcluded: number;
  /** Type PG: numeric */
  CurrencyEcotaxFurnitureAmountVatIncluded: number;
  /** Type PG: boolean */
  IncludeEcotaxFurnitureInDueAmount: boolean;
  /** Type PG: character varying | Max length: 100 */
  PosScaleTransactionNumber?: string;
  /** Type PG: character varying | Max length: 20 */
  Account?: string;
  /** Type PG: character varying | Max length: 11 */
  EcotaxFurnitureId?: string;
  /** Type PG: smallint */
  VatMode?: number;
  /** Type PG: timestamp without time zone */
  LimitDate?: Date;
  /** Type PG: uuid */
  ParentLineId?: string;
  /** Type PG: uuid */
  TopParentLineId?: string;
  /** Type PG: character varying | Max length: 40 */
  TrackingNumber?: string;
  /** Type PG: character varying | Max length: 20 */
  ColleagueId?: string;
  /** Type PG: smallint */
  IsFixedPrice?: number;
  /** Type PG: integer */
  sysEditCounter?: number;
  /** Type PG: character varying | Max length: 10 */
  DealId?: string;
  /** Type PG: character varying | Max length: 4 */
  WeightUnitId?: string;
  /** Type PG: character varying | Max length: 4 */
  OtherTaxes2_TaxUnitId?: string;
  /** Type PG: character varying | Max length: 8 */
  EcotaxId?: string;
  /** Type PG: character varying | Max length: 4 */
  UnitId?: string;
  /** Type PG: uuid */
  StorehouseId?: string;
  /** Type PG: integer */
  StockMovementId?: number;
  /** Type PG: text */
  Description?: string;
  /** Type PG: text */
  DescriptionClear?: string;
  /** Type PG: character varying | Max length: 40 */
  ItemId?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: text */
  xx_NumSerie?: string;
  /** Type PG: character varying | Max length: 20 */
  Location_LocationId?: string;
  /** Type PG: smallint */
  ReturnState?: number;
  /** Type PG: text */
  xx_NumSerie_Clear?: string;
  /** Type PG: smallint */
  PurchaseDeliveryAddressType?: number;
  /** Type PG: text */
  UnitPriceProgram_Program?: string;
  /** Type PG: text */
  BillOfQuantitiesProgram_Program?: string;
  /** Type PG: character varying | Max length: 50 */
  Numbering?: string;
  /** Type PG: character varying | Max length: 50 */
  ItemReference?: string;
  /** Type PG: uuid */
  OtherTaxes2_Id?: string;
  /** Type PG: smallint */
  OtherTaxes2_CalculationBase?: number;
  /** Type PG: character varying | Max length: 4 */
  OtherTaxes1_TaxUnitId?: string;
  /** Type PG: uuid */
  OtherTaxes1_Id?: string;
  /** Type PG: smallint */
  OtherTaxes1_CalculationBase?: number;
  /** Type PG: character varying | Max length: 4 */
  OtherTaxes0_TaxUnitId?: string;
  /** Type PG: uuid */
  OtherTaxes0_Id?: string;
  /** Type PG: smallint */
  OtherTaxes0_CalculationBase?: number;
  /** Type PG: smallint */
  Discounts2_DiscountType?: number;
  /** Type PG: smallint */
  Discounts1_DiscountType?: number;
  /** Type PG: smallint */
  Discounts0_DiscountType?: number;
  /** Type PG: smallint */
  NomenclatureCalculationType?: number;
  /** Type PG: character varying | Max length: 4 */
  VolumeUnitId?: string;
  /** Type PG: uuid */
  VatId?: string;
  /** Type PG: numeric */
  VatAmount?: number;
  /** Type PG: timestamp without time zone */
  DeliveryDate?: Date;
  /** Type PG: smallint */
  DeliveryState?: number;
  /** Type PG: numeric */
  FreePercentage?: number;
  /** Type PG: character varying | Max length: 50 */
  SupplierReference?: string;
  /** Type PG: character varying | Max length: 8 */
  CreatedMaintenanceContractId?: string;
  /** Type PG: text */
  LinkedLinesIds?: string;
  /** Type PG: smallint */
  LinkType?: number;
  /** Type PG: text */
  CustomerProductIds?: string;
  /** Type PG: character varying | Max length: 13 */
  Duration?: string;
  /** Type PG: character varying | Max length: 20 */
  SupplierId?: string;
  /** Type PG: character varying | Max length: 40 */
  RangeItemId?: string;
  /** Type PG: character varying | Max length: 8 */
  MaintenanceContractId?: string;
  /** Type PG: character varying | Max length: 8 */
  GuaranteeTypeId?: string;
  /** Type PG: character varying | Max length: 8 */
  IncidentId?: string;
  /** Type PG: numeric */
  DeliveredQuantity?: number;
  /** Type PG: integer */
  AnalyticPlanItemId?: number;
  /** Type PG: uuid */
  OtherTaxes0_SubTaxId?: string;
  /** Type PG: uuid */
  OtherTaxes1_SubTaxId?: string;
  /** Type PG: uuid */
  OtherTaxes2_SubTaxId?: string;
  /** Type PG: boolean */
  IgnoreManualPriceSetForMultiLinePriceList?: boolean;
  /** Type PG: numeric */
  xx_Tarif_1er_janvier_HT?: number;
  /** Type PG: numeric */
  xx_Tarif_1er_janvier_TTC?: number;
  /** Type PG: uuid */
  RoundId?: string;
  /** Type PG: text */
  TechnicalDescription?: string;
  /** Type PG: text */
  TechnicalDescriptionClear?: string;
  /** Type PG: numeric */
  InvoicedQuantity?: number;
  /** Type PG: smallint */
  NomenclatureAccountingTransferType?: number;
  /** Type PG: smallint */
  ProgressStateType?: number;
  /** Type PG: numeric */
  QuantityProgressPercentage: number;
  /** Type PG: numeric */
  TotalQuantityProgressPercentage: number;
  /** Type PG: numeric */
  PreviousTotalQuantityProgressPercentage: number;
  /** Type PG: numeric */
  ProgressPercentage: number;
  /** Type PG: numeric */
  TotalProgressPercentage: number;
  /** Type PG: numeric */
  PreviousTotalProgressPercentage: number;
  /** Type PG: numeric */
  TotalProgressQuantity: number;
  /** Type PG: numeric */
  ProgressRealQuantity: number;
  /** Type PG: numeric */
  PreviousTotalProgressQuantity: number;
  /** Type PG: numeric */
  TotalProgressRealNetAmountVatExcluded: number;
  /** Type PG: numeric */
  CurrencyTotalProgressRealNetAmountVatExcluded: number;
  /** Type PG: numeric */
  PreviousTotalProgressRealNetAmountVatExcluded: number;
  /** Type PG: numeric */
  CurrencyPreviousTotalProgressRealNetAmountVatExcluded: number;
  /** Type PG: uuid */
  LastAcceptedProgressStateLineId?: string;
  /** Type PG: uuid */
  LastProgressStateLineId?: string;
  /** Type PG: uuid */
  ReferenceDocumentLineId?: string;
  /** Type PG: integer */
  ComponentFixedQuantityNumber?: number;
  /** Type PG: numeric */
  FixedQuantityPriceConversionRate?: number;
  /** Type PG: smallint */
  DeliveryOrderInvoiceState?: number;
  /** Type PG: boolean */
  MustPartiallyInvoiceCommercialNomenclature: boolean;
  /** Type PG: numeric */
  NetInterestBase: number;
  /** Type PG: smallint */
  NetInterestCalculationType: number;
  /** Type PG: boolean */
  HasTask: boolean;
  /** Type PG: smallint */
  ExecutionQuoteLineStatus?: number;
  /** Type PG: character varying | Max length: 8 */
  ScheduleEventTemplateId?: string;
  /** Type PG: character varying | Max length: 8 */
  CompetenceId?: string;
  /** Type PG: integer */
  CompetenceNumberToPlan?: number;
  /** Type PG: character varying | Max length: 9 */
  EquipmentTypeId?: string;
  /** Type PG: integer */
  EquipmentTypeNumberToPlan?: number;
  /** Type PG: smallint */
  ConstraintType?: number;
  /** Type PG: timestamp without time zone */
  ConstraintDateTime?: Date;
  /** Type PG: text */
  ConstraintReason?: string;
  /** Type PG: timestamp without time zone */
  Deadline?: Date;
  /** Type PG: uuid */
  ScheduleEventId?: string;
  /** Type PG: smallint */
  CoordinatedActivity: number;
  /** Type PG: boolean */
  IsCritical: boolean;
  /** Type PG: boolean */
  IsMilestone: boolean;
  /** Type PG: numeric */
  PickedStockQuantity: number;
  /** Type PG: numeric */
  ConsumptionQuantity: number;
  /** Type PG: numeric */
  TotalConsumptionQuantity: number;
  /** Type PG: numeric */
  SurplusQuantity: number;
  /** Type PG: numeric */
  TotalSurplusQuantity: number;
  /** Type PG: numeric */
  OriginNetAmountVatExcluded?: number;
  /** Type PG: numeric */
  OriginQuantity?: number;
  /** Type PG: smallint */
  SchedulingType: number;
  /** Type PG: smallint */
  ReplenishmentType: number;
  /** Type PG: smallint */
  ReplenishmentSupplierDocumentType?: number;
  /** Type PG: smallint */
  ReplenishmentSubContractorDocumentType?: number;
  /** Type PG: uuid */
  ConstructionSiteLineId?: string;
  /** Type PG: smallint */
  LineFeature: number;
  /** Type PG: numeric */
  ExtraFeeAmount: number;
  /** Type PG: smallint */
  ExtraFeeState: number;
  /** Type PG: boolean */
  ExtraFeeIsManualDistribution: boolean;
  /** Type PG: character varying | Max length: 20 */
  SubContractorId?: string;
  /** Type PG: character varying | Max length: 50 */
  SubContractorReference?: string;
  /** Type PG: text */
  PurchaseState_State?: string;
  /** Type PG: smallint */
  PurchaseState_Indicator: number;
  /** Type PG: text */
  SubContractorState_State?: string;
  /** Type PG: smallint */
  SubContractorState_Indicator: number;
  /** Type PG: boolean */
  IsExtraFree: boolean;
  /** Type PG: uuid */
  CancelledAmendmentLineId?: string;
  /** Type PG: uuid */
  AddedAmendmentLineId?: string;
  /** Type PG: character varying | Max length: 20 */
  CustomerSubscriptionId?: string;
  /** Type PG: bytea */
  PurchaseState_IndicatorImage?: Buffer;
  /** Type PG: bytea */
  SubContractorState_IndicatorImage?: Buffer;
  /** Type PG: numeric */
  OtherTaxes0_VatRate?: number;
  /** Type PG: uuid */
  OtherTaxes0_VatId?: string;
  /** Type PG: numeric */
  OtherTaxes1_VatRate?: number;
  /** Type PG: uuid */
  OtherTaxes1_VatId?: string;
  /** Type PG: numeric */
  OtherTaxes2_VatRate?: number;
  /** Type PG: uuid */
  OtherTaxes2_VatId?: string;
  /** Type PG: smallint */
  VatType?: number;
  /** Type PG: numeric */
  VatOnMarginRate?: number;
  /** Type PG: numeric */
  VatOnMarginBaseAmount: number;
  /** Type PG: boolean */
  ExcludeFixedQuantityForPrice: boolean;
  /** Type PG: character varying | Max length: 3 */
  IntrastatOriginCountryId?: string;
  /** Type PG: character varying | Max length: 3 */
  IntrastatDestinationOriginCountryId?: string;
  /** Type PG: boolean */
  ExcludedFromFootDiscount: boolean;
  /** Type PG: boolean */
  ExcludedFromFinancialDiscount: boolean;
  /** Type PG: character varying | Max length: 3 */
  ServiceTypeId?: string;
}
