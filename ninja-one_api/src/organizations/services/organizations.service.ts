import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { NinjaOneAuthService } from '../../common';

/**
 * Service pour interagir avec les endpoints Organizations de l'API NinjaOne
 */
@Injectable()
export class OrganizationsService {
  private readonly logger = new Logger(OrganizationsService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly authService: NinjaOneAuthService,
  ) {}

  /**
   * Get all organizations from NinjaOne API
   */
  async getOrganizations(): Promise<any> {
    const token = await this.authService.authenticate();

    try {
      this.logger.log('Fetching organizations from NinjaOne API...');

      const response = await firstValueFrom(
        this.httpService.get(
          `${this.authService.baseUrl}/v2/organizations`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          },
        ),
      );

      this.logger.log(`Retrieved ${response.data?.length || 0} organizations`);
      return response.data;
    } catch (error) {
      this.logger.error(
        'Failed to fetch organizations:',
        error.response?.data || error.message,
      );
      throw new Error('Failed to fetch organizations from NinjaOne API');
    }
  }

  /**
   * Get a specific organization by ID
   */
  async getOrganizationById(organizationId: number): Promise<any> {
    const token = await this.authService.authenticate();

    try {
      this.logger.log(
        `Fetching organization ${organizationId} from NinjaOne API...`,
      );

      const response = await firstValueFrom(
        this.httpService.get(
          `${this.authService.baseUrl}/v2/organization/${organizationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          },
        ),
      );

      this.logger.log(
        `Retrieved organization: ${response.data?.name || 'Unknown'}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch organization ${organizationId}:`,
        error.response?.data || error.message,
      );
      throw new Error(
        `Failed to fetch organization ${organizationId} from NinjaOne API`,
      );
    }
  }

  /**
   * Get locations for a specific organization
   */
  async getOrganizationLocations(organizationId: number): Promise<any> {
    const token = await this.authService.authenticate();

    try {
      this.logger.log(
        `Fetching locations for organization ${organizationId} from NinjaOne API...`,
      );

      const response = await firstValueFrom(
        this.httpService.get(
          `${this.authService.baseUrl}/v2/organization/${organizationId}/locations`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          },
        ),
      );

      this.logger.log(
        `Retrieved ${response.data?.length || 0} locations for organization ${organizationId}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch locations for organization ${organizationId}:`,
        error.response?.data || error.message,
      );
      throw new Error(
        `Failed to fetch locations for organization ${organizationId} from NinjaOne API`,
      );
    }
  }

  /**
   * Get devices for a specific organization
   */
  async getOrganizationDevices(organizationId: number): Promise<any> {
    const token = await this.authService.authenticate();

    try {
      this.logger.log(
        `Fetching devices for organization ${organizationId} from NinjaOne API...`,
      );

      const response = await firstValueFrom(
        this.httpService.get(
          `${this.authService.baseUrl}/v2/organization/${organizationId}/devices`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          },
        ),
      );

      this.logger.log(
        `Retrieved ${response.data?.length || 0} devices for organization ${organizationId}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch devices for organization ${organizationId}:`,
        error.response?.data || error.message,
      );
      throw new Error(
        `Failed to fetch devices for organization ${organizationId} from NinjaOne API`,
      );
    }
  }

  /**
   * Get documents for a specific organization
   */
  async getOrganizationDocuments(organizationId: number): Promise<any> {
    const token = await this.authService.authenticate();

    try {
      this.logger.log(
        `Fetching documents for organization ${organizationId} from NinjaOne API...`,
      );

      const response = await firstValueFrom(
        this.httpService.get(
          `${this.authService.baseUrl}/v2/organization/${organizationId}/documents`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          },
        ),
      );

      this.logger.log(
        `Retrieved ${response.data?.length || 0} documents for organization ${organizationId}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch documents for organization ${organizationId}:`,
        error.response?.data || error.message,
      );
      throw new Error(
        `Failed to fetch documents for organization ${organizationId} from NinjaOne API`,
      );
    }
  }

  /**
   * Get document attributes with values for a specific client document
   */
  async getOrganizationDocumentAttributes(
    clientDocumentId: number,
  ): Promise<any> {
    const token = await this.authService.authenticate();

    try {
      this.logger.log(
        `Fetching attributes for document ${clientDocumentId} from NinjaOne API...`,
      );

      const response = await firstValueFrom(
        this.httpService.get(
          `${this.authService.baseUrl}/v2/organization/documents/${clientDocumentId}/attributes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          },
        ),
      );

      this.logger.log(
        `Retrieved ${response.data?.length || 0} attributes for document ${clientDocumentId}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch attributes for document ${clientDocumentId}:`,
        error.response?.data || error.message,
      );
      throw new Error(
        `Failed to fetch attributes for document ${clientDocumentId} from NinjaOne API`,
      );
    }
  }

  /**
   * Get end users for a specific organization
   */
  async getOrganizationEndUsers(organizationId: number): Promise<any> {
    const token = await this.authService.authenticate();

    try {
      this.logger.log(
        `Fetching end users for organization ${organizationId} from NinjaOne API...`,
      );

      const response = await firstValueFrom(
        this.httpService.get(
          `${this.authService.baseUrl}/v2/organization/${organizationId}/end-users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          },
        ),
      );

      this.logger.log(
        `Retrieved ${response.data?.length || 0} end users for organization ${organizationId}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch end users for organization ${organizationId}:`,
        error.response?.data || error.message,
      );
      throw new Error(
        `Failed to fetch end users for organization ${organizationId} from NinjaOne API`,
      );
    }
  }
}
