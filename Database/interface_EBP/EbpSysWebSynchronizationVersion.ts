/**
 * Interface pour la table: EbpSysWebSynchronizationVersion
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysWebSynchronizationVersion {
  /** Type PG: uuid */
  ProviderId: string;
  /** Type PG: smallint */
  Kind: number;
  /** Type PG: character varying | Max length: 250 */
  EntityId: string;
  /** Type PG: integer */
  LastVersion: number;
  /** Type PG: boolean */
  IsDeleted: boolean;
}
