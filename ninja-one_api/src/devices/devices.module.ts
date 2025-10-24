import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Device } from './entities/device.entity';
import { DevicesController } from './controllers/devices.controller';
import { DevicesService } from './services/devices.service';
import { DevicesSyncService } from './services/devices-sync.service';

@Module({
  imports: [TypeOrmModule.forFeature([Device]), HttpModule],
  controllers: [DevicesController],
  providers: [DevicesService, DevicesSyncService],
  exports: [DevicesService, DevicesSyncService],
})
export class DevicesModule {}
