import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Organization } from './organization.entity';

@Entity({ schema: 'ninjaone', name: 'dim_devices' })
export class Device {
  @PrimaryColumn({ name: 'device_id' })
  deviceId: number;

  @Column({ name: 'device_uid', unique: true, nullable: true })
  deviceUid: string;

  @Column({ name: 'organization_id' })
  organizationId: number;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ name: 'location_id', nullable: true })
  locationId: number;

  @Column({ name: 'system_name', length: 255, nullable: true })
  systemName: string;

  @Column({ name: 'dns_name', length: 255, nullable: true })
  dnsName: string;

  @Column({ name: 'node_class', length: 100, nullable: true })
  nodeClass: string;

  @Column({ name: 'node_role_id', nullable: true })
  nodeRoleId: number;

  @Column({ name: 'role_policy_id', nullable: true })
  rolePolicyId: number;

  @Column({ name: 'approval_status', length: 50, nullable: true })
  approvalStatus: string;

  @Column({ name: 'is_offline', default: false })
  isOffline: boolean;

  @Column({ name: 'created_at', type: 'timestamp with time zone', nullable: true })
  createdAt: Date;

  @Column({ name: 'last_contact_at', type: 'timestamp with time zone', nullable: true })
  lastContactAt: Date;

  @Column({ name: 'last_update_at', type: 'timestamp with time zone', nullable: true })
  lastUpdateAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  tags: any;

  @Column({ name: 'custom_fields', type: 'jsonb', nullable: true })
  customFields: any;

  @CreateDateColumn({ name: 'etl_loaded_at', type: 'timestamp with time zone' })
  etlLoadedAt: Date;

  @Column({ name: 'etl_source', default: 'ninjaone_api' })
  etlSource: string;
}
