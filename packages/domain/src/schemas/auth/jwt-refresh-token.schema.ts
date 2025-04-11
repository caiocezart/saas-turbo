import { z } from "zod";

export const jwtRefreshTokenSchema = z.object({
  sub: z.string().cuid(),
  iat: z.number(),
  exp: z.number(),
});

export type JwtRefreshTokenPayload = z.infer<typeof jwtRefreshTokenSchema>;
