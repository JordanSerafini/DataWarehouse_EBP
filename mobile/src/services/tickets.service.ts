/**
 * Service pour gérer les tickets NinjaOne RMM
 * Intégration avec l'API NinjaOne pour le suivi des interventions RMM
 */

import { apiService } from './api.service';

// Configuration de l'API NinjaOne
const NINJAONE_API_BASE = 'http://localhost:3001/api';

/**
 * Types pour les tickets NinjaOne
 */
export interface NinjaOneTicket {
  ticketId: number;
  title: string;
  description?: string;
  status: {
    statusId?: number;
    displayName?: string;
    parentId?: number;
  };
  priority: string; // NONE, LOW, MEDIUM, HIGH
  severity?: string;
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  dueDate?: string;

  // Durée - CHAMP PRINCIPAL
  timeSpentSeconds: number;
  timeSpentHours: number;
  estimatedTimeSeconds?: number;
  estimatedTimeHours?: number;
  timeToResolutionSeconds?: number;
  timeToResolutionHours?: number;
  timeToFirstResponseSeconds?: number;
  timeToFirstResponseHours?: number;

  // Relations
  organizationId?: number;
  assignedTechnicianId?: number;
  createdByTechnicianId?: number;
  deviceId?: number;

  // Flags
  isOverdue: boolean;
  isResolved: boolean;
  isClosed: boolean;
  hasAttachments: boolean;
  hasComments: boolean;
  commentsCount: number;
  attachmentsCount: number;

  // Metadata
  tags?: string[];
  source?: string;
  channel?: string;
  requesterName?: string;
  requesterEmail?: string;
  requesterPhone?: string;
}

export interface TicketWithRelations {
  ticket: NinjaOneTicket;
  organization?: {
    organizationId: number;
    organizationName: string;
  };
  technician?: {
    technicianId: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface TicketFilters {
  page?: number;
  limit?: number;
  organizationId?: number;
  assignedTechnicianId?: number;
  createdByTechnicianId?: number;
  unassigned?: boolean;
  priority?: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
  statusName?: string;
  isClosed?: boolean;
  isResolved?: boolean;
  isOverdue?: boolean;
  search?: string;
  createdAfter?: string;
  createdBefore?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'priority' | 'timeSpentSeconds';
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedTicketsResponse {
  data: TicketWithRelations[];
  pagination: {
    total: number;
    page: number;
    limit: string;
    totalPages: number;
  };
  filters: {
    applied: any[];
    available: {
      priorities: string[];
      statuses: string[];
      sources: string[];
      totalOrganizations: number;
      totalTechnicians: number;
    };
  };
}

export interface TicketStats {
  total: number;
  open: number;
  closed: number;
  resolved: number;
  unassigned: number;
  overdue: number;
  avgTimeSpentHours: number;
  totalTimeSpentHours: number;
  avgTimeToResolutionHours: number;
  byPriority: {
    priority: string;
    count: number;
    percentage: number;
  }[];
  byStatus: {
    status: string;
    count: number;
    percentage: number;
  }[];
}

/**
 * Service des tickets NinjaOne
 */
class TicketsService {
  /**
   * Récupère la liste des tickets avec filtres
   * IMPORTANT: Pour les techniciens, filtrer par assignedTechnicianId
   */
  async getTickets(filters?: TicketFilters): Promise<PaginatedTicketsResponse> {
    try {
      const params = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
      }

      const queryString = params.toString();
      const url = `${NINJAONE_API_BASE}/tickets${queryString ? `?${queryString}` : ''}`;

      const response = await apiService.get<PaginatedTicketsResponse>(url);
      return response;
    } catch (error) {
      console.error('[TicketsService] Error fetching tickets:', error);
      throw error;
    }
  }

  /**
   * Récupère un ticket par son ID
   */
  async getTicketById(ticketId: number): Promise<TicketWithRelations> {
    try {
      const response = await apiService.get<TicketWithRelations>(
        `${NINJAONE_API_BASE}/tickets/${ticketId}`
      );
      return response;
    } catch (error) {
      console.error(`[TicketsService] Error fetching ticket ${ticketId}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques globales ou filtrées
   */
  async getTicketStats(filters?: TicketFilters): Promise<TicketStats> {
    try {
      const params = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
      }

      const queryString = params.toString();
      const url = `${NINJAONE_API_BASE}/tickets/stats${queryString ? `?${queryString}` : ''}`;

      const response = await apiService.get<TicketStats>(url);
      return response;
    } catch (error) {
      console.error('[TicketsService] Error fetching ticket stats:', error);
      throw error;
    }
  }

  /**
   * Récupère les tickets d'une organisation spécifique
   */
  async getOrganizationTickets(
    organizationId: number,
    filters?: TicketFilters
  ): Promise<PaginatedTicketsResponse> {
    try {
      const params = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
      }

      const queryString = params.toString();
      const url = `${NINJAONE_API_BASE}/organizations/${organizationId}/tickets${queryString ? `?${queryString}` : ''}`;

      const response = await apiService.get<PaginatedTicketsResponse>(url);
      return response;
    } catch (error) {
      console.error(`[TicketsService] Error fetching organization ${organizationId} tickets:`, error);
      throw error;
    }
  }

  /**
   * Récupère les tickets d'un technicien spécifique
   * UTILISÉ POUR LES TECHNICIENS qui ne voient que leurs tickets
   */
  async getTechnicianTickets(
    technicianId: number,
    filters?: TicketFilters
  ): Promise<PaginatedTicketsResponse> {
    try {
      const params = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
      }

      const queryString = params.toString();
      const url = `${NINJAONE_API_BASE}/technicians/${technicianId}/tickets${queryString ? `?${queryString}` : ''}`;

      const response = await apiService.get<PaginatedTicketsResponse>(url);
      return response;
    } catch (error) {
      console.error(`[TicketsService] Error fetching technician ${technicianId} tickets:`, error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques d'un technicien
   */
  async getTechnicianStats(technicianId: number): Promise<TicketStats> {
    try {
      const response = await apiService.get<TicketStats>(
        `${NINJAONE_API_BASE}/technicians/${technicianId}/tickets/stats`
      );
      return response;
    } catch (error) {
      console.error(`[TicketsService] Error fetching technician ${technicianId} stats:`, error);
      throw error;
    }
  }

  /**
   * Synchronise les tickets depuis NinjaOne (admin only)
   */
  async syncTickets(): Promise<{ synced: number; errors: number; message: string }> {
    try {
      const response = await apiService.post<{ synced: number; errors: number; message: string }>(
        `${NINJAONE_API_BASE}/tickets/sync`,
        {}
      );
      return response;
    } catch (error) {
      console.error('[TicketsService] Error syncing tickets:', error);
      throw error;
    }
  }

  /**
   * Helper: Formatte la durée en heures/minutes
   */
  formatDuration(seconds: number): string {
    if (seconds === 0) return '0h';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}m`;
    }
  }

  /**
   * Helper: Badge de couleur selon la priorité
   */
  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'HIGH':
        return '#f44336'; // Rouge
      case 'MEDIUM':
        return '#ff9800'; // Orange
      case 'LOW':
        return '#2196f3'; // Bleu
      case 'NONE':
      default:
        return '#9e9e9e'; // Gris
    }
  }

  /**
   * Helper: Label de priorité en français
   */
  getPriorityLabel(priority: string): string {
    switch (priority) {
      case 'HIGH':
        return 'Haute';
      case 'MEDIUM':
        return 'Moyenne';
      case 'LOW':
        return 'Basse';
      case 'NONE':
      default:
        return 'Aucune';
    }
  }
}

export const ticketsService = new TicketsService();
