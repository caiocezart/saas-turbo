import { Injectable } from "@nestjs/common";
import { OrganizationService } from "../services/organization.service";

@Injectable()
export class DeleteOrganizationUseCase {
  constructor(private readonly organizationService: OrganizationService) {}

  async execute(organizationId: string) {
    await this.organizationService.deleteOrganization(organizationId);
  }
}
