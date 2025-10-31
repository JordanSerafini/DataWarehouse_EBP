import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from './database.service';
import { LoginDto } from '../dto/auth/login.dto';
import { AuthResponseDto, UserInfoDto } from '../dto/auth/auth-response.dto';
import { UserRole, ROLE_PERMISSIONS } from '../enums/user-role.enum';

interface User {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: UserRole;
  colleague_id: string | null;
  ninja_one_technician_id: number | null;
  is_active: boolean;
  is_verified: boolean;
  failed_login_attempts: number;
  locked_until: Date | null;
}

@Injectable()
export class AuthService {
  constructor(
    private databaseService: DatabaseService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Login utilisateur
   */
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    // 1. Récupérer l'utilisateur
    const user = await this.findUserByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // 2. Vérifier si le compte est actif
    if (!user.is_active) {
      throw new UnauthorizedException('Compte désactivé');
    }

    // 3. Vérifier si le compte est verrouillé
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      const minutesLeft = Math.ceil(
        (new Date(user.locked_until).getTime() - Date.now()) / 60000,
      );
      throw new UnauthorizedException(
        `Compte verrouillé pour ${minutesLeft} minutes`,
      );
    }

    // 4. Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password_hash,
    );

    if (!isPasswordValid) {
      await this.handleFailedLogin(user.id);
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // 5. Réinitialiser les tentatives échouées
    await this.resetFailedLoginAttempts(user.id);

    // 6. Générer le token JWT
    const jti = uuidv4();
    const token = await this.generateJwtToken(user, jti);

    // 7. Enregistrer la session
    await this.createSession(user.id, jti, loginDto.deviceId);

    // 8. Mettre à jour last_login
    await this.updateLastLogin(user.id, loginDto.deviceId);

    // 9. Retourner la réponse
    return {
      accessToken: token,
      tokenType: 'Bearer',
      expiresIn: this.getTokenExpiresIn(),
      user: this.mapUserToUserInfo(user),
    };
  }

  /**
   * Logout utilisateur
   */
  async logout(userId: string, jti: string): Promise<void> {
    await this.revokeSession(jti);
  }

  /**
   * Logout de tous les devices
   */
  async logoutAll(userId: string): Promise<void> {
    const result = await this.databaseService.query(
      'SELECT mobile.revoke_user_sessions($1) as count',
      [userId],
    );
    console.log(`✅ ${result.rows[0].count} sessions révoquées`);
  }

  /**
   * Vérifier si un token est valide
   */
  async validateToken(jti: string): Promise<boolean> {
    const result = await this.databaseService.query(
      `SELECT id FROM mobile.user_sessions
       WHERE token_jti = $1
         AND revoked_at IS NULL
         AND expires_at > NOW()`,
      [jti],
    );

    return result.rows.length > 0;
  }

  /**
   * Créer un nouvel utilisateur
   */
  async createUser(
    email: string,
    password: string,
    fullName: string,
    role: UserRole,
    colleagueId?: string,
  ): Promise<string> {
    // Vérifier si l'email existe déjà
    const existing = await this.findUserByEmail(email);
    if (existing) {
      throw new BadRequestException('Email déjà utilisé');
    }

    // Hasher le mot de passe
    const passwordHash = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const result = await this.databaseService.query(
      `SELECT mobile.create_user($1, $2, $3, $4, $5) as id`,
      [email, passwordHash, fullName, role, colleagueId],
    );

    return result.rows[0].id;
  }

  /**
   * Changer le mot de passe
   */
  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    // Récupérer l'utilisateur
    const user = await this.findUserById(userId);

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    // Vérifier l'ancien mot de passe
    const isOldPasswordValid = await bcrypt.compare(
      oldPassword,
      user.password_hash,
    );

    if (!isOldPasswordValid) {
      throw new UnauthorizedException('Ancien mot de passe incorrect');
    }

    // Hasher le nouveau mot de passe
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Mettre à jour
    await this.databaseService.query(
      `UPDATE mobile.users
       SET password_hash = $1, updated_at = NOW()
       WHERE id = $2`,
      [newPasswordHash, userId],
    );

    // Révoquer toutes les sessions sauf la courante
    // (L'utilisateur devra se reconnecter sur les autres devices)
  }

  // ============================================================
  // MÉTHODES PRIVÉES
  // ============================================================

  private async findUserByEmail(email: string): Promise<User | null> {
    const result = await this.databaseService.query<User>(
      `SELECT * FROM mobile.users WHERE email = $1`,
      [email],
    );

    return result.rows[0] || null;
  }

  private async findUserById(id: string): Promise<User | null> {
    const result = await this.databaseService.query<User>(
      `SELECT * FROM mobile.users WHERE id = $1`,
      [id],
    );

    return result.rows[0] || null;
  }

  private async handleFailedLogin(userId: string): Promise<void> {
    const result = await this.databaseService.query<User>(
      `UPDATE mobile.users
       SET failed_login_attempts = failed_login_attempts + 1,
           locked_until = CASE
             WHEN failed_login_attempts >= 4 THEN NOW() + INTERVAL '30 minutes'
             ELSE locked_until
           END
       WHERE id = $1
       RETURNING failed_login_attempts`,
      [userId],
    );

    const attempts = result.rows[0]?.failed_login_attempts || 0;
    if (attempts >= 5) {
      console.warn(`⚠️  Compte verrouillé: ${userId} (5 tentatives échouées)`);
    }
  }

  private async resetFailedLoginAttempts(userId: string): Promise<void> {
    await this.databaseService.query(
      `UPDATE mobile.users
       SET failed_login_attempts = 0, locked_until = NULL
       WHERE id = $1`,
      [userId],
    );
  }

  private async generateJwtToken(user: User, jti: string): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      colleagueId: user.colleague_id,
      jti,
    };

    return this.jwtService.sign(payload);
  }

  private getTokenExpiresIn(): number {
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || '7d';

    // Convertir en secondes
    if (expiresIn.endsWith('d')) {
      return parseInt(expiresIn) * 24 * 60 * 60;
    } else if (expiresIn.endsWith('h')) {
      return parseInt(expiresIn) * 60 * 60;
    } else if (expiresIn.endsWith('m')) {
      return parseInt(expiresIn) * 60;
    }

    return parseInt(expiresIn);
  }

  private async createSession(
    userId: string,
    jti: string,
    deviceId?: string,
  ): Promise<void> {
    const expiresIn = this.getTokenExpiresIn();
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    await this.databaseService.query(
      `INSERT INTO mobile.user_sessions (
        user_id, token_jti, device_id, expires_at
      ) VALUES ($1, $2, $3, $4)`,
      [userId, jti, deviceId, expiresAt],
    );
  }

  private async revokeSession(jti: string): Promise<void> {
    await this.databaseService.query(
      `UPDATE mobile.user_sessions
       SET revoked_at = NOW()
       WHERE token_jti = $1`,
      [jti],
    );
  }

  private async updateLastLogin(
    userId: string,
    deviceId?: string,
  ): Promise<void> {
    await this.databaseService.query(
      `UPDATE mobile.users
       SET last_login_at = NOW(),
           last_device_id = COALESCE($2, last_device_id)
       WHERE id = $1`,
      [userId, deviceId],
    );
  }

  private mapUserToUserInfo(user: User): UserInfoDto {
    return {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      colleagueId: user.colleague_id || undefined,
      ninjaOneTechnicianId: user.ninja_one_technician_id || undefined,
      permissions: this.getUserPermissions(user.role),
    };
  }

  private getUserPermissions(role: UserRole): string[] {
    const permissions = ROLE_PERMISSIONS[role] || [];

    // Super admin a tous les droits
    if (role === UserRole.SUPER_ADMIN) {
      return ['*'];
    }

    return permissions;
  }
}
