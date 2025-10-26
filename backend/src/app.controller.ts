import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Health check',
    description: "Vérifie que l'API est en ligne",
  })
  @ApiResponse({
    status: 200,
    description: 'API opérationnelle',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        message: {
          type: 'string',
          example: 'API EBP Mobile - Backend opérationnel',
        },
        version: { type: 'string', example: '1.0.0' },
      },
    },
  })
  getHealth(): { status: string; message: string; version: string } {
    return this.appService.getHealth();
  }

  @Get('ping')
  @ApiOperation({
    summary: 'Ping',
    description: 'Endpoint simple pour vérifier la connectivité',
  })
  @ApiResponse({
    status: 200,
    description: 'Pong',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'pong' },
      },
    },
  })
  ping(): { message: string } {
    return { message: 'pong' };
  }
}
