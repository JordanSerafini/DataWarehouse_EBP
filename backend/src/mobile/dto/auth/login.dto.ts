import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email de connexion',
    example: 'admin@ebp.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Mot de passe',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'ID du device (pour tracking)',
    example: 'device-uuid-123',
    required: false,
  })
  @IsString()
  @IsOptional()
  deviceId?: string;
}
