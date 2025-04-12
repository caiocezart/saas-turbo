import { UserRepository } from "../repositories/user.repository";
import { Injectable, Logger } from "@nestjs/common";
import { VerificationService } from "../services/verification.service";
import { AppException } from "@/core/shared/exceptions/app.exception";
import { ErrorCode } from "@repo/domain";
import { RequestPayload } from "../schemas/jwt-request-payload.schema";
import { VerifyUserEmailRequestDto } from "@repo/domain";
import { VerificationAction, VerificationMethod } from "@/prisma/client";
@Injectable()
export class VerifyEmailUserUseCase {
  private readonly logger = new Logger(VerifyEmailUserUseCase.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly verificationService: VerificationService
  ) {}

  async execute(request: RequestPayload, input: VerifyUserEmailRequestDto) {
    const { userId, token } = input;

    this.logger.debug("verifyEmail", input);

    const verification = await this.verificationService.findVerification(
      userId,
      VerificationAction.SIGNUP,
      VerificationMethod.EMAIL
    );

    this.logger.debug("verification", verification);

    if (!verification) {
      throw new AppException(
        ErrorCode.VERIFICATION_CODE_INVALID,
        "Verification code not found"
      );
    }

    if (verification.user.emailVerified) {
      throw new AppException(
        ErrorCode.EMAIL_ALREADY_VERIFIED,
        "Email already verified"
      );
    }

    const isValidToken = await this.verificationService.verify(
      verification,
      token
    );
    if (!isValidToken) {
      throw new AppException(
        ErrorCode.VERIFICATION_CODE_INVALID,
        "Invalid verification code"
      );
    }

    try {
      await this.userRepository.verifyEmail(userId);
    } catch (error) {
      throw new AppException(
        ErrorCode.VERIFICATION_FAILED,
        "Failed to verify email"
      );
    }
  }
}
