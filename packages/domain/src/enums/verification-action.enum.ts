import { z } from "zod";

export enum PrismaVerificationActions {
  SIGNUP = "SIGNUP",
  FORGOT_PASSWORD = "FORGOT_PASSWORD",
}

export const verificationActionsSchema = z.nativeEnum(
  PrismaVerificationActions
);
