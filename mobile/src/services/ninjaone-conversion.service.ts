/**
 * Service de conversion tickets NinjaOne → interventions/incidents EBP
 * Gère les appels API pour la conversion et le mapping
 */

import { apiService } from './api.service';
import { API_CONFIG } from '../config/api.config';

const NINJAONE_API_BASE = `${API_CONFIG.BASE_URL}/api/v1/ninjaone`;
console.log('[NinjaOneConversionService] API configurée:', NINJAONE_API_BASE);

/**
 * Types pour la conversion
 */
export type TargetType = 'schedule_event' | 'incident';

export interface TicketPreview {
  // Ticket source
  ticketId: number;
  ticketNumber: string;
  ticketTitle: string;
  ticketDescription?: string;

  // Données pré-remplies
  caption: string;
  description?: string;
  customerId?: string;
  customerName?: string;
  colleagueId?: string;
  colleagueName?: string;
  startDateTime: string;
  endDateTime: string;
  estimatedDurationHours: number;
  priority: string;
  isUrgent: boolean;
  addressLine1?: string;
  city?: string;
  zipcode?: string;
  contactPhone?: string;
  maintenanceReference?: string;

  // Mapping info
  canConvert: boolean;
  customerMapped: boolean;
  technicianMapped: boolean;
  warnings: string[];
}

export interface ConvertTicketParams {
  ticketId: number;
  targetType: TargetType;

  // Informations de base (modifiables)
  caption: string;
  description?: string;

  // Client (modifiable)
  customerId: string;
  customerName?: string;

  // Technicien (optionnel, modifiable)
  colleagueId?: string;
  colleagueName?: string;

  // Dates et horaires (modifiables)
  startDateTime: string;
  endDateTime: string;
  estimatedDurationHours?: number;

  // Priorité (modifiable)
  priority?: string;
  isUrgent?: boolean;

  // Localisation (pré-remplie depuis organisation)
  addressLine1?: string;
  city?: string;
  zipcode?: string;
  latitude?: number;
  longitude?: number;

  // Contact client (pré-rempli)
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;

  // Champs maintenance (pour schedule_event)
  maintenanceReference?: string;
  maintenanceInterventionDescription?: string;
  maintenanceTravelDuration?: number;

  // Champs personnalisés EBP (optionnels)
  customTaskType?: string;
  customTheme?: string;
  customServices?: string;
  customActivity?: string;
}

export interface ConversionResult {
  success: boolean;
  proposalId?: string;
  proposalType?: string;
  message: string;
}

export interface OrganizationMapping {
  ninjaoneOrganizationId: number;
  ebpCustomerId: string;
  mappingNotes?: string;
}

export interface TechnicianMapping {
  ninjaoneTechnicianId: number;
  ebpColleagueId: string;
  mappingNotes?: string;
}

export interface ConversionStats {
  total_tickets: number;
  tickets_closed: number;
  tickets_open: number;
  tickets_converted: number;
  interventions_proposed: number;
  incidents_proposed: number;
  proposals_pending: number;
  proposals_approved: number;
  proposals_integrated: number;
  organizations_mapped: number;
  technicians_mapped: number;
  tickets_ready_to_convert: number;
}

/**
 * Service de conversion NinjaOne
 */
class NinjaOneConversionService {
  /**
   * Obtenir la prévisualisation d'un ticket pour conversion
   * (pré-remplit le formulaire)
   */
  async getTicketPreview(ticketId: number, targetType: TargetType): Promise<TicketPreview> {
    try {
      const url = `${NINJAONE_API_BASE}/tickets/${ticketId}/preview?targetType=${targetType}`;
      const response = await apiService.get<TicketPreview>(url);
      return response.data;
    } catch (error) {
      console.error('[NinjaOneConversionService] Error fetching ticket preview:', error);
      throw error;
    }
  }

  /**
   * Convertir un ticket en intervention ou incident proposé
   * AVEC DONNÉES MODIFIABLES depuis le formulaire
   */
  async convertTicket(params: ConvertTicketParams): Promise<ConversionResult> {
    try {
      const url = `${NINJAONE_API_BASE}/convert`;
      const response = await apiService.post<ConversionResult>(url, params);
      return response.data;
    } catch (error) {
      console.error('[NinjaOneConversionService] Error converting ticket:', error);
      throw error;
    }
  }

