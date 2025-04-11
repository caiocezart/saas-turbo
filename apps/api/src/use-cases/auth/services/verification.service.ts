import { Injectable } from "@nestjs/common";
import { CryptoService } from "./crypto.service";
import { ErrorCode } from "@repo/domain";
import { AppException } from "@/shared/exceptions/app.exception";
import { VerificationRepository } from "@/database/repositories/verification.repository";
import { VerificationMethod, VerificationAction, Prisma } from "@prisma/client";
import { Verification } from "@prisma/client";
import { ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);

  constructor(
    private readonly cryptoService: CryptoService,
    private readonly verificationRepository: VerificationRepository,
    private readonly configService: ConfigService
  ) {}

  async findVerification(
    userId: string,
    action: VerificationAction,
    method: VerificationMethod
  ) {
    return this.verificationRepository.findVerification(userId, action, method);
  }

  async verify(verification: Verification, token: string) {
    if (verification.value !== token || verification.expiresAt < new Date()) {
      return false;
    }
    return true;
  }

  async rateLimitCheck(verification: Verification) {
    const verificationCodeWaitTime = this.configService.get(
      "VERIFICATION_CODE_WAIT_TIME"
    );
    const olderThanWaitTime = new Date(Date.now() - verificationCodeWaitTime);

    if (verification.createdAt < olderThanWaitTime) {
      return true;
    }
    return false;
  }

  async requestVerificationCode(
    userId: string,
    action: VerificationAction,
    method: VerificationMethod,
    tx?: Prisma.TransactionClient // Add optional tx parameter
  ) {
    let verificationCode: { value: string; expiresAt: Date };

    if (action === VerificationAction.SIGNUP) {
      verificationCode =
        await this.cryptoService.generateEmailVerificationCode();
    } else {
      verificationCode = await this.cryptoService.generateOtpCode();
    }

    this.logger.debug(
      `User ${userId} with action ${action} and method ${method}. Verification code: ${verificationCode.value}`
    );

    try {
      const verification = await this.verificationRepository.createVerification(
        userId,
        action,
        method,
        verificationCode.value,
        verificationCode.expiresAt,
        tx // Pass tx to repository method
      );

      this.logger.debug(`Verification created ${verification}`);

      return { verificationCode: verification.value, user: verification.user };
    } catch (error) {
      this.logger.error(
        `Failed to generate verification code for user ${userId} with action ${action} and method ${method}.`,
        error
      );

      throw new AppException(
        ErrorCode.VERIFICATION_CODE_CREATION_FAILED,
        "Failed to generate verification code"
      );
    }
  }

  async deleteVerificationCode(
    userId: string,
    action: VerificationAction,
    method: VerificationMethod
  ) {
    await this.verificationRepository.deleteUserVerifications(
      userId,
      action,
      method
    );
  }

  async getVerificationLink(verificationCode: string) {
    const frontEndUrl = this.configService.get("FRONTEND_URL");
    return `${frontEndUrl}/verify-email?code=${verificationCode}`;
  }
}
