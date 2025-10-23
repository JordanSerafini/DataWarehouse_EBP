/**
 * Interface pour la table: EbpSysCloudDocument
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysCloudDocument {
  /** Type PG: uuid */
  GeneratorId: string;
  /** Type PG: text */
  Configuration: string;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: uuid */
  PublicationId: string;
  /** Type PG: integer */
  CategoryId: number;
  /** Type PG: character varying | Max length: 80 */
  Name: string;
  /** Type PG: character varying | Max length: 200 */
  Description?: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
}
