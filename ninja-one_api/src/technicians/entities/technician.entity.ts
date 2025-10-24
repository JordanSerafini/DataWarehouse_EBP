import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';

@Entity({ schema: 'ninjaone', name: 'dim_technicians' })
export class Technician {
  @PrimaryColumn({ name: 'technician_id' })
  technicianId: number;

  @Column({ name: 'technician_uid', unique: true, nullable: true })
  technicianUid: string;

  @Column({ name: 'first_name', length: 100, nullable: true })
  firstName: string;

  @Column({ name: 'last_name', length: 100, nullable: true })
  lastName: string;

  @Column({ name: 'full_name', length: 255, nullable: true })
  fullName: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ length: 50, nullable: true })
  phone: string;

  @Column({ name: 'user_type', length: 50, nullable: true })
  userType: string;

  @Column({ name: 'is_administrator', default: false })
  isAdministrator: boolean;

  @Column({ name: 'is_enabled', default: true })
  isEnabled: boolean;

  @Column({ name: 'permit_all_clients', default: false })
  permitAllClients: boolean;

  @Column({ name: 'notify_all_clients', default: false })
  notifyAllClients: boolean;

  @Column({ name: 'mfa_configured', default: false })
  mfaConfigured: boolean;

  @Column({ name: 'must_change_password', default: false })
  mustChangePassword: boolean;

  @Column({ name: 'invitation_status', length: 50, nullable: true })
  invitationStatus: string;

  @Column({ name: 'organization_id', nullable: true })
  organizationId: number;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ type: 'jsonb', nullable: true })
  tags: any;

  @Column({ name: 'custom_fields', type: 'jsonb', nullable: true })
  customFields: any;

  @Column({ name: 'created_at', type: 'timestamp with time zone', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @Column({ name: 'last_login_at', type: 'timestamp with time zone', nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn({ name: 'etl_loaded_at', type: 'timestamp with time zone' })
  etlLoadedAt: Date;

  @Column({ name: 'etl_source', default: 'ninjaone_api' })
  etlSource: string;
}