  /**
   * Créer un mapping manuel organisation → client
   */
  async createOrganizationMapping(mapping: OrganizationMapping): Promise<{ success: boolean; message: string }> {
    try {
      const url = `${NINJAONE_API_BASE}/mappings/organizations`;
      const response = await apiService.post<{ success: boolean; message: string }>(url, mapping);
      return response.data;
    } catch (error) {
      console.error('[NinjaOneConversionService] Error creating organization mapping:', error);
      throw error;
    }
  }

  /**
   * Créer un mapping manuel technicien → collègue
   */
  async createTechnicianMapping(mapping: TechnicianMapping): Promise<{ success: boolean; message: string }> {
    try {
      const url = `${NINJAONE_API_BASE}/mappings/technicians`;
      const response = await apiService.post<{ success: boolean; message: string }>(url, mapping);
      return response.data;
    } catch (error) {
      console.error('[NinjaOneConversionService] Error creating technician mapping:', error);
      throw error;
    }
  }

  /**
   * Obtenir les statistiques de conversion
   */
  async getConversionStats(): Promise<ConversionStats> {
    try {
      const url = `${NINJAONE_API_BASE}/stats`;
      const response = await apiService.get<ConversionStats>(url);
      return response.data;
    } catch (error) {
      console.error('[NinjaOneConversionService] Error fetching conversion stats:', error);
      throw error;
    }
  }

  /**
   * Lister les interventions proposées
   */
  async listInterventionProposals(status?: 'pending' | 'approved' | 'rejected' | 'integrated'): Promise<any[]> {
    try {
      const url = `${NINJAONE_API_BASE}/proposals/interventions${status ? `?status=${status}` : ''}`;
      const response = await apiService.get<any[]>(url);
      return response.data;
    } catch (error) {
      console.error('[NinjaOneConversionService] Error fetching intervention proposals:', error);
      throw error;
    }
  }

  /**
   * Lister les incidents proposés
   */
  async listIncidentProposals(status?: 'pending' | 'approved' | 'rejected' | 'integrated'): Promise<any[]> {
    try {
      const url = `${NINJAONE_API_BASE}/proposals/incidents${status ? `?status=${status}` : ''}`;
      const response = await apiService.get<any[]>(url);
      return response.data;
    } catch (error) {
      console.error('[NinjaOneConversionService] Error fetching incident proposals:', error);
      throw error;
    }
  }

  /**
   * Lister les mappings organisations
   */
  async listOrganizationMappings(): Promise<any[]> {
    try {
      const url = `${NINJAONE_API_BASE}/mappings/organizations`;
      const response = await apiService.get<any[]>(url);
      return response.data;
    } catch (error) {
      console.error('[NinjaOneConversionService] Error fetching organization mappings:', error);
      throw error;
    }
  }

  /**
   * Lister les mappings techniciens
   */
  async listTechnicianMappings(): Promise<any[]> {
    try {
      const url = `${NINJAONE_API_BASE}/mappings/technicians`;
      const response = await apiService.get<any[]>(url);
      return response.data;
    } catch (error) {
      console.error('[NinjaOneConversionService] Error fetching technician mappings:', error);
      throw error;
    }
  }

  /**
   * Helper: Formater une date pour le formulaire (date-time-picker)
   */
  formatDateForPicker(dateString: string): Date {
    return new Date(dateString);
  }

  /**
   * Helper: Formater une date depuis le picker vers ISO string
   */
  formatDateToISO(date: Date): string {
    return date.toISOString();
  }

  /**
   * Helper: Badge de couleur selon la priorité
   */
  getPriorityColor(priority: string): string {
    switch (priority.toUpperCase()) {
      case 'URGENT':
        return '#f44336'; // Rouge
      case 'HIGH':
        return '#ff5722'; // Rouge-orange
      case 'MEDIUM':
        return '#ff9800'; // Orange
      case 'LOW':
        return '#2196f3'; // Bleu
      case 'NORMAL':
      default:
        return '#4caf50'; // Vert
    }
  }

  /**
   * Helper: Label de priorité en français
   */
  getPriorityLabel(priority: string): string {
    switch (priority.toUpperCase()) {
      case 'URGENT':
        return 'Urgent';
      case 'HIGH':
        return 'Haute';
      case 'MEDIUM':
        return 'Moyenne';
      case 'LOW':
        return 'Basse';
      case 'NORMAL':
      default:
        return 'Normale';
    }
  }
}

export const ninjaoneConversionService = new NinjaOneConversionService();
