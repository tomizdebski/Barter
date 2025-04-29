import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies?.token,
        ExtractJwt.fromAuthHeaderAsBearerToken(), // <-- DODANE!
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    if (!payload?.id) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return {
      id: Number(payload.id),
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      avatar: payload.avatar,
    };
  }
}

