import { Injectable } from "@nestjs/common";
import { OrganizationService } from "./services/organization.service";
import { PrismaRoles } from "@repo/domain";
@Injectable()
export class CreateOrganizationUseCase {
  constructor(private readonly organizationService: OrganizationService) {}

  async execute(userId: string, name: string) {
    const organization =
      await this.organizationService.createOrganization(name);

    await this.organizationService.createMembership(
      organization.id,
      userId,
      PrismaRoles.ORGANIZATION_OWNER
    );

    return organization;
  }
}
