import { z } from "zod";
import { jwtRefreshTokenSchema } from "./jwt-refresh-token.schema";

export const jwtAccessTokenSchema = z.object({
  sub: z.string().cuid(),
  email: z.string(),
  name: z.string(),
  organizationId: z.string().cuid().nullish(),
  refreshToken: jwtRefreshTokenSchema.optional(),
});

export type JwtAccessToken = z.infer<typeof jwtAccessTokenSchema>;
