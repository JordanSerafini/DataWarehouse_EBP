import { Controller, Get, Post } from '@nestjs/common';
import { DevicesService } from '../services/devices.service';
import { DevicesSyncService } from '../services/devices-sync.service';

@Controller('devices')
export class DevicesController {
  constructor(
    private readonly devicesService: DevicesService,
    private readonly devicesSyncService: DevicesSyncService,
  ) {}

  @Get()
  async getDevices() {
    return this.devicesService.getDevices();
  }

  @Post('sync')
  async syncDevices() {
    return this.devicesSyncService.syncDevices();
  }
}
