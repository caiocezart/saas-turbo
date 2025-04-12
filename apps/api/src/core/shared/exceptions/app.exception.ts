import { HttpException } from "@nestjs/common";
import { ErrorCode } from "@repo/domain";

export class AppException extends HttpException {
  constructor(
    readonly code: ErrorCode,
    readonly detail?: string,
    status = 400
  ) {
    super({ code, message: detail }, status);
  }
}
