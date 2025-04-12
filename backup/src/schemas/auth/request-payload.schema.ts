import { z } from "zod";
import { jwtAccessTokenSchema } from "./jwt-access-token.schema";

export const requestPayloadSchema = z.object({
  user: jwtAccessTokenSchema,
  refreshToken: z.string().optional(),
  ip: z.string().optional(),
});

export type RequestPayload = z.infer<typeof requestPayloadSchema>;
