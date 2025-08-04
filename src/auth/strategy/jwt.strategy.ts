import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt2") {
  constructor(config: ConfigService, private prisma: PrismaService) {
    const jwt_secret = config.get("JWT_SECRET");
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwt_secret
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
        where: {
            id: payload.sub
        }
    });
    if (!user) throw new ForbiddenException("User not found");
    const { hash, ...theRest } = user;
    return theRest;
  }
}