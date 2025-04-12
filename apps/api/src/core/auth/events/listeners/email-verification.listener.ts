import { OnEvent } from "@nestjs/event-emitter";
import { Injectable } from "@nestjs/common";
import { EmailService } from "@/core/email/services/email.service";
import { EventBusAuth } from "../auth.event-bus";
import { VerifyEmailEvent } from "../verify-email.event";

@Injectable()
export class VerifyEmailListener {
  constructor(private readonly emailService: EmailService) {}

  @OnEvent(EventBusAuth.VERIFY_EMAIL, { async: true })
  async verifyEmail(event: VerifyEmailEvent) {
    this.emailService.sendVerificationEmail(
      event.email,
      event.name,
      event.verificationLink,
      event.verificationCode
    );
  }
}
