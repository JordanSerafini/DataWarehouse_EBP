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
   * Get tickets from NinjaOne API
   */
  async getTickets(): Promise<any> {
    const token = await this.authenticate();

    try {
      this.logger.log('Fetching tickets from NinjaOne API...');

      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/v2/ticketing/ticket/board`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }),
      );

      this.logger.log(`Retrieved ${response.data?.length || 0} tickets`);
      return response.data;
    } catch (error) {
      this.logger.error(
        'Failed to fetch tickets:',
        error.response?.data || error.message,
      );
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
}
