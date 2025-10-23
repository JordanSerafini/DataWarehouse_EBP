/**
 * Interface pour la table: PurchaseDocumentEx
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface PurchaseDocumentEx {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: numeric */
  EcotaxFurnitureAmountVatExcluded: number;
  /** Type PG: numeric */
  EcotaxFurnitureVatAmount: number;
  /** Type PG: numeric */
  EcotaxFurnitureAmountVatIncluded: number;
  /** Type PG: numeric */
  EcotaxFurnitureAmountVatExcludedIncludedToDueAmount: number;
  /** Type PG: numeric */
  EcotaxFurnitureVatAmountIncludedToDueAmount: number;
  /** Type PG: numeric */
  EcotaxFurnitureAmountIncludedToDueAmount: number;
  /** Type PG: numeric */
  CurrencyEcotaxFurnitureVatAmount: number;
  /** Type PG: numeric */
  CurrencyEcotaxFurnitureAmountVatExcluded: number;
  /** Type PG: numeric */
  CurrencyEcotaxFurnitureAmountVatIncluded: number;
  /** Type PG: numeric */
  CurrencyEcotaxFurnitureVatAmountIncludedToDueAmount: number;
  /** Type PG: numeric */
  CurrencyEcotaxFurnitureAmountVatExcludedIncludedToDueAmount: number;
  /** Type PG: numeric */
  CurrencyEcotaxFurnitureAmountIncludedToDueAmount: number;
  /** Type PG: boolean */
  TransferReverseChargeEntryLine: boolean;
  /** Type PG: boolean */
  IsSelfBilling: boolean;
  /** Type PG: boolean */
  DistributeShippingOnPurchaseChargeAmount: boolean;
  /** Type PG: smallint */
  DistributionBase: number;
  /** Type PG: boolean */
  IsShippingDistributedOnPurchaseChargeAmount: boolean;
  /** Type PG: numeric */
  SettlementFinancialDiscountAmount: number;
  /** Type PG: numeric */
  SettlementCurrencyFinancialDiscountAmount: number;
  /** Type PG: boolean */
  RoundLinesNetPriceVatExcluded: boolean;
  /** Type PG: uuid */
  ShippingReverseChargeVatId?: string;
  /** Type PG: uuid */
  InvoicingChargesReverseChargeVatId?: string;
  /** Type PG: numeric */
  DetailVatAmount0_EcotaxFurnitureAmountVatExcluded?: number;
  /** Type PG: numeric */
  DetailVatAmount0_EcotaxFurnitureAmountVatIncluded?: number;
  /** Type PG: numeric */
  DetailVatAmount0_EcotaxFurnitureVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount0_TaxFurnitAmountVatExcludedIncludedToDueAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount0_TaxFurnitAmountVatIncludedIncludedToDueAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount0_EcotaxFurnitureVatAmountIncludedToDueAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount0_CurrencyEcotaxFurnitureAmountVatExcluded?: number;
  /** Type PG: numeric */
  DetailVatAmount0_CurrencyEcotaxFurnitureAmountVatIncluded?: number;
  /** Type PG: numeric */
  DetailVatAmount0_CurrencyEcotaxFurnitureVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount0_CurTaxFurnitAmountVatExcludIncludedToDueAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount0_CurTaxFurnitAmountVatIncludIncludedToDueAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount0_CurEcotaxFurnitureVatAmountIncludedToDueAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount1_EcotaxFurnitureAmountVatExcluded?: number;
  /** Type PG: numeric */
  DetailVatAmount1_EcotaxFurnitureAmountVatIncluded?: number;
  /** Type PG: numeric */
  DetailVatAmount1_EcotaxFurnitureVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount1_TaxFurnitAmountVatExcludedIncludedToDueAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount1_TaxFurnitAmountVatIncludedIncludedToDueAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount1_EcotaxFurnitureVatAmountIncludedToDueAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount1_CurrencyEcotaxFurnitureAmountVatExcluded?: number;
  /** Type PG: numeric */
  DetailVatAmount1_CurrencyEcotaxFurnitureAmountVatIncluded?: number;
  /** Type PG: numeric */
  DetailVatAmount1_CurrencyEcotaxFurnitureVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount1_CurTaxFurnitAmountVatExcludIncludedToDueAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount1_CurTaxFurnitAmountVatIncludIncludedToDueAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount1_CurEcotaxFurnitureVatAmountIncludedToDueAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount2_EcotaxFurnitureAmountVatExcluded?: number;
  /** Type PG: numeric */
  DetailVatAmount2_EcotaxFurnitureAmountVatIncluded?: number;
  /** Type PG: numeric */
  DetailVatAmount2_EcotaxFurnitureVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount2_TaxFurnitAmountVatExcludedIncludedToDueAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount2_TaxFurnitAmountVatIncludedIncludedToDueAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount2_EcotaxFurnitureVatAmountIncludedToDueAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount2_CurrencyEcotaxFurnitureAmountVatExcluded?: number;
  /** Type PG: numeric */
  DetailVatAmount2_CurrencyEcotaxFurnitureAmountVatIncluded?: number;
  /** Type PG: numeric */
  DetailVatAmount2_CurrencyEcotaxFurnitureVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount2_CurTaxFurnitAmountVatExcludIncludedToDueAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount2_CurTaxFurnitAmountVatIncludIncludedToDueAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount2_CurEcotaxFurnitureVatAmountIncludedToDueAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount3_EcotaxFurnitureAmountVatExcluded?: number;
  /** Type PG: numeric */
  DetailVatAmount3_EcotaxFurnitureAmountVatIncluded?: number;
  /** Type PG: numeric */
  DetailVatAmount3_EcotaxFurnitureVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount3_TaxFurnitAmountVatExcludedIncludedToDueAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount3_TaxFurnitAmountVatIncludedIncludedToDueAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount3_EcotaxFurnitureVatAmountIncludedToDueAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount3_CurrencyEcotaxFurnitureAmountVatExcluded?: number;
  /** Type PG: numeric */
  DetailVatAmount3_CurrencyEcotaxFurnitureAmountVatIncluded?: number;
  /** Type PG: numeric */
  DetailVatAmount3_CurrencyEcotaxFurnitureVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount3_CurTaxFurnitAmountVatExcludIncludedToDueAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount3_CurTaxFurnitAmountVatIncludIncludedToDueAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount3_CurEcotaxFurnitureVatAmountIncludedToDueAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount4_EcotaxFurnitureAmountVatExcluded?: number;
  /** Type PG: numeric */
  DetailVatAmount4_EcotaxFurnitureAmountVatIncluded?: number;
  /** Type PG: numeric */
  DetailVatAmount4_EcotaxFurnitureVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount4_TaxFurnitAmountVatExcludedIncludedToDueAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount4_TaxFurnitAmountVatIncludedIncludedToDueAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount4_EcotaxFurnitureVatAmountIncludedToDueAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount4_CurrencyEcotaxFurnitureAmountVatExcluded?: number;
  /** Type PG: numeric */
  DetailVatAmount4_CurrencyEcotaxFurnitureAmountVatIncluded?: number;
  /** Type PG: numeric */
  DetailVatAmount4_CurrencyEcotaxFurnitureVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount4_CurTaxFurnitAmountVatExcludIncludedToDueAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount4_CurTaxFurnitAmountVatIncludIncludedToDueAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount4_CurEcotaxFurnitureVatAmountIncludedToDueAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount5_EcotaxFurnitureAmountVatExcluded?: number;
  /** Type PG: numeric */
  DetailVatAmount5_EcotaxFurnitureAmountVatIncluded?: number;
  /** Type PG: numeric */
  DetailVatAmount5_EcotaxFurnitureVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount5_TaxFurnitAmountVatExcludedIncludedToDueAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount5_TaxFurnitAmountVatIncludedIncludedToDueAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount5_EcotaxFurnitureVatAmountIncludedToDueAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount5_CurrencyEcotaxFurnitureAmountVatExcluded?: number;
  /** Type PG: numeric */
  DetailVatAmount5_CurrencyEcotaxFurnitureAmountVatIncluded?: number;
  /** Type PG: numeric */
  DetailVatAmount5_CurrencyEcotaxFurnitureVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount5_CurTaxFurnitAmountVatExcludIncludedToDueAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount5_CurTaxFurnitAmountVatIncludIncludedToDueAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount5_CurEcotaxFurnitureVatAmountIncludedToDueAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount0_SmoothedDepositDocumentVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount0_CurrencySmoothedDepositDocumentVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount1_SmoothedDepositDocumentVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount1_CurrencySmoothedDepositDocumentVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount2_SmoothedDepositDocumentVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount2_CurrencySmoothedDepositDocumentVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount3_SmoothedDepositDocumentVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount3_CurrencySmoothedDepositDocumentVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount4_SmoothedDepositDocumentVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount4_CurrencySmoothedDepositDocumentVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount5_SmoothedDepositDocumentVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount5_CurrencySmoothedDepositDocumentVatAmount?: number;
  /** Type PG: boolean */
  IsCompleted: boolean;
  /** Type PG: smallint */
  ProgressStateLinesPrintType: number;
  /** Type PG: smallint */
  ProgressStateType?: number;
  /** Type PG: numeric */
  GlobalProgressPercentage: number;
  /** Type PG: numeric */
  GlobalVatIncludedProgressPercentage: number;
  /** Type PG: numeric */
  SmoothedDepositAmount: number;
  /** Type PG: numeric */
  SmoothedDepositCurrencyAmount: number;
  /** Type PG: smallint */
  DepositSmoothingCalculationType: number;
  /** Type PG: boolean */
  ForceSmoothedDepositAmount: boolean;
  /** Type PG: numeric */
  CumulatedSmoothedDepositAmount: number;
  /** Type PG: numeric */
  CumulatedSmoothedDepositCurrencyAmount: number;
  /** Type PG: uuid */
  AssociatedProgressStateId?: string;
  /** Type PG: integer */
  ProgressStateStatus?: number;
  /** Type PG: smallint */
  ProgressStateNumbering?: number;
  /** Type PG: uuid */
  PreviousProgressStateDocumentId?: string;
  /** Type PG: uuid */
  NextProgressStateDocumentId?: string;
  /** Type PG: smallint */
  DeliveryOrderInvoiceState?: number;
  /** Type PG: smallint */
  DeliveryOrderInvoiceBehaviour?: number;
  /** Type PG: numeric */
  IrpfAmountCalculationBase: number;
  /** Type PG: numeric */
  CurrencyIrpfAmountCalculationBase: number;
  /** Type PG: character varying | Max length: 10 */
  DeliveryConstructionSiteId?: string;
  /** Type PG: uuid */
  PurchaseOrderId?: string;
  /** Type PG: timestamp without time zone */
  ProgressEndDate?: Date;
  /** Type PG: boolean */
  IsEcotaxFurnitureBasedOnAmountVatIncluded: boolean;
  /** Type PG: character varying | Max length: 3 */
  IntrastatDestinationOriginCountryId?: string;
  /** Type PG: numeric */
  RemainingAmountToInvoiceVatExcluded: number;
  /** Type PG: numeric */
  RemainingAmountToInvoiceVatIncluded: number;
  /** Type PG: boolean */
  HasAssociatedFiles: boolean;
}
