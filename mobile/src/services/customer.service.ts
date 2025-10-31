/**
 * CustomerService - API wrapper pour les clients
 *
 * Fonctionnalités :
 * - Recherche avec filtres (nom, ville, code postal)
 * - Clients à proximité GPS
 * - Détail client complet (vue 360°)
 * - Historique interventions
 * - Statistiques documents
 */

import { apiService } from './api.service';

/**
 * Interface Client
 */
export interface Customer {
  customerId: string;
  name: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryPostalCode?: string;
  latitude?: number;
  longitude?: number;
  gpsProvider?: string;
  gpsQuality?: number;
  createdAt?: string;
  modifiedAt?: string;
  // Données financières (visibles uniquement pour bureau/commerciaux/admin)
  allowedAmount?: number;
  currentAmount?: number;
  exceedAmount?: number;
  activeState?: number;
  colleagueId?: string;
}

/**
 * Interface Client avec distance
 */
export interface NearbyCustomer extends Customer {
  distanceKm: number;
}

/**
 * Interface Historique Intervention Client
 */
export interface CustomerHistoryItem {
  interventionId: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  technicianName?: string;
  productDescription?: string;
  createdAt: string;
}

/**
 * Interface Statistiques Documents
 */
export interface CustomerDocumentStats {
  documentTypeLabel: string;
  documentCount: number;
  totalAmount: number;
}

/**
 * Interface Résumé Client (Vue 360°)
 */
export interface CustomerSummary {
  customer: Customer;
  recentInterventions: CustomerHistoryItem[];
  documentStats: CustomerDocumentStats[];
  totalInterventions: number;
  totalRevenue: number;
  // Données d'activité & insights
  lastInterventionDate?: string;
  daysSinceLastIntervention?: number;
  customerHealthScore?: number;
}

/**
 * Paramètres de recherche clients
 */
export interface SearchCustomersParams {
  query?: string; // Recherche texte libre (nom, adresse)
  city?: string; // Ville
  postalCode?: string; // Code postal
  limit?: number; // Limite résultats (default: 50)
  offset?: number; // Offset pagination (default: 0)
}

/**
 * Paramètres clients à proximité
 */
export interface QueryNearbyCustomersParams {
  latitude: number;
  longitude: number;
  radiusKm?: number; // Rayon en km (default: 50, max: 200)
  limit?: number; // Limite résultats (default: 20)
}

/**
 * Paramètres historique client
 */
export interface QueryCustomerHistoryParams {
  limit?: number; // Limite résultats (default: 50)
}

/**
 * Service API pour les clients
 */
export class CustomerService {
  /**
   * Rechercher des clients avec filtres
   */
  static async searchCustomers(
    params: SearchCustomersParams = {}
  ): Promise<Customer[]> {
    try {
      const queryParams = new URLSearchParams();

      if (params.query) queryParams.append('query', params.query);
      if (params.city) queryParams.append('city', params.city);
      if (params.postalCode) queryParams.append('postalCode', params.postalCode);
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.offset) queryParams.append('offset', params.offset.toString());

      const response = await apiService.get<Customer[]>(
        `/api/v1/customers/search?${queryParams.toString()}`
      );

      return response.data;
    } catch (error: any) {
      console.error('Error searching customers:', error);
      throw error;
    }
  }

  /**
   * Trouver les clients à proximité d'une position GPS
   */
  static async getNearbyCustomers(
    params: QueryNearbyCustomersParams
  ): Promise<NearbyCustomer[]> {
    try {
      const queryParams = new URLSearchParams({
        latitude: params.latitude.toString(),
        longitude: params.longitude.toString(),
      });

      if (params.radiusKm) {
        queryParams.append('radiusKm', params.radiusKm.toString());
      }
      if (params.limit) {
        queryParams.append('limit', params.limit.toString());
      }

      const response = await apiService.get<NearbyCustomer[]>(
        `/api/v1/customers/nearby?${queryParams.toString()}`
      );

      return response.data;
    } catch (error: any) {
      console.error('Error fetching nearby customers:', error);
      throw error;
    }
  }

  /**
   * Récupérer le résumé complet d'un client (Vue 360°)
   */
  static async getCustomerSummary(
    customerId: string
  ): Promise<CustomerSummary> {
    try {
      const response = await apiService.get<CustomerSummary>(
        `/api/v1/customers/${customerId}`
      );

      return response.data;
    } catch (error: any) {
      console.error('Error fetching customer summary:', error);
      throw error;
    }
  }

  /**
   * Récupérer l'historique des interventions d'un client
   */
  static async getCustomerHistory(
    customerId: string,
    params: QueryCustomerHistoryParams = {}
  ): Promise<CustomerHistoryItem[]> {
    try {
      const queryParams = new URLSearchParams();

      if (params.limit) {
        queryParams.append('limit', params.limit.toString());
      }

      const response = await apiService.get<CustomerHistoryItem[]>(
        `/api/v1/customers/${customerId}/history?${queryParams.toString()}`
      );

      return response.data;
    } catch (error: any) {
      console.error('Error fetching customer history:', error);
      throw error;
    }
  }

  /**
   * Récupérer les statistiques de documents d'un client
   */
  static async getCustomerDocumentStats(
    customerId: string
  ): Promise<CustomerDocumentStats[]> {
    try {
      const response = await apiService.get<CustomerDocumentStats[]>(
        `/api/v1/customers/${customerId}/documents-stats`
      );

      return response.data;
    } catch (error: any) {
      console.error('Error fetching customer document stats:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour les coordonnées GPS d'un client
   */
  static async updateCustomerGps(
    customerId: string,
    latitude: number,
    longitude: number,
    gpsProvider: 'manual' | 'ebp' | 'mobile' = 'mobile'
  ): Promise<Customer> {
    try {
      const response = await apiService.put<Customer>(
        `/api/v1/customers/${customerId}/gps`,
        {
          latitude,
          longitude,
          gpsProvider,
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Error updating customer GPS:', error);
      throw error;
    }
  }
}
