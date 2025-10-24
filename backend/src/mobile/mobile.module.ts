import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// Config
import databaseConfig from '../config/database.config';

// Services
import { DatabaseService } from './services/database.service';
import { AuthService } from './services/auth.service';
import { InterventionsService } from './services/interventions.service';
import { FileService } from './services/file.service';

// Controllers
import { AuthController } from './controllers/auth.controller';
import { InterventionsController } from './controllers/interventions.controller';

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
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '7d',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, InterventionsController],
  providers: [
    DatabaseService,
    AuthService,
    InterventionsService,
    FileService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [DatabaseService, AuthService, JwtAuthGuard, RolesGuard],
})
export class MobileModule {}
