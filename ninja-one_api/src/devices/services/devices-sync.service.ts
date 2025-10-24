import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from '../entities/device.entity';
import { DevicesService } from './devices.service';

@Injectable()
export class DevicesSyncService {
  private readonly logger = new Logger(DevicesSyncService.name);

  constructor(
    @InjectRepository(Device)
    private deviceRepository: Repository<Device>,
    private devicesService: DevicesService,
  ) {}

  async syncDevices(): Promise<{
    synced: number;
    errors: number;
    message: string;
  }> {
    this.logger.log('Starting devices sync...');
    let synced = 0;
    let errors = 0;

    try {
      const devices = await this.devicesService.getDevices();

      for (const dev of devices) {
        try {
          const device = this.deviceRepository.create({
            deviceId: dev.id,
            deviceUid: dev.uid || undefined,
            organizationId: dev.organizationId,
            locationId: dev.locationId || undefined,
            systemName: dev.systemName || undefined,
            dnsName: dev.dnsName || undefined,
            nodeClass: dev.nodeClass || undefined,
            nodeRoleId: dev.nodeRoleId || undefined,
            rolePolicyId: dev.rolePolicyId || undefined,
            approvalStatus: dev.approvalStatus || undefined,
            isOffline: dev.offline || false,
            createdAt: dev.createdAt ? new Date(dev.createdAt * 1000) : undefined,
            lastContactAt: dev.lastContact
              ? new Date(dev.lastContact * 1000)
              : undefined,
            lastUpdateAt: dev.lastUpdate
              ? new Date(dev.lastUpdate * 1000)
              : undefined,
            tags: dev.tags || undefined,
            customFields: dev.customFields || undefined,
            etlSource: 'ninjaone_api',
          });

          await this.deviceRepository.save(device);
          synced++;
        } catch (error) {
          this.logger.error(
            `Error syncing device ${dev.id}: ${error.message}`,
          );
          errors++;
        }
      }

      this.logger.log(
        `Devices sync completed: ${synced} synced, ${errors} errors`,
      );
      return {
        synced,
        errors,
        message: `Devices sync completed: ${synced} synced, ${errors} errors`,
      };
    } catch (error) {
      this.logger.error(`Error fetching devices: ${error.message}`);
      throw error;
    }
  }
}
