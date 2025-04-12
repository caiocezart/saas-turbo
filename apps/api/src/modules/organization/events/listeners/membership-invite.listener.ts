import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { EmailService } from "@/email/services/email.service";
import {
  EventBusTopics,
  MembershipInviteAcceptedEvent,
  MembershipInviteCreatedEvent,
} from "@repo/domain";

@Injectable()
export class MembershipInviteListener {
  constructor(private readonly emailService: EmailService) {}

  @OnEvent(EventBusTopics.MEMBERSHIP_INVITE_CREATED)
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

  @OnEvent(EventBusTopics.MEMBERSHIP_INVITE_ACCEPTED)
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
