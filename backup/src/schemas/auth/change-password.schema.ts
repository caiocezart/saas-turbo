import { z } from "zod";

export const changePasswordSchema = z.object({
  otp: z.string().min(6),
  oldPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export type ChangePassword = z.infer<typeof changePasswordSchema>;
