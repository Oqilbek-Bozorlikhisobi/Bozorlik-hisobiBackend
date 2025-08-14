// src/common/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_KEY,
    });

  }

  async validate(payload: any) {


    if (!payload) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // Sizning payload-ingizda quyidagi ma'lumotlar bo'lishi kerak
    return {
      id: payload.id,
      phone: payload.phone,
      role: payload.role,
    };
  }
}
