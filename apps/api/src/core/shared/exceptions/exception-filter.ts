import {
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { ArgumentsHost } from "@nestjs/common";
import { AppException } from "./app.exception";
import { ApiResponse } from "@repo/domain";

@Catch(AppException)
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: AppException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const code =
      exception instanceof AppException ? exception.code : "UNEXPECTED_ERROR";

    const message =
      exception instanceof AppException
        ? exception.message
        : "An unexpected error occurred";

    // const errorId = ctx.getRequest().requestId || "";
    // const errorId = new uuidv4();

    const response: ApiResponse = {
      statusCode: status,
      headers: {},
      data: null,
      errors: [
        {
          id: "123",
          code,
          detail: message,
          source: null,
        },
      ],
    };

    res.status(status).send(response);
  }
}
