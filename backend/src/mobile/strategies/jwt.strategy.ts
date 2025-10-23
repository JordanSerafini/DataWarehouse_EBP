import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../services/auth.service';

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

  async validate(payload: any) {
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
