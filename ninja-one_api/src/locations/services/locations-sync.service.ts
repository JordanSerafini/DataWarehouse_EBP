import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from '../entities/location.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import { OrganizationsService } from '../../organizations';

/**
 * Service de synchronisation des locations depuis l'API NinjaOne vers la base de données locale
 */
@Injectable()
export class LocationsSyncService {
  private readonly logger = new Logger(LocationsSyncService.name);

  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    private organizationsService: OrganizationsService,
  ) {}

  /**
   * Synchronise toutes les locations de toutes les organisations
   */
  async syncLocations(): Promise<{
    synced: number;
    errors: number;
    message: string;
  }> {
    this.logger.log('Starting locations sync...');
    let synced = 0;
    let errors = 0;

    try {
      const organizations = await this.organizationRepository.find();

      for (const org of organizations) {
        try {
          const locations =
            await this.organizationsService.getOrganizationLocations(
              org.organizationId,
            );

          for (const loc of locations) {
            try {
              const location = this.locationRepository.create({
                locationId: loc.id,
                organizationId: org.organizationId,
                locationName: loc.name,
                locationUid: loc.uid || undefined,
                address: loc.address || undefined,
                city: loc.city || undefined,
                state: loc.state || undefined,
                country: loc.country || undefined,
                postalCode: loc.postalCode || undefined,
                phone: loc.phone || undefined,
                tags: loc.tags || undefined,
                customFields: loc.fields || undefined,
                etlSource: 'ninjaone_api',
              });

              await this.locationRepository.save(location);
              synced++;
            } catch (error) {
              this.logger.error(
                `Error syncing location ${loc.id}: ${error.message}`,
              );
              errors++;
            }
          }
        } catch (error) {
          this.logger.warn(
            `Could not fetch locations for organization ${org.organizationId}: ${error.message}`,
          );
          errors++;
        }
      }

      this.logger.log(
        `Locations sync completed: ${synced} synced, ${errors} errors`,
      );
      return {
        synced,
        errors,
        message: `Locations sync completed: ${synced} synced, ${errors} errors`,
      };
    } catch (error) {
      this.logger.error(`Error in locations sync: ${error.message}`);
      throw error;
    }
  }
}
