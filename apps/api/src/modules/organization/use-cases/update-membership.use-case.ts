import { Injectable, NotFoundException } from "@nestjs/common";
import { MembershipService } from "./services/membership.service";
import { Membership, UpdateMembership } from "@repo/domain";

@Injectable()
export class UpdateMembershipUseCase {
  constructor(private readonly membershipService: MembershipService) {}

  async execute(
    membershipId: string,
    input: UpdateMembership
  ): Promise<Membership> {
    // Optional: Check if membership exists first
    const existingMembership =
      await this.membershipService.getMembershipById(membershipId);
    if (!existingMembership) {
      throw new NotFoundException(
        `Membership with ID ${membershipId} not found`
      );
    }

    // Add authorization checks here (e.g., can user update this specific membership?)

    // Assuming UpdateMembership only contains 'role'
    const updatedMembership = await this.membershipService.updateMembershipRole(
      membershipId,
      input.role
    );
    return updatedMembership;
  }
}
