import { z } from "zod";

export const changePasswordRequestDtoSchema = z.object({
  otp: z.string().min(6),
  oldPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export type ChangePasswordRequestDto = z.infer<
  typeof changePasswordRequestDtoSchema
>;
