import { z } from "zod";
import { userSchema } from "@/entities/user.entity";

export const updateUserDtoSchema = userSchema.partial();

export type UpdateUserDto = z.infer<typeof updateUserDtoSchema>;

// export const updateUserDtoSchema = z.object({
//   id: z.string().optional(),
//   email: z.string().email().optional(),
//   firstName: z.string().min(1).optional(),
//   lastName: z.string().min(1).optional(),
//   avatarUrl: z.string().url().optional(),
//   createdAt: z.string().datetime().optional(),
//   updatedAt: z.string().datetime().optional(),
//   lastLoginAt: z.string().datetime().optional(),
//   isActive: z.boolean().optional(),
//   languagePreference: z.string().min(2).optional(),
//   emailVerified: z.boolean().optional(),
//   emailVerifiedAt: z.string().datetime().optional(),
//   twoFactorEnabled: z.boolean().optional(),
//   phoneNumber: z.string().optional().optional(),
//   phoneNumberVerified: z.boolean().optional(),
// });

// export type UpdateUserDto = z.infer<typeof updateUserDtoSchema>;
