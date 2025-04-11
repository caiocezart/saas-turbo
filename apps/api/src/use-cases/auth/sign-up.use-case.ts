import { AccountRepository } from "@/database/repositories/account.repository";
import { UserRepository } from "@/database/repositories/user.repository";
import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { CryptoService } from "./services/crypto.service";
import { AppException } from "@/shared/exceptions/app.exception";
import {
  ErrorCode,
  EventBusTopics,
  SignUpUser,
  RequestPayload,
} from "@repo/domain";
import { SignedUpUserEvent } from "@repo/domain";
import { VerificationService } from "./services/verification.service";
import { VerificationMethod, VerificationAction } from "@prisma/client";
import { TokenService } from "./services/token.service";
import { Logger } from "@nestjs/common";
import { PrismaService } from "@/database/prisma/prisma.service";

@Injectable()
export class SignUpUseCase {
  private readonly logger = new Logger(SignUpUseCase.name);

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly cryptoService: CryptoService,
    private readonly verificationService: VerificationService,
    private readonly userRepository: UserRepository,
    private readonly accountRepository: AccountRepository,
    private readonly tokenService: TokenService,
    private readonly prisma: PrismaService // Inject PrismaService
  ) {}

  async execute(request: RequestPayload, input: SignUpUser) {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      throw new AppException(
        ErrorCode.EMAIL_ALREADY_EXISTS,
        "Email already registered"
      );
    }

    try {
      const passwordHash = await this.cryptoService.hash(input.password);

      // --- Start Transaction ---
      const { account, verificationCode, accessToken, refreshToken } =
        await this.prisma.$transaction(async (tx) => {
          const createdAccount = await this.accountRepository.createUserAccount(
            input,
            passwordHash,
            tx // Pass transaction client
          );

          this.logger.debug(
            `User created within transaction: ${createdAccount.user.id}`
          );

          const { verificationCode: code } =
            await this.verificationService.requestVerificationCode(
              createdAccount.user.id,
              VerificationAction.SIGNUP,
              VerificationMethod.EMAIL,
              tx // Pass transaction client
            );

          this.logger.debug(
            `Verification code requested within transaction: ${code}`
          );

          // generate jwt tokens (assuming signTokens might save refresh token)
          const tokens = await this.tokenService.signTokens(
            request.ip ?? "unknown",
            createdAccount.user.id,
            {
              sub: createdAccount.user.id,
              email: createdAccount.user.email,
              name: createdAccount.user.name,
            },
            tx // Pass transaction client
          );

          return {
            account: createdAccount,
            verificationCode: code,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          };
        });
      // --- End Transaction ---

      // Emit event *after* transaction commits successfully

      const signedUpEvent: SignedUpUserEvent = {
        email: account.user.email,
        name: account.user.name,
        verificationLink:
          await this.verificationService.getVerificationLink(verificationCode),
        verificationCode: verificationCode,
      };

      this.eventEmitter.emit(EventBusTopics.USER_SIGNED_UP, signedUpEvent);
      this.logger.log(
        `User sign up successful, event emitted: ${account.user.id}`
      );

      return { accessToken, refreshToken };
    } catch (error) {
      throw new AppException(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "Failed to sign up"
      );
    }
  }
}
