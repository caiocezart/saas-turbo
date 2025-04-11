import { Injectable, NotFoundException } from "@nestjs/common";
import { OrganizationService } from "./services/organization.service";
import { UpdateOrganization } from "@repo/domain";

@Injectable()
export class UpdateOrganizationUseCase {
  constructor(private readonly organizationService: OrganizationService) {}

  async execute(
    organizationId: string,
    input: UpdateOrganization
  ): Promise<void> {
    // Optional: Check if organization exists first
    const existingOrg =
      await this.organizationService.getOrganizationById(organizationId);
    if (!existingOrg) {
      throw new NotFoundException(
        `Organization with ID ${organizationId} not found`
      );
    }

    await this.organizationService.updateOrganization(organizationId, input);
  }
}
