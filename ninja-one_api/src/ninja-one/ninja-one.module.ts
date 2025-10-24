import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NinjaOneController } from './ninja-one.controller';
import { NinjaOneService } from './ninja-one.service';
import { DatabaseSyncService } from './services/database-sync.service';
import { TicketQueryService } from './services/ticket-query.service';
import {
  TicketsController,
  OrganizationTicketsController,
  TechnicianTicketsController,
} from './controllers/tickets.controller';
import { Organization } from './entities/organization.entity';
import { Technician } from './entities/technician.entity';
import { Device } from './entities/device.entity';
import { Ticket } from './entities/ticket.entity';
import { Location } from './entities/location.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Organization, Technician, Device, Ticket, Location]),
  ],
  controllers: [
    NinjaOneController,
    TicketsController,
    OrganizationTicketsController,
    TechnicianTicketsController,
  ],
  providers: [NinjaOneService, DatabaseSyncService, TicketQueryService],
  exports: [NinjaOneService, DatabaseSyncService, TicketQueryService],
})
export class NinjaOneModule {}
