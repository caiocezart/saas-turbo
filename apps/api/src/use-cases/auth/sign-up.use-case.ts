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

@Injectable()
export class SignUpUseCase {
  private readonly logger = new Logger(SignUpUseCase.name);

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly cryptoService: CryptoService,
    private readonly verificationService: VerificationService,
    private readonly userRepository: UserRepository,
    private readonly accountRepository: AccountRepository,
    private readonly tokenService: TokenService
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
      const account = await this.accountRepository.createUserAccount(
        input,
        passwordHash
      );

      this.logger.debug(`User created: ${account.user.id}`);

      const { verificationCode } =
        await this.verificationService.requestVerificationCode(
          account.user.id,
          VerificationAction.SIGNUP,
          VerificationMethod.EMAIL
        );

      this.logger.debug(`Verification code requested: ${verificationCode}`);

      // generate jwt tokens
      const { accessToken, refreshToken } = await this.tokenService.signTokens(
        request.ip ?? "unknown",
        account.user.id,
        {
          sub: account.user.id,
          email: account.user.email,
          name: account.user.name,
        }
      );

      const signedUpEvent: SignedUpUserEvent = {
        email: account.user.email,
        name: account.user.name,
        verificationLink:
          await this.verificationService.getVerificationLink(verificationCode),
        verificationCode: verificationCode,
      };

      this.eventEmitter.emit(EventBusTopics.USER_SIGNED_UP, signedUpEvent);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new AppException(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "Failed to sign up"
      );
    }
  }
}
