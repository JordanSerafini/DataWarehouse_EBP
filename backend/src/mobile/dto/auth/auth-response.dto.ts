import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../enums/user-role.enum';

export class UserInfoDto {
  @ApiProperty({
    description: 'ID utilisateur',
    example: 'user-uuid-123',
  })
  id: string;

  @ApiProperty({
    description: 'Email',
    example: 'admin@ebp.com',
  })
  email: string;

  @ApiProperty({
    description: 'Nom complet',
    example: 'Jean Dupont',
  })
  fullName: string;

  @ApiProperty({
    description: 'Rôle',
    enum: UserRole,
    example: UserRole.SUPER_ADMIN,
  })
  role: UserRole;

  @ApiProperty({
    description: 'ID EBP du collègue (si applicable)',
    example: 'COL001',
    required: false,
  })
  colleagueId?: string;

  @ApiProperty({
    description: 'Permissions',
    example: ['users.read', 'users.create'],
  })
  permissions: string[];
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'Token JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Type de token',
    example: 'Bearer',
  })
  tokenType: string = 'Bearer';

  @ApiProperty({
    description: 'Durée de validité en secondes',
    example: 604800,
  })
  expiresIn: number;

  @ApiProperty({
    description: 'Informations utilisateur',
  })
  user: UserInfoDto;
}
