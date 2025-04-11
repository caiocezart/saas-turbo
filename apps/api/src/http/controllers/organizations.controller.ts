import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  CreateOrganization,
  createOrganizationSchema,
  UpdateOrganization,
  updateOrganizationSchema,
  OrganizationIdParam,
  organizationIdSchema,
  RequestPayload,
} from "@repo/domain";
import { CreateOrganizationUseCase } from "@/use-cases/organizations/create-organization.use-case";
import { GetOrganizationUseCase } from "@/use-cases/organizations/get-organization.use-case";
import { DeleteOrganizationUseCase } from "@/use-cases/organizations/delete-organization.use-case";
import { UpdateOrganizationUseCase } from "@/use-cases/organizations/update-organization.use-case";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { Request as RequestPayloadDecorator } from "../decorators/request-payload.decorator";
import { PlatformListOrganizationUseCase } from "@/use-cases/organizations/platform-list-organization.use-case";

@Controller("organizations")
export class OrganizationsController {
  constructor(
    private readonly createOrganizationUseCase: CreateOrganizationUseCase,
    private readonly getOrganizationUseCase: GetOrganizationUseCase,
    private readonly deleteOrganizationUseCase: DeleteOrganizationUseCase,
    private readonly updateOrganizationUseCase: UpdateOrganizationUseCase,
    private readonly platformListOrganizationUseCase: PlatformListOrganizationUseCase
  ) {}

  @Get()
  async listOrganizations(@RequestPayloadDecorator() payload: RequestPayload) {
    return this.platformListOrganizationUseCase.execute();
  }

  @Post()
  async create(
    @RequestPayloadDecorator() payload: RequestPayload,
    @Body(new ZodValidationPipe(createOrganizationSchema))
    body: CreateOrganization
  ) {
    // Assuming CreateOrganizationUseCase needs userId and name
    return this.createOrganizationUseCase.execute(payload.user.sub, body.name);
  }

  @Get(":organizationId")
  async getOrganization(
    @Param(new ZodValidationPipe(organizationIdSchema))
    params: OrganizationIdParam
    // @RequestPayloadDecorator() payload: RequestPayload, // Add if authorization check needed
  ) {
    // Basic get, authorization might be added in the use case or a dedicated guard later
    return this.getOrganizationUseCase.execute(params.organizationId);
  }

  @Patch(":organizationId")
  @HttpCode(HttpStatus.NO_CONTENT) // Return 204 on successful update
  async updateOrganization(
    @Param(new ZodValidationPipe(organizationIdSchema))
    params: OrganizationIdParam,
    @Body(new ZodValidationPipe(updateOrganizationSchema))
    body: UpdateOrganization
    // @RequestPayloadDecorator() payload: RequestPayload, // Add if authorization check needed
  ) {
    // Authorization (e.g., is user member/admin of this org?) should ideally be checked
    await this.updateOrganizationUseCase.execute(params.organizationId, body);
    // No content returned on success
  }

  @Delete(":organizationId")
  @HttpCode(HttpStatus.NO_CONTENT) // Return 204 on successful delete
  async deleteOrganization(
    @Param(new ZodValidationPipe(organizationIdSchema))
    params: OrganizationIdParam
    // @RequestPayloadDecorator() payload: RequestPayload, // Add if authorization check needed
  ) {
    // Authorization check needed here
    await this.deleteOrganizationUseCase.execute(params.organizationId);
    // No content returned on success
  }
}
