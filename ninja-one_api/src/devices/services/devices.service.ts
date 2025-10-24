import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { NinjaOneAuthService } from '../../common';

@Injectable()
export class DevicesService {
  private readonly logger = new Logger(DevicesService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly authService: NinjaOneAuthService,
  ) {}

  async getDevices(): Promise<any> {
    const token = await this.authService.authenticate();

    try {
      this.logger.log('Fetching devices from NinjaOne API...');

      const response = await firstValueFrom(
        this.httpService.get(`${this.authService.baseUrl}/v2/devices`, {
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
