/**
 * Interface pour la table: PriceList
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface PriceList {
  /** Type PG: boolean */
  AllowToDefineItemOnCalculationLines: boolean;
  /** Type PG: boolean */
  IsPurchasePriceList: boolean;
  /** Type PG: character varying | Max length: 10 */
  Id: string;
  /** Type PG: character varying | Max length: 100 */
  Description: string;
  /** Type PG: boolean */
  UseFooterDiscount: boolean;
  /** Type PG: smallint */
  CalculationBase: number;
  /** Type PG: boolean */
  IsPromotion: boolean;
  /** Type PG: boolean */
  IsAccumulatableWithPriceListOrPromotion: boolean;
  /** Type PG: boolean */
  IsLastAccumulatable: boolean;
  /** Type PG: boolean */
  CanBeAccumulated: boolean;
  /** Type PG: uuid */
  UniqueId: string;
  /** Type PG: boolean */
  IsApplyingOnSeveralLines: boolean;
  /** Type PG: boolean */
  IsMultiLineGroupingAllItemConditions: boolean;
  /** Type PG: smallint */
  MultiLineFreeItemChoice: number;
  /** Type PG: smallint */
  Type: number;
  /** Type PG: integer */
  sysRecordVersion?: number;
  /** Type PG: uuid */
  sysRecordVersionId?: string;
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
  /** Type PG: text */
  NotesClear?: string;
  /** Type PG: text */
  Notes?: string;
  /** Type PG: timestamp without time zone */
  StartValidityDate?: Date;
  /** Type PG: timestamp without time zone */
  EndValidityDate?: Date;
  /** Type PG: character varying | Max length: 3 */
  CurrencyId?: string;
  /** Type PG: smallint */
  ThirdPriceType?: number;
  /** Type PG: smallint */
  FootDiscountType: number;
}
