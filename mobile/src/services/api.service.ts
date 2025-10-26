/**
 * Service API - Communication avec le backend NestJS
 */

import axios, { AxiosInstance } from 'axios';
import { API_CONFIG } from '../config/api.config';
import { useAuthStore } from '../stores/authStore.v2';
import {
  LoginCredentials,
  LoginResponse,
  User,
} from '../types/user.types';
import {
  Intervention,
  QueryInterventionsDto,
  StartInterventionDto,
  CompleteInterventionDto,
} from '../types/intervention.types';
import {
  Customer,
  QueryCustomersDto,
} from '../types/customer.types';
import {
  Project,
  QueryProjectsDto,
} from '../types/project.types';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    // Créer l'instance Axios
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Intercepteur pour ajouter le token JWT à chaque requête
    this.client.interceptors.request.use(
      (config) => {
        const { tokens } = useAuthStore.getState();
        if (tokens?.accessToken) {
          config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Intercepteur pour gérer les erreurs de réponse
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Si erreur 401 et token expiré, tenter un refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const { tokens } = useAuthStore.getState();
            if (tokens?.refreshToken) {
              const response = await this.refreshToken(tokens.refreshToken);
              const { loginWithData } = useAuthStore.getState();

              // Mettre à jour les tokens avec loginWithData (v2)
              loginWithData(response.user, {
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
                expiresIn: response.expiresIn,
              });

              // Réessayer la requête originale
              originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Si le refresh échoue, déconnecter l'utilisateur
            const { logout } = useAuthStore.getState();
            await logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // ==================== GENERIC HTTP METHODS ====================

  async get<T = any>(url: string, config?: any): Promise<{ data: T }> {
    return this.client.get<T>(url, config);
  }

  async post<T = any>(url: string, data?: any, config?: any): Promise<{ data: T }> {
    return this.client.post<T>(url, data, config);
  }

  async put<T = any>(url: string, data?: any, config?: any): Promise<{ data: T }> {
    return this.client.put<T>(url, data, config);
  }

  async delete<T = any>(url: string, config?: any): Promise<{ data: T }> {
    return this.client.delete<T>(url, config);
  }

  async patch<T = any>(url: string, data?: any, config?: any): Promise<{ data: T }> {
    return this.client.patch<T>(url, data, config);
  }

  // ==================== AUTHENTICATION ====================

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await this.client.post<LoginResponse>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return data;
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const { data } = await this.client.post<LoginResponse>(
      API_CONFIG.ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );
    return data;
  }

  async logout(): Promise<void> {
    await this.client.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
  }

  async getMe(): Promise<User> {
    const { data } = await this.client.get<User>(API_CONFIG.ENDPOINTS.AUTH.ME);
    return data;
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await this.client.post(API_CONFIG.ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      oldPassword,
      newPassword,
    });
  }

  // ==================== USERS ====================

  async getUsersList(): Promise<Array<{ email: string; full_name: string; role: string }>> {
    const { data } = await this.client.get('/api/v1/users/list');
    return data;
  }

  async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { data } = await this.client.get('/api/v1/users', { params });
    return data;
  }

  async getUserById(id: string): Promise<any> {
    const { data } = await this.client.get(`/api/v1/users/${id}`);
    return data;
  }

  async createUser(userData: any): Promise<any> {
    const { data } = await this.client.post('/api/v1/users', userData);
    return data;
  }

  async updateUser(id: string, userData: any): Promise<any> {
    const { data } = await this.client.put(`/api/v1/users/${id}`, userData);
    return data;
  }

  async deleteUser(id: string): Promise<void> {
    await this.client.delete(`/api/v1/users/${id}`);
  }

  async resetUserPassword(id: string): Promise<any> {
    const { data } = await this.client.post(`/api/v1/users/${id}/reset-password`);
    return data;
  }

  async syncColleagues(): Promise<any> {
    const { data } = await this.client.post('/api/v1/users/sync/colleagues');
    return data;
  }

  // ==================== INTERVENTIONS ====================

  async getMyInterventions(query?: QueryInterventionsDto): Promise<Intervention[]> {
    const { data } = await this.client.get<Intervention[]>(
      API_CONFIG.ENDPOINTS.INTERVENTIONS.MY_INTERVENTIONS,
      { params: query }
    );
    return data;
  }

  async searchInterventions(query: QueryInterventionsDto): Promise<Intervention[]> {
    const { data } = await this.client.get<Intervention[]>(
      API_CONFIG.ENDPOINTS.INTERVENTIONS.SEARCH,
      { params: query }
    );
    return data;
  }

  async getNearbyInterventions(
    latitude: number,
    longitude: number,
    radiusKm: number = 50,
    statuses?: number[]
  ): Promise<Intervention[]> {
    const { data } = await this.client.get<Intervention[]>(
      API_CONFIG.ENDPOINTS.INTERVENTIONS.NEARBY,
      {
        params: { latitude, longitude, radiusKm, statuses },
      }
    );
    return data;
  }

  async getInterventionById(id: string): Promise<Intervention> {
    const { data } = await this.client.get<Intervention>(
      API_CONFIG.ENDPOINTS.INTERVENTIONS.BY_ID(id)
    );
    return data;
  }

  async startIntervention(id: string, dto: StartInterventionDto): Promise<Intervention> {
    const { data } = await this.client.post<Intervention>(
      API_CONFIG.ENDPOINTS.INTERVENTIONS.START(id),
      dto
    );
    return data;
  }

  async completeIntervention(
    id: string,
    dto: CompleteInterventionDto
  ): Promise<Intervention> {
    const { data } = await this.client.post<Intervention>(
      API_CONFIG.ENDPOINTS.INTERVENTIONS.COMPLETE(id),
      dto
    );
    return data;
  }

  async cancelIntervention(id: string, reason: string): Promise<Intervention> {
    const { data } = await this.client.post<Intervention>(
      API_CONFIG.ENDPOINTS.INTERVENTIONS.CANCEL(id),
      { reason }
    );
    return data;
  }

  async uploadInterventionPhoto(
    id: string,
    file: File | Blob,
    latitude?: number,
    longitude?: number
  ): Promise<{ fileId: string; url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    if (latitude) formData.append('latitude', latitude.toString());
    if (longitude) formData.append('longitude', longitude.toString());

    const { data } = await this.client.post(
      API_CONFIG.ENDPOINTS.INTERVENTIONS.UPLOAD_PHOTO(id),
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return data;
  }

  // ==================== CUSTOMERS ====================

  async searchCustomers(query: QueryCustomersDto): Promise<Customer[]> {
    const { data } = await this.client.get<Customer[]>(
      API_CONFIG.ENDPOINTS.CUSTOMERS.SEARCH,
      { params: query }
    );
    return data;
  }

  async getNearbyCustomers(
    latitude: number,
    longitude: number,
    radiusKm: number = 50
  ): Promise<Customer[]> {
    const { data } = await this.client.get<Customer[]>(
      API_CONFIG.ENDPOINTS.CUSTOMERS.NEARBY,
      {
        params: { latitude, longitude, radiusKm },
      }
    );
    return data;
  }

  async getCustomerById(id: string): Promise<Customer> {
    const { data } = await this.client.get<Customer>(
      API_CONFIG.ENDPOINTS.CUSTOMERS.BY_ID(id)
    );
    return data;
  }

  // ==================== PROJECTS ====================

  async getMyProjects(): Promise<Project[]> {
    const { data } = await this.client.get<Project[]>(
      API_CONFIG.ENDPOINTS.PROJECTS.MY_PROJECTS
    );
    return data;
  }

  async searchProjects(query: QueryProjectsDto): Promise<Project[]> {
    const { data } = await this.client.get<Project[]>(
      API_CONFIG.ENDPOINTS.PROJECTS.SEARCH,
      { params: query }
    );
    return data;
  }

  async getNearbyProjects(
    latitude: number,
    longitude: number,
    radiusKm: number = 50,
    states?: number[]
  ): Promise<Project[]> {
    const { data } = await this.client.get<Project[]>(
      API_CONFIG.ENDPOINTS.PROJECTS.NEARBY,
      {
        params: { latitude, longitude, radiusKm, states },
      }
    );
    return data;
  }

  async getProjectById(id: number): Promise<Project> {
    const { data } = await this.client.get<Project>(
      API_CONFIG.ENDPOINTS.PROJECTS.BY_ID(id.toString())
    );
    return data;
  }

  // ==================== SYNC ====================

  async getLastSyncDate(): Promise<{ lastSync: string | null }> {
    const { data } = await this.client.get(API_CONFIG.ENDPOINTS.SYNC.LAST_SYNC);
    return data;
  }

  async syncInterventions(lastSyncDate?: string): Promise<Intervention[]> {
    const { data } = await this.client.get<Intervention[]>(
      API_CONFIG.ENDPOINTS.SYNC.SYNC_INTERVENTIONS,
      { params: { lastSyncDate } }
    );
    return data;
  }

  async syncCustomers(lastSyncDate?: string): Promise<Customer[]> {
    const { data } = await this.client.get<Customer[]>(
      API_CONFIG.ENDPOINTS.SYNC.SYNC_CUSTOMERS,
      { params: { lastSyncDate } }
    );
    return data;
  }

  async syncProjects(lastSyncDate?: string): Promise<Project[]> {
    const { data } = await this.client.get<Project[]>(
      API_CONFIG.ENDPOINTS.SYNC.SYNC_PROJECTS,
      { params: { lastSyncDate } }
    );
    return data;
  }

  async fullSync(): Promise<{
    interventions: Intervention[];
    customers: Customer[];
    projects: Project[];
  }> {
    const { data } = await this.client.post(API_CONFIG.ENDPOINTS.SYNC.FULL_SYNC);
    return data;
  }
}

// Export d'une instance unique (singleton)
export const apiService = new ApiService();
export default apiService;
