import { Injectable } from "@nestjs/common";
import { BaseRepository } from "./base.repository";
import { PrismaService } from "@/database/prisma/prisma.service";
import { Membership, Prisma, Role } from "@prisma/client";
import { MembershipUpdate } from "@repo/domain";

@Injectable()
export class MembershipRepository extends BaseRepository<
  Membership,
  Prisma.MembershipCreateInput,
  Prisma.MembershipUpdateInput
> {
  constructor(prisma: PrismaService) {
    super(prisma, "membership");
  }

  async createMembership(organizationId: string, userId: string, role: Role) {
    return this.prisma.membership.create({
      data: {
        organization: {
          connect: {
            id: organizationId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
        role,
      },
    });
  }

  async deleteMembership(organizationId: string, membershipId: string) {
    return this.prisma.membership.delete({
      where: {
        organizationId,
        id: membershipId,
      },
    });
  }

  async updateMembership(organizationId: string, membership: MembershipUpdate) {
    return this.prisma.membership.update({
      where: {
        organizationId: organizationId,
        id: membership.id,
      },
      data: {
        ...membership,
      },
    });
  }
}
