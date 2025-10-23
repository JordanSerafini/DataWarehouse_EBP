/**
 * Interface pour la table: EbpSysCloudAccountPublicationAssociation
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysCloudAccountPublicationAssociation {
  /** Type PG: character varying | Max length: 100 */
  AccountId: string;
  /** Type PG: uuid */
  PublicationId: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}
