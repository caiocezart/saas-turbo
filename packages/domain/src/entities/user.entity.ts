import { z } from "zod";
import { accountSchema } from "./account.entity";
import { membershipSchema } from "./membership.entity";
import { refreshTokenSchema } from "./refresh-token.entity";
import { verificationSchema } from "./verification.entity";

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  name: z.string().min(1),
  avatarUrl: z.string().url().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  lastLoginAt: z.string().datetime().optional(),
  isActive: z.boolean(),
  languagePreference: z.string().min(2),
  emailVerified: z.boolean(),
  emailVerifiedAt: z.string().datetime().optional(),
  twoFactorEnabled: z.boolean(),
  phoneNumber: z.string().optional(),
  phoneNumberVerified: z.boolean(),
});

export type User = z.infer<typeof userSchema>;

export const UserWithRelationsSchema = userSchema.extend({
  accounts: z.array(z.lazy(() => accountSchema.partial())),
  refreshTokens: z.array(z.lazy(() => refreshTokenSchema.partial())),
  memberships: z.array(z.lazy(() => membershipSchema.partial())),
  tokens: z.array(z.lazy(() => verificationSchema.partial())),
});

export type UserWithRelations = z.infer<typeof UserWithRelationsSchema>;
