import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsUUID } from 'class-validator';

/**
 * DTO pour upload d'une photo d'intervention
 */
export class UploadPhotoDto {
  @ApiProperty({
    description: 'ID de l\'intervention',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  interventionId: string;

  @ApiProperty({
    description: 'Latitude GPS de la photo',
    example: 48.8566,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({
    description: 'Longitude GPS de la photo',
    example: 2.3522,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({
    description: 'Description/légende de la photo',
    example: 'État avant intervention',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Fichier photo (JPEG, PNG, WebP)',
  })
  file: Express.Multer.File;
}

/**
 * DTO pour upload d'une signature
 */
export class UploadSignatureDto {
  @ApiProperty({
    description: 'ID de l\'intervention',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  interventionId: string;

  @ApiProperty({
    description: 'Nom du signataire (client)',
    example: 'Jean Dupont',
    required: false,
  })
  @IsString()
  @IsOptional()
  signerName?: string;

  @ApiProperty({
    description: 'Fonction du signataire',
    example: 'Responsable technique',
    required: false,
  })
  @IsString()
  @IsOptional()
  signerRole?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Fichier signature (PNG, SVG)',
  })
  file: Express.Multer.File;
}

/**
 * DTO pour la réponse d'upload de fichier
 */
export class FileUploadResponseDto {
  @ApiProperty({
    description: 'ID du fichier uploadé',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'Nom du fichier',
    example: '1698765432-a1b2c3d4e5f6.jpg',
  })
  filename: string;

  @ApiProperty({
    description: 'URL relative du fichier',
    example: '/uploads/photos/1698765432-a1b2c3d4e5f6.jpg',
  })
  url: string;

  @ApiProperty({
    description: 'Type MIME',
    example: 'image/jpeg',
  })
  mimeType: string;

  @ApiProperty({
    description: 'Taille en octets',
    example: 245760,
  })
  size: number;

  @ApiProperty({
    description: 'Date d\'upload',
    example: '2025-10-24T10:30:00Z',
  })
  uploadedAt: Date;
}

/**
 * DTO pour lister les fichiers d'une intervention
 */
export class InterventionFilesDto {
  @ApiProperty({
    description: 'Liste des photos',
    type: [FileUploadResponseDto],
  })
  photos: FileUploadResponseDto[];

  @ApiProperty({
    description: 'Signature client',
    type: FileUploadResponseDto,
    required: false,
  })
  signature?: FileUploadResponseDto;

  @ApiProperty({
    description: 'Nombre total de fichiers',
    example: 5,
  })
  totalFiles: number;

  @ApiProperty({
    description: 'Taille totale en octets',
    example: 1024000,
  })
  totalSize: number;
}
