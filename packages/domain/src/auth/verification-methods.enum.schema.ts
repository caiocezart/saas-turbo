
import { z } from "zod";

export enum VerificationMethods {
  EMAIL = "EMAIL",
  OTP = "OTP",
  MOBILE = "MOBILE",
}

export const verificationMethodsSchema = z.nativeEnum(
  VerificationMethods
);
