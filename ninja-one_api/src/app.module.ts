import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NinjaOneModule } from './ninja-one/ninja-one.module';
import { Organization } from './ninja-one/entities/organization.entity';
import { Technician } from './ninja-one/entities/technician.entity';
import { Device } from './ninja-one/entities/device.entity';
import { Ticket } from './ninja-one/entities/ticket.entity';

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
        entities: [Organization, Technician, Device, Ticket],
        synchronize: false, // We'll use our SQL schema instead
        logging: true,
      }),
      inject: [ConfigService],
    }),
    NinjaOneModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
