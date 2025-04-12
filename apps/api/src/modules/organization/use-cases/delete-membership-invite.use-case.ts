import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { MembershipInviteService } from "../services/membership-invite.service";
import { MembershipService } from "../services/membership.service";
import { Roles } from "@repo/domain";
import { MembershipInvite } from "@/prisma/client";

@Injectable()
export class DeleteMembershipInviteUseCase {
  constructor(
    private readonly membershipInviteService: MembershipInviteService,
    private readonly membershipService: MembershipService
  ) {}

  async execute(userId: string, inviteId: string): Promise<MembershipInvite> {
    const invite =
      await this.membershipInviteService.getMembershipInviteById(inviteId);

    if (!invite) {
      throw new NotFoundException(
        `Membership invite with ID ${inviteId} not found`
      );
    }

    const membership = await this.membershipService.getMembershipByUserAndOrg(
      userId,
      invite.organizationId
    );

    if (!membership) {
      throw new ForbiddenException("User is not a member of this organization");
    }

    if (
      membership.role !== Roles.ORGANIZATION_ADMIN &&
      membership.role !== Roles.ORGANIZATION_OWNER
    ) {
      throw new ForbiddenException(
        "User does not have permission to delete invites"
      );
    }

    return this.membershipInviteService.deleteMembershipInvite(inviteId);
  }
}
