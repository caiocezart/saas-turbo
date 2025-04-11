import { Global, Module } from "@nestjs/common";
import { EmailModule } from "@/email/email.module";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { EmailService } from "@/email/services/email.service";
import { SignedUpUserListener } from "./auth/signed-up-user.listener";
import { VerifyEmailListener } from "./auth/verify-email.listener";
import { PasswordUpdatedListener } from "./auth/password-updated.listener";
import { EmailOtpRequestedListener } from "./auth/email-otp-requested.listener";
import { MembershipInviteListener } from "./organizations/membership-invite.listener";

@Global()
@Module({
  imports: [EmailModule, EventEmitterModule.forRoot()],
  providers: [
    EmailService,
    SignedUpUserListener,
    VerifyEmailListener,
    PasswordUpdatedListener,
    EmailOtpRequestedListener,
    MembershipInviteListener,
  ],
})
export class EventsModule {}
