import { Injectable } from "@nestjs/common";
import { BaseRepository } from "./base.repository";
import { PrismaService } from "@/database/prisma/prisma.service";
import { Prisma, Account, ProviderType } from "@prisma/client";
import { SignUpUser } from "@repo/domain";

@Injectable()
export class AccountRepository extends BaseRepository<
  Account,
  Prisma.AccountCreateInput,
  Prisma.AccountUpdateInput
> {
  constructor(prisma: PrismaService) {
    super(prisma, "account");
  }

  async createUserAccount(
    input: SignUpUser,
    passwordHash: string,
    tx?: Prisma.TransactionClient
  ) {
    // Use the provided transaction client or the default prisma client
    const prismaClient = tx || this.prisma;
    const user = await prismaClient.user.create({
      data: {
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        name: `${input.firstName} ${input.lastName}`,
      },
    });

    const provider = await prismaClient.provider.findUniqueOrThrow({
      where: {
        type: input.providerType,
      },
    });

    const account = await prismaClient.account.create({
      data: {
        userId: user.id,
        providerType: input.providerType,
        providerId: provider.id,
        passwordHash,
        providerAccountId: user.id,
      },
      include: {
        user: true,
      },
    });

    return account;
  }

  async findAccountByUserEmailAndProvider(
    email: string,
    providerType: ProviderType
  ) {
    const accountWithRelations = await this.prisma.account.findFirst({
      where: {
        user: {
          email,
        },
        provider: {
          type: providerType,
        },
      },
      select: {
        id: true,
        passwordHash: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        provider: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return accountWithRelations;
  }

  async findPasswordByUserId(userId: string) {
    const password = await this.prisma.account.findFirst({
      where: {
        userId,
        provider: {
          name: "password",
        },
      },
      select: {
        passwordHash: true,
      },
    });

    return password;
  }

  async updatePassword(
    userId: string,
    accountId: string,
    passwordHash: string,
    tx?: Prisma.TransactionClient // Add optional tx parameter
  ) {
    // Use the provided transaction client or the default prisma client
    const prismaClient = tx || this.prisma;

    // Perform only the password update using the determined client
    // Verification deletion will be handled in the use case transaction
    return await prismaClient.account.update({
      where: { id: accountId },
      data: { passwordHash },
    });
  }
}
