import { z } from "zod";

export const verifyUserEmailRequestDtoSchema = z.object({
  userId: z.string(),
  token: z.string(),
});

export type VerifyUserEmailRequestDto = z.infer<
  typeof verifyUserEmailRequestDtoSchema
>;
