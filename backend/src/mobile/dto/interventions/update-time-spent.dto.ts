import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

/**
 * DTO pour mettre à jour le temps passé sur une intervention
 */
export class UpdateTimeSpentDto {
  @ApiProperty({
    description: 'Temps passé en secondes',
    example: 3600,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  timeSpentSeconds: number;
}
