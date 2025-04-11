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
import { PrismaService } from "@/database/prisma/prisma.service"; // Inject PrismaService
import { VerificationRepository } from "@/database/repositories/verification.repository"; // Inject VerificationRepository

@Injectable()
export class ForgotPasswordUseCase {
  constructor(
    private readonly verificationService: VerificationService,
    private readonly accountService: AccountService,
    private readonly eventEmitter: EventEmitter2,
    private readonly prisma: PrismaService, // Add PrismaService to constructor
    private readonly verificationRepository: VerificationRepository // Add VerificationRepository
  ) {}

  async execute(request: RequestPayload, forgotPassword: ForgotPassword) {
    const { otp, newPassword } = forgotPassword;

    const verification = await this.verificationService.findVerification(
      request.user.sub,
      VerificationAction.FORGOT_PASSWORD,
      VerificationMethod.EMAIL
    );

    if (!verification) {
      throw new AppException(
        ErrorCode.VERIFICATION_CODE_INVALID,
        "Invalid verification code or user data missing"
      );
    }

    // Find the specific password account after confirming verification exists
    const passwordAccount = verification.user.accounts.find(
      (account) => account.providerType === ProviderType.PASSWORD
    );

    if (!passwordAccount) {
      // Throw a specific error if the user associated with the verification
      // doesn't have a password-based account to reset.
      throw new AppException(
        ErrorCode.ACCOUNT_NOT_FOUND, // Or a more specific error code if available
        "User does not have a password account."
      );
    } // Add missing closing brace for the if statement

    // Assert verification is not null here, as the check above guarantees it.
    await this.verificationService.verify(verification!, otp);

    try {
      // --- Start Transaction ---
      await this.prisma.$transaction(async (tx) => {
        // Call account service to reset password, passing tx
        // Assert verification and passwordAccount are not null/undefined here.
        await this.accountService.resetPassword(
          verification!.userId,
          passwordAccount!.id, // Use the found password account ID
          newPassword,
          tx // Pass transaction client
        );

        // Delete the used verification code within the same transaction
        // Assert verification is not null here.
        await this.verificationRepository.deleteUserVerifications(
          verification!.userId,
          verification!.action,
          verification!.method,
          tx // Pass transaction client
        );
      });
      // --- End Transaction ---

      // Emit event *after* transaction commits successfully
      // Assert verification is not null here.
      const passwordUpdatedEvent: PasswordUpdatedEvent = {
        name: verification!.user.name,
        email: verification!.user.email,
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
  } // End execute method
} // End class
