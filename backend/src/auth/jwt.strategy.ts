import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { envs } from 'src/config/envs.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => req.cookies['usercookie']]),
      ignoreExpiration: false,
      secretOrKey: envs.jwt_secret,
    })
  };

  async validate(payload: any) {
    return { userId: payload.sub, dni: payload.dni };
  };
};
