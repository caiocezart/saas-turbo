import { OnEvent } from "@nestjs/event-emitter";
import { EmailService } from "@/email/services/email.service";
import { Injectable } from "@nestjs/common";
import { PasswordUpdatedEvent, EventBusTopics } from "@repo/domain";

@Injectable()
export class PasswordUpdatedListener {
  constructor(private readonly emailService: EmailService) {}

  @OnEvent(EventBusTopics.PASSWORD_UPDATED, { async: true })
  async passwordUpdated(event: PasswordUpdatedEvent) {
    this.emailService.sendPasswordUpdatedEmail(event.email, event.name);
  }
}
