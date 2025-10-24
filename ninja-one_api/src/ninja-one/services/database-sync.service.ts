import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity';
import { Technician } from '../entities/technician.entity';
import { Device } from '../entities/device.entity';
import { Ticket } from '../entities/ticket.entity';
import { Location } from '../entities/location.entity';
import { NinjaOneService } from '../ninja-one.service';

@Injectable()
export class DatabaseSyncService {
  private readonly logger = new Logger(DatabaseSyncService.name);

  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(Technician)
    private technicianRepository: Repository<Technician>,
    @InjectRepository(Device)
    private deviceRepository: Repository<Device>,
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    private ninjaOneService: NinjaOneService,
  ) {}

  /**
   * Sync all organizations from NinjaOne API to database
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
      const organizations = await this.ninjaOneService.getOrganizations();

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

  /**
   * Sync all technicians from NinjaOne API to database
   */
  async syncTechnicians(): Promise<{
    synced: number;
    errors: number;
    message: string;
  }> {
    this.logger.log('Starting technicians sync...');
    let synced = 0;
    let errors = 0;

    try {
      const technicians = await this.ninjaOneService.getTechnicians();

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

  /**
   * Sync all devices from NinjaOne API to database
   */
  async syncDevices(): Promise<{
    synced: number;
    errors: number;
    message: string;
  }> {
    this.logger.log('Starting devices sync...');
    let synced = 0;
    let errors = 0;

    try {
      const devices = await this.ninjaOneService.getDevices();

      for (const dev of devices) {
        try {
          const device = this.deviceRepository.create({
            deviceId: dev.id,
            deviceUid: dev.uid || undefined,
            organizationId: dev.organizationId,
            locationId: dev.locationId || undefined,
            systemName: dev.systemName || undefined,
            dnsName: dev.dnsName || undefined,
            nodeClass: dev.nodeClass || undefined,
            nodeRoleId: dev.nodeRoleId || undefined,
            rolePolicyId: dev.rolePolicyId || undefined,
            approvalStatus: dev.approvalStatus || undefined,
            isOffline: dev.offline || false,
            createdAt: dev.createdAt ? new Date(dev.createdAt * 1000) : undefined,
            lastContactAt: dev.lastContact
              ? new Date(dev.lastContact * 1000)
              : undefined,
            lastUpdateAt: dev.lastUpdate
              ? new Date(dev.lastUpdate * 1000)
              : undefined,
            tags: dev.tags || undefined,
            customFields: dev.customFields || undefined,
            etlSource: 'ninjaone_api',
          });

          await this.deviceRepository.save(device);
          synced++;
        } catch (error) {
          this.logger.error(
            `Error syncing device ${dev.id}: ${error.message}`,
          );
          errors++;
        }
      }

      this.logger.log(
        `Devices sync completed: ${synced} synced, ${errors} errors`,
      );
      return {
        synced,
        errors,
        message: `Devices sync completed: ${synced} synced, ${errors} errors`,
      };
    } catch (error) {
      this.logger.error(`Error fetching devices: ${error.message}`);
      throw error;
    }
  }

  /**
   * Sync all tickets from NinjaOne API to database
   */
  async syncTickets(): Promise<{
    synced: number;
    errors: number;
    message: string;
  }> {
    this.logger.log('Starting tickets sync...');
    let synced = 0;
    let errors = 0;

    try {
      const tickets = await this.ninjaOneService.getTickets();

      // Load all organizations and technicians for mapping names to IDs
      const organizations = await this.organizationRepository.find();
      const technicians = await this.technicianRepository.find();

      const orgNameToId = new Map(
        organizations.map(o => [o.organizationName?.toLowerCase(), o.organizationId])
      );
      const techNameToId = new Map(
        technicians.map(t => [
          (t.firstName + ' ' + t.lastName).toLowerCase(),
          t.technicianId
        ])
      );

      for (const tkt of tickets) {
        try {
          // Map organization name to ID
          const orgId = orgNameToId.get(tkt.organization?.toLowerCase());

          // Map technician name to ID
          const techId = techNameToId.get(tkt.assignedAppUser?.toLowerCase());

          // Calculate date IDs for time dimension
          const createdDateId = tkt.createTime
            ? this.getDateId(new Date(tkt.createTime * 1000))
            : null;
          const resolvedDateId = tkt.resolvedTime
            ? this.getDateId(new Date(tkt.resolvedTime * 1000))
            : null;
          const closedDateId = tkt.closedTime
            ? this.getDateId(new Date(tkt.closedTime * 1000))
            : null;
          const dueDateId = tkt.dueDate
            ? this.getDateId(new Date(tkt.dueDate * 1000))
            : null;

          // Calculate time to resolution
          const timeToResolutionSeconds =
            tkt.resolvedTime && tkt.createTime
              ? tkt.resolvedTime - tkt.createTime
              : null;

          // Determine flags
          const statusName = tkt.status?.displayName?.toUpperCase() || '';
          const isResolved = ['RESOLVED', 'CLOSED', 'RÉSOLU', 'FERMÉ'].includes(
            statusName,
          );
          const isClosed = statusName === 'CLOSED' || statusName === 'FERMÉ';
          const isOverdue =
            tkt.dueDate &&
            !isResolved &&
            new Date(tkt.dueDate * 1000) < new Date();

          const ticket = this.ticketRepository.create({
            ticketId: tkt.id,
            ticketUid: tkt.uid || undefined,
            ticketNumber: tkt.ticketNumber?.toString() || tkt.number?.toString() || undefined,
            externalId: tkt.externalId || undefined,
            organizationId: orgId || tkt.clientId || tkt.organizationId || undefined,
            locationId: tkt.locationId || undefined,
            assignedTechnicianId: techId || tkt.assignedTo || undefined,
            createdByTechnicianId: tkt.createBy || tkt.createdBy || undefined,
            deviceId: tkt.deviceId || undefined,
            statusId: tkt.status?.statusId || tkt.statusId || undefined,
            createdDateId: createdDateId || undefined,
            resolvedDateId: resolvedDateId || undefined,
            closedDateId: closedDateId || undefined,
            dueDateId: dueDateId || undefined,
            title: tkt.summary || tkt.subject || '',
            description: tkt.description || undefined,
            category: tkt.category || undefined,
            subcategory: tkt.subcategory || undefined,
            status: tkt.status || undefined,
            priority: tkt.priority || undefined,
            severity: tkt.severity || undefined,
            ticketType: tkt.type || undefined,
            createdAt: tkt.createTime
              ? new Date(tkt.createTime * 1000)
              : new Date(),
            updatedAt: tkt.lastUpdateTime || tkt.updateTime
              ? new Date((tkt.lastUpdateTime || tkt.updateTime) * 1000)
              : undefined,
            resolvedAt: tkt.resolvedTime || tkt.closeTime
              ? new Date((tkt.resolvedTime || tkt.closeTime) * 1000)
              : undefined,
            closedAt: tkt.closedTime || tkt.closeTime
              ? new Date((tkt.closedTime || tkt.closeTime) * 1000)
              : undefined,
            dueDate: tkt.dueDate ? new Date(tkt.dueDate * 1000) : undefined,
            timeSpentSeconds: tkt.totalTimeTracked || tkt.timeTracked || 0,
            estimatedTimeSeconds: tkt.estimatedTime || undefined,
            timeToResolutionSeconds: timeToResolutionSeconds || undefined,
            timeToFirstResponseSeconds: tkt.timeToFirstResponse || undefined,
            isOverdue: isOverdue || false,
            isResolved,
            isClosed,
            hasAttachments: (tkt.attachments?.length || 0) > 0,
            hasComments: (tkt.comments?.length || 0) > 0,
            commentsCount: tkt.comments?.length || 0,
            attachmentsCount: tkt.attachments?.length || 0,
            activityCount: tkt.activities?.length || 0,
            tags: tkt.tags || undefined,
            customFields: tkt.customFields || undefined,
            source: tkt.source || undefined,
            channel: tkt.channel || undefined,
            requesterName: typeof tkt.requester === 'string' ? tkt.requester : tkt.requester?.name || undefined,
            requesterEmail: typeof tkt.requester === 'object' ? tkt.requester?.email : undefined,
            requesterPhone: typeof tkt.requester === 'object' ? tkt.requester?.phone : undefined,
            etlSource: 'ninjaone_api',
            etlVersion: '1.1',
          });

          await this.ticketRepository.save(ticket);
          synced++;
        } catch (error) {
          this.logger.error(`Error syncing ticket ${tkt.id}: ${error.message}`);
          errors++;
        }
      }

      this.logger.log(
        `Tickets sync completed: ${synced} synced, ${errors} errors`,
      );
      return {
        synced,
        errors,
        message: `Tickets sync completed: ${synced} synced, ${errors} errors`,
      };
    } catch (error) {
      this.logger.error(`Error fetching tickets: ${error.message}`);
      throw error;
    }
  }

  /**
   * Sync all locations from NinjaOne API to database
   * Must be called after syncOrganizations()
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
      // Get all organizations first
      const organizations = await this.organizationRepository.find();

      for (const org of organizations) {
        try {
          // Fetch locations for this organization from NinjaOne API
          const locations = await this.ninjaOneService.getOrganizationLocations(
            org.organizationId,
          );

          for (const loc of locations) {
            try {
              const location = this.locationRepository.create({
                locationId: loc.id,
                locationUid: loc.uid || undefined,
                organizationId: org.organizationId,
                locationName: loc.name,
                description: loc.description || undefined,
                address: loc.address || undefined,
                city: loc.city || undefined,
                state: loc.state || undefined,
                country: loc.country || undefined,
                postalCode: loc.postalCode || undefined,
                phone: loc.phone || undefined,
                tags: loc.tags || undefined,
                customFields: loc.fields || undefined,
                createdAt: loc.createTime
                  ? new Date(loc.createTime * 1000)
                  : undefined,
                isActive: true,
                etlSource: 'ninjaone_api',
              });

              await this.locationRepository.save(location);
              synced++;
            } catch (error) {
              this.logger.error(
                `Error syncing location ${loc.id} for org ${org.organizationId}: ${error.message}`,
              );
              errors++;
            }
          }
        } catch (error) {
          // If organization has no locations or API error, just log and continue
          this.logger.warn(
            `Could not fetch locations for organization ${org.organizationId}: ${error.message}`,
          );
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

  /**
   * Sync all data from NinjaOne API to database
   */
  async syncAll(): Promise<{
    organizations: any;
    locations: any;
    technicians: any;
    devices: any;
    tickets: any;
    message: string;
  }> {
    this.logger.log('Starting full sync of all NinjaOne data...');

    const organizations = await this.syncOrganizations();
    const locations = await this.syncLocations();
    const technicians = await this.syncTechnicians();
    const devices = await this.syncDevices();
    const tickets = await this.syncTickets();

    return {
      organizations,
      locations,
      technicians,
      devices,
      tickets,
      message: 'Full sync completed successfully',
    };
  }

  /**
   * Helper function to convert a Date to a date ID (YYYYMMDD format)
   */
  private getDateId(date: Date): number {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return parseInt(`${year}${month}${day}`);
  }
}
