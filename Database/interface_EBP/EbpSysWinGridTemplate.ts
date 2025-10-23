/**
 * Interface pour la table: EbpSysWinGridTemplate
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EbpSysWinGridTemplate {
  /** Type PG: uuid */
  TemplateId: string;
  /** Type PG: character varying | Max length: 100 */
  Label: string;
  /** Type PG: uuid */
  OwningId: string;
  /** Type PG: uuid */
  GridId: string;
  /** Type PG: uuid */
  CategoryId: string;
  /** Type PG: boolean */
  HasDynamicMember: boolean;
  /** Type PG: integer */
  sysEditCounter?: number;
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
  /** Type PG: uuid */
  ExtensionId?: string;
}
