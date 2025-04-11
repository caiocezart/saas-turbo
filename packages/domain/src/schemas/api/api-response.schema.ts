import { z } from "zod";

export const ApiErrorSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  detail: z.string(),
  source: z.string().nullable(),
});

export const ApiResponseSchema = z.object({
  statusCode: z.number(),
  headers: z.record(z.any()),
  data: z.unknown().nullable(),
  errors: z.array(ApiErrorSchema),
});

export type ApiResponse<T = unknown> = z.infer<typeof ApiResponseSchema> & {
  data: T;
};
