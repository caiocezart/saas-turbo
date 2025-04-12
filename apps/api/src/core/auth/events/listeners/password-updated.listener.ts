import { OnEvent } from "@nestjs/event-emitter";
import { EmailService } from "@/core/email/services/email.service";
import { Injectable } from "@nestjs/common";
import { PasswordUpdatedEvent } from "../password-updated.event";
import { EventBusAuth } from "../auth.event-bus";

@Injectable()
export class PasswordUpdatedListener {
  constructor(private readonly emailService: EmailService) {}

  @OnEvent(EventBusAuth.PASSWORD_UPDATED, { async: true })
  async passwordUpdated(event: PasswordUpdatedEvent) {
    this.emailService.sendPasswordUpdatedEmail(
      event.email, 
      event.name
    );
  }
}
