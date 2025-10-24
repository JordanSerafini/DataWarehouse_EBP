import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { TicketQueryService } from '../services/ticket-query.service';
import { TicketQueryDto } from '../dto/ticket-query.dto';

@Controller('api/tickets')
export class TicketsController {
  constructor(private readonly ticketQueryService: TicketQueryService) {}

  @Get()
  async findAll(@Query() queryDto: TicketQueryDto) {
    return this.ticketQueryService.findTickets(queryDto);
  }

  @Get('stats')
  async getStats(@Query('organizationId', ParseIntPipe) organizationId?: number) {
    return this.ticketQueryService.getTicketStats(organizationId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const ticket = await this.ticketQueryService.findTicketById(id);
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
    return ticket;
  }
}
