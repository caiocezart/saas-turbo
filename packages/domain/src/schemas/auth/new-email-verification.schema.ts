import { z } from "zod";

export const newEmailVerificationSchema = z.object({
  userId: z.string(),
});

export type NewEmailVerification = z.infer<typeof newEmailVerificationSchema>;
