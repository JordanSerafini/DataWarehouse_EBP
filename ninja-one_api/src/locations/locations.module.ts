import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { LocationsController } from './controllers/locations.controller';
import { LocationsSyncService } from './services/locations-sync.service';
import { OrganizationsModule } from '../organizations';

/**
 * Module Locations
 * Gère toutes les fonctionnalités liées aux locations (sites) des organisations
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Location, Organization]),
    OrganizationsModule,
  ],
  controllers: [LocationsController],
  providers: [LocationsSyncService],
  exports: [LocationsSyncService],
})
export class LocationsModule {}
