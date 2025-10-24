import { Controller, Get, Post } from '@nestjs/common';
import { TechniciansService } from '../services/technicians.service';
import { TechniciansSyncService } from '../services/technicians-sync.service';

@Controller('technicians')
export class TechniciansController {
  constructor(
    private readonly techniciansService: TechniciansService,
    private readonly techniciansSyncService: TechniciansSyncService,
  ) {}

  @Get()
  async getTechnicians() {
    return this.techniciansService.getTechnicians();
  }

  @Post('sync')
  async syncTechnicians() {
    return this.techniciansSyncService.syncTechnicians();
  }
}
