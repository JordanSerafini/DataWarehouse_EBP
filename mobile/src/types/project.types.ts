/**
 * Types relatifs aux projets/affaires
 */

export enum ProjectState {
  PROSPECTION = 0,
  EN_COURS = 1,
  GAGNE = 2,
  PERDU = 3,
  SUSPENDU = 4,
  ANNULE = 5,
}

export interface Project {
  id: number;
  name: string;
  reference?: string;

  // Relations
  customerId?: string;
  customerName?: string;
  managerId?: string;
  managerName?: string;

  // Statut
  state: ProjectState;
  stateLabel: string;

  // Dates
  startDate?: string;
  endDate?: string;
  actualEndDate?: string;

  // Localisation
  city?: string;
  latitude?: number;
  longitude?: number;

  // Métadonnées
  createdAt?: string;
  modifiedAt?: string;
}

export interface ProjectWithDistance extends Project {
  distanceKm: number;
}

export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  wonProjects: number;
  lostProjects: number;
  totalEstimatedAmount: number;
  totalActualAmount: number;
  winRate: number;
}

export interface QueryProjectsDto {
  managerId?: string;
  states?: ProjectState[];
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}
