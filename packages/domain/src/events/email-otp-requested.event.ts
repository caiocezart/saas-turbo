import { z } from "zod";

export const emailOtpRequestedEventSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  verificationCode: z.string(),
});

export type EmailOtpRequestedEvent = z.infer<
  typeof emailOtpRequestedEventSchema
>;
