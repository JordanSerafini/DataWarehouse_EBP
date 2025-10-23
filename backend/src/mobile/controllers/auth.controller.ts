import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/auth/login.dto';
import { AuthResponseDto } from '../dto/auth/auth-response.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Login - Authentification utilisateur
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Connexion utilisateur',
    description:
      'Authentifie un utilisateur avec email/password et retourne un token JWT',
  })
  @ApiResponse({
    status: 200,
    description: 'Authentification réussie',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Email ou mot de passe incorrect',
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  /**
   * Logout - Déconnexion utilisateur
   */
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Déconnexion utilisateur',
    description: 'Révoque le token JWT courant',
  })
  @ApiResponse({
    status: 204,
    description: 'Déconnexion réussie',
  })
  async logout(@Request() req): Promise<void> {
    await this.authService.logout(req.user.sub, req.user.jti);
  }

  /**
   * Logout All - Déconnexion de tous les devices
   */
  @Post('logout-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Déconnexion de tous les devices',
    description: 'Révoque tous les tokens JWT de l\'utilisateur',
  })
  @ApiResponse({
    status: 204,
    description: 'Déconnexion réussie sur tous les devices',
  })
  async logoutAll(@Request() req): Promise<void> {
    await this.authService.logoutAll(req.user.sub);
  }

  /**
   * Me - Informations utilisateur courant
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Profil utilisateur courant',
    description: 'Retourne les informations de l\'utilisateur authentifié',
  })
  @ApiResponse({
    status: 200,
    description: 'Informations utilisateur',
  })
  async getProfile(@Request() req) {
    return {
      id: req.user.sub,
      email: req.user.email,
      role: req.user.role,
      colleagueId: req.user.colleagueId,
      permissions: req.user.permissions,
    };
  }

  /**
   * Refresh - Renouveler le token
   */
  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Renouveler le token JWT',
    description:
      'Génère un nouveau token JWT (utile pour prolonger la session)',
  })
  @ApiResponse({
    status: 200,
    description: 'Nouveau token généré',
    type: AuthResponseDto,
  })
  async refresh(@Request() req): Promise<AuthResponseDto> {
    // Révoquer l'ancien token
    await this.authService.logout(req.user.sub, req.user.jti);

    // Générer un nouveau token (simule un nouveau login)
    const loginDto: LoginDto = {
      email: req.user.email,
      password: '', // Le password n'est pas vérifié car déjà authentifié
      deviceId: req.user.deviceId,
    };

    // Note: Cette implémentation simplifiée pourrait être améliorée
    // en ayant une méthode refresh() dédiée
    return this.authService.login(loginDto);
  }
}
