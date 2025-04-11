import { Injectable } from "@nestjs/common";
import { CreateMembershipInvite, ErrorCode } from "@repo/domain";
import { AppException } from "@/shared/exceptions/app.exception";
import { MembershipInviteService } from "./services/membership-invite.service";
@Injectable()
export class CreateMembershipInviteUseCase {
  constructor(
    private readonly membershipInviteService: MembershipInviteService
  ) {}

  async execute(userId: string, input: CreateMembershipInvite) {
    const existingInvite =
      await this.membershipInviteService.getMembershipInviteByMemberId(
        input.organizationId,
        input.memberId
      );

    if (existingInvite) {
      throw new AppException(ErrorCode.MEMBERSHIP_INVITE_ALREADY_EXISTS);
    }

    const invite = await this.membershipInviteService.createMembershipInvite(
      userId,
      input
    );

    return invite;
  }
}
