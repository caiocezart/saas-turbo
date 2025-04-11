import { Controller } from "@nestjs/common";
import {} from "@repo/domain";
import { CreateOrganizationUseCase } from "@/use-cases/organizations/create-organization.use-case";
import { CreateMembershipInviteUseCase } from "@/use-cases/organizations/create-membership-invite.use-case";
import { GetOrganizationUseCase } from "@/use-cases/organizations/get-organization.use-case";
import { DeleteOrganizationUseCase } from "@/use-cases/organizations/delete-organization.use-case";
import { UpdateOrganizationUseCase } from "@/use-cases/organizations/update-organization.use-case";

@Controller("organizations")
export class OrganizationsController {
  constructor(
    private readonly createOrganizationUseCase: CreateOrganizationUseCase,
    private readonly createMembershipInviteUseCase: CreateMembershipInviteUseCase,
    private readonly getOrganizationUseCase: GetOrganizationUseCase,
    private readonly deleteOrganizationUseCase: DeleteOrganizationUseCase,
    private readonly updateOrganizationUseCase: UpdateOrganizationUseCase
  ) {}

  // @Get()
  // async getOrganizations(@Request() request: RequestPayload) {
  //   return this.getOrganizationUseCase.execute(request.user.sub, request.ip);
  // }

  // @Post()
  // async create(
  //   @Request() request: RequestPayload,
  //   @Body() body: CreateOrganization
  // ) {
  //   return this.createOrganizationUseCase.execute(request.user.sub, body.name);
  // }

  // @Delete()
  // async deleteOrganization(
  //   @Request() request: RequestPayload,
  //   @Param("organizationId") organizationId: string
  // ) {
  //   return this.deleteOrganizationUseCase.execute(
  //     request.user.sub,
  //     organizationId,
  //     request.ip
  //   );
  // }

  // @Patch()
  // async updateOrganization(
  //   @Request() request: RequestPayload,
  //   @Param("organizationId") organizationId: string,
  //   @Body() body: UpdateOrganization
  // ) {
  //   return this.updateOrganizationUseCase.execute(
  //     request.user.sub,
  //     organizationId,
  //     body,
  //     request.ip
  //   );
  // }
}
