/**
 * Interface pour la table: Zipcode
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface Zipcode {
  /** Type PG: character varying | Max length: 3 */
  CountryIsoCode: string;
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 10 */
  ZipCode: string;
  /** Type PG: character varying | Max length: 35 */
  City: string;
  /** Type PG: uuid */
  StateId?: string;
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
  /** Type PG: integer */
  sysRecordVersion?: number;
  /** Type PG: uuid */
  sysRecordVersionId?: string;
  /** Type PG: character varying | Max length: 35 */
  LocalizableCity_2?: string;
  /** Type PG: character varying | Max length: 35 */
  LocalizableCity_3?: string;
  /** Type PG: character varying | Max length: 35 */
  LocalizableCity_4?: string;
  /** Type PG: character varying | Max length: 35 */
  LocalizableCity_5?: string;
  /** Type PG: character varying | Max length: 10 */
  CodeINSEE?: string;
  /** Type PG: character varying | Max length: 50 */
  CityINSEE?: string;
}
