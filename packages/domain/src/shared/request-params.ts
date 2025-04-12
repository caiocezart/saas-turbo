import { z } from "zod";

export const requestParamsSchema = z.object({
  organizationId: z.string(),
});

export type RequestParams = z.infer<typeof requestParamsSchema>;
