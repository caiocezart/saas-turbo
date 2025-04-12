import { AccountRepository } from "../repositories/account.repository";
import { AppException } from "@/core/shared/exceptions/app.exception";
import { ErrorCode } from "@repo/domain";
import { CryptoService } from "./crypto.service";
import { Prisma } from "@/prisma/client";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AccountService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly cryptoService: CryptoService
  ) {}

  async resetPassword(
    userId: string,
    accountId: string,
    newPassword: string,
    tx?: Prisma.TransactionClient // Add optional tx parameter
  ) {
    const passwordHash = await this.cryptoService.hash(newPassword);

    await this.accountRepository.updatePassword(
      userId,
      accountId,
      passwordHash,
      tx // Pass tx to repository method
    );
  }

  async changePassword(
    userId: string,
    accountId: string,
    dbPasswordHash: string,
    oldPassword: string,
    newPassword: string,
    tx?: Prisma.TransactionClient // Add optional tx parameter
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
      passwordHash,
      tx // Pass tx to repository method
    );
  }
}
