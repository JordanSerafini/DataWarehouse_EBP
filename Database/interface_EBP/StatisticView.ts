/**
 * Interface pour la table: StatisticView
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface StatisticView {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: character varying | Max length: 100 */
  Caption: string;
  /** Type PG: text */
  Content: string;
  /** Type PG: smallint */
  StatisticType: number;
}
