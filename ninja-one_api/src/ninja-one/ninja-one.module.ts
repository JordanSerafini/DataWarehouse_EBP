import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NinjaOneController } from './ninja-one.controller';
import { NinjaOneService } from './ninja-one.service';
import { DatabaseSyncService } from './services/database-sync.service';
import { Organization } from './entities/organization.entity';
import { Technician } from './entities/technician.entity';
import { Device } from './entities/device.entity';
import { Ticket } from './entities/ticket.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Organization, Technician, Device, Ticket]),
  ],
  controllers: [NinjaOneController],
  providers: [NinjaOneService, DatabaseSyncService],
  exports: [NinjaOneService, DatabaseSyncService],
})
export class NinjaOneModule {}
