import { z } from "zod";

export const verifyUserEmailSchema = z.object({
  userId: z.string(),
  token: z.string(),
});

export type VerifyUserEmail = z.infer<typeof verifyUserEmailSchema>;
