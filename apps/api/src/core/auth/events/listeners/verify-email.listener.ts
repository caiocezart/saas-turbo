import { OnEvent } from "@nestjs/event-emitter";
import { EmailService } from "@/core/email/services/email.service";
import { Injectable } from "@nestjs/common";
import { VerifyEmailEvent } from "../verify-email.event";
import { EventBusAuth } from "../auth.event-bus";

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
