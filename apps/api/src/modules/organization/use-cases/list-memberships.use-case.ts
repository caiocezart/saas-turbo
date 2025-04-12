import { Injectable } from "@nestjs/common";
import { MembershipService } from "../services/membership.service";
import { Membership } from "@/prisma/client";
import { Params, Query } from "@repo/domain";
@Injectable()
export class ListMembershipsUseCase {
  constructor(private readonly membershipService: MembershipService) {}

  async execute(params: Params, query: Query): Promise<Membership[]> {
    // Add authorization checks here if needed (e.g., can user list memberships for this org/user?)
    const memberships = await this.membershipService.listMemberships(
      params.organizationId,
      query
    );
    return memberships;
  }
}
