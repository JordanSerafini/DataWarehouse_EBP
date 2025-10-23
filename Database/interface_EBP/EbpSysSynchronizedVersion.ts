/**
 * Interface pour la table: EbpSysSynchronizedVersion
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysSynchronizedVersion {
  /** Type PG: integer */
  Version: number;
  /** Type PG: uuid */
  VersionId: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: integer */
  VersionKonwnByDistant?: number;
}
