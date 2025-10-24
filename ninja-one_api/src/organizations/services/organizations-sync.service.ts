import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity';
import { OrganizationsService } from './organizations.service';

/**
 * Service de synchronisation des organisations depuis l'API NinjaOne vers la base de données locale
 */
@Injectable()
export class OrganizationsSyncService {
  private readonly logger = new Logger(OrganizationsSyncService.name);

  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    private organizationsService: OrganizationsService,
  ) {}

  /**
   * Synchronise toutes les organisations depuis l'API NinjaOne
   * Retourne le nombre d'organisations synchronisées et d'erreurs
   */
  async syncOrganizations(): Promise<{
    synced: number;
    errors: number;
    message: string;
  }> {
    this.logger.log('Starting organizations sync...');
    let synced = 0;
    let errors = 0;

    try {
      const organizations = await this.organizationsService.getOrganizations();

      for (const org of organizations) {
        try {
          const organization = this.organizationRepository.create({
            organizationId: org.id,
            organizationUid: org.uid || undefined,
            organizationName: org.name,
            nodeApprovalMode: org.nodeApprovalMode || undefined,
            description: org.description || undefined,
            address: org.address || undefined,
            city: org.city || undefined,
            state: org.state || undefined,
            country: org.country || undefined,
            postalCode: org.postalCode || undefined,
            phone: org.phone || undefined,
            email: org.email || undefined,
            website: org.website || undefined,
            tags: org.tags || undefined,
            customFields: org.fields || undefined,
            createdAt: org.createTime
              ? new Date(org.createTime * 1000)
              : undefined,
            isActive: true,
            etlSource: 'ninjaone_api',
          });

          await this.organizationRepository.save(organization);
          synced++;
        } catch (error) {
          this.logger.error(
            `Error syncing organization ${org.id}: ${error.message}`,
          );
          errors++;
        }
      }

      this.logger.log(
        `Organizations sync completed: ${synced} synced, ${errors} errors`,
      );
      return {
        synced,
        errors,
        message: `Organizations sync completed: ${synced} synced, ${errors} errors`,
      };
    } catch (error) {
      this.logger.error(`Error fetching organizations: ${error.message}`);
      throw error;
    }
  }
}
