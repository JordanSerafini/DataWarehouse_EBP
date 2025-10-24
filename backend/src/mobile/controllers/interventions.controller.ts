import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Res,
  StreamableFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { InterventionsService } from '../services/interventions.service';
import { FileService } from '../services/file.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../enums/user-role.enum';
import {
  InterventionDto,
  InterventionWithDistanceDto,
  TechnicianStatsDto,
} from '../dto/interventions/intervention.dto';
import {
  UpdateInterventionDto,
  StartInterventionDto,
  CompleteInterventionDto,
  CreateTimesheetDto,
} from '../dto/interventions/update-intervention.dto';
import {
  QueryInterventionsDto,
  QueryNearbyInterventionsDto,
} from '../dto/interventions/query-interventions.dto';
import {
  UploadPhotoDto,
  UploadSignatureDto,
  FileUploadResponseDto,
  InterventionFilesDto,
} from '../dto/files/upload-file.dto';

@ApiTags('Interventions')
@Controller('api/v1/interventions')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class InterventionsController {
  constructor(
    private readonly interventionsService: InterventionsService,
    private readonly fileService: FileService,
  ) {}

  /**
   * Récupère les interventions du technicien connecté
   */
  @Get('my-interventions')
  @Roles(UserRole.TECHNICIEN, UserRole.CHEF_CHANTIER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Mes interventions',
    description: 'Récupère la liste des interventions du technicien connecté',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des interventions',
    type: [InterventionDto],
  })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 403, description: 'Accès refusé' })
  async getMyInterventions(
    @Request() req,
    @Query() query: QueryInterventionsDto,
  ): Promise<InterventionDto[]> {
    const technicianId = req.user.colleagueId;

    // Si pas de colleagueId (admin/super_admin), retourner tableau vide
    // Les admins ne sont pas des techniciens de terrain
    if (!technicianId) {
      return Promise.resolve([]);
    }

    return this.interventionsService.getInterventionsForTechnician(technicianId, query);
  }

  /**
   * Récupère les statistiques du technicien connecté
   */
  @Get('my-stats')
  @Roles(UserRole.TECHNICIEN, UserRole.CHEF_CHANTIER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Mes statistiques',
    description: 'Statistiques d\'interventions du technicien connecté',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistiques',
    type: TechnicianStatsDto,
  })
  async getMyStats(@Request() req): Promise<TechnicianStatsDto> {
    const technicianId = req.user.colleagueId;

    if (!technicianId) {
      throw new Error('Utilisateur sans colleagueId');
    }

    return this.interventionsService.getTechnicianStats(technicianId);
  }

  /**
   * Récupère une intervention par ID
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
    summary: 'Détail intervention',
    description: 'Récupère les détails d\'une intervention',
  })
  @ApiParam({ name: 'id', description: 'ID de l\'intervention (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Détail de l\'intervention',
    type: InterventionDto,
  })
  @ApiResponse({ status: 404, description: 'Intervention non trouvée' })
  async getInterventionById(@Param('id') id: string): Promise<InterventionDto> {
    return this.interventionsService.getInterventionById(id);
  }

  /**
   * Récupère les interventions à proximité
   */
  @Get('nearby')
  @Roles(UserRole.TECHNICIEN, UserRole.CHEF_CHANTIER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Interventions à proximité',
    description: 'Recherche les interventions dans un rayon donné',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des interventions à proximité avec distance',
    type: [InterventionWithDistanceDto],
  })
  async getNearbyInterventions(
    @Query() query: QueryNearbyInterventionsDto,
    @Request() req,
  ): Promise<InterventionWithDistanceDto[]> {
    // Si technicien, filtrer par son ID
    if (req.user.role === UserRole.TECHNICIEN && !query.technicianId) {
      query.technicianId = req.user.colleagueId;
    }

    return this.interventionsService.getNearbyInterventions(query);
  }

  /**
   * Démarre une intervention
   */
  @Put(':id/start')
  @Roles(UserRole.TECHNICIEN, UserRole.CHEF_CHANTIER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Démarrer intervention',
    description: 'Marque une intervention comme démarrée (statut = EN_COURS)',
  })
  @ApiParam({ name: 'id', description: 'ID de l\'intervention' })
  @ApiResponse({
    status: 200,
    description: 'Intervention démarrée',
    type: InterventionDto,
  })
  @ApiResponse({ status: 404, description: 'Intervention non trouvée' })
  async startIntervention(
    @Param('id') id: string,
    @Body() dto: StartInterventionDto,
    @Request() req,
  ): Promise<InterventionDto> {
    const technicianId = req.user.colleagueId;
    return this.interventionsService.startIntervention(id, technicianId, dto);
  }

  /**
   * Clôture une intervention
   */
  @Put(':id/complete')
  @Roles(UserRole.TECHNICIEN, UserRole.CHEF_CHANTIER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Clôturer intervention',
    description: 'Marque une intervention comme terminée avec rapport',
  })
  @ApiParam({ name: 'id', description: 'ID de l\'intervention' })
  @ApiResponse({
    status: 200,
    description: 'Intervention clôturée',
    type: InterventionDto,
  })
  @ApiResponse({ status: 404, description: 'Intervention non trouvée' })
  async completeIntervention(
    @Param('id') id: string,
    @Body() dto: CompleteInterventionDto,
    @Request() req,
  ): Promise<InterventionDto> {
    const technicianId = req.user.colleagueId;
    return this.interventionsService.completeIntervention(id, technicianId, dto);
  }

  /**
   * Met à jour une intervention
   */
  @Put(':id')
  @Roles(UserRole.TECHNICIEN, UserRole.CHEF_CHANTIER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Mettre à jour intervention',
    description: 'Met à jour les informations d\'une intervention',
  })
  @ApiParam({ name: 'id', description: 'ID de l\'intervention' })
  @ApiResponse({
    status: 200,
    description: 'Intervention mise à jour',
    type: InterventionDto,
  })
  @ApiResponse({ status: 404, description: 'Intervention non trouvée' })
  async updateIntervention(
    @Param('id') id: string,
    @Body() dto: UpdateInterventionDto,
  ): Promise<InterventionDto> {
    return this.interventionsService.updateIntervention(id, dto);
  }

  /**
   * Enregistre le temps passé (timesheet)
   */
  @Post('timesheet')
  @Roles(UserRole.TECHNICIEN, UserRole.CHEF_CHANTIER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Enregistrer temps passé',
    description: 'Crée un timesheet pour une intervention',
  })
  @ApiResponse({
    status: 201,
    description: 'Timesheet créé',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Temps enregistré avec succès' },
      },
    },
  })
  async createTimesheet(
    @Body() dto: CreateTimesheetDto,
    @Request() req,
  ): Promise<{ success: boolean; message: string }> {
    const technicianId = req.user.colleagueId;
    return this.interventionsService.createTimesheet(technicianId, dto);
  }

  /**
   * Récupère les interventions d'un technicien spécifique (admin uniquement)
   */
  @Get('technician/:technicianId')
  @Roles(UserRole.CHEF_CHANTIER, UserRole.PATRON, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Interventions d\'un technicien (admin)',
    description: 'Récupère les interventions d\'un technicien spécifique',
  })
  @ApiParam({ name: 'technicianId', description: 'ID du technicien EBP' })
  @ApiResponse({
    status: 200,
    description: 'Liste des interventions',
    type: [InterventionDto],
  })
  async getTechnicianInterventions(
    @Param('technicianId') technicianId: string,
    @Query() query: QueryInterventionsDto,
  ): Promise<InterventionDto[]> {
    return this.interventionsService.getInterventionsForTechnician(technicianId, query);
  }

  /**
   * Récupère les statistiques d'un technicien spécifique (admin uniquement)
   */
  @Get('technician/:technicianId/stats')
  @Roles(UserRole.CHEF_CHANTIER, UserRole.PATRON, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Statistiques technicien (admin)',
    description: 'Statistiques d\'un technicien spécifique',
  })
  @ApiParam({ name: 'technicianId', description: 'ID du technicien EBP' })
  @ApiResponse({
    status: 200,
    description: 'Statistiques',
    type: TechnicianStatsDto,
  })
  async getTechnicianStatsById(
    @Param('technicianId') technicianId: string,
  ): Promise<TechnicianStatsDto> {
    return this.interventionsService.getTechnicianStats(technicianId);
  }

  /**
   * Upload une photo d'intervention
   */
  @Post(':id/photos')
  @Roles(UserRole.TECHNICIEN, UserRole.CHEF_CHANTIER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Upload photo intervention',
    description: 'Ajoute une photo à une intervention',
  })
  @ApiParam({ name: 'id', description: 'ID de l\'intervention' })
  @ApiResponse({
    status: 201,
    description: 'Photo uploadée avec succès',
    type: FileUploadResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Fichier invalide' })
  @ApiResponse({ status: 404, description: 'Intervention non trouvée' })
  async uploadPhoto(
    @Param('id') interventionId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadPhotoDto,
    @Request() req,
  ): Promise<FileUploadResponseDto> {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    const userId = req.user.id;

    const uploadedFile = {
      fieldname: file.fieldname,
      originalname: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
      size: file.size,
      buffer: file.buffer,
    };

    const result = await this.fileService.uploadInterventionPhoto(
      uploadedFile,
      interventionId,
      userId,
      body.latitude,
      body.longitude,
    );

    return {
      id: result.id,
      filename: result.filename,
      url: result.url,
      mimeType: result.mimeType,
      size: result.size,
      uploadedAt: result.uploadedAt,
    };
  }

  /**
   * Upload une signature client
   */
  @Post(':id/signature')
  @Roles(UserRole.TECHNICIEN, UserRole.CHEF_CHANTIER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Upload signature client',
    description: 'Ajoute la signature du client à une intervention',
  })
  @ApiParam({ name: 'id', description: 'ID de l\'intervention' })
  @ApiResponse({
    status: 201,
    description: 'Signature uploadée avec succès',
    type: FileUploadResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Fichier invalide' })
  @ApiResponse({ status: 404, description: 'Intervention non trouvée' })
  async uploadSignature(
    @Param('id') interventionId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadSignatureDto,
    @Request() req,
  ): Promise<FileUploadResponseDto> {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    const userId = req.user.id;

    const uploadedFile = {
      fieldname: file.fieldname,
      originalname: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
      size: file.size,
      buffer: file.buffer,
    };

    const result = await this.fileService.uploadSignature(
      uploadedFile,
      interventionId,
      userId,
      body.signerName,
    );

    return {
      id: result.id,
      filename: result.filename,
      url: result.url,
      mimeType: result.mimeType,
      size: result.size,
      uploadedAt: result.uploadedAt,
    };
  }

  /**
   * Récupère tous les fichiers d'une intervention
   */
  @Get(':id/files')
  @Roles(
    UserRole.TECHNICIEN,
    UserRole.CHEF_CHANTIER,
    UserRole.COMMERCIAL,
    UserRole.PATRON,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({
    summary: 'Fichiers intervention',
    description: 'Récupère toutes les photos et la signature d\'une intervention',
  })
  @ApiParam({ name: 'id', description: 'ID de l\'intervention' })
  @ApiResponse({
    status: 200,
    description: 'Liste des fichiers',
    type: InterventionFilesDto,
  })
  @ApiResponse({ status: 404, description: 'Intervention non trouvée' })
  async getInterventionFiles(@Param('id') interventionId: string): Promise<InterventionFilesDto> {
    const photos = await this.fileService.getInterventionPhotos(interventionId);

    // TODO: Récupérer la signature si elle existe
    // const signature = await this.fileService.getInterventionSignature(interventionId);

    return {
      photos: photos.map((p) => ({
        id: p.id,
        filename: p.filename,
        url: p.url,
        mimeType: p.mimeType,
        size: p.size,
        uploadedAt: p.uploadedAt,
      })),
      signature: undefined, // TODO
      totalFiles: photos.length,
      totalSize: photos.reduce((sum, p) => sum + p.size, 0),
    };
  }

  /**
   * Supprime un fichier
   */
  @Delete('files/:fileId')
  @Roles(UserRole.TECHNICIEN, UserRole.CHEF_CHANTIER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Supprimer fichier',
    description: 'Supprime une photo ou une signature',
  })
  @ApiParam({ name: 'fileId', description: 'ID du fichier' })
  @ApiResponse({
    status: 200,
    description: 'Fichier supprimé',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Fichier supprimé avec succès' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Fichier non trouvé' })
  async deleteFile(
    @Param('fileId') fileId: string,
    @Request() req,
  ): Promise<{ success: boolean; message: string }> {
    const userId = req.user.id;
    return this.fileService.deleteFile(fileId, userId);
  }

  /**
   * Télécharge un fichier
   */
  @Get('files/:fileId/download')
  @Roles(
    UserRole.TECHNICIEN,
    UserRole.CHEF_CHANTIER,
    UserRole.COMMERCIAL,
    UserRole.PATRON,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({
    summary: 'Télécharger fichier',
    description: 'Télécharge une photo ou une signature',
  })
  @ApiParam({ name: 'fileId', description: 'ID du fichier' })
  @ApiResponse({
    status: 200,
    description: 'Fichier téléchargé',
  })
  @ApiResponse({ status: 404, description: 'Fichier non trouvé' })
  async downloadFile(
    @Param('fileId') fileId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const { buffer, metadata } = await this.fileService.getFile(fileId);

    res.set({
      'Content-Type': metadata.mimeType,
      'Content-Disposition': `attachment; filename="${metadata.originalName}"`,
      'Content-Length': metadata.size,
    });

    return new StreamableFile(buffer);
  }
}
