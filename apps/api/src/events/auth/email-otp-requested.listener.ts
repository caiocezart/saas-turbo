import { OnEvent } from "@nestjs/event-emitter";
import { EmailService } from "@/email/services/email.service";
import { Injectable } from "@nestjs/common";
import { EmailOtpRequestedEvent, EventBusTopics } from "@repo/domain";

@Injectable()
export class EmailOtpRequestedListener {
  constructor(private readonly emailService: EmailService) {}

  @OnEvent(EventBusTopics.EMAIL_OTP_REQUESTED, { async: true })
  async emailOtpRequested(event: EmailOtpRequestedEvent) {
    this.emailService.sendEmailOtpRequestedEmail(
      event.email,
      event.name,
      event.verificationCode
    );
  }
}
