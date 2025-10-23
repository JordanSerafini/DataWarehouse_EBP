/**
 * Interface pour la table: EbpSysNavBarDefaultTemplate
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysNavBarDefaultTemplate {
  /** Type PG: integer */
  Id: number;
  /** Type PG: uuid */
  DefaultTemplateId: string;
  /** Type PG: uuid */
  OwningId: string;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: character varying | Max length: 20 */
  UserId?: string;
  /** Type PG: character varying | Max length: 20 */
  GroupId?: string;
}
