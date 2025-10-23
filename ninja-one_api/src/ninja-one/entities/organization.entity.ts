import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'ninjaone', name: 'dim_organizations' })
export class Organization {
  @PrimaryColumn({ name: 'organization_id' })
  organizationId: number;

  @Column({ name: 'organization_uid', nullable: true })
  organizationUid: string;

  @Column({ name: 'organization_name' })
  organizationName: string;

  @Column({ name: 'node_approval_mode', nullable: true })
  nodeApprovalMode: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ length: 100, nullable: true })
  state: string;

  @Column({ length: 100, nullable: true })
  country: string;

  @Column({ name: 'postal_code', length: 20, nullable: true })
  postalCode: string;

  @Column({ length: 50, nullable: true })
  phone: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ length: 255, nullable: true })
  website: string;

  @Column({ type: 'jsonb', nullable: true })
  tags: any;

  @Column({ name: 'custom_fields', type: 'jsonb', nullable: true })
  customFields: any;

  @Column({ name: 'created_at', type: 'timestamp with time zone', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'etl_loaded_at', type: 'timestamp with time zone' })
  etlLoadedAt: Date;

  @Column({ name: 'etl_source', default: 'ninjaone_api' })
  etlSource: string;
}
