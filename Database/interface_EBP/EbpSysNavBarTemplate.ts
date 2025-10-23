/**
 * Interface pour la table: EbpSysNavBarTemplate
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysNavBarTemplate {
  /** Type PG: uuid */
  OwningId: string;
  /** Type PG: uuid */
  TemplateId: string;
  /** Type PG: character varying | Max length: 100 */
  Label: string;
  /** Type PG: text */
  Template?: string;
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
  /** Type PG: integer */
  sysEditCounter?: number;
}
