import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Ticket } from './entities/ticket.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { Technician } from '../technicians/entities/technician.entity';
import { Device } from '../devices/entities/device.entity';
import { TicketsController } from './controllers/tickets.controller';
import { TicketsService } from './services/tickets.service';
import { TicketsSyncService } from './services/tickets-sync.service';
import { TicketQueryService } from './services/ticket-query.service';
import { TicketTransformService } from './services/ticket-transform.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, Organization, Technician, Device]),
    HttpModule,
  ],
  controllers: [TicketsController],
  providers: [
    TicketsService,
    TicketsSyncService,
    TicketQueryService,
    TicketTransformService,
  ],
  exports: [
    TicketsService,
    TicketsSyncService,
    TicketQueryService,
    TicketTransformService,
  ],
})
export class TicketsModule {}
