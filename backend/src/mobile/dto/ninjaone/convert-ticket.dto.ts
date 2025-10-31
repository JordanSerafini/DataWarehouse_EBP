import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsEnum, IsOptional, IsUUID, IsString, IsBoolean } from 'class-validator';

/**
 * Type de cible pour la conversion
 */
export enum TargetType {
  SCHEDULE_EVENT = 'schedule_event', // Intervention planifiée
  INCIDENT = 'incident', // Ticket maintenance
}

/**
 * DTO pour convertir un ticket NinjaOne en intervention ou incident
 */
export class ConvertTicketDto {
  @ApiProperty({
    description: 'ID du ticket NinjaOne à convertir',
    example: 42,
  })
  @IsInt()
  ticketId: number;

  @ApiProperty({
    description: 'Type de cible: schedule_event (intervention) ou incident',
    enum: TargetType,
    example: TargetType.SCHEDULE_EVENT,
  })
  @IsEnum(TargetType)
  targetType: TargetType;

  @ApiProperty({
    description: 'ID de l\'utilisateur effectuant la conversion (optionnel, déduit du JWT)',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  convertedBy?: string;
}

/**
 * DTO de réponse après conversion
 */
export class ConversionResultDto {
  @ApiProperty({
    description: 'Succès de la conversion',
    example: true,
  })
  @IsBoolean()
  success: boolean;

  @ApiProperty({
    description: 'ID de la proposition créée (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  proposalId?: string;

  @ApiProperty({
    description: 'Type de proposition créée',
    example: 'intervention_proposed',
    required: false,
  })
  @IsOptional()
  @IsString()
  proposalType?: string;

  @ApiProperty({
    description: 'Message de résultat',
    example: 'Intervention proposée créée avec succès. ID: uuid-xxx',
  })
  @IsString()
  message: string;
}

/**
 * DTO pour créer un mapping manuel organisation → client
 */
export class CreateOrganizationMappingDto {
  @ApiProperty({
    description: 'ID de l\'organisation NinjaOne',
    example: 123,
  })
  @IsInt()
  ninjaoneOrganizationId: number;

  @ApiProperty({
    description: 'ID du client EBP',
    example: 'CUST001',
  })
  @IsString()
  ebpCustomerId: string;

  @ApiProperty({
    description: 'Notes sur le mapping',
    required: false,
  })
  @IsOptional()
  @IsString()
  mappingNotes?: string;
}

/**
 * DTO pour créer un mapping manuel technicien → collègue
 */
export class CreateTechnicianMappingDto {
  @ApiProperty({
    description: 'ID du technicien NinjaOne',
    example: 5,
  })
  @IsInt()
  ninjaoneTechnicianId: number;

  @ApiProperty({
    description: 'ID du collègue EBP',
    example: 'TECH01',
  })
  @IsString()
  ebpColleagueId: string;

  @ApiProperty({
    description: 'Notes sur le mapping',
    required: false,
  })
  @IsOptional()
  @IsString()
  mappingNotes?: string;
}

/**
 * DTO pour approuver/rejeter une proposition
 */
export class UpdateProposalStatusDto {
  @ApiProperty({
    description: 'Nouveau statut',
    enum: ['approved', 'rejected', 'cancelled'],
    example: 'approved',
  })
  @IsEnum(['approved', 'rejected', 'cancelled'])
  status: 'approved' | 'rejected' | 'cancelled';

  @ApiProperty({
    description: 'Raison du rejet (si status = rejected)',
    required: false,
  })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
