import { Injectable } from "@nestjs/common";
import { BaseRepository } from "./base.repository";
import { PrismaService } from "@/database/prisma/prisma.service";
import { Prisma, RefreshToken } from "@prisma/client";
import { z } from "zod";

const saveRefreshToken = z.object({
  token: z.string(),
  expiresAt: z.date(),
  createdByIp: z.string(),
  userId: z.string(),
});

@Injectable()
export class RefreshTokenRepository extends BaseRepository<
  RefreshToken,
  Prisma.RefreshTokenCreateInput,
  Prisma.RefreshTokenUpdateInput
> {
  constructor(prisma: PrismaService) {
    super(prisma, "refreshToken");
  }

  async saveRefreshToken({
    token,
    expiresAt,
    createdByIp,
    userId,
  }: z.infer<typeof saveRefreshToken>) {
    // save new refresh token
    return await this.prisma.refreshToken.create({
      data: {
        token,
        expiresAt,
        createdByIp,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async deleteUserRefreshTokens(userId: string) {
    return this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  async deleteRefreshToken(token: string) {
    return this.prisma.refreshToken.delete({
      where: { token },
    });
  }

  async findRefreshToken(token: string) {
    const refreshToken = await this.prisma.refreshToken.findFirst({
      where: { token },
      include: {
        user: true,
      },
    });

    return refreshToken;
  }
}
