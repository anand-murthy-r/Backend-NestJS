import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt2") {
  constructor(config: ConfigService) {
    const jwt_secret = config.get("JWT_SECRET");
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwt_secret
    });
  }

  async validate(payload: any) {
    console.log({
        payload: payload
    });
    return { userId: payload.sub, username: payload.username };
  }
}