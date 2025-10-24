import { Controller, Get, Post, Param, ParseIntPipe, Query } from '@nestjs/common';
import { NinjaOneService } from './ninja-one.service';
import { DatabaseSyncService } from './services/database-sync.service';

@Controller('ninja-one')
export class NinjaOneController {
  constructor(
    private readonly ninjaOneService: NinjaOneService,
    private readonly databaseSyncService: DatabaseSyncService,
  ) {}

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

  @Get('organizations/:id')
  async getOrganizationById(@Param('id', ParseIntPipe) id: number) {
    return this.ninjaOneService.getOrganizationById(id);
  }

  @Get('organizations/:id/locations')
  async getOrganizationLocations(@Param('id', ParseIntPipe) id: number) {
    return this.ninjaOneService.getOrganizationLocations(id);
  }

  @Get('organizations/:id/devices')
  async getOrganizationDevices(@Param('id', ParseIntPipe) id: number) {
    return this.ninjaOneService.getOrganizationDevices(id);
  }

  @Get('organizations/:id/documents')
  async getOrganizationDocuments(@Param('id', ParseIntPipe) id: number) {
    return this.ninjaOneService.getOrganizationDocuments(id);
  }

  @Get('organizations/:id/end-users')
  async getOrganizationEndUsers(@Param('id', ParseIntPipe) id: number) {
    return this.ninjaOneService.getOrganizationEndUsers(id);
  }

  @Get('documents/:id/attributes')
  async getOrganizationDocumentAttributes(@Param('id', ParseIntPipe) id: number) {
    return this.ninjaOneService.getOrganizationDocumentAttributes(id);
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

  // Database synchronization endpoints
  @Post('sync/organizations')
  async syncOrganizations() {
    return this.databaseSyncService.syncOrganizations();
  }

  @Post('sync/locations')
  async syncLocations() {
    return this.databaseSyncService.syncLocations();
  }

  @Post('sync/technicians')
  async syncTechnicians() {
    return this.databaseSyncService.syncTechnicians();
  }

  @Post('sync/devices')
  async syncDevices() {
    return this.databaseSyncService.syncDevices();
  }

  @Post('sync/tickets')
  async syncTickets() {
    return this.databaseSyncService.syncTickets();
  }

  @Post('sync/all')
  async syncAll() {
    return this.databaseSyncService.syncAll();
  }
}
