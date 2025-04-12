import { Injectable } from "@nestjs/common";
import { BaseRepository } from "@/core/database/repositories/base.repository";
import { PrismaService } from "@/core/database/prisma/prisma.service";
import {
  Prisma,
  Verification,
  VerificationMethod,
  VerificationAction,
  ProviderType,
} from "@/prisma/client";

@Injectable()
export class VerificationRepository extends BaseRepository<
  Verification,
  Prisma.VerificationCreateInput,
  Prisma.VerificationUpdateInput
> {
  constructor(prisma: PrismaService) {
    super(prisma, "verification");
  }

  async deleteUserVerifications(
    userId: string,
    action: VerificationAction,
    method: VerificationMethod,
    tx?: Prisma.TransactionClient // Add optional tx parameter
  ) {
    // Use the provided transaction client or the default prisma client
    const prismaClient = tx || this.prisma;
    await prismaClient.verification.deleteMany({
      where: { userId, method, action },
    });
  }

  async createVerification(
    userId: string,
    action: VerificationAction,
    method: VerificationMethod,
    value: string,
    expiresAt: Date,
    tx?: Prisma.TransactionClient // Add optional tx parameter
  ): Promise<
    Prisma.VerificationGetPayload<{
      include: {
        user: true;
      };
    }>
  > {
    // Use the provided transaction client or the default prisma client
    const prismaClient = tx || this.prisma;
    // Remove the internal transaction wrapper
    // Delete existing verifications using the determined client
    await prismaClient.verification.deleteMany({
      where: { userId, method, action },
    });

    // Create the new verification using the determined client
    const verification = await prismaClient.verification.create({
      data: {
        action,
        method,
        value,
        user: {
          connect: { id: userId },
        },
        expiresAt,
      },
      include: {
        user: true,
      },
    });

    return verification;
  }

  async findVerification(
    userId: string,
    action: VerificationAction,
    method: VerificationMethod
  ): Promise<Prisma.VerificationGetPayload<{
    include: {
      user: {
        include: {
          accounts: true;
        };
      };
    };
  }> | null> {
    const verification = await this.prisma.verification.findFirst({
      where: {
        userId,
        action,
        method,
      },
      include: {
        user: {
          include: {
            accounts: {
              where: {
                providerType: ProviderType.PASSWORD,
              },
            },
          },
        },
      },
    });

    return verification;
  }
}
