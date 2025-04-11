import { Injectable } from "@nestjs/common";
import { MembershipService } from "./services/membership.service";
import {
  Membership,
  ListMembershipsQuery,
  OrganizationIdParam,
} from "@repo/domain";

@Injectable()
export class ListMembershipsUseCase {
  constructor(private readonly membershipService: MembershipService) {}

  async execute(
    params: OrganizationIdParam,
    query: ListMembershipsQuery
  ): Promise<Membership[]> {
    // Add authorization checks here if needed (e.g., can user list memberships for this org/user?)
    const memberships = await this.membershipService.listMemberships(
      params.organizationId,
      query
    );
    return memberships;
  }
}
