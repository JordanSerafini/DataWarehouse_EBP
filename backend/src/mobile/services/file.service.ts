import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';
import { DatabaseService } from './database.service';

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export interface FileMetadata {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
  entityType: string;
  entityId: string;
  uploadedBy: string;
  uploadedAt: Date;
}

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  private readonly uploadDir: string;
  private readonly maxFileSize: number = 10 * 1024 * 1024; // 10MB
  private readonly allowedMimeTypes = {
    images: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    documents: ['application/pdf'],
    signatures: ['image/png', 'image/svg+xml'],
  };

  constructor(
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
  ) {
    // Par défaut, stockage local dans uploads/
    this.uploadDir = this.configService.get<string>('UPLOAD_DIR') || path.join(process.cwd(), 'uploads');
    this.initializeUploadDirectories();
  }

  /**
   * Initialise les dossiers d'upload
   */
  private async initializeUploadDirectories() {
    try {
      await fs.mkdir(path.join(this.uploadDir, 'photos'), { recursive: true });
      await fs.mkdir(path.join(this.uploadDir, 'signatures'), { recursive: true });
      await fs.mkdir(path.join(this.uploadDir, 'documents'), { recursive: true });
      this.logger.log(`Upload directories initialized at: ${this.uploadDir}`);
    } catch (error) {
      this.logger.error('Error creating upload directories:', error);
      throw error;
    }
  }

  /**
   * Génère un nom de fichier unique
   */
  private generateUniqueFilename(originalName: string): string {
    const ext = path.extname(originalName);
    const hash = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();
    return `${timestamp}-${hash}${ext}`;
  }

  /**
   * Valide un fichier
   */
  private validateFile(file: UploadedFile, fileType: 'photo' | 'signature' | 'document') {
    // Vérifier taille
    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `Fichier trop volumineux. Taille max: ${this.maxFileSize / 1024 / 1024}MB`,
      );
    }

    // Vérifier type MIME
    let allowedTypes: string[] = [];
    switch (fileType) {
      case 'photo':
        allowedTypes = this.allowedMimeTypes.images;
        break;
      case 'signature':
        allowedTypes = this.allowedMimeTypes.signatures;
        break;
      case 'document':
        allowedTypes = [...this.allowedMimeTypes.images, ...this.allowedMimeTypes.documents];
        break;
    }

    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Type de fichier non autorisé. Types acceptés: ${allowedTypes.join(', ')}`,
      );
    }
  }

  /**
   * Upload une photo d'intervention
   */
  async uploadInterventionPhoto(
    file: UploadedFile,
    interventionId: string,
    userId: string,
    latitude?: number,
    longitude?: number,
  ): Promise<FileMetadata> {
    this.logger.log(`Uploading photo for intervention ${interventionId}`);

    this.validateFile(file, 'photo');

    const filename = this.generateUniqueFilename(file.originalname);
    const filePath = path.join(this.uploadDir, 'photos', filename);
    const relativeUrl = `/uploads/photos/${filename}`;

    try {
      // Sauvegarder le fichier
      await fs.writeFile(filePath, file.buffer);

      // TODO: Ajouter compression/resize avec sharp si nécessaire
      // const sharp = require('sharp');
      // await sharp(file.buffer).resize(1920, 1080, { fit: 'inside' }).jpeg({ quality: 85 }).toFile(filePath);

      // Enregistrer en base
      const result = await this.databaseService.query<FileMetadata>(
        `
        INSERT INTO mobile.intervention_photos (
          id,
          intervention_id,
          filename,
          original_name,
          mime_type,
          size_bytes,
          file_path,
          url,
          latitude,
          longitude,
          uploaded_by,
          uploaded_at
        ) VALUES (
          gen_random_uuid(),
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW()
        )
        RETURNING
          id,
          filename,
          original_name as "originalName",
          mime_type as "mimeType",
          size_bytes as size,
          file_path as path,
          url,
          'intervention' as "entityType",
          intervention_id as "entityId",
          uploaded_by as "uploadedBy",
          uploaded_at as "uploadedAt"
        `,
        [
          interventionId,
          filename,
          file.originalname,
          file.mimetype,
          file.size,
          filePath,
          relativeUrl,
          latitude || null,
          longitude || null,
          userId,
        ],
      );

      this.logger.log(`Photo uploaded successfully: ${filename}`);
      return result.rows[0];
    } catch (error) {
      // Nettoyer le fichier en cas d'erreur
      try {
        await fs.unlink(filePath);
      } catch (unlinkError) {
        this.logger.warn('Could not delete file after error:', unlinkError);
      }
      this.logger.error('Error uploading photo:', error);
      throw new BadRequestException('Erreur lors de l\'upload de la photo');
    }
  }

  /**
   * Upload une signature
   */
  async uploadSignature(
    file: UploadedFile,
    interventionId: string,
    userId: string,
    signerName: string,
  ): Promise<FileMetadata> {
    this.logger.log(`Uploading signature for intervention ${interventionId}`);

    this.validateFile(file, 'signature');

    const filename = this.generateUniqueFilename(file.originalname);
    const filePath = path.join(this.uploadDir, 'signatures', filename);
    const relativeUrl = `/uploads/signatures/${filename}`;

    try {
      // Sauvegarder le fichier
      await fs.writeFile(filePath, file.buffer);

      // Enregistrer en base
      const result = await this.databaseService.query<FileMetadata>(
        `
        INSERT INTO mobile.intervention_signatures (
          id,
          intervention_id,
          filename,
          original_name,
          mime_type,
          size_bytes,
          file_path,
          url,
          signer_name,
          signed_by,
          signed_at
        ) VALUES (
          gen_random_uuid(),
          $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()
        )
        RETURNING
          id,
          filename,
          original_name as "originalName",
          mime_type as "mimeType",
          size_bytes as size,
          file_path as path,
          url,
          'signature' as "entityType",
          intervention_id as "entityId",
          signed_by as "uploadedBy",
          signed_at as "uploadedAt"
        `,
        [
          interventionId,
          filename,
          file.originalname,
          file.mimetype,
          file.size,
          filePath,
          relativeUrl,
          signerName,
          userId,
        ],
      );

      // Mettre à jour l'intervention pour indiquer qu'elle a une signature
      await this.databaseService.query(
        `
        UPDATE public."ScheduleEvent"
        SET "HasAssociatedFiles" = TRUE
        WHERE "Id" = $1
        `,
        [interventionId],
      );

      this.logger.log(`Signature uploaded successfully: ${filename}`);
      return result.rows[0];
    } catch (error) {
      try {
        await fs.unlink(filePath);
      } catch (unlinkError) {
        this.logger.warn('Could not delete file after error:', unlinkError);
      }
      this.logger.error('Error uploading signature:', error);
      throw new BadRequestException('Erreur lors de l\'upload de la signature');
    }
  }

  /**
   * Récupère la liste des photos d'une intervention
   */
  async getInterventionPhotos(interventionId: string): Promise<FileMetadata[]> {
    try {
      const result = await this.databaseService.query<FileMetadata>(
        `
        SELECT
          id,
          filename,
          original_name as "originalName",
          mime_type as "mimeType",
          size_bytes as size,
          file_path as path,
          url,
          'intervention' as "entityType",
          intervention_id as "entityId",
          uploaded_by as "uploadedBy",
          uploaded_at as "uploadedAt"
        FROM mobile.intervention_photos
        WHERE intervention_id = $1
        ORDER BY uploaded_at DESC
        `,
        [interventionId],
      );

      return result.rows;
    } catch (error) {
      this.logger.error(`Error fetching photos for intervention ${interventionId}:`, error);
      throw new BadRequestException('Erreur lors de la récupération des photos');
    }
  }

  /**
   * Récupère un fichier
   */
  async getFile(fileId: string): Promise<{ buffer: Buffer; metadata: FileMetadata }> {
    try {
      // Chercher dans les photos
      let result = await this.databaseService.query<FileMetadata>(
        `
        SELECT
          id,
          filename,
          original_name as "originalName",
          mime_type as "mimeType",
          size_bytes as size,
          file_path as path,
          url,
          'photo' as "entityType",
          intervention_id as "entityId",
          uploaded_by as "uploadedBy",
          uploaded_at as "uploadedAt"
        FROM mobile.intervention_photos
        WHERE id = $1
        `,
        [fileId],
      );

      // Si pas trouvé, chercher dans les signatures
      if (result.rows.length === 0) {
        result = await this.databaseService.query<FileMetadata>(
          `
          SELECT
            id,
            filename,
            original_name as "originalName",
            mime_type as "mimeType",
            size_bytes as size,
            file_path as path,
            url,
            'signature' as "entityType",
            intervention_id as "entityId",
            signed_by as "uploadedBy",
            signed_at as "uploadedAt"
          FROM mobile.intervention_signatures
          WHERE id = $1
          `,
          [fileId],
        );
      }

      if (result.rows.length === 0) {
        throw new NotFoundException(`Fichier ${fileId} non trouvé`);
      }

      const metadata = result.rows[0];
      const buffer = await fs.readFile(metadata.path);

      return { buffer, metadata };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Error fetching file ${fileId}:`, error);
      throw new BadRequestException('Erreur lors de la récupération du fichier');
    }
  }

  /**
   * Supprime un fichier
   */
  async deleteFile(fileId: string, userId: string): Promise<{ success: boolean; message: string }> {
    try {
      // Récupérer le fichier
      const { metadata } = await this.getFile(fileId);

      // Vérifier que l'utilisateur est le propriétaire (ou admin)
      // TODO: Ajouter vérification rôle admin

      // Supprimer le fichier physique
      await fs.unlink(metadata.path);

      // Supprimer de la base
      if (metadata.entityType === 'photo') {
        await this.databaseService.query(
          `DELETE FROM mobile.intervention_photos WHERE id = $1`,
          [fileId],
        );
      } else {
        await this.databaseService.query(
          `DELETE FROM mobile.intervention_signatures WHERE id = $1`,
          [fileId],
        );
      }

      this.logger.log(`File ${fileId} deleted successfully`);
      return {
        success: true,
        message: 'Fichier supprimé avec succès',
      };
    } catch (error) {
      this.logger.error(`Error deleting file ${fileId}:`, error);
      throw new BadRequestException('Erreur lors de la suppression du fichier');
    }
  }
}
