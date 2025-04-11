import { SignedUpUserEvent } from "@repo/domain";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { EventBusTopics } from "@repo/domain";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SignedUpUserListener {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  @OnEvent(EventBusTopics.USER_SIGNED_UP, { async: true })
  async sendEmailVerification(event: SignedUpUserEvent) {
    this.eventEmitter.emit(EventBusTopics.VERIFY_EMAIL, {
      email: event.email,
      name: event.name,
      verificationLink: event.verificationLink,
      verificationCode: event.verificationCode,
    });
  }
}
