import { Injectable } from "@nestjs/common";
import { MembershipRepository } from "../repositories/membership.repository";
import { Membership } from "@/prisma/client";
import { Query, UpdateMembershipDto } from "@repo/domain";

@Injectable()
export class MembershipService {
  constructor(private readonly membershipRepository: MembershipRepository) {}

  async getMembershipById(membershipId: string): Promise<Membership | null> {
    const membership = await this.membershipRepository.findById(membershipId);
    // Assert the type to match the domain entity, assuming compatibility
    return membership as Membership | null;
  }

  async listMemberships(
    organizationId: string,
    query: Query
  ): Promise<Membership[]> {
    // Build filter based on query (organizationId, userId)
    const where: Record<string, any> = {};
    where.organizationId = organizationId;

    if (query.userId) {
      // Assuming the repository maps memberId to userId internally or directly
      where.memberId = query.userId;
    }
    // Add pagination later if needed
    const memberships = await this.membershipRepository.findAll({ where });
    // Assert the type to match the domain entity array
    return memberships as Membership[];
  }

  async updateMembership(
    membershipId: string,
    input: UpdateMembershipDto
  ): Promise<Membership> {
    // Assuming repository has update method taking id and data
    const updatedMembership = await this.membershipRepository.update(
      membershipId,
      input
    );
    // Assert the type to match the domain entity
    return updatedMembership as Membership;
  }

  async deleteMembership(membershipId: string): Promise<Membership> {
    // Assuming repository has delete method
    const deletedMembership =
      await this.membershipRepository.delete(membershipId);
    // Assert the type to match the domain entity
    return deletedMembership as Membership;
  }

  async getMembershipByUserAndOrg(userId: string, organizationId: string) {
    return (await this.membershipRepository.findFirst({
      where: {
        userId,
        organizationId,
      },
    })) as Membership | null;
  }

  // Add other methods like createMembership if needed later
}
