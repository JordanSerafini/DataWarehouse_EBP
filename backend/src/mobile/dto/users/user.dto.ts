import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../enums/user-role.enum';

/**
 * DTO pour créer un utilisateur
 */
export class CreateUserDto {
  @ApiProperty({
    description: 'Email de l\'utilisateur',
    example: 'jean.dupont@solution-logique.fr',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Mot de passe (si non fourni, "pass123" par défaut)',
    example: 'SecurePassword123!',
    required: false,
  })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiProperty({
    description: 'Nom complet de l\'utilisateur',
    example: 'Jean Dupont',
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'Rôle de l\'utilisateur',
    enum: UserRole,
    example: UserRole.TECHNICIEN,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({
    description: 'ID du collaborateur EBP associé',
    example: 'JDUPONT',
    required: false,
  })
  @IsString()
  @IsOptional()
  colleagueId?: string;

  @ApiProperty({
    description: 'L\'utilisateur est-il actif',
    example: true,
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: 'L\'utilisateur est-il vérifié',
    example: false,
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;
}

/**
 * DTO pour mettre à jour un utilisateur
 */
export class UpdateUserDto {
  @ApiProperty({
    description: 'Email de l\'utilisateur',
    example: 'jean.dupont@solution-logique.fr',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Nom complet de l\'utilisateur',
    example: 'Jean Dupont',
    required: false,
  })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiProperty({
    description: 'Rôle de l\'utilisateur',
    enum: UserRole,
    example: UserRole.TECHNICIEN,
    required: false,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiProperty({
    description: 'ID du collaborateur EBP associé',
    example: 'JDUPONT',
    required: false,
  })
  @IsString()
  @IsOptional()
  colleagueId?: string;

  @ApiProperty({
    description: 'L\'utilisateur est-il actif',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: 'L\'utilisateur est-il vérifié',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;
}
