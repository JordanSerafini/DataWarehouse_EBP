/**
 * Interface pour la table: Deal
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface Deal {
  /** Type PG: boolean */
  xx_NC: boolean;
  /** Type PG: numeric */
  PredictedCosts: number;
  /** Type PG: numeric */
  PredictedSales: number;
  /** Type PG: numeric */
  PredictedGrossMargin: number;
  /** Type PG: numeric */
  AccomplishedCosts: number;
  /** Type PG: numeric */
  AccomplishedSales: number;
  /** Type PG: numeric */
  AccomplishedGrossMargin: number;
  /** Type PG: numeric */
  ProfitsOnCosts: number;
  /** Type PG: numeric */
  ProfitsOnSales: number;
  /** Type PG: numeric */
  ProfitsOnGrossMargin: number;
  /** Type PG: character varying | Max length: 10 */
  Id: string;
  /** Type PG: character varying | Max length: 80 */
  Caption: string;
  /** Type PG: timestamp without time zone */
  DealDate: Date;
  /** Type PG: boolean */
  InvoiceScheduleEvent: boolean;
  /** Type PG: boolean */
  InvoiceScheduleTimeEvent: boolean;
  /** Type PG: numeric */
  PredictedDuration: number;
  /** Type PG: numeric */
  AccomplishedDuration: number;
  /** Type PG: numeric */
  ProfitsOnDuration: number;
  /** Type PG: timestamp without time zone */
  xx_DateDebut?: Date;
  /** Type PG: timestamp without time zone */
  xx_DateFin?: Date;
  /** Type PG: character varying | Max length: 10 */
  xx_Gestion_Projet_Posit?: string;
  /** Type PG: numeric */
  xx_DureePrevue?: number;
  /** Type PG: integer */
  DealState?: number;
  /** Type PG: character varying | Max length: 40 */
  AnalyticAccounting_GridId?: string;
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
  /** Type PG: character varying | Max length: 20 */
  xx_Client?: string;
  /** Type PG: numeric */
  xx_Total_Temps_Realise?: number;
  /** Type PG: numeric */
  xx_Total_Temps_Realise_Client?: number;
  /** Type PG: numeric */
  xx_Total_Temps_Realise_Interne?: number;
  /** Type PG: character varying | Max length: 50 */
  xx_Service?: string;
  /** Type PG: numeric */
  xx_Total_Temps_Realise_Relationnel?: number;
  /** Type PG: timestamp without time zone */
  xx_Date_Fin_Reelle?: Date;
  /** Type PG: numeric */
  xx_Total_Temps_Realise_Projet?: number;
  /** Type PG: numeric */
  xx_Duree_Trajet?: number;
  /** Type PG: numeric */
  xx_Total_Temps_Realise_Trajet?: number;
  /** Type PG: character varying | Max length: 20 */
  xx_Commercial?: string;
  /** Type PG: numeric */
  xx_Total_Temps_Realise_Formation?: number;
  /** Type PG: numeric */
  xx_Total_Temps_Realise_Maquettage?: number;
  /** Type PG: timestamp without time zone */
  xx_Date_Fiche_Travail?: Date;
  /** Type PG: character varying | Max length: 255 */
  xx_Origine_Vente?: string;
  /** Type PG: timestamp without time zone */
  xx_Date_Rapport?: Date;
  /** Type PG: numeric */
  ActualTreasury: number;
  /** Type PG: numeric */
  CustomerCommitmentBalanceDues: number;
  /** Type PG: numeric */
  SupplierCommitmentBalanceDues: number;
  /** Type PG: numeric */
  SubContractorCommitmentBalanceDues: number;
  /** Type PG: numeric */
  OtherCosts: number;
  /** Type PG: numeric */
  TreasuryBalanceDue: number;
  /** Type PG: boolean */
  HasAssociatedFiles: boolean;
}
