import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common';
import { OrganizationsModule } from './organizations';
import { LocationsModule } from './locations/locations.module';
import { TechniciansModule } from './technicians/technicians.module';
import { DevicesModule } from './devices/devices.module';
import { TicketsModule } from './tickets/tickets.module';
import { Organization } from './organizations/entities/organization.entity';
import { Location } from './locations/entities/location.entity';
import { Technician } from './technicians/entities/technician.entity';
import { Device } from './devices/entities/device.entity';
import { Ticket } from './tickets/entities/ticket.entity';

/**
 * Module racine de l'application NinjaOne API
 * Structure modulaire organisée par ressource métier
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [Organization, Location, Technician, Device, Ticket],
        synchronize: false, // We'll use our SQL schema instead
        logging: true,
      }),
      inject: [ConfigService],
    }),
    CommonModule,
    OrganizationsModule,
    LocationsModule,
    TechniciansModule,
    DevicesModule,
    TicketsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
