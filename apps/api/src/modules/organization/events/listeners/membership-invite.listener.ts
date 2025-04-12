import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { EmailService } from "@/core/email/services/email.service";
import { MembershipInviteCreatedEvent } from "../membership-invite-created.event";
import { EventBusOrganization } from "../organization.events.enum";
import { MembershipInviteAcceptedEvent } from "../membership-invite-accepted.event";

@Injectable()
export class MembershipInviteListener {
  constructor(private readonly emailService: EmailService) {}

  @OnEvent(EventBusOrganization.MEMBERSHIP_INVITE_CREATED)
  async handleMembershipInviteCreatedEvent(
    event: MembershipInviteCreatedEvent
  ) {
    const { email, name, organizationName, role, inviteUrl } = event;

    console.log(`You've been invited to join ${organizationName}`);
    console.log(`Invite URL: ${inviteUrl}`);
    console.log(`Role: ${role}`);

    await this.emailService.sendMembershipInviteCreatedEmail({
      email,
      name,
      organizationName,
      inviteUrl,
      role,
    });
  }

  @OnEvent(EventBusOrganization.MEMBERSHIP_INVITE_ACCEPTED)
  async handleMembershipInviteAcceptedEvent(
    event: MembershipInviteAcceptedEvent
  ) {
    const { email, name, organizationName, role } = event;

    // Notify the organization admin who created the invite
    await this.emailService.sendMembershipInviteAcceptedEmail({
      email,
      name,
      organizationName,
      role,
    });
  }
}
