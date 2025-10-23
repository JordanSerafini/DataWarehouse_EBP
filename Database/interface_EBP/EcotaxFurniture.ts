/**
 * Interface pour la table: EcotaxFurniture
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface EcotaxFurniture {
  /** Type PG: character varying | Max length: 11 */
  Id: string;
  /** Type PG: character varying | Max length: 250 */
  Caption: string;
  /** Type PG: uuid */
  OrganizationId: string;
  /** Type PG: character varying | Max length: 8 */
  EcotaxCalculationBaseId: string;
  /** Type PG: character varying | Max length: 50 */
  ProducerStatus?: string;
  /** Type PG: character varying | Max length: 50 */
  DecreeCategory?: string;
  /** Type PG: character varying | Max length: 50 */
  DecreeFunction?: string;
  /** Type PG: character varying | Max length: 50 */
  ValdeliaFamily?: string;
  /** Type PG: character varying | Max length: 50 */
  MajoritoryProductMaterial?: string;
  /** Type PG: character varying | Max length: 50 */
  CustomsCode?: string;
  /** Type PG: character varying | Max length: 50 */
  ProductStatus?: string;
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
  /** Type PG: boolean */
  IsObsolete: boolean;
}
