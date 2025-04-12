import { Injectable, NotFoundException } from "@nestjs/common";
import { OrganizationService } from "../services/organization.service";
import { Organization } from "@/prisma/client";

@Injectable()
export class GetOrganizationUseCase {
  constructor(private readonly organizationService: OrganizationService) {}

  async execute(organizationId: string): Promise<Organization> {
    const organization =
      await this.organizationService.getOrganizationById(organizationId);

    if (!organization) {
      throw new NotFoundException(
        `Organization with ID ${organizationId} not found`
      );
    }

    return organization;
  }
}
