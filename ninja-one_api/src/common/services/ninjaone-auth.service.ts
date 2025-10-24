import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

/**
 * Service d'authentification partagé pour l'API NinjaOne
 * Gère le flux OAuth2 client credentials et le cache des tokens
 */
@Injectable()
export class NinjaOneAuthService {
  private readonly logger = new Logger(NinjaOneAuthService.name);
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;
  public readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    // Get base URL from environment or use default
    this.baseUrl =
      this.configService.get<string>('NINJA_ONE_BASE_URL') ||
      'https://app.ninjaone.com';
    this.logger.log(`Using NinjaOne base URL: ${this.baseUrl}`);
  }

  /**
   * Authenticate with NinjaOne API using OAuth2 client credentials flow
   * Retourne un token valide (utilise le cache si disponible)
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
            scope: 'monitoring management control',
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
   * Test authentication with all possible regions/URLs
   * Utile pour le debugging et la configuration initiale
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
          this.httpService.post(`${url}/ws/oauth/token`, params.toString(), {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            timeout: 5000,
          }),
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

        this.logger.warn(
          `Failed with ${url}: ${error.response?.data?.resultCode || error.message}`,
        );
      }
    }

    return {
      results,
      successfulUrls: results.filter((r) => r.success).map((r) => r.url),
      summary: `Tested ${urlsToTest.length} URLs, ${results.filter((r) => r.success).length} successful`,
    };
  }

  /**
   * Invalide le token actuel (force une nouvelle authentification au prochain appel)
   */
  invalidateToken(): void {
    this.accessToken = null;
    this.tokenExpiry = null;
    this.logger.log('Token invalidated');
  }

  /**
   * Vérifie si un token valide est disponible (sans déclencher d'authentification)
   */
  hasValidToken(): boolean {
    return !!(
      this.accessToken &&
      this.tokenExpiry &&
      new Date() < this.tokenExpiry
    );
  }
}
