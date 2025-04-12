export enum EventBusTopics {
  USER_SIGNED_UP = "auth.user.signed-up",
  EMAIL_VERIFICATION_REQUESTED = "auth.verification.email.requested",
  VERIFY_EMAIL = "auth.verification.email.verify",
  PASSWORD_UPDATED = "auth.password.updated",
  PASSWORD_RESET_REQUESTED = "auth.password.requested",
  EMAIL_OTP_REQUESTED = "auth.otp.email.requested",
  MEMBERSHIP_INVITE_CREATED = "organization.membership.invite.created",
  MEMBERSHIP_INVITE_ACCEPTED = "organization.membership.invite.accepted",
}
