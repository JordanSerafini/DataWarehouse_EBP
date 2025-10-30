import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../enums/user-role.enum';

/**
 * Interface pour le payload JWT
 */
interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  colleagueId: string | null;
  jti: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    // Vérifier que le token n'est pas révoqué
    const isValid = await this.authService.validateToken(payload.jti);

    if (!isValid) {
      throw new UnauthorizedException('Token révoqué ou expiré');
    }

    // Retourner le payload (sera attaché à req.user)
    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
      colleagueId: payload.colleagueId,
      jti: payload.jti,
    };
  }
}
