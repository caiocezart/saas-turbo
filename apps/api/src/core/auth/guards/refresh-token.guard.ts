import { Injectable, ExecutionContext, Logger } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ErrorCode } from "@repo/domain";
import { AppException } from "@/core/shared/exceptions/app.exception";
import { JwtService } from "@nestjs/jwt";
@Injectable()
// This guard specifically uses the 'jwt-refresh' strategy
export class RefreshTokenGuard extends AuthGuard("jwt-refresh") {
  private readonly logger = new Logger(RefreshTokenGuard.name);
  constructor(private readonly jwtService: JwtService) {
    super();
  }
  // Optional: Override canActivate if you need logic before the strategy runs
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies?.refresh_token;
    const valid = this.jwtService.verify(refreshToken);
    if (valid) {
      this.logger.debug("valid");
    } else {
      this.logger.debug("invalid refresh token");
    }
    // Custom logic here
    return super.canActivate(context);
  }

  // handleRequest is called after the strategy's validate method runs
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    this.logger.debug("user", user);

    if (info instanceof Error || err || !user) {
      this.logger.error("JwtAuthGuard error: invalid access token");
      throw new AppException(
        ErrorCode.REFRESH_TOKEN_INVALID,
        "Invalid refresh token."
      );
    }

    return user;
  }
}
