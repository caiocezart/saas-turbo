import { EnvService } from "@/env/env.service";
import { Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { JwtAccessToken, jwtAccessTokenSchema } from "@repo/domain";
import { Strategy } from "passport-jwt";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "jwt") {
  private readonly logger = new Logger(AccessTokenStrategy.name);

  constructor(private readonly envService: EnvService) {
    const publicKey = envService.get("JWT_PUBLIC_KEY");

    super({
      jwtFromRequest: (req) => {
        if (!req || !req.cookies) {
          return null;
        }
        this.logger.debug("jwtFromRequest", req.cookies.access_token);
        return req.cookies.access_token;
      },
      secretOrKey: Buffer.from(publicKey, "base64"),
      algorithms: ["RS256"],
      passReqToCallback: true,
      ignoreExpiration: false,
    });
  }

  async validate(req, payload: JwtAccessToken) {
    this.logger.debug("validate", payload);
    const parsed = jwtAccessTokenSchema.parse(payload);
    // this.logger.debug("parsed", parsed);
    return { ...parsed };
  }
}
