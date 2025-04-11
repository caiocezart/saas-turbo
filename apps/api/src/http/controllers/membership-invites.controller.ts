import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { Request } from "@/http/decorators/request-payload.decorator";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import {
  createMembershipInviteSchema,
  membershipInviteIdSchema,
  membershipInviteTokenSchema,
  listMembershipInvitesSchema,
  organizationIdSchema,
} from "@repo/domain";
import { CreateMembershipInviteUseCase } from "../../use-cases/membership-invites/create-membership-invite.use-case";
import { GetMembershipInviteUseCase } from "../../use-cases/membership-invites/get-membership-invite.use-case";
import { GetMembershipInviteByTokenUseCase } from "../../use-cases/membership-invites/get-membership-invite-by-token.use-case";
import { ListMembershipInvitesUseCase } from "../../use-cases/membership-invites/list-membership-invites.use-case";
import { AcceptMembershipInviteUseCase } from "../../use-cases/membership-invites/accept-membership-invite.use-case";
import { DeleteMembershipInviteUseCase } from "../../use-cases/membership-invites/delete-membership-invite.use-case";

@Controller("organizations/:organizationId/membership-invites")
@UseGuards(JwtAuthGuard)
export class MembershipInvitesController {
  constructor(
    private readonly createMembershipInviteUseCase: CreateMembershipInviteUseCase,
    private readonly getMembershipInviteUseCase: GetMembershipInviteUseCase,
    private readonly getMembershipInviteByTokenUseCase: GetMembershipInviteByTokenUseCase,
    private readonly listMembershipInvitesUseCase: ListMembershipInvitesUseCase,
    private readonly acceptMembershipInviteUseCase: AcceptMembershipInviteUseCase,
    private readonly deleteMembershipInviteUseCase: DeleteMembershipInviteUseCase
  ) {}

  @Post()
  async createInvite(
    @Request("sub") userId: string,
    @Param(new ZodValidationPipe(organizationIdSchema)) {
      organizationId,
    }: { organizationId: string },
    @Body(new ZodValidationPipe(createMembershipInviteSchema)) body: any
  ) {
    return this.createMembershipInviteUseCase.execute(
      userId,
      organizationId,
      body
    );
  }

  @Get()
  async listInvites(
    @Request("sub") userId: string,
    @Param(new ZodValidationPipe(organizationIdSchema)) {
      organizationId,
    }: { organizationId: string },
    @Query(new ZodValidationPipe(listMembershipInvitesSchema)) query: any
  ) {
    return this.listMembershipInvitesUseCase.execute(
      userId,
      organizationId,
      query
    );
  }

  @Get(":id")
  async getInviteById(
    @Param(new ZodValidationPipe(membershipInviteIdSchema)) {
      id,
    }: { id: string }
  ) {
    return this.getMembershipInviteUseCase.execute(id);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteInvite(
    @Request("sub") userId: string,
    @Param(new ZodValidationPipe(membershipInviteIdSchema)) {
      id,
    }: { id: string }
  ) {
    await this.deleteMembershipInviteUseCase.execute(userId, id);
  }
}

@Controller("membership-invites")
export class MembershipInvitesPublicController {
  constructor(
    private readonly getMembershipInviteByTokenUseCase: GetMembershipInviteByTokenUseCase,
    private readonly acceptMembershipInviteUseCase: AcceptMembershipInviteUseCase
  ) {}

  @Get("by-token/:token")
  async getInviteByToken(
    @Param(new ZodValidationPipe(membershipInviteTokenSchema)) {
      token,
    }: { token: string }
  ) {
    return this.getMembershipInviteByTokenUseCase.execute(token);
  }

  @Post("accept/:token")
  @UseGuards(JwtAuthGuard)
  async acceptInvite(
    @Request("sub") userId: string,
    @Param(new ZodValidationPipe(membershipInviteTokenSchema)) {
      token,
    }: { token: string }
  ) {
    return this.acceptMembershipInviteUseCase.execute(token, userId);
  }
}
