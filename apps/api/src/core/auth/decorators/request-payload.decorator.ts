import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { RequestPayload } from "../schemas/jwt-request-payload.schema";

export const Request = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RequestPayload | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return {
      user: { ...request.user },
      ip: request.ip,
      refreshToken: request.cookies.refresh_token,
    } as RequestPayload;
  }
);
