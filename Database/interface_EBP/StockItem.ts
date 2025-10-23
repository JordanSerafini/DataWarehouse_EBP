/**
 * Interface pour la table: StockItem
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface StockItem {
  /** Type PG: numeric */
  CustomersDeliveryOrderPreparingQuantity: number;
  /** Type PG: numeric */
  CustomersReturnOrderPreparingQuantity: number;
  /** Type PG: numeric */
  SuppliersDeliveryOrderPreparingQuantity: number;
  /** Type PG: numeric */
  SuppliersReturnOrderPreparingQuantity: number;
  /** Type PG: character varying | Max length: 40 */
  ItemId: string;
  /** Type PG: uuid */
  StorehouseId: string;
  /** Type PG: numeric */
  RealStock: number;
  /** Type PG: numeric */
  StockValue: number;
  /** Type PG: numeric */
  MinStock: number;
  /** Type PG: numeric */
  StockToOrderThreshold: number;
  /** Type PG: numeric */
  VirtualStock: number;
  /** Type PG: numeric */
  OrderedQuantity: number;
  /** Type PG: numeric */
  SuppliersOrderedQuantity: number;
  /** Type PG: numeric */
  Pump: number;
  /** Type PG: boolean */
  StorageEnable: boolean;
  /** Type PG: numeric */
  TransferOutputVirtualQuantity: number;
  /** Type PG: numeric */
  TransferInputVirtualQuantity: number;
  /** Type PG: numeric */
  AssemblingVirtualQuantity: number;
  /** Type PG: numeric */
  DisassemblingQuantity: number;
  /** Type PG: numeric */
  QuantityUsedToAssemblate: number;
  /** Type PG: numeric */
  QuantityFromDisassembling: number;
  /** Type PG: numeric */
  MaxStock: number;
  /** Type PG: smallint */
  MultiLocationMode: number;
  /** Type PG: boolean */
  HasLocationDispatch: boolean;
  /** Type PG: numeric */
  VirtualPump: number;
  /** Type PG: numeric */
  VirtualStockValue: number;
  /** Type PG: numeric */
  BookedQuantity: number;
  /** Type PG: character varying | Max length: 20 */
  LocationId?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}
