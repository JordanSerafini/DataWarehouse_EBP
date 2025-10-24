import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Organization } from './entities/organization.entity';
import { OrganizationsController } from './controllers/organizations.controller';
import { OrganizationsService } from './services/organizations.service';
import { OrganizationsSyncService } from './services/organizations-sync.service';

/**
 * Module Organizations
 * Gère toutes les fonctionnalités liées aux organisations NinjaOne
 */
@Module({
  imports: [TypeOrmModule.forFeature([Organization]), HttpModule],
  controllers: [OrganizationsController],
  providers: [OrganizationsService, OrganizationsSyncService],
  exports: [OrganizationsService, OrganizationsSyncService],
})
export class OrganizationsModule {}
