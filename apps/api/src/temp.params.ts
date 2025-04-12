import { z } from "zod";

export const tempQuery = z.object({
  organizationId: z.string(),
  membershipId: z.string(),
});

export type TempQuery = z.infer<typeof tempQuery>;

export const tempParams = z.object({
  organizationId: z.string(),
  membershipId: z.string(),
});

export type TempParams = z.infer<typeof tempParams>;
