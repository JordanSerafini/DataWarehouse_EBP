import { Module, Global } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { NinjaOneAuthService } from './services/ninjaone-auth.service';

/**
 * Module commun global contenant les services partagés
 * @Global permet à ce module d'être disponible dans toute l'application
 * sans avoir à l'importer dans chaque module
 */
@Global()
@Module({
  imports: [HttpModule, ConfigModule],
  providers: [NinjaOneAuthService],
  exports: [NinjaOneAuthService, HttpModule],
})
export class CommonModule {}
