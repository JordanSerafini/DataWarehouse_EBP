/**
 * Interface pour la table: StockRangeItem
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface StockRangeItem {
  /** Type PG: numeric */
  MinStock: number;
  /** Type PG: numeric */
  StockToOrderThreshold: number;
  /** Type PG: boolean */
  StorageEnable: boolean;
  /** Type PG: numeric */
  MaxStock: number;
  /** Type PG: smallint */
  MultiLocationMode: number;
  /** Type PG: character varying | Max length: 40 */
  RangeItemId: string;
  /** Type PG: uuid */
  StorehouseId: string;
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
