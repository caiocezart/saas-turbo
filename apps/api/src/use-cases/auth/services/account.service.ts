import { AccountRepository } from "@/database/repositories/account.repository";
import { AppException } from "@/shared/exceptions/app.exception";
import { ErrorCode } from "@repo/domain";
import { CryptoService } from "./crypto.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AccountService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly cryptoService: CryptoService
  ) {}

  async resetPassword(userId: string, accountId: string, newPassword: string) {
    const passwordHash = await this.cryptoService.hash(newPassword);

    await this.accountRepository.updatePassword(
      userId,
      accountId,
      passwordHash
    );
  }

  async changePassword(
    userId: string,
    accountId: string,
    dbPasswordHash: string,
    oldPassword: string,
    newPassword: string
  ) {
    const isPasswordCorrect = await this.cryptoService.compare(
      oldPassword,
      dbPasswordHash
    );

    if (!isPasswordCorrect) {
      throw new AppException(ErrorCode.INVALID_PASSWORD, "Invalid password");
    }

    const passwordHash = await this.cryptoService.hash(newPassword);

    await this.accountRepository.updatePassword(
      userId,
      accountId,
      passwordHash
    );
  }
}
