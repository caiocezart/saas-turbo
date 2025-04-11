import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailService {
  async sendVerificationEmail(
    emailTo: string,
    name: string,
    verificationLink: string,
    verificationCode: string
  ) {
    console.log(`Sending verification email to ${emailTo} with name ${name}`);
    console.log(`Verification link: ${verificationLink}`);
    console.log(`Verification code: ${verificationCode}`);
  }

  async sendPasswordUpdatedEmail(emailTo: string, name: string) {
    console.log(`emailTo: ${emailTo}`);
    console.log(`Hi ${name}. Your password has been updated.`);
  }

  async sendEmailOtpRequestedEmail(emailTo: string, name: string, otp: string) {
    console.log(`emailTo: ${emailTo}`);
    console.log(`Hi ${name}. Your email OTP is ${otp}.`);
  }
}
