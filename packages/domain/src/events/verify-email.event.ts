import { z } from "zod";

export const emailVerificationEventSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  verificationLink: z.string().url(),
  verificationCode: z.string(),
});

export type EmailVerificationEvent = z.infer<
  typeof emailVerificationEventSchema
>;
