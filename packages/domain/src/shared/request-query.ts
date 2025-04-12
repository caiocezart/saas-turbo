import { z } from "zod";

export const requestQuerySchema = z.object({
  organizationId: z.string(),
  userId: z.string(),
});

export type RequestQuery = z.infer<typeof requestQuerySchema>;
