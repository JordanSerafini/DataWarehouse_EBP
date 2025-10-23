/**
 * Interface pour la table: IntrastatLine
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface IntrastatLine {
  /** Type PG: numeric */
  StatisticValue: number;
  /** Type PG: numeric */
  SupplementaryUnits: number;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: uuid */
  IntrastatId: string;
  /** Type PG: integer */
  LineNumber: number;
  /** Type PG: numeric */
  Amount: number;
  /** Type PG: smallint */
  RegionCode: number;
  /** Type PG: character varying | Max length: 20 */
  PurchaserCeNumber?: string;
  /** Type PG: uuid */
  DocumentId?: string;
  /** Type PG: uuid */
  DocumentLineId?: string;
  /** Type PG: smallint */
  DocumentType?: number;
  /** Type PG: character varying | Max length: 9 */
  Nc8NomenclatureId?: string;
  /** Type PG: character varying | Max length: 3 */
  DestinationCountry?: string;
  /** Type PG: character varying | Max length: 2 */
  RegimeId?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: character varying | Max length: 2 */
  TransactionNatureId?: string;
  /** Type PG: character varying | Max length: 1 */
  TransportModeId?: string;
  /** Type PG: character varying | Max length: 3 */
  ExpeditionFinishState?: string;
  /** Type PG: character varying | Max length: 3 */
  OriginCountry?: string;
  /** Type PG: numeric */
  NetWeight?: number;
  /** Type PG: character varying | Max length: 3 */
  IncotermId?: string;
}
