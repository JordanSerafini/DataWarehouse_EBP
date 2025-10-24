import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// Config
import databaseConfig from '../config/database.config';

// Services
import { DatabaseService } from './services/database.service';
import { AuthService } from './services/auth.service';
import { InterventionsService } from './services/interventions.service';
import { FileService } from './services/file.service';
import { CustomersService } from './services/customers.service';
import { SyncService } from './services/sync.service';
import { SalesService } from './services/sales.service';
import { ProjectsService } from './services/projects.service';

// Controllers
import { AuthController } from './controllers/auth.controller';
import { InterventionsController } from './controllers/interventions.controller';
import { CustomersController } from './controllers/customers.controller';
import { SyncController } from './controllers/sync.controller';
import { SalesController } from './controllers/sales.controller';
import { ProjectsController } from './controllers/projects.controller';

// Strategies
import { JwtStrategy } from './strategies/jwt.strategy';

// Guards
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService): Promise<JwtModuleOptions> => ({
        secret: configService.get<string>('JWT_SECRET') || 'default-secret-change-in-production',
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '7d',
        },
      } as JwtModuleOptions),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    AuthController,
    InterventionsController,
    CustomersController,
    SyncController,
    SalesController,
    ProjectsController,
  ],
  providers: [
    DatabaseService,
    AuthService,
    InterventionsService,
    FileService,
    CustomersService,
    SyncService,
    SalesService,
    ProjectsService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [DatabaseService, AuthService, JwtAuthGuard, RolesGuard],
})
export class MobileModule {}
