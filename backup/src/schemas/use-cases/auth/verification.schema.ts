import { userSchema } from "@/entities";
import { verificationSchema } from "@/entities/verification.entity";
import { z } from "zod";

export const createVerificationResponse = verificationSchema
  .pick({
    id: true,
    action: true,
    method: true,
    value: true,
    expiresAt: true,
  })
  .extend({
    user: userSchema.pick({
      email: true,
      name: true,
    }),
  });

export type CreateVerificationResponse = z.infer<
  typeof createVerificationResponse
>;
