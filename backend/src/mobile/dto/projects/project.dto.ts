import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate, IsOptional, IsEnum } from 'class-validator';

/**
 * États de projets (Deals)
 */
export enum ProjectState {
  PROSPECTION = 0,
  EN_COURS = 1,
  GAGNE = 2,
  PERDU = 3,
  SUSPENDU = 4,
  ANNULE = 5,
}

/**
 * DTO pour un projet/affaire (Deal)
 */
export class ProjectDto {
  @ApiProperty({ description: 'ID du projet' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'Nom du projet' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Référence du projet' })
  @IsString()
  @IsOptional()
  reference?: string;

  @ApiProperty({ description: 'Nom du client' })
  @IsString()
  @IsOptional()
  customerName?: string;

  @ApiProperty({ description: 'ID du client' })
  @IsString()
  @IsOptional()
  customerId?: string;

  @ApiProperty({
    description: 'État du projet',
    enum: ProjectState,
  })
  @IsEnum(ProjectState)
  @IsOptional()
  state?: ProjectState;

  @ApiProperty({ description: 'Libellé de l\'état' })
  @IsString()
  @IsOptional()
  stateLabel?: string;

  @ApiProperty({ description: 'Date de début' })
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @ApiProperty({ description: 'Date de fin prévue' })
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @ApiProperty({ description: 'Date de fin réelle' })
  @IsDate()
  @IsOptional()
  actualEndDate?: Date;

  @ApiProperty({ description: 'Ville du chantier' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ description: 'Latitude GPS' })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ description: 'Longitude GPS' })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({ description: 'ID du responsable' })
  @IsString()
  @IsOptional()
  managerId?: string;

  @ApiProperty({ description: 'Nom du responsable' })
  @IsString()
  @IsOptional()
  managerName?: string;

  @ApiProperty({ description: 'Montant estimé HT' })
  @IsNumber()
  @IsOptional()
  estimatedAmount?: number;

  @ApiProperty({ description: 'Montant réel HT' })
  @IsNumber()
  @IsOptional()
  actualAmount?: number;

  @ApiProperty({ description: 'Date de création' })
  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @ApiProperty({ description: 'Date de modification' })
  @IsDate()
  @IsOptional()
  modifiedAt?: Date;
}

/**
 * DTO pour un projet avec distance (proximité GPS)
 */
export class ProjectWithDistanceDto extends ProjectDto {
  @ApiProperty({ description: 'Distance en km', example: 5.2 })
  @IsNumber()
  distanceKm: number;
}

/**
 * DTO pour les statistiques de projets
 */
export class ProjectStatsDto {
  @ApiProperty({ description: 'Nombre total de projets' })
  @IsNumber()
  totalProjects: number;

  @ApiProperty({ description: 'Projets en cours' })
  @IsNumber()
  activeProjects: number;

  @ApiProperty({ description: 'Projets gagnés' })
  @IsNumber()
  wonProjects: number;

  @ApiProperty({ description: 'Projets perdus' })
  @IsNumber()
  lostProjects: number;

  @ApiProperty({ description: 'Montant total estimé' })
  @IsNumber()
  totalEstimatedAmount: number;

  @ApiProperty({ description: 'Montant total réalisé' })
  @IsNumber()
  totalActualAmount: number;

  @ApiProperty({ description: 'Taux de gain (%)' })
  @IsNumber()
  winRate: number;
}
