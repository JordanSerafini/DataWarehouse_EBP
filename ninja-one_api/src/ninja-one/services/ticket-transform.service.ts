import { Injectable, Logger } from '@nestjs/common';
import { NinjaOneTicket } from '../interfaces/ninjaone-ticket.interface';
import {
  TransformedTicketDto,
  TicketDataWarehouseDto,
  ClientInfo,
  TechnicianInfo,
  RequesterInfo,
  DeviceInfo,
  CommentSummary,
  TicketStatisticsDto,
  ClientTicketCount,
  TechnicianTicketCount,
} from '../dto/ticket-transform.dto';

@Injectable()
export class TicketTransformService {
  private readonly logger = new Logger(TicketTransformService.name);

  /**
   * Transform a NinjaOne ticket to the application format
   */
  transformTicket(ticket: NinjaOneTicket): TransformedTicketDto {
    return {
      ticketId: ticket.id,
      ticketUid: ticket.uid,
      ticketNumber: ticket.ticketNumber,
      externalId: ticket.externalId,

      title: ticket.subject,
      description: ticket.description,
      category: ticket.category,
      subcategory: ticket.subcategory,

      status: ticket.status || 'UNKNOWN',
      statusId: ticket.statusId,
      priority: ticket.priority || 'MEDIUM',
      severity: ticket.severity,
      type: ticket.type,

      client: this.extractClientInfo(ticket),
      assignedTechnician: ticket.assignedTo
        ? {
            id: ticket.assignedTo,
            name: ticket.assignedToName || 'Unknown',
          }
        : undefined,
      createdBy: ticket.createBy
        ? {
            id: ticket.createBy,
            name: ticket.createdByName || 'Unknown',
          }
        : undefined,
      requester: ticket.requester
        ? {
            id: ticket.requester.id,
            name: ticket.requester.name || 'Unknown',
            email: ticket.requester.email,
            phone: ticket.requester.phone,
            organizationId: ticket.requester.organizationId,
          }
        : undefined,

      createdAt: this.convertToISO(ticket.createTime),
      updatedAt: this.convertToISO(ticket.lastUpdateTime),
      resolvedAt: this.convertToISO(ticket.resolvedTime),
      closedAt: this.convertToISO(ticket.closedTime),
      dueDate: this.convertToISO(ticket.dueDate),

      timeSpent: this.convertSecondsToTime(ticket.timeTracked || 0),
      estimatedTime: ticket.estimatedTime
        ? this.convertSecondsToTime(ticket.estimatedTime)
        : undefined,

      device: ticket.deviceId
        ? {
            id: ticket.deviceId,
            name: ticket.deviceName || 'Unknown Device',
            organizationId: ticket.organizationId,
          }
        : undefined,

      tags: ticket.tags || [],
      customFields: ticket.customFields,

      commentsCount: ticket.comments?.length || 0,
      lastComment: this.extractLastComment(ticket.comments),
      activityCount: ticket.logs?.length || 0,

      attachmentsCount: ticket.attachments?.length || 0,
      hasAttachments: (ticket.attachments?.length || 0) > 0,

      source: ticket.source,
      channel: ticket.channel,
    };
  }

  /**
   * Transform a NinjaOne ticket to Data Warehouse format
   */
  transformToDataWarehouse(ticket: NinjaOneTicket): TicketDataWarehouseDto {
    const createdTimestamp = this.convertToTimestamp(ticket.createTime);
    const updatedTimestamp = this.convertToTimestamp(ticket.lastUpdateTime);
    const resolvedTimestamp = this.convertToTimestamp(ticket.resolvedTime);
    const closedTimestamp = this.convertToTimestamp(ticket.closedTime);

    const timeToResolution = resolvedTimestamp && createdTimestamp
      ? resolvedTimestamp - createdTimestamp
      : undefined;

    return {
      ticket_id: ticket.id,
      ticket_uid: ticket.uid || `TICKET-${ticket.id}`,
      ticket_number: ticket.ticketNumber || `#${ticket.id}`,

      client_id: ticket.clientId || ticket.organizationId || 0,
      technician_id: ticket.assignedTo,
      device_id: ticket.deviceId,
      status_id: ticket.statusId,

      title: ticket.subject,
      description: ticket.description,
      priority: ticket.priority || 'MEDIUM',
      severity: ticket.severity,
      status: ticket.status || 'UNKNOWN',

      created_date: this.extractDate(createdTimestamp) || '1970-01-01',
      created_time: this.extractTime(createdTimestamp) || '00:00:00',
      created_timestamp: createdTimestamp,

      updated_date: this.extractDate(updatedTimestamp),
      updated_time: this.extractTime(updatedTimestamp),
      updated_timestamp: updatedTimestamp,

      resolved_date: this.extractDate(resolvedTimestamp),
      resolved_time: this.extractTime(resolvedTimestamp),
      resolved_timestamp: resolvedTimestamp,

      closed_date: this.extractDate(closedTimestamp),
      closed_time: this.extractTime(closedTimestamp),
      closed_timestamp: closedTimestamp,

      time_spent_seconds: ticket.timeTracked || 0,
      time_spent_hours: (ticket.timeTracked || 0) / 3600,
      estimated_time_seconds: ticket.estimatedTime,
      estimated_time_hours: ticket.estimatedTime
        ? ticket.estimatedTime / 3600
        : undefined,

      time_to_resolution_seconds: timeToResolution,
      time_to_resolution_hours: timeToResolution
        ? timeToResolution / 3600
        : undefined,
      time_to_first_response_seconds: undefined, // TODO: Calculate from logs
      time_to_first_response_hours: undefined,

      is_overdue: this.isOverdue(ticket.dueDate, ticket.status),
      is_resolved: ticket.status === 'RESOLVED' || ticket.status === 'CLOSED',
      is_closed: ticket.status === 'CLOSED',
      has_attachments: (ticket.attachments?.length || 0) > 0,
      has_comments: (ticket.comments?.length || 0) > 0,

      tags_json: JSON.stringify(ticket.tags || []),
      category: ticket.category,
      subcategory: ticket.subcategory,

      source: ticket.source,
      channel: ticket.channel,
      custom_fields_json: ticket.customFields
        ? JSON.stringify(ticket.customFields)
        : undefined,

      etl_loaded_at: new Date().toISOString(),
      etl_source: 'ninjaone_api',
    };
  }

