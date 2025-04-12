import { z } from "zod";

export const forgotPasswordSchema = z.object({
  otp: z.string().min(6),
  newPassword: z.string().min(8),
});

export type ForgotPassword = z.infer<typeof forgotPasswordSchema>;
