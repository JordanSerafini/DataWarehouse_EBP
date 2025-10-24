import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): { status: string; message: string; version: string } {
    return {
      status: 'ok',
      message: 'API EBP Mobile - Backend opérationnel',
      version: '1.0.0',
    };
  }
}
