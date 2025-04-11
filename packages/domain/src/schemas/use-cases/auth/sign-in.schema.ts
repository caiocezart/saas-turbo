import { accountSchema, providerSchema, userSchema } from "@/entities";
import { PrismaProviderType, prismaProviderTypeSchema } from "@/enums";
import { z } from "zod";

export const signInUserSchema = userSchema
  .pick({
    email: true,
  })
  .extend({
    password: z.string().min(8),
    providerType: prismaProviderTypeSchema.default(PrismaProviderType.PASSWORD),
  });

export type SignInUser = z.infer<typeof signInUserSchema>;

export const signInResponseSchema = userSchema
  .pick({
    id: true,
    email: true,
    twoFactorEnabled: true,
    avatarUrl: true,
  })
  .extend({
    name: z.string(),
  });

export type SignInResponse = z.infer<typeof signInResponseSchema>;

export const accountLookupSchema = accountSchema
  .pick({
    id: true,
  })
  .extend({
    passwordHash: z.string().min(1),
    user: z.lazy(() =>
      userSchema.pick({
        id: true,
        email: true,
        name: true,
      })
    ),
    provider: z.lazy(() =>
      providerSchema.pick({
        id: true,
        name: true,
      })
    ),
  });

export type AccountLookup = z.infer<typeof accountLookupSchema>;
