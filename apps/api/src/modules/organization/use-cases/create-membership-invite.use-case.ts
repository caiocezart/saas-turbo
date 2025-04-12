import { Injectable } from "@nestjs/common";
import { MembershipInviteService } from "../services/membership-invite.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { EventBusOrganization, MembershipInviteCreatedEvent } from "../events";
import { Params } from "@repo/domain";
@Injectable()
export class CreateMembershipInviteUseCase {
  constructor(
    private readonly membershipInviteService: MembershipInviteService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async execute(userId: string, organizationId: string, params: Params) {
    const invite = await this.membershipInviteService.createMembershipInvite(
      userId,
      organizationId,
      params
    );

    const inviteUrl = await this.membershipInviteService.generateInviteUrl(
      invite.id
    );

    const membershipInviteCreatedEvent: MembershipInviteCreatedEvent = {
      email: invite.inviter.email,
      name: invite.inviter.name,
      organizationName: invite.organization.name,
      role: invite.role,
      inviteUrl,
    };
    // Emit event to trigger email sending
    this.eventEmitter.emit(
      EventBusOrganization.MEMBERSHIP_INVITE_CREATED,
      membershipInviteCreatedEvent
    );

    return invite;
  }
}
