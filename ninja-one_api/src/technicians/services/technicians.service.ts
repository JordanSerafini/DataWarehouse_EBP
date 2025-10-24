import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { NinjaOneAuthService } from '../../common';

/**
 * Service pour interagir avec les endpoints Technicians de l'API NinjaOne
 */
@Injectable()
export class TechniciansService {
  private readonly logger = new Logger(TechniciansService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly authService: NinjaOneAuthService,
  ) {}

  /**
   * Get list of technicians/users
   */
  async getTechnicians(): Promise<any> {
    const token = await this.authService.authenticate();

    try {
      this.logger.log('Fetching technicians from NinjaOne API...');

      const response = await firstValueFrom(
        this.httpService.get(`${this.authService.baseUrl}/v2/users`, {
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
}
