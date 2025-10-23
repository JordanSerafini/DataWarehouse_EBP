/**
 * Interface pour la table: Organization
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface Organization {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 100 */
  Caption: string;
  /** Type PG: smallint */
  OrganizationOfficial: number;
  /** Type PG: boolean */
  IncludeEcotaxFurnitureAmountInSaleDocument: boolean;
  /** Type PG: boolean */
  IsEcotaxCalculationTypeBasedOnDocumentCalculationType: boolean;
  /** Type PG: boolean */
  IncludeEcotaxFurnitureAmountInPurchaseDocument: boolean;
  /** Type PG: timestamp without time zone */
  sysCreatedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysCreatedUser?: string;
  /** Type PG: timestamp without time zone */
  sysModifiedDate?: Date;
  /** Type PG: character varying | Max length: 255 */
  sysModifiedUser?: string;
  /** Type PG: text */
  NotesClear?: string;
  /** Type PG: text */
  Notes?: string;
}