  /**
   * Calculate statistics from a list of tickets
   */
  calculateStatistics(tickets: NinjaOneTicket[]): TicketStatisticsDto {
    const stats: TicketStatisticsDto = {
      total: tickets.length,
      byStatus: {},
      byPriority: {},
      bySeverity: {},
      byClient: [],
      byTechnician: [],
    };

    const clientMap = new Map<number, any>();
    const technicianMap = new Map<number, any>();
    let totalResolutionTime = 0;
    let resolvedCount = 0;

    tickets.forEach((ticket) => {
      // Count by status
      const status = ticket.status || 'UNKNOWN';
      stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;

      // Count by priority
      const priority = ticket.priority || 'MEDIUM';
      stats.byPriority[priority] = (stats.byPriority[priority] || 0) + 1;

      // Count by severity
      if (ticket.severity) {
        stats.bySeverity[ticket.severity] =
          (stats.bySeverity[ticket.severity] || 0) + 1;
      }

      // Count by client
      const clientId = ticket.clientId || ticket.organizationId;
      if (clientId) {
        if (!clientMap.has(clientId)) {
          clientMap.set(clientId, {
            clientId,
            clientName: ticket.organizationName || `Client ${clientId}`,
            count: 0,
            openCount: 0,
            closedCount: 0,
          });
        }
        const clientStat = clientMap.get(clientId);
        clientStat.count++;
        if (status === 'OPEN' || status === 'IN_PROGRESS') {
          clientStat.openCount++;
        } else if (status === 'CLOSED') {
          clientStat.closedCount++;
        }
      }

      // Count by technician
      if (ticket.assignedTo) {
        if (!technicianMap.has(ticket.assignedTo)) {
          technicianMap.set(ticket.assignedTo, {
            technicianId: ticket.assignedTo,
            technicianName: ticket.assignedToName || `Technician ${ticket.assignedTo}`,
            count: 0,
            openCount: 0,
            inProgressCount: 0,
          });
        }
        const techStat = technicianMap.get(ticket.assignedTo);
        techStat.count++;
        if (status === 'OPEN') techStat.openCount++;
        if (status === 'IN_PROGRESS') techStat.inProgressCount++;
      }

      // Calculate resolution time
      if (ticket.resolvedTime && ticket.createTime) {
        const created = this.convertToTimestamp(ticket.createTime);
        const resolved = this.convertToTimestamp(ticket.resolvedTime);
        totalResolutionTime += (resolved - created) / 3600; // Convert to hours
        resolvedCount++;
      }
    });

    stats.byClient = Array.from(clientMap.values());
    stats.byTechnician = Array.from(technicianMap.values());
    stats.averageResolutionTime =
      resolvedCount > 0 ? totalResolutionTime / resolvedCount : undefined;

    return stats;
  }

  // Helper methods

  private extractClientInfo(ticket: NinjaOneTicket): ClientInfo {
    return {
      id: ticket.clientId || ticket.organizationId || 0,
      name: ticket.organizationName || 'Unknown Organization',
      locationId: ticket.locationId,
      contactId: ticket.contactId,
    };
  }

  private extractLastComment(comments?: any[]): CommentSummary | undefined {
    if (!comments || comments.length === 0) return undefined;

    const lastComment = comments[comments.length - 1];
    return {
      id: lastComment.id,
      preview: (lastComment.body || '').substring(0, 100),
      author: lastComment.userName || 'Unknown',
      createdAt: this.convertToISO(lastComment.createTime),
      isInternal: lastComment.isInternal || false,
    };
  }

  private convertSecondsToTime(seconds: number): {
    hours: number;
    minutes: number;
    totalSeconds: number;
  } {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return { hours, minutes, totalSeconds: seconds };
  }

  private convertToISO(time?: number | string): string {
    if (!time) return '';
    if (typeof time === 'string') return time;
    return new Date(time * 1000).toISOString();
  }

  private convertToTimestamp(time?: number | string): number {
    if (!time) return 0;
    if (typeof time === 'number') return time;
    return Math.floor(new Date(time).getTime() / 1000);
  }

  private extractDate(timestamp?: number): string | undefined {
    if (!timestamp) return undefined;
    return new Date(timestamp * 1000).toISOString().split('T')[0];
  }

  private extractTime(timestamp?: number): string | undefined {
    if (!timestamp) return undefined;
    return new Date(timestamp * 1000).toISOString().split('T')[1].split('.')[0];
  }

  private isOverdue(dueDate?: number | string, status?: string): boolean {
    if (!dueDate || status === 'CLOSED' || status === 'RESOLVED') return false;
    const due = this.convertToTimestamp(dueDate);
    const now = Math.floor(Date.now() / 1000);
    return now > due;
  }
}
