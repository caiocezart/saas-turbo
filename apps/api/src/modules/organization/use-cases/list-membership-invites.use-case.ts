import { Injectable, ForbiddenException } from "@nestjs/common";
import { MembershipInviteService } from "../services/membership-invite.service";
import { MembershipService } from "../services/membership.service";
import { Params } from "@repo/domain";
import { MembershipInvite } from "@/prisma/client";

@Injectable()
export class ListMembershipInvitesUseCase {
  constructor(
    private readonly membershipInviteService: MembershipInviteService,
    private readonly membershipService: MembershipService
  ) {}

  async execute(
    userId: string,
    organizationId: string,
    params: Params
  ): Promise<MembershipInvite[]> {
    const membership = await this.membershipService.getMembershipByUserAndOrg(
      userId,
      organizationId
    );

    if (!membership) {
      throw new ForbiddenException("User is not a member of this organization");
    }

    return this.membershipInviteService.listMembershipInvites(
      organizationId,
      params
    );
  }
}
