import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../entities/ticket.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import { Technician } from '../../technicians/entities/technician.entity';
import { TicketsService } from './tickets.service';

@Injectable()
export class TicketsSyncService {
  private readonly logger = new Logger(TicketsSyncService.name);

  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(Technician)
    private technicianRepository: Repository<Technician>,
    private ticketsService: TicketsService,
  ) {}

  private getDateId(date: Date): number {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return parseInt(`${year}${month}${day}`);
  }

  async syncTickets(): Promise<{
    synced: number;
    errors: number;
    message: string;
  }> {
    this.logger.log('Starting tickets sync...');
    let synced = 0;
    let errors = 0;

    try {
      const tickets = await this.ticketsService.getTickets();

      const organizations = await this.organizationRepository.find();
      const technicians = await this.technicianRepository.find();

      const orgNameToId = new Map(
        organizations.map((o) => [
          o.organizationName?.toLowerCase(),
          o.organizationId,
        ]),
      );
      const techNameToId = new Map(
        technicians.map((t) => [
          (t.firstName + ' ' + t.lastName).toLowerCase(),
          t.technicianId,
        ]),
      );

      for (const tkt of tickets) {
        try {
          const orgId = orgNameToId.get(tkt.organization?.toLowerCase());
          const techId = techNameToId.get(tkt.assignedAppUser?.toLowerCase());

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

          const timeToResolutionSeconds =
            tkt.resolvedTime && tkt.createTime
              ? tkt.resolvedTime - tkt.createTime
              : null;

          const statusName = tkt.status?.displayName?.toUpperCase() || '';
          const isResolved = ['RESOLVED', 'CLOSED', 'RÉSOLU', 'FERMÉ'].includes(
            statusName,
          );
          const isClosed =
            statusName === 'CLOSED' || statusName === 'FERMÉ';
          const isOverdue =
            tkt.dueDate &&
            !isResolved &&
            new Date(tkt.dueDate * 1000) < new Date();

          const ticket = this.ticketRepository.create({
            ticketId: tkt.id,
            ticketUid: tkt.uid || undefined,
            ticketNumber:
              tkt.ticketNumber?.toString() || tkt.number?.toString() || undefined,
            externalId: tkt.externalId || undefined,
            organizationId:
              orgId || tkt.clientId || tkt.organizationId || undefined,
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
            updatedAt:
              tkt.lastUpdateTime || tkt.updateTime
                ? new Date((tkt.lastUpdateTime || tkt.updateTime) * 1000)
                : undefined,
            resolvedAt:
              tkt.resolvedTime || tkt.closeTime
                ? new Date((tkt.resolvedTime || tkt.closeTime) * 1000)
                : undefined,
            closedAt:
              tkt.closedTime || tkt.closeTime
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
            requesterName:
              typeof tkt.requester === 'string'
                ? tkt.requester
                : tkt.requester?.name || undefined,
            requesterEmail:
              typeof tkt.requester === 'object'
                ? tkt.requester?.email
                : undefined,
            requesterPhone:
              typeof tkt.requester === 'object'
                ? tkt.requester?.phone
                : undefined,
            etlSource: 'ninjaone_api',
            etlVersion: '1.1',
          });

          await this.ticketRepository.save(ticket);
          synced++;
        } catch (error) {
          this.logger.error(
            `Error syncing ticket ${tkt.id}: ${error.message}`,
          );
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
}
