import { VerificationService } from "../services/verification.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Injectable, Logger } from "@nestjs/common";
import { VerificationMethod } from "@/prisma/client";
import { OtpRequestRequestDto } from "@repo/domain";
import { AppException } from "@/core/shared/exceptions/app.exception";
import { ErrorCode } from "@repo/domain";
import { RequestPayload } from "../schemas/jwt-request-payload.schema";
import { EmailOtpRequestedEvent } from "../events/email-otp-requested.event";
import { EventBusAuth } from "../events";

@Injectable()
export class OtpRequestUseCase {
  private readonly logger = new Logger(OtpRequestUseCase.name);

  constructor(
    private readonly verificationService: VerificationService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async execute(request: RequestPayload, otpRequest: OtpRequestRequestDto) {
    const { action, method } = otpRequest;

    const existingVerification =
      await this.verificationService.findVerification(
        request.user.sub,
        action,
        method
      );

    this.logger.debug(`Existing verification: ${existingVerification?.id}`);

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
        action,
        method
      );

    switch (method) {
      case VerificationMethod.EMAIL:
        {
          // if OTP is EMAIL but not part of the signed up, send a normal OTP email
          const emailOtpRequestedEvent: EmailOtpRequestedEvent = {
            email: user.email,
            name: user.name,
            otpCode: verificationCode,
          };

          this.eventEmitter.emit(
            EventBusAuth.EMAIL_OTP_REQUESTED,
            emailOtpRequestedEvent
          );
        }

        break;
      default: {
        throw new AppException(
          ErrorCode.INVALID_OTP_METHOD,
          "Invalid OTP method"
        );
      }
    }

    return true;
  }
}
