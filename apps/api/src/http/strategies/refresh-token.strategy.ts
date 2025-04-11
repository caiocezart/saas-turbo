import { EnvService } from "@/env/env.service";
import { Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { jwtRefreshTokenSchema, JwtRefreshTokenPayload } from "@repo/domain";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh"
) {
  private readonly logger = new Logger(RefreshTokenStrategy.name);

  constructor(private readonly envService: EnvService) {
    const publicKey = envService.get("JWT_PUBLIC_KEY");

    super({
      jwtFromRequest: (req) => {
        if (!req || !req.cookies) {
          return null;
        }

        this.logger.debug("jwtFromRequest", req.cookies.refresh_token);

        return req.cookies.refresh_token;
      },
      secretOrKey: Buffer.from(publicKey, "base64"),
      algorithms: ["RS256"],
      passReqToCallback: true,
      ignoreExpiration: false,
    });
  }

  async validate(req, payload: JwtRefreshTokenPayload) {
    this.logger.debug("validate", payload);
    const parsed = jwtRefreshTokenSchema.parse(payload);
    return { ...parsed };
  }
}
