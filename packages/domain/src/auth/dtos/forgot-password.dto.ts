import { z } from "zod";

export const forgotPasswordRequestDtoSchema = z.object({
  otp: z.string().min(6),
  newPassword: z.string().min(8),
});

export type ForgotPasswordRequestDto = z.infer<
  typeof forgotPasswordRequestDtoSchema
>;
