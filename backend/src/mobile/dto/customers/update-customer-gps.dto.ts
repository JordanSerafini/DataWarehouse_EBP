import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

/**
 * DTO pour mettre à jour les coordonnées GPS d'un client
 */
export class UpdateCustomerGpsDto {
  @ApiProperty({
    description: 'Latitude GPS',
    example: 48.8566,
    required: true,
  })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({
    description: 'Longitude GPS',
    example: 2.3522,
    required: true,
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @ApiProperty({
    description: 'Source de la position GPS (manual, mobile, ebp)',
    example: 'mobile',
    default: 'manual',
    required: false,
  })
  @IsString()
  @IsOptional()
  provider?: string;

  @ApiProperty({
    description: 'Qualité de la position GPS (0-1)',
    example: 0.95,
    default: 1.0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(1)
  quality?: number;
}
