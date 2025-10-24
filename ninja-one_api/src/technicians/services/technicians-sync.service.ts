import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Technician } from '../entities/technician.entity';
import { TechniciansService } from './technicians.service';

/**
 * Service de synchronisation des technicians depuis l'API NinjaOne
 */
@Injectable()
export class TechniciansSyncService {
  private readonly logger = new Logger(TechniciansSyncService.name);

  constructor(
    @InjectRepository(Technician)
    private technicianRepository: Repository<Technician>,
    private techniciansService: TechniciansService,
  ) {}

  async syncTechnicians(): Promise<{
    synced: number;
    errors: number;
    message: string;
  }> {
    this.logger.log('Starting technicians sync...');
    let synced = 0;
    let errors = 0;

    try {
      const technicians = await this.techniciansService.getTechnicians();

      for (const tech of technicians) {
        try {
          const technician = this.technicianRepository.create({
            technicianId: tech.id,
            technicianUid: tech.uid || undefined,
            firstName: tech.firstName || undefined,
            lastName: tech.lastName || undefined,
            fullName: tech.name || undefined,
            email: tech.email || undefined,
            phone: tech.phone || undefined,
            userType: tech.userType || undefined,
            isAdministrator: tech.isAdministrator || false,
            isEnabled: tech.isEnabled ?? true,
            permitAllClients: tech.permitAllClients || false,
            notifyAllClients: tech.notifyAllClients || false,
            mfaConfigured: tech.mfaConfigured || false,
            mustChangePassword: tech.mustChangePassword || false,
            invitationStatus: tech.invitationStatus || undefined,
            organizationId: tech.organizationId || undefined,
            tags: tech.tags || undefined,
            customFields: tech.customFields || undefined,
            createdAt: tech.timestamp ? new Date(tech.timestamp * 1000) : undefined,
            lastLoginAt: tech.lastLoginDate
              ? new Date(tech.lastLoginDate * 1000)
              : undefined,
            etlSource: 'ninjaone_api',
          });

          await this.technicianRepository.save(technician);
          synced++;
        } catch (error) {
          this.logger.error(
            `Error syncing technician ${tech.id}: ${error.message}`,
          );
          errors++;
        }
      }

      this.logger.log(
        `Technicians sync completed: ${synced} synced, ${errors} errors`,
      );
      return {
        synced,
        errors,
        message: `Technicians sync completed: ${synced} synced, ${errors} errors`,
      };
    } catch (error) {
      this.logger.error(`Error fetching technicians: ${error.message}`);
      throw error;
    }
  }
}
