import { z } from "zod";
import { verificationActionsSchema } from "@/auth";
import { verificationMethodsSchema } from "@/auth";

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

export type VerificationSchema = z.infer<typeof verificationSchema>;

// export const verificationWithUserSchema = verificationSchema.extend({
//   user: z.lazy(() => userSchema.partial()),
// });

// export type VerificationWithUserDto = z.infer<
//   typeof verificationWithUserDtoSchema
// >;
