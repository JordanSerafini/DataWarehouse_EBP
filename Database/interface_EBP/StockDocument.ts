/**
 * Interface pour la table: StockDocument
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface StockDocument {
  /** Type PG: boolean */
  MustGetQuantities: boolean;
  /** Type PG: numeric */
  TotalVolume: number;
  /** Type PG: numeric */
  TotalWeight: number;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 26 */
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
  StorehouseId: string;
  /** Type PG: boolean */
  DispatchedByStorehouse: boolean;
  /** Type PG: smallint */
  DocumentType: number;
  /** Type PG: boolean */
  MustBeTransferedToAccounting: boolean;
  /** Type PG: smallint */
  DocumentStage: number;
  /** Type PG: boolean */
  IncludeSoldOutTrackingNumbers: boolean;
  /** Type PG: boolean */
  RemoveOutOfDateUseByStock: boolean;
  /** Type PG: boolean */
  RemoveOutOfDateBestBeforeStock: boolean;
  /** Type PG: boolean */
  UseAdjustedLimitDate: boolean;
  /** Type PG: smallint */
  ItemValueType: number;
  /** Type PG: boolean */
  IsExchangeDocument: boolean;
  /** Type PG: smallint */
  PreparationState: number;
  /** Type PG: character varying | Max length: 2 */
  SerialId: string;
  /** Type PG: boolean */
  DefaultActivateInventoryQuantityFormula: boolean;
  /** Type PG: boolean */
  UseMaxPrecisionForPump: boolean;
  /** Type PG: character varying | Max length: 8 */
  MaintenanceContractId?: string;
  /** Type PG: character varying | Max length: 8 */
  IncidentId?: string;
  /** Type PG: timestamp without time zone */
  ProcessDate?: Date;
  /** Type PG: uuid */
  ScheduleEventId?: string;
  /** Type PG: uuid */
  InvoiceId?: string;
  /** Type PG: integer */
  sysEditCounter?: number;
  /** Type PG: uuid */
  sysModuleId?: string;
  /** Type PG: uuid */
  sysDatabaseId?: string;
  /** Type PG: integer */
  sysRecordVersion?: number;
  /** Type PG: uuid */
  sysRecordVersionId?: string;
  /** Type PG: uuid */
  OriginDocumentId?: string;
  /** Type PG: uuid */
  TransitStorehouseId?: string;
  /** Type PG: timestamp without time zone */
  TransitEndDate?: Date;
  /** Type PG: integer */
  TransitDuration?: number;
  /** Type PG: uuid */
  TargetStorehouseId?: string;
  /** Type PG: timestamp without time zone */
  ValidationDate?: Date;
  /** Type PG: integer */
  ValidationGlobalDocumentOrder?: number;
  /** Type PG: smallint */
  OriginDocumentType?: number;
  /** Type PG: smallint */
  ValidateState?: number;
  /** Type PG: smallint */
  GroupingType?: number;
  /** Type PG: smallint */
  SortingType?: number;
  /** Type PG: uuid */
  TransferedDocumentId?: string;
  /** Type PG: character varying | Max length: 70 */
  Reference?: string;
  /** Type PG: smallint */
  RecoveredFrom?: number;
  /** Type PG: boolean */
  ModifiedSinceRecovery?: boolean;
  /** Type PG: uuid */
  AccountingExchangeGroupId?: string;
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
  /** Type PG: character varying | Max length: 10 */
  DealId?: string;
  /** Type PG: character varying | Max length: 10 */
  ConstructionSiteId?: string;
  /** Type PG: uuid */
  Hash_ChainedId?: string;
  /** Type PG: bytea */
  Hash_Hash?: Buffer;
  /** Type PG: uuid */
  ExecutionQuoteId?: string;
  /** Type PG: boolean */
  CreatedFromConstructionSiteConsumptions: boolean;
  /** Type PG: uuid */
  ProgressStateDocumentId?: string;
  /** Type PG: boolean */
  xx_LoanEquipmentReturn: boolean;
  /** Type PG: boolean */
  xx_LoanEquipment: boolean;
  /** Type PG: character varying | Max length: 20 */
  xx_ForCustomer?: string;
  /** Type PG: boolean */
  HasAssociatedFiles: boolean;
}
