/**
 * Interface pour la table: DocumentLineAssociation
 * Générée automatiquement le 23/10/2025 09:15:22
 */
export interface DocumentLineAssociation {
  /** Type PG: uuid */
  Id: string;
  /** Type PG: uuid */
  OriginDocumentId: string;
  /** Type PG: uuid */
  OriginLineId: string;
  /** Type PG: smallint */
  OriginDocumentType: number;
  /** Type PG: smallint */
  OriginDocumentSubType: number;
  /** Type PG: uuid */
  TransferedLineId: string;
  /** Type PG: smallint */
  TransferedDocumentType: number;
  /** Type PG: smallint */
  TransferedDocumentSubType: number;
  /** Type PG: uuid */
  TransferedDocumentId: string;
  /** Type PG: numeric */
  Quantity: number;
  /** Type PG: numeric */
  RealQuantity: number;
  /** Type PG: boolean */
  IsCountermark: boolean;
  /** Type PG: smallint */
  LinkType: number;
}
