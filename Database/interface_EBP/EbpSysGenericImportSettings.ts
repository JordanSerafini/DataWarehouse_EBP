/**
 * Interface pour la table: EbpSysGenericImportSettings
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysGenericImportSettings {
  /** Type PG: character varying | Max length: 80 */
  name: string;
  /** Type PG: uuid */
  categoryId: string;
  /** Type PG: boolean */
  export: boolean;
  /** Type PG: text */
  serializedEntity: string;
  /** Type PG: uuid */
  formatId?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}
