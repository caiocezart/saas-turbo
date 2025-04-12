import {
  Controller,
  Get,
  Param,
  Patch,
  Delete,
  Body,
  HttpCode,
  HttpStatus,
  Query,
} from "@nestjs/common";
import { GetMembershipUseCase } from "../use-cases/get-membership.use-case";
import { ListMembershipsUseCase } from "../use-cases/list-memberships.use-case";
import { UpdateMembershipUseCase } from "../use-cases/update-membership.use-case";
import { DeleteMembershipUseCase } from "../use-cases/delete-membership.use-case";
import { ZodValidationPipe } from "@/core/auth/pipes/zod-validation-pipe";
import {} from "@/temp.params";
import {
  RequestParams,
  updateMembershipDtoSchema,
  RequestQuery,
  requestParamsSchema,
  requestQuerySchema,
} from "@repo/domain";
import { UpdateMembershipDto } from "@repo/domain";

@Controller("organizations/:organizationId/memberships")
export class MembershipsController {
  constructor(
    private readonly getMembershipUseCase: GetMembershipUseCase,
    private readonly listMembershipsUseCase: ListMembershipsUseCase,
    private readonly updateMembershipUseCase: UpdateMembershipUseCase,
    private readonly deleteMembershipUseCase: DeleteMembershipUseCase
  ) {}

  @Get()
  async listMemberships(
    @Param(new ZodValidationPipe(requestParamsSchema)) params: RequestParams,
    @Query(new ZodValidationPipe(requestQuerySchema)) query: RequestQuery
    // @RequestPayloadDecorator() payload: RequestPayload, // Add if auth needed
  ) {
    // Authorization needed: Can user list memberships based on query?
    return this.listMembershipsUseCase.execute(params, query);
  }

  @Get(":membershipId")
  async getMembership(
    @Param(new ZodValidationPipe(requestParamsSchema)) params: RequestParams
    // @RequestPayloadDecorator() payload: RequestPayload, // Add if auth needed
  ) {
    // Authorization needed: Can user get this specific membership?
    return this.getMembershipUseCase.execute(params.membershipId);
  }

  @Patch(":membershipId")
  async updateMembership(
    @Param(new ZodValidationPipe(requestParamsSchema)) params: RequestParams,
    @Body(new ZodValidationPipe(updateMembershipDtoSchema))
    body: UpdateMembershipDto
    // @RequestPayloadDecorator() payload: RequestPayload, // Add if auth needed
  ) {
    // Authorization needed: Can user update this membership?
    return this.updateMembershipUseCase.execute(params.membershipId, body);
  }

  @Delete(":membershipId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMembership(
    @Param(new ZodValidationPipe(requestParamsSchema)) params: RequestParams
    // @RequestPayloadDecorator() payload: RequestPayload, // Add if auth needed
  ) {
    // Authorization needed: Can user delete this membership?
    await this.deleteMembershipUseCase.execute(params.membershipId);
  }
}
