import { compare, hash } from "bcrypt";
import { Injectable } from "@nestjs/common";
import * as crypto from "node:crypto";
import { EnvService } from "@/env/env.service";
import { TimeInMilliseconds } from "@repo/domain";

@Injectable()
export class CryptoService {
  constructor(private readonly envService: EnvService) {}

  private HASH_SALT_LENGTH = this.envService.get("BCRYPT_SALT_ROUNDS");

  async hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash);
  }

  async generateOtpCode() {
    const otpExpirationTime =
      TimeInMilliseconds[this.envService.get("OTP_EXPIRATION_TIME")];
    const otpSize = this.envService.get("OTP_SIZE");

    const expiresAt = new Date(Date.now() + otpExpirationTime);

    let value: string;

    switch (otpSize) {
      case 6: {
        value = crypto.randomInt(100000, 999999).toString();
        break;
      }
      case 7: {
        value = crypto.randomInt(1000000, 9999999).toString();
        break;
      }
      case 8: {
        value = crypto.randomInt(10000000, 99999999).toString();
        break;
      }
      case 9: {
        value = crypto.randomInt(100000000, 999999999).toString();
        break;
      }
      default: {
        value = crypto.randomInt(1000000, 9999999).toString();
      }
    }
    return {
      value,
      expiresAt,
    };
  }

  async generateEmailVerificationCode() {
    const emailVerificationCodeSize = this.envService.get(
      "EMAIL_VERIFICATION_CODE_SIZE"
    );
    const emailExpirationTime =
      TimeInMilliseconds[this.envService.get("EMAIL_EXPIRATION_TIME")];
    const expiresAt = new Date(Date.now() + emailExpirationTime);

    const value = crypto
      .randomBytes(emailVerificationCodeSize)
      .toString("base64url");

    return {
      value,
      expiresAt,
    };
  }
}
