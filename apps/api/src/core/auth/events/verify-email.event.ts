export interface VerifyEmailEvent {
  name: string;
  email: string;
  verificationLink: string;
  verificationCode: string;
}
