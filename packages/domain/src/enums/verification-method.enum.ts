import { z } from "zod";

export enum PrismaVerificationMethods {
  EMAIL = "EMAIL",
  OTP = "OTP",
  MOBILE = "MOBILE",
}

export const verificationMethodsSchema = z.nativeEnum(
  PrismaVerificationMethods
);
