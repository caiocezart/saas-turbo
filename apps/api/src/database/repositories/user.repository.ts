import { Injectable } from "@nestjs/common";
import { BaseRepository } from "./base.repository";
import { PrismaService } from "@/database/prisma/prisma.service";
import {
  Prisma,
  User,
  VerificationAction,
  VerificationMethod,
} from "@prisma/client";

@Injectable()
export class UserRepository extends BaseRepository<
  User,
  Prisma.UserCreateInput,
  Prisma.UserUpdateInput
> {
  constructor(prisma: PrismaService) {
    super(prisma, "user");
  }

  async verifyEmail(userId: string) {
    const deleteUserVerifications = this.prisma.verification.deleteMany({
      where: {
        userId,
        action: VerificationAction.SIGNUP,
        method: VerificationMethod.EMAIL,
      },
    });
    const updateUser = this.prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true },
    });

    await Promise.all([updateUser, deleteUserVerifications]);

    return true;
  }

  async findByIdWithAccountPassword(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: {
          where: {
            provider: {
              name: "password",
            },
          },
        },
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findAll() {
    return await this.prisma.user.findMany({
      include: {
        refreshTokens: true,
        accounts: {
          include: {
            provider: true,
          },
        },
        verifications: true,
      },
    });
  }
}
