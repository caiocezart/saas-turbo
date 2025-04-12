import { z } from "zod";
import { providerTypesSchema } from "@/auth";

export const accountSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().cuid(),
  providerId: z.string().cuid(),
  providerAccountId: z.string(),
  providerType: providerTypesSchema,
  passwordHash: z.string().nullish(),
  oauthToken: z.string().nullish(),
  oauthTokenSecret: z.string().nullish(),
  refreshToken: z.string().nullish(),
  expiresAt: z.coerce.date().nullish(),
  tokenType: z.string().nullish(),
  scope: z.string().nullish(),
  idToken: z.string().nullish(),
  sessionState: z.string().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type AccountSchema = z.infer<typeof accountSchema>;

// export const accountWithRelationsDtoSchema = accountDtoSchema.extend({
//   user: z.lazy(() => userSchema),
//   provider: z.lazy(() => providerSchema),
// });

// export type AccountWithRelationsSchema = z.infer<
//   typeof accountWithRelationsDtoSchema
// >;
