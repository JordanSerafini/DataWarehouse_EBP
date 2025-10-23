/**
 * Data Transfer Objects for transformed ticket data
 * These DTOs represent the structure optimized for your application
 */

export class TransformedTicketDto {
  // Identifiers
  ticketId: number;
  ticketUid?: string;
  ticketNumber?: string;
  externalId?: string;

  // Basic information
  title: string;
  description?: string;
  category?: string;
  subcategory?: string;

  // Status and workflow
  status: string;
  statusId?: number;
  priority: string;
  severity?: string;
  type?: string;

  // Client/Organization
  client: ClientInfo;

  // Assignment and ownership
  assignedTechnician?: TechnicianInfo;
  createdBy?: TechnicianInfo;
  requester?: RequesterInfo;

  // Dates (ISO 8601 format)
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  dueDate?: string;

  // Time tracking
  timeSpent: {
    hours: number;
    minutes: number;
    totalSeconds: number;
  };
  estimatedTime?: {
    hours: number;
    minutes: number;
    totalSeconds: number;
  };

  // Device/Asset information
  device?: DeviceInfo;

  // Tags and metadata
  tags: string[];
  customFields?: Record<string, any>;

  // Comments and activity
  commentsCount?: number;
  lastComment?: CommentSummary;
  activityCount?: number;

  // Attachments
  attachmentsCount?: number;
  hasAttachments: boolean;

  // Source tracking
  source?: string;
  channel?: string;
}

export class ClientInfo {
  id: number;
  name: string;
  locationId?: number;
  contactId?: number;
}

export class TechnicianInfo {
  id: number;
  name: string;
  email?: string;
  phone?: string;
}

export class RequesterInfo {
  id?: number;
  name: string;
  email?: string;
  phone?: string;
  organizationId?: number;
}

export class DeviceInfo {
  id: number;
  name: string;
  type?: string;
  organizationId?: number;
}

export class CommentSummary {
  id: number;
  preview: string; // First 100 characters
  author: string;
  createdAt: string;
  isInternal: boolean;
}

/**
 * DTO for bulk ticket statistics
 */
export class TicketStatisticsDto {
  total: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  bySeverity: Record<string, number>;
  byClient: ClientTicketCount[];
  byTechnician: TechnicianTicketCount[];
  averageResolutionTime?: number; // in hours
  averageResponseTime?: number; // in hours
}

export class ClientTicketCount {
  clientId: number;
  clientName: string;
  count: number;
  openCount: number;
  closedCount: number;
}

export class TechnicianTicketCount {
  technicianId: number;
  technicianName: string;
  count: number;
  openCount: number;
  inProgressCount: number;
}

/**
 * DTO for ticket timeline/activity
 */
export class TicketActivityDto {
  id: number;
  type: 'comment' | 'status_change' | 'assignment' | 'update' | 'attachment';
  description: string;
  author: {
    id?: number;
    name: string;
  };
  timestamp: string;
  details?: any;
}

/**
 * DTO for ticket export to Data Warehouse
 */
export class TicketDataWarehouseDto {
  // Fact table fields
  ticket_id: number;
  ticket_uid: string;
  ticket_number: string;

  // Dimensions (foreign keys)
  client_id: number;
  technician_id?: number;
  device_id?: number;
  status_id?: number;

  // Measures
  title: string;
  description?: string;
  priority: string;
  severity?: string;
  status: string;

  // Time dimensions
  created_date: string; // YYYY-MM-DD
  created_time: string; // HH:MM:SS
  created_timestamp: number;

  updated_date?: string;
  updated_time?: string;
  updated_timestamp?: number;

  resolved_date?: string;
  resolved_time?: string;
  resolved_timestamp?: number;

  closed_date?: string;
  closed_time?: string;
  closed_timestamp?: number;

  // Metrics
  time_spent_seconds: number;
  time_spent_hours: number;
  estimated_time_seconds?: number;
  estimated_time_hours?: number;

  // Resolution metrics
  time_to_resolution_seconds?: number;
  time_to_resolution_hours?: number;
  time_to_first_response_seconds?: number;
  time_to_first_response_hours?: number;

  // Flags and indicators
  is_overdue: boolean;
  is_resolved: boolean;
  is_closed: boolean;
  has_attachments: boolean;
  has_comments: boolean;

  // Tags and categorization
  tags_json: string; // JSON array as string
  category?: string;
  subcategory?: string;

  // Metadata
  source?: string;
  channel?: string;
  custom_fields_json?: string; // JSON object as string

  // ETL metadata
  etl_loaded_at: string;
  etl_source: string;
}
