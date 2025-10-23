/**
 * Interface pour la table: EbpSysExchangeApplication
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysExchangeApplication {
  /** Type PG: uuid */
  SourceApplicationId: string;
  /** Type PG: character varying | Max length: 200 */
  SourceApplicationName: string;
  /** Type PG: uuid */
  DestinationApplicationId: string;
  /** Type PG: character varying | Max length: 200 */
  DestinationApplicationName: string;
  /** Type PG: character varying | Max length: 20 */
  ApplicationVersion: string;
  /** Type PG: character varying | Max length: 200 */
  SourceDatabaseName: string;
}
