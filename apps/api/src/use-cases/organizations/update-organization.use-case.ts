import { Injectable } from "@nestjs/common";
import { OrganizationService } from "./services/organization.service";
import { OrganizationUpdate } from "@repo/domain";

@Injectable()
export class UpdateOrganizationUseCase {
  constructor(private readonly organizationService: OrganizationService) {}

  async execute(organizationId: string, input: OrganizationUpdate) {
    const organization = await this.organizationService.updateMembership(
      organizationId,
      input
    );

    return organization;
  }
}
