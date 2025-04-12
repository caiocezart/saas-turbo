import { Injectable } from "@nestjs/common";
import { OrganizationService } from "./services/organization.service";

@Injectable()
export class PlatformListOrganizationUseCase {
  constructor(private readonly organizationService: OrganizationService) {}

  async execute() {
    const organizations = await this.organizationService.findAll();

    return organizations;
  }
}
