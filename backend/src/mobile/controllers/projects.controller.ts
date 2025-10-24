import { Controller, Get, Param, Query, UseGuards, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProjectsService } from '../services/projects.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../enums/user-role.enum';
import {
  ProjectDto,
  ProjectWithDistanceDto,
  ProjectStatsDto,
} from '../dto/projects/project.dto';
import {
  QueryProjectsDto,
  QueryNearbyProjectsDto,
} from '../dto/projects/query-projects.dto';

@ApiTags('Projets')
@Controller('api/v1/projects')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  /**
   * Récupère les projets du responsable connecté
   */
  @Get('my-projects')
  @Roles(
    UserRole.CHEF_CHANTIER,
    UserRole.COMMERCIAL,
    UserRole.PATRON,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({
    summary: 'Mes projets',
    description: 'Récupère les projets dont je suis responsable',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des projets',
    type: [ProjectDto],
  })
  async getMyProjects(@Request() req): Promise<ProjectDto[]> {
    const managerId = req.user.colleagueId;
    return this.projectsService.getProjectsForManager(managerId);
  }

  /**
   * Récupère les projets d'un responsable spécifique (admin)
   */
  @Get('manager/:managerId')
  @Roles(UserRole.PATRON, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Projets responsable (admin)',
    description: 'Récupère les projets d\'un responsable spécifique',
  })
  @ApiParam({ name: 'managerId', description: 'ID du responsable' })
  @ApiResponse({
    status: 200,
    description: 'Liste des projets',
    type: [ProjectDto],
  })
  async getProjectsForManager(
    @Param('managerId') managerId: string,
  ): Promise<ProjectDto[]> {
    return this.projectsService.getProjectsForManager(managerId);
  }

  /**
   * Recherche de projets par critères
   */
  @Get('search')
  @Roles(
    UserRole.TECHNICIEN,
    UserRole.CHEF_CHANTIER,
    UserRole.COMMERCIAL,
    UserRole.PATRON,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({
    summary: 'Rechercher projets',
    description:
      'Recherche de projets par responsable, état, client, dates (avec pagination)',
  })
  @ApiResponse({
    status: 200,
    description: 'Projets trouvés',
    type: [ProjectDto],
  })
  async searchProjects(@Query() query: QueryProjectsDto): Promise<ProjectDto[]> {
    return this.projectsService.searchProjects(query);
  }

  /**
   * Recherche des projets à proximité GPS
   */
  @Get('nearby')
  @Roles(
    UserRole.TECHNICIEN,
    UserRole.CHEF_CHANTIER,
    UserRole.COMMERCIAL,
    UserRole.PATRON,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({
    summary: 'Projets à proximité',
    description: 'Recherche les projets dans un rayon donné autour d\'une position GPS',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des projets à proximité',
    type: [ProjectWithDistanceDto],
  })
  async getNearbyProjects(
    @Query() query: QueryNearbyProjectsDto,
  ): Promise<ProjectWithDistanceDto[]> {
    return this.projectsService.getNearbyProjects(query);
  }

  /**
   * Récupère un projet par son ID
   */
  @Get(':id')
  @Roles(
    UserRole.TECHNICIEN,
    UserRole.CHEF_CHANTIER,
    UserRole.COMMERCIAL,
    UserRole.PATRON,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({
    summary: 'Détail projet',
    description: 'Récupère les informations complètes d\'un projet',
  })
  @ApiParam({ name: 'id', description: 'ID du projet' })
  @ApiResponse({
    status: 200,
    description: 'Projet trouvé',
    type: ProjectDto,
  })
  @ApiResponse({ status: 404, description: 'Projet non trouvé' })
  async getProjectById(@Param('id') id: string): Promise<ProjectDto> {
    return this.projectsService.getProjectById(Number(id));
  }

  /**
   * Récupère les statistiques globales des projets
   */
  @Get('stats/global')
  @Roles(
    UserRole.CHEF_CHANTIER,
    UserRole.PATRON,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({
    summary: 'Statistiques globales',
    description:
      'Récupère les statistiques globales sur tous les projets (taux de gain, etc.)',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistiques des projets',
    type: ProjectStatsDto,
  })
  async getProjectsStats(): Promise<ProjectStatsDto> {
    return this.projectsService.getProjectsStats();
  }
}
