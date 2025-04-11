import { Injectable } from "@nestjs/common";
import { BaseRepository } from "./base.repository";
import { PrismaService } from "@/database/prisma/prisma.service";
import { MembershipInvite, Prisma, Role } from "@prisma/client";
import { MembershipInviteUpdate } from "@repo/domain";

@Injectable()
export class MembershipInviteRepository extends BaseRepository<
  MembershipInvite,
  Prisma.MembershipInviteCreateInput,
  Prisma.MembershipInviteUpdateInput
> {
  constructor(prisma: PrismaService) {
    super(prisma, "membership");
  }

  async getMembershipInviteByMemberId(
    organizationId: string,
    memberId: string
  ) {
    return this.prisma.membershipInvite.findFirst({
      where: { organizationId, memberId },
    });
  }

  async createInvite(
    organizationId: string,
    inviterId: string,
    memberId: string,
    role: Role
  ) {
    return this.prisma.membershipInvite.create({
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
    });
  }

  async deleteInvite(organizationId: string, inviteId: string) {
    return this.prisma.membershipInvite.delete({
      where: {
        organizationId,
        id: inviteId,
      },
    });
  }

  async updateInvite(
    organizationId: string,
    inviteId: string,
    invite: MembershipInviteUpdate
  ) {
    return this.prisma.membershipInvite.update({
      where: {
        organizationId,
        id: inviteId,
      },
      data: {
        ...invite,
      },
    });
  }

  async acceptInvite(
    organizationId: string,
    inviteId: string,
    invite: MembershipInvite
  ) {
    return this.prisma.membershipInvite.update({
      where: {
        organizationId,
        id: inviteId,
      },
      data: {
        ...invite,
      },
    });
  }
}
