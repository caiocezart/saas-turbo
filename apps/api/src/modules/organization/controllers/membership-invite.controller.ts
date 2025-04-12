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
import { JwtAuthGuard } from "@/core/auth/guards/jwt-auth.guard";
import { RequestPayload } from "@/core/auth/schemas/jwt-request-payload.schema";
import { Request } from "@/core/auth/decorators/request.decorator";
import { ZodValidationPipe } from "@/core/auth/pipes/zod-validation-pipe";
import { CreateMembershipInviteUseCase } from "../use-cases/create-membership-invite.use-case";
import { GetMembershipInviteUseCase } from "../use-cases/get-membership-invite.use-case";
import { GetMembershipInviteByTokenUseCase } from "../use-cases/get-membership-invite-by-token.use-case";
import { ListMembershipInvitesUseCase } from "../use-cases/list-membership-invites.use-case";
import { AcceptMembershipInviteUseCase } from "../use-cases/accept-membership-invite.use-case";
import { DeleteMembershipInviteUseCase } from "../use-cases/delete-membership-invite.use-case";
import {
  paramsSchema,
  createMembershipInviteDtoSchema,
  requestQuerySchema,
  requestParamsSchema,
} from "@repo/domain";

@Controller("organizations/:organizationId/membership-invites")
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
    @Request() request: RequestPayload,
    @Param(new ZodValidationPipe(paramsSchema)) {
      organizationId,
    }: { organizationId: string },
    @Body(new ZodValidationPipe(createMembershipInviteDtoSchema)) body: any
  ) {
    return this.createMembershipInviteUseCase.execute(
      request.user.sub,
      organizationId,
      body
    );
  }

  @Get()
  async listInvites(
    @Request() request: RequestPayload,
    @Param(new ZodValidationPipe(paramsSchema)) {
      organizationId,
    }: { organizationId: string },
    @Query(new ZodValidationPipe(requestQuerySchema)) query: any
  ) {
    return this.listMembershipInvitesUseCase.execute(
      request.user.sub,
      organizationId,
      query
    );
  }

  @Get(":id")
  async getInviteById(
    @Request() request: RequestPayload,
    @Param(new ZodValidationPipe(requestParamsSchema)) { id }: { id: string }
  ) {
    return this.getMembershipInviteUseCase.execute(id);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteInvite(
    @Request() request: RequestPayload,
    @Param(new ZodValidationPipe(requestParamsSchema)) { id }: { id: string }
  ) {
    await this.deleteMembershipInviteUseCase.execute(request.user.sub, id);
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
    @Param(new ZodValidationPipe(requestParamsSchema)) {
      token,
    }: { token: string }
  ) {
    return this.getMembershipInviteByTokenUseCase.execute(token);
  }

  @Post("accept/:token")
  @UseGuards(JwtAuthGuard)
  async acceptInvite(
    @Request() request: RequestPayload,
    @Param(new ZodValidationPipe(requestParamsSchema)) {
      token,
    }: { token: string }
  ) {
    return this.acceptMembershipInviteUseCase.execute(request.user.sub, token);
  }
}
