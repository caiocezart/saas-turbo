import { OnEvent } from "@nestjs/event-emitter";
import { EmailService } from "@/core/email/services/email.service";
import { Injectable } from "@nestjs/common";
import { EmailOtpRequestedEvent } from "../email-otp-requested.event";
import { EventBusAuth } from "../auth.event-bus";

@Injectable()
export class EmailOtpRequestedListener {
  constructor(private readonly emailService: EmailService) {}

  @OnEvent(EventBusAuth.EMAIL_OTP_REQUESTED, { async: true })
  async emailOtpRequested(event: EmailOtpRequestedEvent) {
    this.emailService.sendEmailOtpRequestedEmail(
      event.email,
      event.name,
      event.otpCode
    );
  }
}
