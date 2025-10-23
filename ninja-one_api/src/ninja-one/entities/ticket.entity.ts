import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Organization } from './organization.entity';
import { Technician } from './technician.entity';
import { Device } from './device.entity';

@Entity({ schema: 'ninjaone', name: 'fact_tickets' })
export class Ticket {
  @PrimaryColumn({ name: 'ticket_id' })
  ticketId: number;

  @Column({ name: 'ticket_uid', unique: true, nullable: true })
  ticketUid: string;

  @Column({ name: 'ticket_number', length: 100, nullable: true })
  ticketNumber: string;

  @Column({ name: 'external_id', length: 255, nullable: true })
  externalId: string;

  // Foreign Keys
  @Column({ name: 'organization_id', nullable: true })
  organizationId: number;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ name: 'location_id', nullable: true })
  locationId: number;

  @Column({ name: 'assigned_technician_id', nullable: true })
  assignedTechnicianId: number;

  @ManyToOne(() => Technician)
  @JoinColumn({ name: 'assigned_technician_id' })
  assignedTechnician: Technician;

  @Column({ name: 'created_by_technician_id', nullable: true })
  createdByTechnicianId: number;

  @ManyToOne(() => Technician)
  @JoinColumn({ name: 'created_by_technician_id' })
  createdByTechnician: Technician;

  @Column({ name: 'device_id', nullable: true })
  deviceId: number;

  @ManyToOne(() => Device)
  @JoinColumn({ name: 'device_id' })
  device: Device;

  @Column({ name: 'status_id', nullable: true })
  statusId: number;

  // Time dimension keys
  @Column({ name: 'created_date_id', nullable: true })
  createdDateId: number;

  @Column({ name: 'resolved_date_id', nullable: true })
  resolvedDateId: number;

  @Column({ name: 'closed_date_id', nullable: true })
  closedDateId: number;

  @Column({ name: 'due_date_id', nullable: true })
  dueDateId: number;

  // Ticket details
  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 100, nullable: true })
  category: string;

  @Column({ length: 100, nullable: true })
  subcategory: string;

  // Status and priority
  @Column({ type: 'jsonb', nullable: true })
  status: any;

  @Column({ type: 'jsonb', nullable: true })
  priority: any;

  @Column({ type: 'jsonb', nullable: true })
  severity: any;

  @Column({ name: 'ticket_type', length: 100, nullable: true })
  ticketType: string;

  // Dates
  @Column({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp with time zone', nullable: true })
  updatedAt: Date;

  @Column({ name: 'resolved_at', type: 'timestamp with time zone', nullable: true })
  resolvedAt: Date;

  @Column({ name: 'closed_at', type: 'timestamp with time zone', nullable: true })
  closedAt: Date;

  @Column({ name: 'due_date', type: 'timestamp with time zone', nullable: true })
  dueDate: Date;

  // Metrics
  @Column({ name: 'time_spent_seconds', default: 0 })
  timeSpentSeconds: number;

  @Column({ name: 'estimated_time_seconds', nullable: true })
  estimatedTimeSeconds: number;

  @Column({ name: 'time_to_resolution_seconds', nullable: true })
  timeToResolutionSeconds: number;

  @Column({ name: 'time_to_first_response_seconds', nullable: true })
  timeToFirstResponseSeconds: number;

  // Flags
  @Column({ name: 'is_overdue', default: false })
  isOverdue: boolean;

  @Column({ name: 'is_resolved', default: false })
  isResolved: boolean;

  @Column({ name: 'is_closed', default: false })
  isClosed: boolean;

  @Column({ name: 'has_attachments', default: false })
  hasAttachments: boolean;

  @Column({ name: 'has_comments', default: false })
  hasComments: boolean;

  // Counts
  @Column({ name: 'comments_count', default: 0 })
  commentsCount: number;

  @Column({ name: 'attachments_count', default: 0 })
  attachmentsCount: number;

  @Column({ name: 'activity_count', default: 0 })
  activityCount: number;

  // JSON fields
  @Column({ type: 'jsonb', nullable: true })
  tags: any;

  @Column({ name: 'custom_fields', type: 'jsonb', nullable: true })
  customFields: any;

  // Source tracking
  @Column({ length: 100, nullable: true })
  source: string;

  @Column({ length: 100, nullable: true })
  channel: string;

  // Requester info (denormalized)
  @Column({ name: 'requester_name', length: 255, nullable: true })
  requesterName: string;

  @Column({ name: 'requester_email', length: 255, nullable: true })
  requesterEmail: string;

  @Column({ name: 'requester_phone', length: 50, nullable: true })
  requesterPhone: string;

  // ETL metadata
  @CreateDateColumn({ name: 'etl_loaded_at', type: 'timestamp with time zone' })
  etlLoadedAt: Date;

  @Column({ name: 'etl_source', default: 'ninjaone_api' })
  etlSource: string;

  @Column({ name: 'etl_version', length: 20, nullable: true })
  etlVersion: string;
}
