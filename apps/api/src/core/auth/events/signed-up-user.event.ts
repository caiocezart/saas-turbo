export interface SignedUpUserEvent {
  name: string;
  email: string;
  verificationLink: string;
  verificationCode: string;
}
