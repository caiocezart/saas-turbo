import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { MembershipInviteService } from "./services/membership-invite.service";
import { MembershipService } from "../memberships/services/membership.service";
import { MembershipInvite, PrismaRoles } from "@repo/domain";

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
      membership.role !== PrismaRoles.ORGANIZATION_ADMIN &&
      membership.role !== PrismaRoles.ORGANIZATION_OWNER
    ) {
      throw new ForbiddenException(
        "User does not have permission to delete invites"
      );
    }

    return this.membershipInviteService.deleteMembershipInvite(inviteId);
  }
}
