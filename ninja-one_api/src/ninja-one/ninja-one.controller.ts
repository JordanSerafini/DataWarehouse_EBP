import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { NinjaOneService } from './ninja-one.service';

@Controller('ninja-one')
export class NinjaOneController {
  constructor(private readonly ninjaOneService: NinjaOneService) {}

  @Get('tickets')
  async getTickets(
    @Query('df') df?: string,
    @Query('dt') dt?: string,
    @Query('clientId') clientId?: string,
    @Query('assignedTo') assignedTo?: string,
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('severity') severity?: string,
    @Query('pageSize') pageSize?: string,
    @Query('after') after?: string,
  ) {
    const filters: any = {};
    if (df) filters.df = df;
    if (dt) filters.dt = dt;
    if (clientId) filters.clientId = parseInt(clientId);
    if (assignedTo) filters.assignedTo = assignedTo;
    if (status) filters.status = status;
    if (type) filters.type = type;
    if (severity) filters.severity = severity;
    if (pageSize) filters.pageSize = parseInt(pageSize);
    if (after) filters.after = parseInt(after);

    return this.ninjaOneService.getTickets(Object.keys(filters).length > 0 ? filters : undefined);
  }

  @Get('tickets/:id')
  async getTicketById(@Param('id', ParseIntPipe) id: number) {
    return this.ninjaOneService.getTicketById(id);
  }

  @Get('organizations')
  async getOrganizations() {
    return this.ninjaOneService.getOrganizations();
  }

  @Get('devices')
  async getDevices() {
    return this.ninjaOneService.getDevices();
  }

  @Get('auth/test')
  async testAuthentication() {
    await this.ninjaOneService.authenticate();
    return { message: 'Authentication successful', authenticated: true };
  }

  @Get('auth/test-all-regions')
  async testAllRegions() {
    return this.ninjaOneService.testAllRegions();
  }

  @Get('technicians')
  async getTechnicians() {
    return this.ninjaOneService.getTechnicians();
  }

  @Get('ticket-boards')
  async getTicketBoards() {
    return this.ninjaOneService.getTicketBoards();
  }

  @Get('ticket-statuses')
  async getTicketStatuses() {
    return this.ninjaOneService.getTicketStatuses();
  }
}
