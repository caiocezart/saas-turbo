import {
  Controller,
  Get,
  Param,
  Patch,
  Delete,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  MembershipIdParam,
  membershipIdSchema,
  UpdateMembership,
  updateMembershipSchema,
  ListMembershipsQuery,
  listMembershipsSchema,
  organizationIdSchema,
  OrganizationIdParam,
} from "@repo/domain";
import { GetMembershipUseCase } from "@/use-cases/memberships/get-membership.use-case";
import { ListMembershipsUseCase } from "@/use-cases/memberships/list-memberships.use-case";
import { UpdateMembershipUseCase } from "@/use-cases/memberships/update-membership.use-case";
import { DeleteMembershipUseCase } from "@/use-cases/memberships/delete-membership.use-case";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";

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
    @Param(new ZodValidationPipe(organizationIdSchema))
    params: OrganizationIdParam,
    @Query(new ZodValidationPipe(listMembershipsSchema))
    query: ListMembershipsQuery
    // @RequestPayloadDecorator() payload: RequestPayload, // Add if auth needed
  ) {
    // Authorization needed: Can user list memberships based on query?
    return this.listMembershipsUseCase.execute(params, query);
  }

  @Get(":membershipId")
  async getMembership(
    @Param(new ZodValidationPipe(membershipIdSchema)) params: MembershipIdParam
    // @RequestPayloadDecorator() payload: RequestPayload, // Add if auth needed
  ) {
    // Authorization needed: Can user get this specific membership?
    return this.getMembershipUseCase.execute(params.membershipId);
  }

  @Patch(":membershipId")
  async updateMembership(
    @Param(new ZodValidationPipe(membershipIdSchema)) params: MembershipIdParam,
    @Body(new ZodValidationPipe(updateMembershipSchema)) body: UpdateMembership
    // @RequestPayloadDecorator() payload: RequestPayload, // Add if auth needed
  ) {
    // Authorization needed: Can user update this membership?
    return this.updateMembershipUseCase.execute(params.membershipId, body);
  }

  @Delete(":membershipId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMembership(
    @Param(new ZodValidationPipe(membershipIdSchema)) params: MembershipIdParam
    // @RequestPayloadDecorator() payload: RequestPayload, // Add if auth needed
  ) {
    // Authorization needed: Can user delete this membership?
    await this.deleteMembershipUseCase.execute(params.membershipId);
  }
}
