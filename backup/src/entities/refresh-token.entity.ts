import { z } from "zod";
import { userSchema } from "./user.entity";

export const refreshTokenSchema = z.object({
  id: z.string().cuid(),
  token: z.string(),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date(),
  createdByIp: z.string().ip().nullish(),
  revokedAt: z.coerce.date().nullish(),
  revokedByIp: z.string().ip().nullish(),
  replacedByToken: z.string().nullish(),
  userId: z.string().cuid(),
});

export type RefreshToken = z.infer<typeof refreshTokenSchema>;

export const refreshTokenWithUserSchema = refreshTokenSchema.extend({
  user: z.lazy(() => userSchema.partial()),
});

export type RefreshTokenWithUser = z.infer<typeof refreshTokenWithUserSchema>;
