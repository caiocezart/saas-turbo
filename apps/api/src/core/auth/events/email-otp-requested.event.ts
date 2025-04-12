export interface EmailOtpRequestedEvent {
  name: string;
  email: string;
  otpCode: string;
}
