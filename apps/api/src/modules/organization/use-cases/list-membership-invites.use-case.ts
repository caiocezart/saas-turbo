import { Injectable, ForbiddenException } from "@nestjs/common";
import { MembershipInviteService } from "./services/membership-invite.service";
import { MembershipService } from "../memberships/services/membership.service";
import { ListMembershipInvitesParams, MembershipInvite } from "@repo/domain";

@Injectable()
export class ListMembershipInvitesUseCase {
  constructor(
    private readonly membershipInviteService: MembershipInviteService,
    private readonly membershipService: MembershipService
  ) {}

  async execute(
    userId: string,
    organizationId: string,
    params: ListMembershipInvitesParams
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
