import { Injectable, NotFoundException } from "@nestjs/common";
import { MembershipService } from "./services/membership.service";
import { Membership } from "@repo/domain"; // Assuming Membership entity exists

@Injectable()
export class GetMembershipUseCase {
  constructor(private readonly membershipService: MembershipService) {}

  async execute(membershipId: string): Promise<Membership> {
    const membership =
      await this.membershipService.getMembershipById(membershipId);

    if (!membership) {
      throw new NotFoundException(
        `Membership with ID ${membershipId} not found`
      );
    }

    // Add authorization checks here if needed (e.g., can the requesting user see this membership?)

    return membership;
  }
}
