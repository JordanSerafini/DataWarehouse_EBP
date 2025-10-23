/**
 * Interface pour la table: EbpSysSchemaInformation
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysSchemaInformation {
  /** Type PG: smallint */
  levelCompatibility: number;
  /** Type PG: character varying | Max length: 40 */
  schemaId: string;
  /** Type PG: character varying | Max length: 20 */
  version: string;
  /** Type PG: character varying | Max length: 20 */
  systemVersion: string;
  /** Type PG: timestamp without time zone */
  lastSynchroDate: Date;
  /** Type PG: character varying | Max length: 40 */
  databaseId: string;
  /** Type PG: text */
  schemaMetaData: string;
  /** Type PG: character varying | Max length: 40 */
  lastApplicationId: string;
  /** Type PG: character varying | Max length: 20 */
  lastVersion: string;
  /** Type PG: character varying | Max length: 20 */
  lastSystemVersion: string;
  /** Type PG: character varying | Max length: 40 */
  lastLastApplicationId: string;
  /** Type PG: character varying | Max length: 20 */
  applicationVersion: string;
  /** Type PG: boolean */
  isCreated: boolean;
  /** Type PG: boolean */
  isDemo: boolean;
  /** Type PG: boolean */
  isBeta: boolean;
  /** Type PG: character varying | Max length: 100 */
  lastApplicationCaption: string;
  /** Type PG: boolean */
  isApi: boolean;
  /** Type PG: boolean */
  MustVerifyIntegrity: boolean;
  /** Type PG: text */
  interfaceExtensionInformations?: string;
  /** Type PG: text */
  recoveryInformations?: string;
}
