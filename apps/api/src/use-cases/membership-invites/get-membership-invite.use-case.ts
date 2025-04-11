import { Injectable, NotFoundException } from "@nestjs/common";
import { MembershipInviteService } from "./services/membership-invite.service";
import { MembershipInvite } from "@repo/domain";

@Injectable()
export class GetMembershipInviteUseCase {
  constructor(
    private readonly membershipInviteService: MembershipInviteService
  ) {}

  async execute(id: string): Promise<MembershipInvite> {
    const invite =
      await this.membershipInviteService.getMembershipInviteById(id);

    if (!invite) {
      throw new NotFoundException(`Membership invite with ID ${id} not found`);
    }

    return invite;
  }
}
