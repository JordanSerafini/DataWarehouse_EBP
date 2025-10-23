import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { NinjaOneService } from './ninja-one.service';

@Controller('ninja-one')
export class NinjaOneController {
  constructor(private readonly ninjaOneService: NinjaOneService) {}

  @Get('tickets')
  async getTickets() {
    return this.ninjaOneService.getTickets();
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
}
