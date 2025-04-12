import { Injectable, NotFoundException } from "@nestjs/common";
import { MembershipInviteService } from "../services/membership-invite.service";
import { MembershipInvite } from "@/prisma/client";

@Injectable()
export class GetMembershipInviteByTokenUseCase {
  constructor(
    private readonly membershipInviteService: MembershipInviteService
  ) {}

  async execute(token: string): Promise<MembershipInvite> {
    const invite =
      await this.membershipInviteService.getMembershipInviteByToken(token);

    if (!invite) {
      throw new NotFoundException("Membership invite with token not found");
    }

    return invite;
  }
}
