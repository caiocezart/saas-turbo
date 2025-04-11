import { Injectable, NotFoundException } from "@nestjs/common";
import { MembershipService } from "./services/membership.service";

@Injectable()
export class DeleteMembershipUseCase {
  constructor(private readonly membershipService: MembershipService) {}

  async execute(membershipId: string): Promise<void> {
    // Optional: Check if membership exists first
    const existingMembership =
      await this.membershipService.getMembershipById(membershipId);
    if (!existingMembership) {
      throw new NotFoundException(
        `Membership with ID ${membershipId} not found`
      );
    }

    // Add authorization checks here (e.g., can user delete this specific membership?)

    await this.membershipService.deleteMembership(membershipId);
  }
}
