import { Injectable } from "@nestjs/common";
import { BaseRepository } from "@/core/database/repositories/base.repository";
import { PrismaService } from "@/core/database/prisma/prisma.service";
import { MembershipInvite, Prisma, Role } from "@/prisma/client";

@Injectable()
export class MembershipInviteRepository extends BaseRepository<
  MembershipInvite,
  Prisma.MembershipInviteCreateInput,
  Prisma.MembershipInviteUpdateInput
> {
  constructor(prisma: PrismaService) {
    super(prisma, "membershipInvite");
  }

  async createInvite(
    organizationId: string,
    inviterId: string,
    memberId: string,
    role: Role
  ) {
    return await this.prisma.membershipInvite.create({
      data: {
        organization: {
          connect: {
            id: organizationId,
          },
        },
        inviter: {
          connect: {
            id: inviterId,
          },
        },
        member: {
          connect: {
            id: memberId,
          },
        },
        role,
      },
      include: {
        organization: true,
        inviter: true,
        member: true,
      },
    });
  }

  async updateInvite(
    id: string,
    data: Prisma.MembershipInviteUpdateInput,
    tx?: Prisma.TransactionClient
  ) {
    return await (tx || this.prisma).membershipInvite.update({
      where: { id },
      data,
      include: {
        organization: true,
        inviter: true,
        member: true,
      },
    });
  }
}
