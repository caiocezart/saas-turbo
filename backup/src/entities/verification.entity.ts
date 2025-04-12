import { z } from "zod";
import { verificationActionsSchema } from "@/enums";
import { verificationMethodsSchema } from "@/enums";
import { userSchema } from "./user.entity";

export const verificationSchema = z.object({
  id: z.string().cuid(),
  action: verificationActionsSchema,
  method: verificationMethodsSchema,
  value: z.string(),
  userId: z.string().cuid(),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Verification = z.infer<typeof verificationSchema>;

export const verificationWithUserSchema = verificationSchema.extend({
  user: z.lazy(() => userSchema.partial()),
});

export type VerificationWithUser = z.infer<typeof verificationWithUserSchema>;
