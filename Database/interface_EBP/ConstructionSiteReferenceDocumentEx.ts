/**
 * Interface pour la table: ConstructionSiteReferenceDocumentEx
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface ConstructionSiteReferenceDocumentEx {
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
  DetailVatAmount0_SmoothedDepositDocumentVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount0_CurrencySmoothedDepositDocumentVatAmount?: number;
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
  DetailVatAmount1_SmoothedDepositDocumentVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount1_CurrencySmoothedDepositDocumentVatAmount?: number;
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
  DetailVatAmount2_SmoothedDepositDocumentVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount2_CurrencySmoothedDepositDocumentVatAmount?: number;
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
  DetailVatAmount3_SmoothedDepositDocumentVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount3_CurrencySmoothedDepositDocumentVatAmount?: number;
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
  DetailVatAmount4_SmoothedDepositDocumentVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount4_CurrencySmoothedDepositDocumentVatAmount?: number;
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
  DetailVatAmount5_SmoothedDepositDocumentVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount5_CurrencySmoothedDepositDocumentVatAmount?: number;
  /** Type PG: numeric */
  SettlementFinancialDiscountAmount: number;
  /** Type PG: numeric */
  SettlementCurrencyFinancialDiscountAmount: number;
  /** Type PG: boolean */
  RoundLinesNetPriceVatExcluded: boolean;
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
  /** Type PG: character varying | Max length: 20 */
  OpportunityId?: string;
  /** Type PG: smallint */
  CustomerToUseInCustomerProducts: number;
  /** Type PG: boolean */
  LinkWithCRM?: boolean;
  /** Type PG: numeric */
  DiscountAmountVatIncluded: number;
  /** Type PG: numeric */
  CurrencyDiscountAmountVatIncluded: number;
  /** Type PG: boolean */
  IsDiscountAmountVatIncludedEnabled: boolean;
  /** Type PG: timestamp without time zone */
  ConstructionSiteStartDate?: Date;
  /** Type PG: timestamp without time zone */
  ConstructionSiteEndDate?: Date;
  /** Type PG: timestamp without time zone */
  PlannedReceiptDate?: Date;
  /** Type PG: smallint */
  ExecutionQuoteStatus?: number;
  /** Type PG: character varying | Max length: 20 */
  CreatorColleagueId?: string;
  /** Type PG: timestamp without time zone */
  AcceptanceDate?: Date;
  /** Type PG: timestamp without time zone */
  SignatureDate?: Date;
  /** Type PG: uuid */
  SaleOrderId?: string;
  /** Type PG: integer */
  AmendmentDocumentState?: number;
  /** Type PG: uuid */
  ExecutionQuoteId?: string;
  /** Type PG: timestamp without time zone */
  ProgressEndDate?: Date;
  /** Type PG: boolean */
  CreatePickStockDocument: boolean;
  /** Type PG: boolean */
  IsPosDocument: boolean;
  /** Type PG: boolean */
  IsHeldReceipt: boolean;
  /** Type PG: character varying | Max length: 7 */
  PosTerminalId?: string;
  /** Type PG: boolean */
  IsSaleInAccount: boolean;
  /** Type PG: boolean */
  PosIsLineScaleTransaction: boolean;
  /** Type PG: numeric */
  BudgetAmount: number;
  /** Type PG: numeric */
  InitialContractAmountVatExcluded: number;
  /** Type PG: numeric */
  InitialContractAmountVatIncluded: number;
  /** Type PG: numeric */
  CurrentContractAmountVatExcluded: number;
  /** Type PG: numeric */
  CurrentContractAmountVatIncluded: number;
  /** Type PG: boolean */
  FreezeContract: boolean;
  /** Type PG: numeric */
  contractProgressionRate: number;
  /** Type PG: numeric */
  NewContractAmountVatExcluded: number;
  /** Type PG: numeric */
  NewContractAmountVatIncluded: number;
  /** Type PG: numeric */
  CurrencyInitialContractAmountVatExcluded: number;
  /** Type PG: numeric */
  CurrencyInitialContractAmountVatIncluded: number;
  /** Type PG: numeric */
  CurrencyCurrentContractAmountVatExcluded: number;
  /** Type PG: numeric */
  CurrencyCurrentContractAmountVatIncluded: number;
  /** Type PG: numeric */
  CurrencyNewContractAmountVatExcluded: number;
  /** Type PG: numeric */
  CurrencyNewContractAmountVatIncluded: number;
  /** Type PG: timestamp without time zone */
  DaySchedule0_StartTime: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule0_EndTime: Date;
  /** Type PG: double precision */
  DaySchedule0_Duration: number;
  /** Type PG: boolean */
  DaySchedule0_Active: boolean;
  /** Type PG: timestamp without time zone */
  DaySchedule0_LunchStartTime?: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule0_LunchEndTime?: Date;
  /** Type PG: boolean */
  DaySchedule0_Customize: boolean;
  /** Type PG: timestamp without time zone */
  DaySchedule1_StartTime: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule1_EndTime: Date;
  /** Type PG: double precision */
  DaySchedule1_Duration: number;
  /** Type PG: boolean */
  DaySchedule1_Active: boolean;
  /** Type PG: timestamp without time zone */
  DaySchedule1_LunchStartTime?: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule1_LunchEndTime?: Date;
  /** Type PG: boolean */
  DaySchedule1_Customize: boolean;
  /** Type PG: timestamp without time zone */
  DaySchedule2_StartTime: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule2_EndTime: Date;
  /** Type PG: double precision */
  DaySchedule2_Duration: number;
  /** Type PG: boolean */
  DaySchedule2_Active: boolean;
  /** Type PG: timestamp without time zone */
  DaySchedule2_LunchStartTime?: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule2_LunchEndTime?: Date;
  /** Type PG: boolean */
  DaySchedule2_Customize: boolean;
  /** Type PG: timestamp without time zone */
  DaySchedule3_StartTime: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule3_EndTime: Date;
  /** Type PG: double precision */
  DaySchedule3_Duration: number;
  /** Type PG: boolean */
  DaySchedule3_Active: boolean;
  /** Type PG: timestamp without time zone */
  DaySchedule3_LunchStartTime?: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule3_LunchEndTime?: Date;
  /** Type PG: boolean */
  DaySchedule3_Customize: boolean;
  /** Type PG: timestamp without time zone */
  DaySchedule4_StartTime: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule4_EndTime: Date;
  /** Type PG: double precision */
  DaySchedule4_Duration: number;
  /** Type PG: boolean */
  DaySchedule4_Active: boolean;
  /** Type PG: timestamp without time zone */
  DaySchedule4_LunchStartTime?: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule4_LunchEndTime?: Date;
  /** Type PG: boolean */
  DaySchedule4_Customize: boolean;
  /** Type PG: timestamp without time zone */
  DaySchedule5_StartTime: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule5_EndTime: Date;
  /** Type PG: double precision */
  DaySchedule5_Duration: number;
  /** Type PG: boolean */
  DaySchedule5_Active: boolean;
  /** Type PG: timestamp without time zone */
  DaySchedule5_LunchStartTime?: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule5_LunchEndTime?: Date;
  /** Type PG: boolean */
  DaySchedule5_Customize: boolean;
  /** Type PG: timestamp without time zone */
  DaySchedule6_StartTime: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule6_EndTime: Date;
  /** Type PG: double precision */
  DaySchedule6_Duration: number;
  /** Type PG: boolean */
  DaySchedule6_Active: boolean;
  /** Type PG: timestamp without time zone */
  DaySchedule6_LunchStartTime?: Date;
  /** Type PG: timestamp without time zone */
  DaySchedule6_LunchEndTime?: Date;
  /** Type PG: boolean */
  DaySchedule6_Customize: boolean;
  /** Type PG: timestamp without time zone */
  AmendmentAcceptanceDate?: Date;
  /** Type PG: boolean */
  TransferedFromExecutionQuote: boolean;
  /** Type PG: uuid */
  AssociatedQuoteId?: string;
  /** Type PG: numeric */
  DepositPercentage: number;
  /** Type PG: smallint */
  DepositInputMode: number;
  /** Type PG: character varying | Max length: 150 */
  WorksDelay?: string;
  /** Type PG: text */
  WorksDescription?: string;
  /** Type PG: text */
  WorksDescriptionClear?: string;
  /** Type PG: numeric */
  SecurityBondAmount: number;
  /** Type PG: numeric */
  CurrencySecurityBondAmount: number;
  /** Type PG: numeric */
  SecurityBondAmountForGoodCompletedWork: number;
  /** Type PG: numeric */
  CurrencySecurityBondAmountForGoodCompletedWork: number;
  /** Type PG: numeric */
  ComplementaryAccountAmount: number;
  /** Type PG: numeric */
  CurrencyComplementaryAccountAmount: number;
  /** Type PG: boolean */
  ImportedDatas?: boolean;
  /** Type PG: boolean */
  IsTemporary?: boolean;
  /** Type PG: boolean */
  FreezeContractReferenceDocument: boolean;
  /** Type PG: character varying | Max length: 100 */
  BuyerReference?: string;
  /** Type PG: character varying | Max length: 50 */
  IssuerAssignedId?: string;
  /** Type PG: character varying | Max length: 64 */
  ChorusFlowId?: string;
  /** Type PG: character varying | Max length: 128 */
  ChorusFlowStatus?: string;
  /** Type PG: character varying | Max length: 255 */
  ChorusFlowComment?: string;
  /** Type PG: timestamp without time zone */
  ValidityDate?: Date;
  /** Type PG: smallint */
  ValidityState?: number;
  /** Type PG: numeric */
  NetInterestBase: number;
  /** Type PG: numeric */
  MiscAmountVatIncluded: number;
  /** Type PG: boolean */
  IsReferenceDocument?: boolean;
  /** Type PG: numeric */
  DetailVatAmount0_DeterminedItemMarginAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount0_UndeterminedItemMarginAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount0_DeterminedItemMarginVatAmount: number;
  /** Type PG: numeric */
  DetailVatAmount0_UndeterminedItemMarginVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount1_DeterminedItemMarginAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount1_UndeterminedItemMarginAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount1_DeterminedItemMarginVatAmount: number;
  /** Type PG: numeric */
  DetailVatAmount1_UndeterminedItemMarginVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount2_DeterminedItemMarginAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount2_UndeterminedItemMarginAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount2_DeterminedItemMarginVatAmount: number;
  /** Type PG: numeric */
  DetailVatAmount2_UndeterminedItemMarginVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount3_DeterminedItemMarginAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount3_UndeterminedItemMarginAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount3_DeterminedItemMarginVatAmount: number;
  /** Type PG: numeric */
  DetailVatAmount3_UndeterminedItemMarginVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount4_DeterminedItemMarginAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount4_UndeterminedItemMarginAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount4_DeterminedItemMarginVatAmount: number;
  /** Type PG: numeric */
  DetailVatAmount4_UndeterminedItemMarginVatAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount5_DeterminedItemMarginAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount5_UndeterminedItemMarginAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount5_DeterminedItemMarginVatAmount: number;
  /** Type PG: numeric */
  DetailVatAmount5_UndeterminedItemMarginVatAmount?: number;
  /** Type PG: character varying | Max length: 50 */
  IssuerMarketId?: string;
  /** Type PG: uuid */
  ScheduleEventId?: string;
  /** Type PG: text */
  ThirdOrderNumber?: string;
  /** Type PG: smallint */
  NeotouchSendingType: number;
  /** Type PG: smallint */
  NeotouchDuplicateSendingType: number;
  /** Type PG: smallint */
  NeotouchStatus?: number;
  /** Type PG: text */
  NeotouchContactsIdForDuplicate?: string;
  /** Type PG: smallint */
  JefactureStatus?: number;
  /** Type PG: character varying | Max length: 40 */
  JefactureId?: string;
  /** Type PG: character varying | Max length: 3 */
  IntrastatDestinationOriginCountryId?: string;
  /** Type PG: numeric */
  RemainingAmountToInvoiceVatExcluded: number;
  /** Type PG: numeric */
  RemainingAmountToInvoiceVatIncluded: number;
  /** Type PG: smallint */
  TicketBaiStatus?: number;
  /** Type PG: smallint */
  MyUnisoftStatus?: number;
  /** Type PG: integer */
  TicketBaiId?: number;
  /** Type PG: character varying | Max length: 255 */
  UrlTicketBAIId?: string;
  /** Type PG: timestamp without time zone */
  UrssafServiceBeginDate?: Date;
  /** Type PG: timestamp without time zone */
  UrssafServiceEndDate?: Date;
  /** Type PG: character varying | Max length: 40 */
  UrssafPaymentId?: string;
  /** Type PG: character varying | Max length: 5 */
  UrssafStatusId?: string;
  /** Type PG: character varying | Max length: 50 */
  UrssafStatusCaption?: string;
  /** Type PG: timestamp without time zone */
  UrssafPaymentDate?: Date;
  /** Type PG: numeric */
  UrssafPaymentAmount: number;
  /** Type PG: character varying | Max length: 60 */
  PlatformPaymentId?: string;
  /** Type PG: smallint */
  PlatformPaymentType?: number;
  /** Type PG: smallint */
  CategoryOperation?: number;
  /** Type PG: character varying | Max length: 25 */
  GlnThird?: string;
  /** Type PG: character varying | Max length: 25 */
  GlnPaymentThird?: string;
  /** Type PG: uuid */
  VatExemptionReasonId?: string;
  /** Type PG: character varying | Max length: 20 */
  VatexCode?: string;
  /** Type PG: character varying | Max length: 3 */
  CategoryCode?: string;
  /** Type PG: numeric */
  DetailVatAmount0_DiscountAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount0_CurrencyDiscountAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount1_DiscountAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount1_CurrencyDiscountAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount2_DiscountAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount2_CurrencyDiscountAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount3_DiscountAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount3_CurrencyDiscountAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount4_DiscountAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount4_CurrencyDiscountAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount5_DiscountAmount?: number;
  /** Type PG: numeric */
  DetailVatAmount5_CurrencyDiscountAmount?: number;
  /** Type PG: smallint */
  IsTakeawaySale: number;
  /** Type PG: boolean */
  IsCompliantElectronicInvoice?: boolean;
}
