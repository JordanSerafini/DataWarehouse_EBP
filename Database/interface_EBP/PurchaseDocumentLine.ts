/**
 * Interface pour la table: PurchaseDocumentLine
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface PurchaseDocumentLine {
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
  OrderedQuantity: number;
  /** Type PG: numeric */
  RemainingQuantityToInvoice: number;
  /** Type PG: numeric */
  ReturnedQuantity: number;
  /** Type PG: numeric */
  ReturnedQuantityByPreviousCreditMemo: number;
  /** Type PG: numeric */
  RemainingQuantityToDeliver: number;
  /** Type PG: smallint */
  Location_MultiLocationMode: number;
  /** Type PG: boolean */
  BillOfQuantitiesProgram_IsActive: boolean;
  /** Type PG: boolean */
  BillOfQuantitiesProgram_KeepActiveFromQuoteToOrder: boolean;
  /** Type PG: boolean */
  UnitPriceProgram_IsActive: boolean;
  /** Type PG: boolean */
  UnitPriceProgram_KeepActiveFromQuoteToOrder: boolean;
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
  /** Type PG: integer */
  PhaseLevel: number;
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
  /** Type PG: boolean */
  MustPartiallyDeliverCommercialNomenclature: boolean;
  /** Type PG: numeric */
  SalePurchaseConversionRate: number;
  /** Type PG: numeric */
  TotalChargeAmount: number;
  /** Type PG: numeric */
  CostAmount: number;
  /** Type PG: numeric */
  AdvisedSalePriceVatExcluded: number;
  /** Type PG: numeric */
  DiscountRateOnAdvisedSalePrice: number;
  /** Type PG: numeric */
  DiscountAmountOnAdvisedSalePrice: number;
  /** Type PG: numeric */
  QuantityToReplenish: number;
  /** Type PG: boolean */
  IsCostAmountModifiedByNextDocument: boolean;
  /** Type PG: numeric */
  CurrencyPriceVatExcluded: number;
  /** Type PG: numeric */
  CurrencyPriceVatIncluded: number;
  /** Type PG: numeric */
  CurrencyPurchaseChargeAmount: number;
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
  PriceVatExcluded: number;
  /** Type PG: numeric */
  PriceVatIncluded: number;
  /** Type PG: numeric */
  OtherTaxes1_TaxValue: number;
  /** Type PG: boolean */
  OtherTaxes1_SubjectToVat: boolean;
  /** Type PG: numeric */
  OtherTaxes1_TaxAmount: number;
  /** Type PG: numeric */
  OtherTaxes1_BaseAmount: number;
  /** Type PG: numeric */
  OtherTaxes2_TaxValue: number;
  /** Type PG: boolean */
  OtherTaxes2_SubjectToVat: boolean;
  /** Type PG: numeric */
  OtherTaxes2_TaxAmount: number;
  /** Type PG: numeric */
  OtherTaxes2_BaseAmount: number;
  /** Type PG: numeric */
  PurchaseOrderMinimumQuantity: number;
  /** Type PG: numeric */
  PurchaseOrderMultipleQuantity: number;
  /** Type PG: uuid */
  Id: string;
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
  /** Type PG: boolean */
  ManageStock: boolean;
  /** Type PG: integer */
  NomenclatureLevel: number;
  /** Type PG: smallint */
  IsPrintable: number;
  /** Type PG: smallint */
  QuantityDecimalNumber: number;
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
  UnitEcotaxAmountVatExcluded: number;
  /** Type PG: numeric */
  UnitEcotaxAmountVatIncluded: number;
  /** Type PG: numeric */
  EcotaxAmountVatExcluded: number;
  /** Type PG: numeric */
  EcotaxAmountVatIncluded: number;
  /** Type PG: boolean */
  HasTrackingDispatch: boolean;
  /** Type PG: numeric */
  Weight: number;
  /** Type PG: numeric */
  TotalWeight: number;
  /** Type PG: integer */
  NumberOfItemByPackage: number;
  /** Type PG: numeric */
  NetWeight: number;
  /** Type PG: numeric */
  TotalNetWeight: number;
  /** Type PG: boolean */
  UseComponentVat: boolean;
  /** Type PG: boolean */
  QuantityDecreaseByFreeQuantity: boolean;
  /** Type PG: boolean */
  HasAnalyticAffectations: boolean;
  /** Type PG: numeric */
  ApproachCharges0_ChargeDistributedAmount: number;
  /** Type PG: numeric */
  ApproachCharges0_CurrencyChargeDistributedAmount: number;
  /** Type PG: numeric */
  ApproachCharges2_ChargeDistributedAmount: number;
  /** Type PG: numeric */
  ApproachCharges2_CurrencyChargeDistributedAmount: number;
  /** Type PG: numeric */
  PurchasePricePercentage: number;
  /** Type PG: boolean */
  IntrastatExcluded: boolean;
  /** Type PG: smallint */
  DoNotCreateMovement: number;
  /** Type PG: numeric */
  ApproachCharges1_ChargeDistributedAmount: number;
  /** Type PG: numeric */
  ApproachCharges1_CurrencyChargeDistributedAmount: number;
  /** Type PG: numeric */
  PurchasePriceVatIncludedPercentage: number;
  /** Type PG: uuid */
  ApproachCharges2_DocumentFreightId?: string;
  /** Type PG: character varying | Max length: 3 */
  IntrastatOriginCountryId?: string;
  /** Type PG: character varying | Max length: 250 */
  xx_Client?: string;
  /** Type PG: character varying | Max length: 40 */
  RangeItemId?: string;
  /** Type PG: character varying | Max length: 8 */
  MaintenanceContractId?: string;
  /** Type PG: character varying | Max length: 8 */
  GuaranteeTypeId?: string;
  /** Type PG: character varying | Max length: 8 */
  IncidentId?: string;
  /** Type PG: uuid */
  ApproachCharges1_DocumentFreightId?: string;
  /** Type PG: text */
  LinkedLinesIds?: string;
  /** Type PG: smallint */
  LinkType?: number;
  /** Type PG: character varying | Max length: 13 */
  Duration?: string;
  /** Type PG: uuid */
  ReverseChargeVatId?: string;
  /** Type PG: uuid */
  ApproachCharges0_DocumentFreightId?: string;
  /** Type PG: numeric */
  FreePercentage?: number;
  /** Type PG: numeric */
  DeliveredQuantity?: number;
  /** Type PG: character varying | Max length: 20 */
  ColleagueId?: string;
  /** Type PG: character varying | Max length: 20 */
  Account?: string;
  /** Type PG: character varying | Max length: 11 */
  EcotaxFurnitureId?: string;
  /** Type PG: text */
  UnitPriceProgram_Program?: string;
  /** Type PG: smallint */
  ReturnState?: number;
  /** Type PG: smallint */
  VatMode?: number;
  /** Type PG: character varying | Max length: 8 */
  EcotaxId?: string;
  /** Type PG: character varying | Max length: 4 */
  VolumeUnitId?: string;
  /** Type PG: character varying | Max length: 40 */
  TrackingNumber?: string;
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
  /** Type PG: uuid */
  ParentLineId?: string;
  /** Type PG: uuid */
  TopParentLineId?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: character varying | Max length: 4 */
  PurchaseUnitId?: string;
  /** Type PG: character varying | Max length: 10 */
  DealId?: string;
  /** Type PG: character varying | Max length: 4 */
  OtherTaxes2_TaxUnitId?: string;
  /** Type PG: uuid */
  OtherTaxes2_Id?: string;
  /** Type PG: smallint */
  OtherTaxes2_CalculationBase?: number;
  /** Type PG: character varying | Max length: 4 */
  OtherTaxes1_TaxUnitId?: string;
  /** Type PG: character varying | Max length: 50 */
  ItemReference?: string;
  /** Type PG: integer */
  sysEditCounter?: number;
  /** Type PG: text */
  xx_NumSerie?: string;
  /** Type PG: text */
  xx_NumSerie_Clear?: string;
  /** Type PG: character varying | Max length: 255 */
  xx_Commentaires?: string;
  /** Type PG: character varying | Max length: 50 */
  Numbering?: string;
  /** Type PG: character varying | Max length: 20 */
  Location_LocationId?: string;
  /** Type PG: text */
  BillOfQuantitiesProgram_Program?: string;
  /** Type PG: integer */
  AnalyticPlanItemId?: number;
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
  WeightUnitId?: string;
  /** Type PG: timestamp without time zone */
  LimitDate?: Date;
  /** Type PG: uuid */
  VatId?: string;
  /** Type PG: numeric */
  VatAmount?: number;
  /** Type PG: timestamp without time zone */
  DeliveryDate?: Date;
  /** Type PG: smallint */
  DeliveryState?: number;
  /** Type PG: uuid */
  OtherTaxes0_SubTaxId?: string;
  /** Type PG: uuid */
  OtherTaxes1_SubTaxId?: string;
  /** Type PG: uuid */
  OtherTaxes2_SubTaxId?: string;
  /** Type PG: boolean */
  IgnoreManualPriceSetForMultiLinePriceList?: boolean;
  /** Type PG: uuid */
  RoundId?: string;
  /** Type PG: character varying | Max length: 3 */
  IntrastatDestinationOriginCountryId?: string;
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
  /** Type PG: boolean */
  FixedQuantity: boolean;
  /** Type PG: integer */
  ComponentFixedQuantityNumber?: number;
  /** Type PG: numeric */
  FixedQuantityPriceConversionRate?: number;
  /** Type PG: smallint */
  DeliveryOrderInvoiceState?: number;
  /** Type PG: boolean */
  MustPartiallyInvoiceCommercialNomenclature: boolean;
  /** Type PG: text */
  ExecutionQuoteLineId?: string;
  /** Type PG: uuid */
  PurchaseOrderLine?: string;
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
  /** Type PG: boolean */
  ExcludeFixedQuantityForPrice: boolean;
  /** Type PG: boolean */
  ExcludedFromFootDiscount: boolean;
  /** Type PG: boolean */
  ExcludedFromFinancialDiscount: boolean;
}
