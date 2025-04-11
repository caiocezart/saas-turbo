import { Injectable } from "@nestjs/common";
import { BaseRepository } from "./base.repository";
import { PrismaService } from "@/database/prisma/prisma.service";
import {
  Prisma,
  Verification,
  VerificationMethod,
  VerificationAction,
  ProviderType,
} from "@prisma/client";

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
    method: VerificationMethod
  ) {
    await this.prisma.verification.deleteMany({
      where: { userId, method, action },
    });
  }

  async createVerification(
    userId: string,
    action: VerificationAction,
    method: VerificationMethod,
    value: string,
    expiresAt: Date
  ): Promise<
    Prisma.VerificationGetPayload<{
      include: {
        user: true;
      };
    }>
  > {
    return await this.prisma.$transaction(async (tx) => {
      const deleteExisting = await this.prisma.verification.deleteMany({
        where: { userId, method, action },
      });

      const verification = await this.prisma.verification.create({
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
    });
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
