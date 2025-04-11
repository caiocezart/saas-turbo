import { Injectable } from "@nestjs/common";
import { AppException } from "@/shared/exceptions/app.exception";
import { ErrorCode, SignInUser, RequestPayload } from "@repo/domain";
import { AccountRepository } from "@/database/repositories/account.repository";
import { TokenService } from "./services/token.service";
import { CryptoService } from "./services/crypto.service";

@Injectable()
export class SignInUseCase {
  constructor(
    private readonly cryptoService: CryptoService,
    private readonly accountRepository: AccountRepository,
    private readonly tokenService: TokenService
  ) {}

  async execute(request: RequestPayload, input: SignInUser) {
    const { email, password, providerType } = input;

    // lookup account by email and provider id
    const account =
      await this.accountRepository.findAccountByUserEmailAndProvider(
        email,
        providerType
      );

    if (!account || !account.passwordHash) {
      throw new AppException(ErrorCode.USER_NOT_FOUND, "User not found");
    }

    // logic by provider types
    switch (account.provider.name) {
      case "password": {
        // check if password is correct
        if (
          !(await this.cryptoService.compare(password, account.passwordHash))
        ) {
          throw new AppException(
            ErrorCode.INVALID_PASSWORD,
            "Invalid password"
          );
        }

        break;
      }
      default:
        throw new AppException(ErrorCode.INVALID_PROVIDER, "Invalid provider");
    }

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

    // auth complete
    return {
      accessToken,
      refreshToken,
    };
  }
}
