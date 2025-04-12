import { Injectable } from "@nestjs/common";
import { MembershipInviteRepository } from "../../../database/repositories/membership-invite.repository";
import { MembershipRepository } from "../../../database/repositories/membership.repository";
import { MembershipInvite } from "@repo/domain";
import { PrismaRoles } from "@repo/domain";
import { PrismaService } from "@/database/prisma/prisma.service";
import { EnvService } from "@/env/env.service";

@Injectable()
export class MembershipInviteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly membershipInviteRepository: MembershipInviteRepository,
    private readonly membershipRepository: MembershipRepository,
    private readonly envConfigService: EnvService
  ) {}

  async createMembershipInvite(
    userId: string,
    organizationId: string,
    params: any
  ) {
    const membership = await this.membershipRepository.findFirst({
      where: {
        userId,
        organizationId,
        role: {
          in: [PrismaRoles.ORGANIZATION_ADMIN, PrismaRoles.ORGANIZATION_OWNER],
        },
      },
    });

    if (!membership) {
      throw new Error(
        "Unauthorized: User does not have permission to create invites for this organization"
      );
    }

    return await this.membershipInviteRepository.createInvite(
      organizationId,
      userId,
      params.email,
      params.role
    );
  }

  async getMembershipInviteById(id: string): Promise<MembershipInvite | null> {
    return this.membershipInviteRepository.findById(
      id
    ) as unknown as MembershipInvite;
  }

  async getMembershipInviteByToken(
    token: string
  ): Promise<MembershipInvite | null> {
    return this.membershipInviteRepository.findFirst({
      where: { token },
    }) as unknown as MembershipInvite;
  }

  async listMembershipInvites(
    organizationId: string,
    params: any
  ): Promise<MembershipInvite[]> {
    const { status } = params;

    const where: any = { organizationId };

    if (status) {
      if (status === "active") {
        where.expiresAt = { gt: new Date() };
        where.acceptedAt = null;
      } else if (status === "expired") {
        where.expiresAt = { lte: new Date() };
        where.acceptedAt = null;
      } else if (status === "accepted") {
        where.acceptedAt = { not: null };
      }
    }

    return this.membershipInviteRepository.findAll({
      where,
      orderBy: { createdAt: "desc" },
    }) as unknown as MembershipInvite[];
  }

  async acceptMembershipInvite(token: string, userId: string) {
    const invite = (await this.membershipInviteRepository.findFirst({
      where: { token },
    })) as unknown as any;

    if (!invite) {
      throw new Error("Invite not found");
    }

    if (invite.expiresAt && invite.expiresAt < new Date()) {
      throw new Error("Invite has expired");
    }

    if (invite.acceptedAt) {
      throw new Error("Invite has already been accepted");
    }

    return await this.prisma.$transaction(async (tx) => {
      await this.membershipRepository.createMembership(
        invite.organizationId,
        userId,
        invite.role,
        tx
      );

      return await this.membershipInviteRepository.updateInvite(
        invite.id,
        {
          acceptedAt: new Date(),
          acceptedById: userId,
        },
        tx
      );
    });
  }

  async deleteMembershipInvite(id: string): Promise<MembershipInvite> {
    return this.membershipInviteRepository.delete(
      id
    ) as unknown as MembershipInvite;
  }

  async generateInviteUrl(inviteId: string) {
    const appUrl = this.envConfigService.get("NEXT_PUBLIC_FRONTEND_URL");
    return `${appUrl}/invites/${inviteId}`;
  }
}
