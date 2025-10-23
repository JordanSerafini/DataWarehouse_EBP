/**
 * NinjaOne Ticket Interface
 * Based on NinjaOne API documentation
 */

export interface NinjaOneTicket {
  id: number;
  uid?: string;
  clientId?: number;
  locationId?: number;
  contactId?: number;
  boardId?: number;
  statusId?: number;
  ticketFormId?: number;

  // Core ticket information
  subject: string;
  description?: string;
  summary?: string;

  // Status and priority
  status?: TicketStatus;
  priority?: TicketPriority;
  severity?: TicketSeverity;
  type?: string;

  // Assignment
  assignedTo?: number;
  assignedToName?: string;
  createBy?: number;
  createdByName?: string;
  requester?: TicketRequester;

  // Dates
  createTime?: number | string;
  lastUpdateTime?: number | string;
  resolvedTime?: number | string;
  closedTime?: number | string;
  dueDate?: number | string;

  // Tags and categorization
  tags?: string[];
  category?: string;
  subcategory?: string;

  // Tracking
  timeTracked?: number; // in seconds
  estimatedTime?: number; // in seconds

  // Relations
  deviceId?: number;
  deviceName?: string;
  organizationId?: number;
  organizationName?: string;

  // Additional fields
  customFields?: Record<string, any>;
  attachments?: TicketAttachment[];
  comments?: TicketComment[];
  logs?: TicketLog[];

  // Metadata
  ticketNumber?: string;
  externalId?: string;
  source?: string;
  channel?: string;
}

export interface TicketRequester {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  organizationId?: number;
}

export interface TicketComment {
  id: number;
  body: string;
  userId?: number;
  userName?: string;
  createTime: number | string;
  isInternal?: boolean;
  attachments?: TicketAttachment[];
}

export interface TicketLog {
  id: number;
  action: string;
  userId?: number;
  userName?: string;
  timestamp: number | string;
  details?: string;
  timeTracked?: number;
}

export interface TicketAttachment {
  id: number;
  name: string;
  url: string;
  size?: number;
  mimeType?: string;
  uploadedBy?: number;
  uploadedAt?: number | string;
}

export enum TicketStatus {
  NEW = 'NEW',
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
  CRITICAL = 'CRITICAL',
}

export enum TicketSeverity {
  MINOR = 'MINOR',
  MODERATE = 'MODERATE',
  MAJOR = 'MAJOR',
  CRITICAL = 'CRITICAL',
}

/**
 * Filters for querying tickets
 */
export interface TicketFilters {
  df?: string; // Date from
  dt?: string; // Date to
  clientId?: number;
  assignedTo?: string;
  status?: string;
  type?: string;
  severity?: string;
  priority?: string;
  tags?: string[];
  pageSize?: number;
  after?: number;
}

/**
 * Paginated response for tickets
 */
export interface PaginatedTicketsResponse {
  results: NinjaOneTicket[];
  totalCount?: number;
  pageSize?: number;
  after?: number;
  hasMore?: boolean;
}
