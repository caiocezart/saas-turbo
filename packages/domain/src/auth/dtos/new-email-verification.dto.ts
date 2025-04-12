import { z } from "zod";

export const newEmailVerificationRequestDtoSchema = z.object({
  userId: z.string(),
});

export type NewEmailVerificationRequestDto = z.infer<
  typeof newEmailVerificationRequestDtoSchema
>;
