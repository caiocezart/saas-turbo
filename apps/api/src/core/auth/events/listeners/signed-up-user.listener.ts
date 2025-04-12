import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { Injectable } from "@nestjs/common";
import { EventBusAuth } from "../auth.event-bus";
import { SignedUpUserEvent } from "../signed-up-user.event";

@Injectable()
export class SignedUpUserListener {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  @OnEvent(EventBusAuth.USER_SIGNED_UP, { async: true })
  async sendEmailVerification(event: SignedUpUserEvent) {
    this.eventEmitter.emit(EventBusAuth.VERIFY_EMAIL, {
      email: event.email,
      name: event.name,
      verificationLink: event.verificationLink,
      verificationCode: event.verificationCode,
    });
  }
}
