import { EventBusTopics } from "@repo/domain";
import { VerificationService } from "./services/verification.service";
import { Injectable } from "@nestjs/common";
import {
  VerificationAction,
  VerificationMethod,
  ProviderType,
} from "@prisma/client";
import { ForgotPassword, RequestPayload } from "@repo/domain";
import { AppException } from "@/shared/exceptions/app.exception";
import { ErrorCode } from "@repo/domain";
import { AccountService } from "./services/account.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PasswordUpdatedEvent } from "@repo/domain";

@Injectable()
export class ForgotPasswordUseCase {
  constructor(
    private readonly verificationService: VerificationService,
    private readonly accountService: AccountService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async execute(request: RequestPayload, forgotPassword: ForgotPassword) {
    const { otp, newPassword } = forgotPassword;

    const verification = await this.verificationService.findVerification(
      request.user.sub,
      VerificationAction.FORGOT_PASSWORD,
      VerificationMethod.EMAIL
    );

    if (
      !verification ||
      !verification.user.accounts.find(
        (account) => account.providerType === ProviderType.PASSWORD
      )
    ) {
      throw new AppException(
        ErrorCode.VERIFICATION_CODE_INVALID,
        "Invalid verification code"
      );
    }

    await this.verificationService.verify(verification, otp);

    try {
      await this.accountService.resetPassword(
        verification.user.id,
        verification.user.accounts[0].id,
        newPassword
      );

      const passwordUpdatedEvent: PasswordUpdatedEvent = {
        name: verification.user.name,
        email: verification.user.email,
      };

      this.eventEmitter.emit(
        EventBusTopics.PASSWORD_UPDATED,
        passwordUpdatedEvent
      );
    } catch (error) {
      throw new AppException(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "Failed to update password"
      );
    }
  }
}
