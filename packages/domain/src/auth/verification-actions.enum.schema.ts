import { z } from "zod";

export enum VerificationActions {
  SIGNUP = "SIGNUP",
  FORGOT_PASSWORD = "FORGOT_PASSWORD",
}

export const verificationActionsSchema = z.nativeEnum(
  VerificationActions
);
