import { Injectable } from "@nestjs/common";
import { MembershipInviteRepository } from "@/database/repositories/membership-invite.repository";
import { CreateMembershipInvite, MembershipInviteUpdate } from "@repo/domain";

@Injectable()
export class MembershipInviteService {
  constructor(
    private readonly membershipInviteRepository: MembershipInviteRepository
  ) {}

  async getMembershipInviteByMemberId(
    organizationId: string,
    memberId: string
  ) {
    return this.membershipInviteRepository.getMembershipInviteByMemberId(
      organizationId,
      memberId
    );
  }

  async createMembershipInvite(
    inviterId: string,
    invite: CreateMembershipInvite
  ) {
    await this.membershipInviteRepository.createInvite(
      inviterId,
      invite.organizationId,
      invite.memberId,
      invite.role
    );
  }

  async updateMembershipInvite(
    organizationId: string,
    inviteId: string,
    invite: MembershipInviteUpdate
  ) {
    await this.membershipInviteRepository.updateInvite(
      organizationId,
      inviteId,
      invite
    );
  }

  private generateSlug(text: string) {
    return text
      .toString()
      .toLowerCase()
      .normalize("NFD") // Normalize accented characters
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w-]+/g, "") // Remove all non-word chars except hyphen
      .replace(/--+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, ""); // Trim - from end of text
  }
}
