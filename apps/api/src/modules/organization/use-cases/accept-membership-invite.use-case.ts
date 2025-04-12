import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { MembershipInviteService } from "../services/membership-invite.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { EventBusOrganization } from "../events";
import { MembershipInviteAcceptedEvent } from "../events";
@Injectable()
export class AcceptMembershipInviteUseCase {
  constructor(
    private readonly membershipInviteService: MembershipInviteService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async execute(token: string, userId: string) {
    try {
      const invite = await this.membershipInviteService.acceptMembershipInvite(
        token,
        userId
      );

      const inviteUrl = await this.membershipInviteService.generateInviteUrl(
        invite.id
      );

      // Emit event for side effects (e.g., sending notification to org admin)
      const membershipInviteAcceptedEvent: MembershipInviteAcceptedEvent = {
        email: invite.inviter.email,
        name: invite.inviter.name,
        organizationName: invite.organization.name,
        role: invite.role,
        inviteUrl,
      };

      this.eventEmitter.emit(
        EventBusOrganization.MEMBERSHIP_INVITE_ACCEPTED,
        membershipInviteAcceptedEvent
      );

      return invite;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Invite not found") {
          throw new NotFoundException("Membership invite not found");
        }
        if (error.message === "Invite has expired") {
          throw new BadRequestException("Membership invite has expired");
        }
        if (error.message === "Invite has already been accepted") {
          throw new BadRequestException(
            "Membership invite has already been accepted"
          );
        }
      }

      throw error;
    }
  }
}
