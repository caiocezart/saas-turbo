import { Injectable } from "@nestjs/common";
import { MembershipInviteService } from "./services/membership-invite.service";
import { CreateMembershipInvitesParams, EventBusTopics } from "@repo/domain";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { membershipInviteCreatedEventSchema } from "@repo/domain";

@Injectable()
export class CreateMembershipInviteUseCase {
  constructor(
    private readonly membershipInviteService: MembershipInviteService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async execute(
    userId: string,
    organizationId: string,
    params: CreateMembershipInvitesParams
  ) {
    const invite = await this.membershipInviteService.createMembershipInvite(
      userId,
      organizationId,
      params
    );

    const inviteUrl = await this.membershipInviteService.generateInviteUrl(
      invite.id
    );

    // Emit event to trigger email sending
    this.eventEmitter.emit(
      EventBusTopics.MEMBERSHIP_INVITE_CREATED,
      membershipInviteCreatedEventSchema.parse({
        email: invite.inviter.email,
        name: invite.inviter.name,
        organizationName: invite.organization.name,
        role: invite.role,
        inviteUrl,
      })
    );

    return invite;
  }
}
