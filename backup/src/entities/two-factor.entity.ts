import { z } from "zod";
import { userSchema } from "./user.entity";

export const twoFactorSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().cuid(),
  secret: z.string(),
  backupCodes: z.string(),
});

export type TwoFactor = z.infer<typeof twoFactorSchema>;

export const twoFactorWithUserSchema = twoFactorSchema.extend({
  user: z.lazy(() => userSchema.partial()),
});

export type TwoFactorWithUser = z.infer<typeof twoFactorWithUserSchema>;
