import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NinjaOneService {
  private readonly logger = new Logger(NinjaOneService.name);
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    // Get base URL from environment or use default
    this.baseUrl = this.configService.get<string>('NINJA_ONE_BASE_URL') || 'https://app.ninjaone.com';
    this.logger.log(`Using NinjaOne base URL: ${this.baseUrl}`);
  }

  /**
   * Authenticate with NinjaOne API using OAuth2 client credentials flow
   */
  async authenticate(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    const clientId = this.configService.get<string>('CLIENT_ID');
    const clientSecret = this.configService.get<string>('CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      throw new Error(
        'CLIENT_ID and CLIENT_SECRET must be set in environment variables',
      );
    }

    try {
      this.logger.log('Authenticating with NinjaOne API...');

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/ws/oauth/token`,
          new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret,
            scope: 'monitoring management',
          }).toString(),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        ),
      );

      this.accessToken = response.data.access_token;
      const expiresIn = response.data.expires_in || 3600;
      this.tokenExpiry = new Date(Date.now() + expiresIn * 1000);

      this.logger.log('Successfully authenticated with NinjaOne');

      if (!this.accessToken) {
        throw new Error('No access token received from NinjaOne API');
      }

      return this.accessToken;
    } catch (error) {
      this.logger.error(
        'Authentication failed:',
        error.response?.data || error.message,
      );
      throw new Error('Failed to authenticate with NinjaOne API');
    }
  }

  /**
   * Get tickets from NinjaOne API with optional filters
   */
  async getTickets(filters?: {
    df?: string; // Date from (format: yyyy-MM-dd or timestamp)
    dt?: string; // Date to (format: yyyy-MM-dd or timestamp)
    clientId?: number; // Client/Organization ID
    assignedTo?: string; // Assigned technician
    status?: string; // Ticket status (OPEN, IN_PROGRESS, CLOSED, etc.)
    type?: string; // Ticket type
    severity?: string; // Ticket severity
    pageSize?: number; // Number of results per page
    after?: number; // Cursor for pagination
  }): Promise<any> {
    const token = await this.authenticate();

    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (filters?.df) params.append('df', filters.df);
      if (filters?.dt) params.append('dt', filters.dt);
      if (filters?.clientId) params.append('clientId', filters.clientId.toString());
      if (filters?.assignedTo) params.append('assignedTo', filters.assignedTo);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.severity) params.append('severity', filters.severity);
      if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());
      if (filters?.after) params.append('after', filters.after.toString());

      const queryString = params.toString();
      const url = `${this.baseUrl}/api/v2/ticketing/tickets${queryString ? `?${queryString}` : ''}`;

      this.logger.log(`Fetching tickets from NinjaOne API: ${url}`);

      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }),
      );

      const ticketsCount = Array.isArray(response.data)
        ? response.data.length
        : response.data?.results?.length || 0;

      this.logger.log(`Retrieved ${ticketsCount} tickets`);
      return response.data;
    } catch (error) {
      this.logger.error('Failed to fetch tickets:');
      this.logger.error('Status:', error.response?.status);
      this.logger.error('Data:', JSON.stringify(error.response?.data));
      this.logger.error('Message:', error.message);
      throw new Error('Failed to fetch tickets from NinjaOne API');
    }
  }

  /**
   * Get a specific ticket by ID
   */
  async getTicketById(ticketId: number): Promise<any> {
    const token = await this.authenticate();

    try {
      this.logger.log(`Fetching ticket ${ticketId} from NinjaOne API...`);

      const response = await firstValueFrom(
        this.httpService.get(
          `${this.baseUrl}/v2/ticketing/ticket/${ticketId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          },
        ),
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch ticket ${ticketId}:`,
        error.response?.data || error.message,
      );
      throw new Error(`Failed to fetch ticket ${ticketId} from NinjaOne API`);
    }
  }

  /**
   * Get organizations from NinjaOne API
   */
  async getOrganizations(): Promise<any> {
    const token = await this.authenticate();

    try {
      this.logger.log('Fetching organizations from NinjaOne API...');

      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/v2/organizations`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }),
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
   * Get devices from NinjaOne API
   */
  async getDevices(): Promise<any> {
    const token = await this.authenticate();

    try {
      this.logger.log('Fetching devices from NinjaOne API...');

      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/v2/devices`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }),
      );

      this.logger.log(`Retrieved ${response.data?.length || 0} devices`);
      return response.data;
    } catch (error) {
      this.logger.error(
        'Failed to fetch devices:',
        error.response?.data || error.message,
      );
      throw new Error('Failed to fetch devices from NinjaOne API');
    }
  }

  /**
   * Test authentication with all possible regions/URLs
   */
  async testAllRegions(): Promise<any> {
    const clientId = this.configService.get<string>('CLIENT_ID');
    const clientSecret = this.configService.get<string>('CLIENT_SECRET');

    const urlsToTest = [
      'https://app.ninjaone.com',
      'https://app.ninjarmm.com',
      'https://eu.ninjaone.com',
      'https://eu.ninjarmm.com',
      'https://oc.ninjaone.com',
      'https://oc.ninjarmm.com',
      'https://ca.ninjaone.com',
      'https://ca.ninjarmm.com',
    ];

    const results: any[] = [];

    for (const url of urlsToTest) {
      try {
        this.logger.log(`Testing authentication with ${url}...`);

        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');
        params.append('client_id', clientId || '');
        params.append('client_secret', clientSecret || '');
        params.append('scope', 'monitoring management');

        const response = await firstValueFrom(
          this.httpService.post(
            `${url}/ws/oauth/token`,
            params.toString(),
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              timeout: 5000,
            },
          ),
        );

        results.push({
          url,
          success: true,
          message: 'Authentication successful!',
          tokenReceived: !!response.data?.access_token,
          expiresIn: response.data?.expires_in,
        });

        this.logger.log(`SUCCESS with ${url}!`);
      } catch (error) {
        results.push({
          url,
          success: false,
          error: error.response?.data?.resultCode || error.message,
          details: error.response?.data,
        });

        this.logger.warn(`Failed with ${url}: ${error.response?.data?.resultCode || error.message}`);
      }
    }

    return {
      results,
      successfulUrls: results.filter((r) => r.success).map((r) => r.url),
      summary: `Tested ${urlsToTest.length} URLs, ${results.filter((r) => r.success).length} successful`,
    };
  }

  /**
   * Get list of technicians/users
   */
  async getTechnicians(): Promise<any> {
    const token = await this.authenticate();

    try {
      this.logger.log('Fetching technicians from NinjaOne API...');

      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/v2/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }),
      );

      this.logger.log(`Retrieved ${response.data?.length || 0} technicians`);
      return response.data;
    } catch (error) {
      this.logger.error(
        'Failed to fetch technicians:',
        error.response?.data || error.message,
      );
      throw new Error('Failed to fetch technicians from NinjaOne API');
    }
  }

  /**
   * Get ticket boards
   */
  async getTicketBoards(): Promise<any> {
    const token = await this.authenticate();

    try {
      this.logger.log('Fetching ticket boards from NinjaOne API...');

      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/v2/ticketing/ticket-board`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }),
      );

      this.logger.log(`Retrieved ${response.data?.length || 0} ticket boards`);
      return response.data;
    } catch (error) {
      this.logger.error(
        'Failed to fetch ticket boards:',
        error.response?.data || error.message,
      );
      throw new Error('Failed to fetch ticket boards from NinjaOne API');
    }
  }

  /**
   * Get ticket statuses
   */
  async getTicketStatuses(): Promise<any> {
    const token = await this.authenticate();

    try {
      this.logger.log('Fetching ticket statuses from NinjaOne API...');

      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/v2/ticketing/ticket-status`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }),
      );

      this.logger.log(`Retrieved ${response.data?.length || 0} ticket statuses`);
      return response.data;
    } catch (error) {
      this.logger.error(
        'Failed to fetch ticket statuses:',
        error.response?.data || error.message,
      );
      throw new Error('Failed to fetch ticket statuses from NinjaOne API');
    }
  }
}
