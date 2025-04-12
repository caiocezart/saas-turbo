import { VerificationService } from "../services/verification.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Injectable } from "@nestjs/common";
import { VerificationMethod, VerificationAction } from "@/prisma/client";
import { AppException } from "@/core/shared/exceptions/app.exception";
import { Logger } from "@nestjs/common";
import { RequestPayload } from "../schemas/jwt-request-payload.schema";
import { EventBusAuth } from "../events";
import { VerifyEmailEvent } from "../events/verify-email.event";
import { ErrorCode } from "@repo/domain";

@Injectable()
export class NewEmailVerificationUseCase {
  private readonly logger = new Logger(NewEmailVerificationUseCase.name);
  constructor(
    private readonly verificationService: VerificationService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async execute(request: RequestPayload) {
    this.logger.debug("execute", request);
    const existingVerification =
      await this.verificationService.findVerification(
        request.user.sub,
        VerificationAction.SIGNUP,
        VerificationMethod.EMAIL
      );

    this.logger.debug("existingVerification", existingVerification);

    if (
      existingVerification &&
      (await this.verificationService.rateLimitCheck(existingVerification))
    ) {
      throw new AppException(
        ErrorCode.VERIFICATION_CODE_RATE_LIMIT,
        "Wait a few seconds before requesting a new verification code"
      );
    }

    const { verificationCode, user } =
      await this.verificationService.requestVerificationCode(
        request.user.sub,
        VerificationAction.SIGNUP,
        VerificationMethod.EMAIL
      );

    this.logger.debug("requestVerificationCode", {
      verificationCode,
      user,
    });

    const emailVerificationEvent: VerifyEmailEvent = {
      email: user.email,
      name: user.name,
      verificationLink:
        await this.verificationService.getVerificationLink(verificationCode),
      verificationCode: verificationCode,
    };

    this.eventEmitter.emit(EventBusAuth.VERIFY_EMAIL, emailVerificationEvent);

    return true;
  }
}
