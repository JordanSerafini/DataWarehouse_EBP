/**
 * Interface pour la table: EbpSysNavBar
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysNavBar {
  /** Type PG: uuid */
  OwningId: string;
  /** Type PG: integer */
  sysEditCounter?: number;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}
