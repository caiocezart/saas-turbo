import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { ErrorCode } from "@repo/domain";
import { AppException } from "@/core/shared/exceptions/app.exception";
import { Logger } from "@nestjs/common";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (info instanceof Error || err || !user) {
      this.logger.error("JwtAuthGuard error: invalid access token");
      throw new AppException(ErrorCode.UNAUTHORIZED, "Invalid access token.");
    }

    this.logger.debug(`JwtAuthGuard user: ${user}`);
    return user;
  }
}
