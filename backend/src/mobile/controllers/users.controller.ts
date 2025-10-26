import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../enums/user-role.enum';
import { UsersService } from '../services/users.service';

@ApiTags('Users')
@Controller('api/v1/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * Liste publique des utilisateurs (pour login)
   */
  @Get('list')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Liste des utilisateurs (public)',
    description: 'Retourne email et nom complet de tous les utilisateurs actifs (pour login)',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des utilisateurs',
  })
  async getUsersList() {
    return this.usersService.getPublicUsersList();
  }

  /**
   * Liste complète des utilisateurs (admin only)
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Liste des utilisateurs (admin)',
    description: 'Retourne tous les utilisateurs avec détails complets',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'role', required: false, enum: UserRole })
  @ApiResponse({
    status: 200,
    description: 'Liste des utilisateurs',
  })
  async getUsers(
    @Query('page') page = 1,
    @Query('limit') limit = 50,
    @Query('search') search?: string,
    @Query('role') role?: UserRole,
  ) {
    return this.usersService.getUsers({ page, limit, search, role });
  }

  /**
   * Détails d'un utilisateur
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Détails utilisateur',
    description: 'Retourne les détails complets d\'un utilisateur',
  })
  @ApiResponse({
    status: 200,
    description: 'Détails utilisateur',
  })
  async getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  /**
   * Créer un utilisateur
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Créer un utilisateur',
    description: 'Crée un nouvel utilisateur',
  })
  @ApiResponse({
    status: 201,
    description: 'Utilisateur créé',
  })
  async createUser(@Body() createUserDto: any, @Request() req) {
    return this.usersService.createUser(createUserDto, req.user.sub);
  }

  /**
   * Mettre à jour un utilisateur
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Mettre à jour un utilisateur',
    description: 'Met à jour les informations d\'un utilisateur',
  })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur mis à jour',
  })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: any,
    @Request() req,
  ) {
    return this.usersService.updateUser(id, updateUserDto, req.user.sub);
  }

  /**
   * Supprimer un utilisateur
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Supprimer un utilisateur',
    description: 'Supprime un utilisateur (soft delete)',
  })
  @ApiResponse({
    status: 204,
    description: 'Utilisateur supprimé',
  })
  async deleteUser(@Param('id') id: string) {
    await this.usersService.deleteUser(id);
  }

  /**
   * Réinitialiser le mot de passe
   */
  @Post(':id/reset-password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Réinitialiser mot de passe',
    description: 'Réinitialise le mot de passe à "pass123"',
  })
  @ApiResponse({
    status: 200,
    description: 'Mot de passe réinitialisé',
  })
  async resetPassword(@Param('id') id: string) {
    return this.usersService.resetPassword(id);
  }

  /**
   * Synchroniser les collègues EBP
   */
  @Post('sync/colleagues')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Synchroniser collègues EBP',
    description: 'Importe les collègues depuis la table EBP',
  })
  @ApiResponse({
    status: 200,
    description: 'Synchronisation effectuée',
  })
  async syncColleagues() {
    return this.usersService.syncColleagues();
  }
}
