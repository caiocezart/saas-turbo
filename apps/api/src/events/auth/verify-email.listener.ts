import { OnEvent } from "@nestjs/event-emitter";
import { EmailService } from "@/email/services/email.service";
import { Injectable } from "@nestjs/common";
import { EmailVerificationEvent, EventBusTopics } from "@repo/domain";

@Injectable()
export class VerifyEmailListener {
  constructor(private readonly emailService: EmailService) {}

  @OnEvent(EventBusTopics.VERIFY_EMAIL, { async: true })
  async verifyEmail(event: EmailVerificationEvent) {
    this.emailService.sendVerificationEmail(
      event.email,
      event.name,
      event.verificationLink,
      event.verificationCode
    );
  }
}
