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
import { CreateOrganizationUseCase } from "../use-cases/create-organization.use-case";
import { GetOrganizationUseCase } from "../use-cases/get-organization.use-case";
import { DeleteOrganizationUseCase } from "../use-cases/delete-organization.use-case";
import { RequestPayload } from "@/core/auth/schemas/jwt-request-payload.schema";
import { PlatformListOrganizationUseCase } from "../use-cases/platform-list-organization.use-case";
import { UpdateOrganizationUseCase } from "../use-cases/update-organization.use-case";
import { Request } from "@/core/auth/decorators/request.decorator";
import { ZodValidationPipe } from "@/core/auth/pipes/zod-validation-pipe";
import {
  CreateOrganizationDto,
  createOrganizationDtoSchema,
  UpdateOrganizationDto,
  updateOrganizationDtoSchema,
  requestParamsSchema,
  RequestParams,
} from "@repo/domain";

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
  async listOrganizations(@Request() payload: RequestPayload) {
    return this.platformListOrganizationUseCase.execute();
  }

  @Post()
  async create(
    @Request() payload: RequestPayload,
    @Body(new ZodValidationPipe(createOrganizationDtoSchema))
    body: CreateOrganizationDto
  ) {
    // Assuming CreateOrganizationUseCase needs userId and name
    return this.createOrganizationUseCase.execute(payload.user.sub, body.name);
  }

  @Get(":organizationId")
  async getOrganization(
    @Param(new ZodValidationPipe(requestParamsSchema))
    params: RequestParams
    // @RequestPayloadDecorator() payload: RequestPayload, // Add if authorization check needed
  ) {
    // Basic get, authorization might be added in the use case or a dedicated guard later
    return this.getOrganizationUseCase.execute(params.organizationId);
  }

  @Patch(":organizationId")
  @HttpCode(HttpStatus.NO_CONTENT) // Return 204 on successful update
  async updateOrganization(
    @Param(new ZodValidationPipe(requestParamsSchema))
    params: RequestParams,
    @Body(new ZodValidationPipe(updateOrganizationDtoSchema))
    body: UpdateOrganizationDto
    // @RequestPayloadDecorator() payload: RequestPayload, // Add if authorization check needed
  ) {
    // Authorization (e.g., is user member/admin of this org?) should ideally be checked
    await this.updateOrganizationUseCase.execute(params.organizationId, body);
    // No content returned on success
  }

  @Delete(":organizationId")
  @HttpCode(HttpStatus.NO_CONTENT) // Return 204 on successful delete
  async deleteOrganization(
    @Param(new ZodValidationPipe(requestParamsSchema))
    params: RequestParams
    // @RequestPayloadDecorator() payload: RequestPayload, // Add if authorization check needed
  ) {
    // Authorization check needed here
    await this.deleteOrganizationUseCase.execute(params.organizationId);
    // No content returned on success
  }
}
