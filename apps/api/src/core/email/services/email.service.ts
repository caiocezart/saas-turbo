import { Injectable } from "@nestjs/common";
import {
  MembershipInviteAcceptedEvent,
  MembershipInviteCreatedEvent,
} from "@repo/domain";

@Injectable()
export class EmailService {
  async sendVerificationEmail(
    emailTo: string,
    name: string,
    verificationLink: string,
    verificationCode: string
  ) {
    console.log(`Sending verification email to ${emailTo} with name ${name}`);
    console.log(`Verification link: ${verificationLink}`);
    console.log(`Verification code: ${verificationCode}`);
  }

  async sendPasswordUpdatedEmail(emailTo: string, name: string) {
    console.log(`emailTo: ${emailTo}`);
    console.log(`Hi ${name}. Your password has been updated.`);
  }

  async sendEmailOtpRequestedEmail(emailTo: string, name: string, otp: string) {
    console.log(`emailTo: ${emailTo}`);
    console.log(`Hi ${name}. Your email OTP is ${otp}.`);
  }

  async sendMembershipInviteCreatedEmail(event: MembershipInviteCreatedEvent) {
    const { email, name, organizationName, role, inviteUrl } = event;

    console.log(`emailTo: ${email}`);
    console.log(`Hi ${name}. You've been invited to join ${organizationName}`);
    console.log(`Invite URL: ${inviteUrl}`);
    console.log(`Role: ${role}`);
  }

  async sendMembershipInviteAcceptedEmail(
    event: MembershipInviteAcceptedEvent
  ) {
    const { email, name, organizationName, role } = event;

    console.log(`emailTo: ${email}`);
    console.log(`Invite accepted: ${name} has joined ${organizationName}`);
    console.log(`Role: ${role}`);
  }
}
